import type { Metadata } from "next";
import Link from "next/link";
import RequestForm from "../components/RequestForm";

export const metadata: Metadata = {
  title: "Request the managed pilot",
  description: "Request access to the managed r2c-tracker founding pilot.",
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
          <p className="eyebrow">Founding pilot • Pricing TBD</p>
          <h1>Bring managed coordination<br /><em>to your team.</em></h1>
          <p>
            Provide your organization&apos;s details and we&apos;ll follow up about
            onboarding, expected field use, and whether the founding pilot fits
            your needs. Early participation will help establish normal service
            costs before any future pricing is set.
          </p>
        </div>
        <RequestForm kind="managed-pilot" />
      </section>
    </main>
  );
}
