import type { Metadata } from "next";
import { headers } from "next/headers";

type SiteMode = "community" | "managed";

type PageProps = {
  searchParams?: Promise<{ view?: string }>;
};

const contactEmail = "kjtstar@kjt.us";

const testerLink = (platform: "Android" | "Apple") =>
  `mailto:${contactEmail}?subject=${encodeURIComponent(
    `RID2Caltopo ${platform} tester request`,
  )}&body=${encodeURIComponent(
    `G'day,\n\nI'd like to help test RID2Caltopo on ${platform}.\n\nName:\nOrganization:\nDevice model:\nHow we use drones:\n\nThanks!`,
  )}`;

const managedRequestLink = `mailto:${contactEmail}?subject=${encodeURIComponent(
  "RID2Caltopo managed tracker interest",
)}&body=${encodeURIComponent(
  `G'day,\n\nOur organization is interested in managed r2c-tracker coordination.\n\nOrganization:\nPrimary contact:\nApproximate number of operators/devices:\nWhat would you like RID2Caltopo to help with?\n\nPlease do not include passwords, API keys, or active-incident details.`,
)}`;

export const metadata: Metadata = {
  title: "RID2Caltopo — Live drone awareness for search and rescue",
  description:
    "Free and managed tools that turn Remote ID observations into useful field awareness for search-and-rescue teams.",
};

const freeCapabilities = [
  "Receive and display ASTM F3411 Remote ID broadcasts",
  "Record aircraft tracks locally on the phone or tablet",
  "Publish tracks directly to CalTopo Teams incident maps",
  "Stream controller video locally for squinter review",
  "Capture potential clues and use on-device anomaly assist",
  "Operate without an r2c-tracker service",
];

const managedCapabilities = [
  {
    number: "01",
    title: "FAA, airspace & land-use checks",
    copy: "Bring nearby flight restrictions, operational airspace context, and protected-land checks into the incident workflow with visible freshness and availability status.",
  },
  {
    number: "02",
    title: "Multiple R2C zones per incident",
    copy: "Coordinate multiple RID2Caltopo tablets and DroneScout Bridges, assign aircraft ownership, relay sightings, and suppress duplicate CalTopo tracks.",
  },
  {
    number: "03",
    title: "BVLOS flight record support",
    copy: "Retain an organization-wide record of flights, tracks, timestamps, aircraft metadata, and exports to support FAA BVLOS documentation and review.",
  },
];

const tutorials = [
  {
    duration: "Field setup",
    title: "Set up the DroneScout Bridge",
    copy: "Placement, height, radio range, and keeping the phone or tablet close enough for a reliable link.",
  },
  {
    duration: "Configuration",
    title: "Connect RID2Caltopo to CalTopo",
    copy: "Import organization settings, select an incident map, and verify publishing before a mission.",
  },
  {
    duration: "Operations",
    title: "Run a multi-zone search",
    copy: "Deploy multiple receivers, understand ownership, and recognize a healthy tracker connection.",
  },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ""
  ).toLowerCase();

  const forcedMode =
    params.view === "managed"
      ? "managed"
      : params.view === "community"
        ? "community"
        : null;
  const mode: SiteMode =
    forcedMode ?? (host.includes("rid2caltopo.com") ? "managed" : "community");
  const isManaged = mode === "managed";

  return (
    <main className={`site-shell mode-${mode}`}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="RID2Caltopo home">
          <BrandMark />
          <span>RID<span className="brand-two">2</span>CalTopo</span>
        </a>
        <nav className="main-nav" aria-label="Primary navigation">
          <a href="#capabilities">Capabilities</a>
          <a href="#tutorials">Tutorials</a>
          <a href="#get-started">Get started</a>
        </nav>
        <div className="edition-switch" aria-label="Website edition">
          <a
            className={!isManaged ? "active" : ""}
            href="/?view=community"
            aria-current={!isManaged ? "page" : undefined}
          >
            Community
          </a>
          <a
            className={isManaged ? "active" : ""}
            href="/?view=managed"
            aria-current={isManaged ? "page" : undefined}
          >
            Managed
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            {isManaged
              ? "Managed coordination for SAR organizations"
              : "Free • Open source • Built for SAR"}
          </p>
          <h1>
            Know where the
            <br />
            <em>drones have searched.</em>
          </h1>
          <p className="hero-lede">
            RID2Caltopo turns broadcast Remote ID into shared field awareness—
            helping search teams see aircraft, preserve coverage, and coordinate
            operations from Android, iPhone, and iPad.
          </p>
          <div className="hero-actions">
            {isManaged ? (
              <>
                <a className="button button-primary" href={managedRequestLink}>
                  Request managed access <ArrowIcon />
                </a>
                <a className="button button-secondary" href="#plans">
                  See the pilot plan
                </a>
              </>
            ) : (
              <>
                <a
                  className="button button-primary"
                  href="https://github.com/kjtsar/RID2Caltopo"
                >
                  Explore the source <ArrowIcon />
                </a>
                <a className="button button-secondary" href="#testing">
                  Join the test team
                </a>
              </>
            )}
          </div>
          <p className="availability-note">
            <span aria-hidden="true" />
            Android and Apple test invitations are provided by email while the
            latest release completes field testing.
          </p>
        </div>

        <div className="hero-visual">
          <div className="hero-art-frame">
            <img
              src="/og.png"
              alt="RID2CalTopo illustration reading Know where the drones have searched, with two aircraft tracks on a topographic field map"
            />
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Project principles">
        <span>Purpose-built for volunteer search teams</span>
        <span>Android • iPhone • iPad</span>
        <span>Open-source core</span>
      </section>

      <section className="how-it-works section" aria-labelledby="how-title">
        <div className="section-heading">
          <p className="eyebrow">The field link</p>
          <h2 id="how-title">From aircraft signal to a useful search record.</h2>
        </div>
        <div className="signal-flow">
          <article>
            <div className="flow-icon drone-icon" aria-hidden="true">✣</div>
            <p className="step">STEP 01</p>
            <h3>Aircraft broadcasts</h3>
            <p>
              Drones used in a SAR mission are required to broadcast ASTM F3411
              Remote ID.
            </p>
          </article>
          <div className="flow-line" aria-hidden="true"><span>RADIO</span></div>
          <article className="bridge-card">
            <img
              src="/dronescout-bridge.jpg"
              alt="DroneScout Bridge mounted high on an antenna mast"
            />
            <div>
              <p className="step">STEP 02</p>
              <h3>Bridge receives</h3>
              <p>
                A raised DroneScout Bridge can receive Remote ID broadcasts over
                thousands of feet when terrain, line of sight, and radio
                conditions cooperate.
              </p>
            </div>
          </article>
          <div className="flow-line" aria-hidden="true"><span>BRIDGE LINK</span></div>
          <article>
            <div className="flow-icon device-icon" aria-hidden="true">⌖</div>
            <p className="step">STEP 03</p>
            <h3>RID2Caltopo records</h3>
            <p>
              RID2Caltopo records tracks locally and directly to CalTopo Teams
              incident maps.
            </p>
          </article>
          <div className="flow-line" aria-hidden="true"><span>LOCAL VIDEO</span></div>
          <article>
            <div className="flow-icon map-icon" aria-hidden="true">▶</div>
            <p className="step">STEP 04</p>
            <h3>Squinters review video</h3>
            <p>
              Stream video locally from a drone to a tablet to engage squinters
              in reviewing the live feed.
            </p>
          </article>
        </div>
      </section>

      <section className="capabilities section" id="capabilities">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">A clear capability boundary</p>
            <h2>Free app first. Tracker when coordination grows.</h2>
          </div>
          <p>
            The free app is operational on its own. The optional r2c-tracker
            adds cross-device coordination and server-side services; it does
            not unlock the core field tools.
          </p>
        </div>
        <div className="capability-split">
          <article className="capability-panel free-panel">
            <div className="capability-panel-heading">
              <div>
                <span className="cap-kicker">FREE RID2CALTOPO APP</span>
                <h3>Works without a tracker.</h3>
              </div>
              <span className="cap-price">$0</span>
            </div>
            <p className="cap-summary">
              Install the app, add a Bridge when greater reception is needed,
              and connect directly to your CalTopo Teams incident map.
            </p>
            <ul className="capability-list">
              {freeCapabilities.map((capability) => (
                <li key={capability}>
                  <span aria-hidden="true">✓</span>
                  {capability}
                </li>
              ))}
            </ul>
          </article>
          <article className="capability-panel tracker-panel">
            <div className="capability-panel-heading">
              <div>
                <span className="cap-kicker">OPTIONAL MANAGED TIER</span>
                <h3>Adds compliance awareness and coordination.</h3>
              </div>
              <span className="cap-adds">STARTER</span>
            </div>
            <p className="cap-summary">
              The founding managed service starts with three practical needs.
              Organizations can still self-host the open tracker instead.
            </p>
            <ol className="managed-feature-list">
              {managedCapabilities.map((capability) => (
                <li key={capability.number}>
                  <span>{capability.number}</span>
                  <div>
                    <strong>{capability.title}</strong>
                    <p>{capability.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="planned-extension">
              <span>PLANNED EXTENSION</span>
              <strong>Secure video from field tablets to Incident Command</strong>
              <p>
                Extend the existing local video workflow so authorized Incident
                Command personnel can review selected live feeds remotely.
              </p>
            </div>
            <p className="compliance-note">
              Record retention supports an organization&apos;s documentation;
              operators remain responsible for their authorization, procedures,
              and applicable FAA requirements.{" "}
              <a href="https://www.faa.gov/newsroom/beyond-visual-line-sight-bvlos">
                FAA BVLOS information
              </a>
            </p>
          </article>
        </div>
        <div className="qualification-note">
          <strong>Built honestly.</strong>
          <span>
            Some Apple, external-radio, and video workflows remain under
            physical-device qualification. We publish testing status instead of
            presenting incomplete evidence as field readiness.
          </span>
        </div>
      </section>

      <section className="choice-section section" id="get-started">
        <div className="section-heading centered">
          <p className="eyebrow">Choose your path</p>
          <h2>The app stays free. Coordination is your choice.</h2>
          <p>
            No tracker is required for local use. Teams that need distributed
            coordination can host the open service themselves or join the
            managed pilot.
          </p>
        </div>
        <div className="choice-grid" id="plans">
          <article className={!isManaged ? "featured" : ""}>
            <div className="choice-top">
              <span className="choice-label">COMMUNITY</span>
              <span className="price">$0 <small>forever</small></span>
            </div>
            <h3>Run it your way.</h3>
            <p>
              Use the mobile app locally, publish directly to CalTopo, or deploy
              and administer your own open-source tracker.
            </p>
            <ul>
              <li>Free Android and Apple apps</li>
              <li>Local Remote ID awareness</li>
              <li>Optional CalTopo publishing</li>
              <li>Open r2c-tracker source</li>
            </ul>
            <a
              className="button button-card"
              href="https://github.com/kjtsar/r2c-tracker"
            >
              Self-host the tracker <ArrowIcon />
            </a>
          </article>

          <article className={isManaged ? "featured managed-plan" : "managed-plan"}>
            <div className="choice-top">
              <span className="choice-label">FOUNDING PILOT</span>
              <span className="price">$100 <small>/ organization / year</small></span>
            </div>
            <h3>Let us handle the tracker.</h3>
            <p>
              A cost-sharing pilot for volunteer organizations that want
              compliance awareness and incident-wide coordination without
              administering cloud infrastructure.
            </p>
            <ul>
              <li>FAA, airspace, and protected-land checks</li>
              <li>Multiple R2C zones and Bridges per incident</li>
              <li>Organization-wide BVLOS flight record support</li>
              <li>Organization onboarding</li>
              <li>Reasonable-use cloud hosting</li>
            </ul>
            <a className="button button-card" href={managedRequestLink}>
              Tell us about your team <ArrowIcon />
            </a>
            <p className="fine-print">
              Starting proposal, not a locked commercial price. Higher-cost
              services would be transparent and optional.
            </p>
          </article>
        </div>
      </section>

      <section className="tutorials section" id="tutorials">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Learn in the field</p>
            <h2>Short tutorials. Real workflows.</h2>
          </div>
          <p>
            The video library is being prepared alongside the next tester
            release. These are the first walkthroughs on the production list.
          </p>
        </div>
        <div className="tutorial-grid">
          {tutorials.map((tutorial, index) => (
            <article key={tutorial.title}>
              <div className="video-placeholder">
                <span className="play-button" aria-hidden="true">▶</span>
                <span className="video-index">0{index + 1}</span>
              </div>
              <p className="step">{tutorial.duration}</p>
              <h3>{tutorial.title}</h3>
              <p>{tutorial.copy}</p>
              <span className="coming-soon">Video coming soon</span>
            </article>
          ))}
        </div>
      </section>

      <section className="test-cta section" id="testing">
        <div>
          <p className="eyebrow">Field testers wanted</p>
          <h2>Help make the next release dependable.</h2>
          <p>
            We’re looking for SAR drone teams, pilots, communications
            specialists, and technically curious volunteers willing to test
            real equipment and report what happens.
          </p>
        </div>
        <div className="tester-actions">
          <a className="button button-light" href={testerLink("Android")}>
            Request Android test access <ArrowIcon />
          </a>
          <a className="button button-outline-light" href={testerLink("Apple")}>
            Request Apple test access <ArrowIcon />
          </a>
          <span>Store invitation links will replace email after release testing.</span>
        </div>
      </section>

      <section className="roadmap section">
        <div className="section-heading">
          <p className="eyebrow">Looking ahead</p>
          <h2>Build what field teams actually need next.</h2>
        </div>
        <div className="roadmap-row">
          <span>FREE APP</span>
          <strong>Remote ID • Shared tracks • Local video • Anomaly assist</strong>
        </div>
        <div className="roadmap-row">
          <span>MANAGED STARTER</span>
          <strong>FAA / airspace / land checks • Multi-zone incidents • BVLOS record support</strong>
        </div>
        <div className="roadmap-row future">
          <span>EXPLORING</span>
          <strong>Secure field-tablet streaming to Incident Command • Trained-model video review</strong>
        </div>
        <p className="roadmap-disclaimer">
          Roadmap items are research directions, not release commitments.
          Operational decisions must always be based on verified information,
          trained personnel, and applicable procedures.
        </p>
      </section>

      <footer>
        <div className="footer-brand">
          <a className="brand" href="#top">
            <BrandMark />
            <span>RID<span className="brand-two">2</span>CalTopo</span>
          </a>
          <p>Open tools for better search awareness.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>PROJECT</strong>
            <a href="https://github.com/kjtsar/RID2Caltopo">App source</a>
            <a href="https://github.com/kjtsar/r2c-tracker">Tracker source</a>
            <a href="/?view=community">Community edition</a>
          </div>
          <div>
            <strong>CONNECT</strong>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            <a href={managedRequestLink}>Managed pilot</a>
            <a href="#testing">Become a tester</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} RID2Caltopo</span>
          <span>
            RID2Caltopo is an operational aid—not a sole source for aviation,
            navigation, or safety decisions.
          </span>
        </div>
      </footer>
    </main>
  );
}
