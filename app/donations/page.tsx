import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Donations",
  description:
    "Learn how RID2Caltopo grew, the principles guiding its development, and how voluntary contributions are used.",
  alternates: { canonical: "/donations" },
};

const directives = [
  {
    number: "01",
    title: "Serve the field mission",
    copy: "Build practical tools around the way SAR drone teams actually search, coordinate, document flights, and review imagery.",
  },
  {
    number: "02",
    title: "Keep the core accessible",
    copy: "Keep the RID2Caltopo field app free, preserve the self-hosted path, and make managed services transparent and usage-based.",
  },
  {
    number: "03",
    title: "Respect operational control",
    copy: "Protect organization data, require pilot approval before video leaves the field device, and never present software as a substitute for trained judgment.",
  },
  {
    number: "04",
    title: "Grow both platforms together",
    copy: "Treat Android and iOS as peer platforms and continue improving the capabilities and productivity of SAR drone teams.",
  },
];

export default function DonationsPage() {
  return (
    <main className="info-shell donations-shell">
      <header className="info-header">
        <Link className="brand" href="/" aria-label="RID2Caltopo home">
          <span>RID<span className="brand-two">2</span>CalTopo</span>
        </Link>
        <nav aria-label="Information pages">
          <Link href="/capabilities">Capabilities</Link>
          <Link href="/tracker">r2c-tracker</Link>
          <Link href="/tips">Tips &amp; tricks</Link>
          <Link aria-current="page" href="/donations">Donations</Link>
        </nav>
      </header>

      <section className="info-hero donations-hero">
        <p className="eyebrow">Donations</p>
        <h1>Built for the search.<br /><em>Sustained by the community.</em></h1>
        <p>
          RID2Caltopo began a little over a year ago as a Python script that
          converted drone tracks to GeoJSON for import into CalTopo. Field needs
          kept pulling it forward, and it has grown into a small ecosystem
          supporting our SAR drone team&apos;s work.
        </p>
      </section>

      <section className="info-section donation-history">
        <div>
          <p className="eyebrow">How it grew</p>
          <h2>One utility became a field platform.</h2>
        </div>
        <div className="donation-story">
          <p>
            What started as track conversion now spans Android and iOS field
            apps, DroneScout Bridge reception, CalTopo publishing, local and
            pilot-authorized video, incident coordination, flight records, and
            an expanding set of operational tools.
          </p>
          <p>
            I&apos;ve invested many hundreds of hours in the project. Starting late
            last year, I&apos;ve also spent hundreds of dollars on AI tokens and
            development tools to reach the current level of functionality. I
            plan to continue development aimed at making SAR drone teams more
            capable and productive.
          </p>
        </div>
      </section>

      <section className="info-section donation-directives">
        <div className="section-heading">
          <p className="eyebrow">Project directives</p>
          <h2>Useful, accessible, accountable.</h2>
        </div>
        <div className="directive-grid">
          {directives.map((directive) => (
            <article key={directive.number}>
              <span>{directive.number}</span>
              <h3>{directive.title}</h3>
              <p>{directive.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="info-section donation-funding">
        <div className="funding-copy">
          <p className="eyebrow">Where contributions go</p>
          <h2>
            Development first.{" "}
            <a
              className="organization-link"
              href="https://nevadacountysar.org/"
              target="_blank"
              rel="noreferrer"
            >
              NCSSAR
            </a>{" "}
            next.
          </h2>
          <p>
            Contributions initially offset project development expenses,
            including the tools and AI resources used to design, implement,
            test, document, and publish RID2Caltopo and r2c-tracker.
          </p>
          <p>
            As the user base grows, managed-service usage payments are intended
            to cover operating costs. After development costs are covered, any
            additional donations will go to our local{" "}
            <a
              className="organization-link"
              href="https://nevadacountysar.org/"
              target="_blank"
              rel="noreferrer"
            >
              Nevada County Sheriff&apos;s Search and Rescue
            </a>
            .
          </p>
        </div>
        <aside className="donation-action" aria-label="Make a voluntary contribution">
          <span>VOLUNTARY SUPPORT</span>
          <h3>Help continue the work.</h3>
          <p>
            Contributions do not purchase product access, service priority, or
            operational influence. No charitable tax receipt is offered through
            this PayPal link.
          </p>
          <a
            className="button button-primary"
            href="https://paypal.me/kjtgv"
            target="_blank"
            rel="noreferrer"
          >
            Contribute through PayPal <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </section>

      <footer className="info-footer">
        <Link href="/">← Back to RID2Caltopo</Link>
        <span>Community-supported development for SAR drone teams</span>
      </footer>
    </main>
  );
}
