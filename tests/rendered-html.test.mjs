import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render(host = "rid2caltopo.org", path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://${host}${path}`, {
      headers: {
        accept: "text/html",
        host,
        "x-forwarded-host": host,
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function assertEveryVisibleCalTopoTeamsMentionIsLinked(html) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? "";
  const visibleMarkup = body
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/\saria-label="[^"]*"/g, "");
  const mentions = visibleMarkup.match(/CalTopo Teams/g) ?? [];
  const links = visibleMarkup.match(
    /<a[^>]+href="https:\/\/caltopo\.com\/about\/teams\/"[^>]*>CalTopo Teams<\/a>/g,
  ) ?? [];

  assert.ok(mentions.length > 0);
  assert.equal(mentions.length, links.length);
}

test("renders the RID2Caltopo landing page and app-icon metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /Track <em>drone assignments and search coverage<\/em> in real time\./,
  );
  assert.match(
    html,
    /RID2Caltopo — Track drone assignments and search coverage in real time/,
  );
  assert.match(
    html,
    /class="brand-mark" src="\/app-icon-orange\.png"/,
  );
  assert.match(html, /src="\/dronescout-ds100-anker-field\.jpg"/);
  assert.match(
    html,
    /href="https:\/\/gearfocus\.com\/products\/drone-detector-bluemark-ds100-dronescout-retail-bridge-faa-r-79np1"/,
  );
  assert.match(html, /DS100 details and purchase options/);
  assert.match(
    html,
    /href="https:\/\/caltopo\.com\/about\/teams\/"[^>]*>CalTopo Teams<\/a>/,
  );
  assertEveryVisibleCalTopoTeamsMentionIsLinked(html);
  assert.match(html, /src="\/configure-team-drones-caltopo-teams\.mp4"/);
  assert.match(html, /Stream drone video to RID2Caltopo/);
  assert.match(html, /src="\/stream-drone-video-to-rid2caltopo\.mp4"/);
  assert.match(html, /rel="icon" href="https:\/\/rid2caltopo\.org\/app-icon-orange\.png"/);
  assert.match(html, /rel="apple-touch-icon" href="https:\/\/rid2caltopo\.org\/app-icon-orange\.png"/);
  assert.match(html, /rel="canonical" href="https:\/\/rid2caltopo\.org\/"/);
  assert.match(html, /"@type":"WebSite","name":"RID2Caltopo"/);
  assert.match(html, /"@type":"SoftwareApplication","name":"RID2Caltopo"/);
  assert.match(html, /href="mailto:kjtsar@kjt\.us">kjtsar@kjt\.us<\/a>/);
  assert.doesNotMatch(html, /kjtstar@kjt\.us/);
  assert.doesNotMatch(html, /\baircraft\b/i);
  assert.doesNotMatch(html, /Know where the drones have searched/i);
});

test("publishes host-specific robots and sitemap discovery", async () => {
  const [comRobots, orgSitemap, comSitemap] = await Promise.all([
    render("rid2caltopo.com", "/robots.txt"),
    render("rid2caltopo.org", "/sitemap.xml"),
    render("rid2caltopo.com", "/sitemap.xml"),
  ]);

  assert.equal(comRobots.status, 200);
  assert.match(comRobots.headers.get("content-type") ?? "", /^text\/plain\b/i);
  assert.match(
    await comRobots.text(),
    /Sitemap: https:\/\/rid2caltopo\.com\/sitemap\.xml/,
  );

  assert.equal(orgSitemap.status, 200);
  assert.match(
    orgSitemap.headers.get("content-type") ?? "",
    /^application\/xml\b/i,
  );
  const orgXml = await orgSitemap.text();
  assert.match(orgXml, /<loc>https:\/\/rid2caltopo\.org\/<\/loc>/);
  assert.doesNotMatch(orgXml, /rid2caltopo\.com/);

  assert.equal(comSitemap.status, 200);
  const comXml = await comSitemap.text();
  assert.match(comXml, /<loc>https:\/\/rid2caltopo\.com\/tracker<\/loc>/);
  assert.doesNotMatch(comXml, /rid2caltopo\.org/);
});

test("links every visible CalTopo Teams mention on the capabilities page", async () => {
  const response = await render("rid2caltopo.com", "/capabilities");
  assert.equal(response.status, 200);
  assertEveryVisibleCalTopoTeamsMentionIsLinked(await response.text());
});

test("keeps public copy drone-specific and ships correctly sized artwork", async () => {
  const appRoot = new URL("../app/", import.meta.url);
  const appFiles = await readdir(appRoot, { recursive: true });
  const copyFiles = appFiles.filter((path) => path.endsWith(".tsx"));
  const publicCopy = (
    await Promise.all(
      copyFiles.map((path) => readFile(new URL(path, appRoot), "utf8")),
    )
  ).join("\n");

  assert.doesNotMatch(publicCopy, /\baircraft\b/i);
  assert.doesNotMatch(publicCopy, /Know where the drones have searched/i);
  assert.doesNotMatch(publicCopy, /\$100|100\/year/i);
  assert.match(publicCopy, /Pricing \$TBD|after pilot usage review/);
  assert.match(publicCopy, /MANAGED PILOT • AVAILABLE ON IOS AND ANDROID/);
  assert.match(publicCopy, /The feed begins only after approval in the RID2Caltopo app\./);
  assert.match(publicCopy, /mailto:\$\{contactEmail\}/);
  assert.match(publicCopy, /const contactEmail = "kjtsar@kjt\.us"/);
  assert.doesNotMatch(publicCopy, /kjtstar@kjt\.us|Founding pilot|Android support is in progress|Built honestly/i);
  assert.doesNotMatch(
    publicCopy,
    /Real-time tracking of Drone search assignments and what has been searched/i,
  );

  const [icon, socialCard] = await Promise.all([
    readFile(new URL("../public/app-icon-orange.png", import.meta.url)),
    readFile(new URL("../public/og-assignment-coverage.png", import.meta.url)),
  ]);
  assert.equal(icon.readUInt32BE(16), 1024);
  assert.equal(icon.readUInt32BE(20), 1024);
  assert.equal(socialCard.readUInt32BE(16), 1792);
  assert.equal(socialCard.readUInt32BE(20), 907);
});
