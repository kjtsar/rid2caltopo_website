import type { Metadata } from "next";
import Link from "next/link";
import RequestForm from "../components/RequestForm";

export const metadata: Metadata = {
  title: "Request the managed pilot",
  description: "Request access to the managed r2c-tracker pilot.",
  alternates: { canonical: "/managed-pilot" },
};

export default function ManagedPilotPage() {
  return (
    <main className="request-shell managed-request-shell">
      <header className="info-header">
        <Link className="brand" href="/" aria-label="RID2Caltopo home">
          <span>RID<span className="brand-two">2</span>CalTopo</span>
        </Link>
        <Link className="request-back-link" href="/tracker">← r2c-tracker</Link>
      </header>
      <section className="request-layout">
        <div className="request-intro">
          <p className="eyebrow">Managed pilot • Free 30 day trial</p>
          <h1>Bring managed coordination<br /><em>to your team.</em></h1>
          <p>
            Provide your organization&apos;s details and we&apos;ll follow up about
            onboarding, expected field use, and whether the managed pilot fits
            your needs. The trial includes a maximum $10 credit, and afterward
            your organization pays only for the services it uses.
          </p>
        </div>
        <RequestForm kind="managed-pilot" />
      </section>
    </main>
  );
}
