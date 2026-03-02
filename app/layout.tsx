import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SciMax — Science-Backed Appearance & Health Optimization",
  description:
    "Get a fully personalized, science-backed protocol to optimize your appearance, hormones, sleep, and performance. Powered by advanced diagnostics and AI.",
  keywords:
    "appearance optimization, health optimization, science-backed, personalized protocol, facial aesthetics, hormone optimization",
  openGraph: {
    title: "SciMax — Optimize Your Appearance With Real Science",
    description:
      "Advanced diagnostics + AI-generated personalized protocols. Not trends. Not supplements ads. Real science.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#050B14] text-white antialiased">{children}</body>
    </html>
  );
}
