import React from "react";
import { Mail, Phone, MapPin, Shield, Clock } from "lucide-react";
import { getCompanySettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/forms/ContactForm";

export default async function ContactPage() {
  const settings = await getCompanySettings();

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 border-b border-[#262626] bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
              // COMMERCIAL INQUIRIES &amp; ARCHITECTURAL BRIEFS
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F5F3EF] tracking-tight uppercase leading-[0.95]">
              START A PROJECT.
            </h1>
            <p className="text-base sm:text-lg text-[#A5A5A5] max-w-2xl leading-relaxed">
              Have a high-throughput platform to build, an LLM agent system to orchestrate, or an application to defensibly audit? Submit your brief below.
            </p>
          </div>
        </section>

        {/* Contact Grid: Form + Studio Details */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Form */}
              <div className="lg:col-span-7 space-y-4">
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
                  TECHNICAL BRIEF SUBMISSION
                </span>
                <ContactForm />
              </div>

              {/* Right Column: Direct Channels & Coordination Protocol */}
              <div className="lg:col-span-5 space-y-6">
                <div className="border border-[#262626] bg-[#141414] p-8 space-y-6">
                  <h3 className="font-mono text-xs text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-3">
                    // Direct Communication Channels
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#1C1C1C] border border-[#333] text-[#B6FF5C] flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono text-[#777] uppercase block text-[10px]">
                          Official Email Desk
                        </span>
                        <a
                          href={`mailto:${settings.contactEmail}`}
                          className="text-[#F5F3EF] hover:text-[#B6FF5C] font-mono text-sm transition-colors"
                        >
                          {settings.contactEmail}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#1C1C1C] border border-[#333] text-[#B6FF5C] flex-shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono text-[#777] uppercase block text-[10px]">
                          Direct Phone Line
                        </span>
                        <span className="text-[#F5F3EF] font-mono text-sm">
                          {settings.contactPhone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#1C1C1C] border border-[#333] text-[#B6FF5C] flex-shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono text-[#777] uppercase block text-[10px]">
                          Headquarters Location
                        </span>
                        <span className="text-[#F5F3EF] text-sm">
                          {settings.officeLocation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#1C1C1C] border border-[#333] text-[#B6FF5C] flex-shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono text-[#777] uppercase block text-[10px]">
                          Operating Hours
                        </span>
                        <span className="text-[#F5F3EF] text-xs">
                          Monday – Friday: 09:00 – 19:00 IST (Global Asynchronous 24/7)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Disclosure Notice */}
                <div className="border border-[#262626] bg-[#141414] p-8 space-y-4">
                  <div className="flex items-center gap-2 text-[#B6FF5C]">
                    <Shield className="w-4 h-4" />
                    <span className="font-mono text-xs uppercase font-bold">
                      Defensive Security Disclosure
                    </span>
                  </div>
                  <p className="text-xs text-[#A5A5A5] leading-relaxed">
                    For sensitive vulnerability disclosures or encrypted cybersecurity communications, request our PGP public key fingerprint directly via <code className="text-[#B6FF5C]">security@axiontech.in</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </>
  );
}
