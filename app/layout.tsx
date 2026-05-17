import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Transactional Wallet Ledger",
  description: "Technical demo for a production-style transactional wallet ledger API.",
  icons: {
    icon: "/brand-logo.png",
    apple: "/brand-logo.png",
  },
  openGraph: {
    title: "Transactional Wallet Ledger",
    description: "Technical demo for a production-style transactional wallet ledger API.",
    images: ["/brand-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
