import React from "react";
import { getCompanySettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function TermsPage() {
  const settings = await getCompanySettings();

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen py-20 border-b border-[#262626]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-4 border-b border-[#262626] pb-8">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest">
              // COMMERCIAL TERMS
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#F5F3EF] tracking-tight uppercase">
              Terms &amp; Conditions
            </h1>
            <p className="font-mono text-xs text-[#666]">
              EFFECTIVE DATE: MARCH 2026 // JURISDICTION: INDIA
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#F5F3EF] uppercase font-mono">
                01 // Acceptance of Terms
              </h2>
              <p>
                By accessing this website, submitting inquiry forms, or reviewing technical publications provided by {settings.companyName}, you agree to be bound by these Terms and Conditions and all applicable statutory regulations in India and international jurisdictions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#F5F3EF] uppercase font-mono">
                02 // Intellectual Property
              </h2>
              <p>
                All proprietary algorithms, architectural diagrams, software code examples, branding elements, typography treatments, and research publications displayed on this website are the intellectual property of {settings.companyName} unless explicitly designated as third-party open-source artifacts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#F5F3EF] uppercase font-mono">
                03 // Authorized Defensive Cybersecurity Engagements
              </h2>
              <p>
                All cybersecurity services, including vulnerability assessments and penetration testing (VAPT), are conducted strictly under formalized, bilaterally executed Statements of Work (SOW) and explicit Letters of Authorization (LOA). {settings.companyName} does not engage in unauthorized penetration testing, offensive cyber operations, or testing against non-contracted third-party infrastructure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#F5F3EF] uppercase font-mono">
                04 // Limitation of Liability
              </h2>
              <p>
                While {settings.companyName} adheres to the highest engineering standards, content published on this site is provided for informational and preliminary evaluation purposes. Formal warranties and performance service level agreements (SLAs) are governed solely by separate written commercial contracts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#F5F3EF] uppercase font-mono">
                05 // Governing Law &amp; Dispute Resolution
              </h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute arising under or in connection with these terms shall fall under the jurisdiction of the competent courts of Bengaluru, Karnataka, India.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </>
  );
}
