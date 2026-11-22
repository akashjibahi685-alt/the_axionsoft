import type { Metadata } from "next";
import "./globals.css";
import { getCompanySettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCompanySettings();
  return {
    title: {
      template: `%s | ${settings.companyName}`,
      default: `${settings.companyName} — ${settings.tagline}`,
    },
    description: settings.mission,
    keywords: [
      "Software Engineering",
      "Artificial Intelligence",
      "Cybersecurity",
      "VAPT",
      "RAG Systems",
      "Cloud Architecture",
      "India",
      "Global Enterprise Software",
    ],
    authors: [{ name: settings.companyName, url: "https://axiontech.in" }],
    creator: settings.companyName,
    metadataBase: new URL("https://axiontech.in"),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://axiontech.in",
      siteName: settings.companyName,
      title: `${settings.companyName} — ${settings.tagline}`,
      description: settings.mission,
      images: [
        {
          url: "/images/blog/zero-trust.svg",
          width: 1200,
          height: 675,
          alt: settings.companyName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.companyName} — ${settings.tagline}`,
      description: settings.mission,
      images: ["/images/blog/zero-trust.svg"],
      creator: "@axiontech_in",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/images/logo/axion-mark.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-[#101010] text-[#F5F3EF] selection:bg-[#B6FF5C] selection:text-[#101010] flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
