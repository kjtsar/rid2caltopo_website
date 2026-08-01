import type { Metadata } from "next";
import { Barlow, IBM_Plex_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "rid2caltopo.org";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const socialImage = new URL("/og-realtime-tracking.png", origin).toString();

  return {
    metadataBase: new URL(origin),
    title: {
      default: "RID2Caltopo — Live drone awareness for search and rescue",
      template: "%s | RID2Caltopo",
    },
    description:
      "Free and managed tools that turn Remote ID observations into useful field awareness for search-and-rescue teams.",
    icons: {
      icon: "/app-icon-orange.png",
      shortcut: "/app-icon-orange.png",
      apple: "/app-icon-orange.png",
    },
    openGraph: {
      type: "website",
      title:
        "RID2Caltopo — Real-time tracking of Drone search assignments and what has been searched",
      description:
        "Open tools for Remote ID awareness, CalTopo tracks, and coordinated SAR drone operations.",
      images: [{ url: socialImage, width: 1792, height: 907 }],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "RID2Caltopo — Real-time tracking of Drone search assignments and what has been searched",
      description:
        "Open tools for Remote ID awareness, CalTopo tracks, and coordinated SAR drone operations.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${plexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
