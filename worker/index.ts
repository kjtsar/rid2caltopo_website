/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  EMAIL: {
    send(message: {
      from: string;
      to: string;
      subject: string;
      text: string;
      replyTo?: string;
    }): Promise<unknown>;
  };
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
  MANAGED_REQUEST_INGEST_KEY: string;
}

const notificationAddress = "kjtsar@kjt.us";
const managedAccessTermsVersion = "2026-08-06";
const indexablePaths = [
  "/",
  "/capabilities",
  "/tracker",
  "/tips",
  "/early-access",
  "/managed-pilot",
];

function publicOrigin(url: URL): string {
  return url.hostname === "rid2caltopo.org"
    ? "https://rid2caltopo.org"
    : "https://rid2caltopo.com";
}

function robotsResponse(url: URL): Response {
  const origin = publicOrigin(url);
  return new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "Disallow: /request-error",
      "Disallow: /request-received",
      `Sitemap: ${origin}/sitemap.xml`,
      "",
    ].join("\n"),
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}

function sitemapResponse(url: URL): Response {
  const origin = publicOrigin(url);
  const entries = indexablePaths
    .map((path) => `  <url><loc>${origin}${path}</loc></url>`)
    .join("\n");
  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      entries,
      "</urlset>",
      "",
    ].join("\n"),
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
}

function cleanField(value: FormDataEntryValue | null, maxLength: number): string {
  return typeof value === "string"
    ? value.replace(/[\r\n\t]+/g, " ").trim().slice(0, maxLength)
    : "";
}

function validEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function handleRequestForm(request: Request, env: Env): Promise<Response> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 16_384) {
    return Response.redirect(new URL("/request-error", request.url), 303);
  }

  const form = await request.formData();
  const requestType = cleanField(form.get("requestType"), 32);
  const name = cleanField(form.get("name"), 100);
  const email = cleanField(form.get("email"), 254);
  const phone = cleanField(form.get("phone"), 64);
  const organization = cleanField(form.get("organization"), 120);
  const designator = cleanField(form.get("designator"), 24);
  const termsVersion = cleanField(form.get("termsVersion"), 32);
  const termsAcknowledged = cleanField(form.get("termsAcknowledged"), 8);
  const honeypot = cleanField(form.get("website"), 200);
  const managed = requestType === "managed-pilot";

  if (honeypot) {
    return Response.redirect(
      new URL(`/request-received?type=${encodeURIComponent(requestType)}`, request.url),
      303,
    );
  }

  if (
    !name ||
    !validEmail(email) ||
    (requestType !== "early-access" && !managed) ||
    (managed && (
      !organization ||
      !designator ||
      termsAcknowledged !== "yes" ||
      termsVersion !== managedAccessTermsVersion
    ))
  ) {
    return Response.redirect(new URL("/request-error", request.url), 303);
  }

  const subject = managed
    ? `Request managed pilot: ${designator}`
    : `request early app release: ${email}`;
  const body = [
    managed ? "Managed r2c-tracker pilot request" : "RID2Caltopo early app access request",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Organization: ${organization || "Not provided"}`,
    `Organization designator: ${designator || "Not provided"}`,
    ...(managed
      ? [`Safety terms acknowledged: ${termsVersion}`]
      : []),
    "",
    `Submitted: ${new Date().toISOString()}`,
    `Site: ${new URL(request.url).host}`,
  ].join("\n");

  try {
    await env.EMAIL.send({
      from: "RID2Caltopo Requests <requests@rid2caltopo.com>",
      to: notificationAddress,
      replyTo: email,
      subject,
      text: body,
    });
    if (managed) {
      const intakeBody = new URLSearchParams({
        requester_name: name,
        requester_email: email,
        requester_phone: phone,
        organization_name: organization,
        designator,
        source_host: new URL(request.url).host,
        terms_acknowledged: "yes",
        terms_version: termsVersion,
      });
      const intakeResponse = await fetch(
        "https://r2c-tracker.com/managed-access-requests",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.MANAGED_REQUEST_INGEST_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: intakeBody,
        },
      );
      if (!intakeResponse.ok) {
        throw new Error(`Managed request storage failed (${intakeResponse.status})`);
      }
    }
  } catch (error) {
    console.error("Request email delivery failed", error);
    return Response.redirect(new URL("/request-error", request.url), 303);
  }

  return Response.redirect(
    new URL(`/request-received?type=${encodeURIComponent(requestType)}`, request.url),
    303,
  );
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === "www.rid2caltopo.com") {
      url.hostname = "rid2caltopo.com";
      return Response.redirect(url, 301);
    }

    if (url.pathname === "/robots.txt") {
      return robotsResponse(url);
    }

    if (url.pathname === "/sitemap.xml") {
      return sitemapResponse(url);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (url.pathname === "/api/request") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", {
          status: 405,
          headers: { Allow: "POST" },
        });
      }
      return handleRequestForm(request, env);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
