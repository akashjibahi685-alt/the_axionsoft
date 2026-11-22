import React from "react";
import { getCompanySettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function PrivacyPage() {
  const settings = await getCompanySettings();

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen py-20 border-b border-[#262626]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-4 border-b border-[#262626] pb-8">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest">
              // LEGAL COMPLIANCE
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#F5F3EF] tracking-tight uppercase">
              Privacy Policy
            </h1>
            <p className="font-mono text-xs text-[#666]">
              LAST REVISED: MARCH 2026 // JURISDICTION: INDIA &amp; GLOBAL STANDARDS
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#F5F3EF] uppercase font-mono">
                01 // Introduction &amp; Commitment
              </h2>
              <p>
                {settings.companyName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to preserving the privacy, confidentiality, and data integrity of all prospective clients, partners, candidates, and website visitors. This Privacy Policy details how we collect, store, sanitize, and manage personal and technical information submitted through our digital properties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#F5F3EF] uppercase font-mono">
                02 // Information We Collect
              </h2>
              <p>
                We collect information strictly necessary to evaluate project briefs, conduct technical feasibility assessments, and communicate regarding commercial engineering engagements:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-[#888]">
                <li><strong className="text-[#CCC]">Contact Credentials:</strong> Full name, verified corporate email address, company entity, and optional telephone contact.</li>
                <li><strong className="text-[#CCC]">Project Brief Data:</strong> Technical scope descriptions, estimated timelines, budget indicators, and architectural requirements.</li>
                <li><strong className="text-[#CCC]">Diagnostic Metadata:</strong> Server request timestamps, client user-agent strings, and obfuscated IP addresses used exclusively for rate limiting and malicious request mitigation.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#F5F3EF] uppercase font-mono">
                03 // Defensive Cybersecurity &amp; Engagement Data
              </h2>
              <p>
                In the context of cybersecurity assessments and Vulnerability Assessment and Penetration Testing (VAPT), any client system data, vulnerability disclosures, architectural diagrams, and network logs disclosed under non-disclosure agreements are encrypted at rest with AES-256 and subject to strict zero-knowledge access controls.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#F5F3EF] uppercase font-mono">
                04 // Third-Party Disclosures
              </h2>
              <p>
                We do not sell, rent, monetize, or barter contact details or proprietary client inquiries to any external data brokers or advertising syndicates. Data is accessed solely by authorized engineering leads and system architects evaluating client proposals.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#F5F3EF] uppercase font-mono">
                05 // Data Retention &amp; Rights
              </h2>
              <p>
                You retain the right to inspect, update, or request the immediate purge of your submitted inquiry data from our systems. Inquiries may be addressed to our privacy desk at <a href={`mailto:${settings.contactEmail}`} className="text-[#B6FF5C] underline">{settings.contactEmail}</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </>
  );
}
