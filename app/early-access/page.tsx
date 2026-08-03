import type { Metadata } from "next";
import Link from "next/link";
import RequestForm from "../components/RequestForm";

export const metadata: Metadata = {
  title: "Request early app access",
  description: "Request early access to RID2Caltopo for Android or iOS.",
  alternates: { canonical: "/early-access" },
};

export default function EarlyAccessPage() {
  return (
    <main className="request-shell">
      <header className="info-header">
        <Link className="brand" href="/" aria-label="RID2Caltopo home">
          <span>RID<span className="brand-two">2</span>CalTopo</span>
        </Link>
        <Link className="request-back-link" href="/capabilities">← Capabilities</Link>
      </header>
      <section className="request-layout">
        <div className="request-intro">
          <p className="eyebrow">Early app release</p>
          <h1>Help us test<br /><em>RID2Caltopo.</em></h1>
          <p>
            Tell us who you are and where to send the invitation. Android and
            iOS access is being provided directly while the current release
            completes field testing.
          </p>
        </div>
        <RequestForm kind="early-access" />
      </section>
    </main>
  );
}
