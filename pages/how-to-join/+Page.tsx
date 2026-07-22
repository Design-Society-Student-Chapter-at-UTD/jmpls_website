import React from "react";
import config from "../../data/site-config.json";

export default function Page() {
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const { organization, forms } = config;

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-maroon text-white py-24 px-8 text-center">
        <h1 className="text-5xl md:text-6xl mb-6 font-serif font-bold text-white tracking-wide">How to Join</h1>
        <p className="font-serif italic text-xl opacity-90 max-w-3xl mx-auto tracking-widest text-white leading-relaxed">
          Become a part of the premier community for UTD students interested in law, policy, and public service.
        </p>
      </section>

      <section className="max-w-[1400px] mx-auto mt-12 px-6 md:px-12">
        {/* Membership Benefits */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-4">
            <div className="w-1.5 h-8 bg-maroon"></div>
            <h2 className="text-2xl font-sans font-bold">Membership Benefits</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard 
              title="Law School Tours" 
              desc="Exclusive access to guided tours of premier law schools across Texas and beyond." 
            />
            <BenefitCard 
              title="LSAT Workshops" 
              desc="Intensive training sessions led by top-scoring peers and legal experts." 
            />
            <BenefitCard 
              title="Professional Networking" 
              desc="Connect directly with local attorneys, judges, and law school admissions officers." 
            />
            <BenefitCard 
              title="Advocacy Competitions" 
              desc="Participate in mock trials and moot court events to build your court presence." 
            />
          </div>
        </div>

        {/* Membership Process */}
        <div className="bg-white border border-gray-200 p-8 md:p-12 rounded-sm shadow-sm mb-24">
          <div className="flex items-center gap-3 mb-12 border-b border-gray-100 pb-4">
            <div className="w-1.5 h-8 bg-gold"></div>
            <h2 className="text-2xl font-sans font-bold">Registration Process</h2>
          </div>
          
          <div className="space-y-20">
            
            {/* Step 1 - Registration CTA */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-1 flex md:justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-sm bg-maroon text-white font-bold shrink-0">
                  1
                </div>
              </div>
              <div className="md:col-span-11">
                <h3 className="text-xl font-sans font-bold text-gray-900 mb-3">Create Your Account</h3>
                <p className="text-gray-600 text-base mb-6 max-w-3xl leading-relaxed">
                  First, set up your member profile in our digital portal. This will allow you to track your attendance, access member-only resources, and manage your dues.
                </p>
                <a 
                  href="/login" 
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold tracking-wider uppercase text-xs rounded-sm hover:bg-black transition-all"
                >
                  Open Member Portal
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </a>
              </div>
            </div>

            {/* Step 2 - Payment */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-1 flex md:justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-sm bg-gold text-maroon font-bold shrink-0">
                  2
                </div>
              </div>
              <div className="md:col-span-11">
                <div className="bg-gray-50 border border-gray-200 p-8 rounded-sm">
                  <h3 className="text-xl font-sans font-bold text-gray-900 mb-2">Submit Yearly Dues</h3>
                  <p className="text-gray-600 text-base mb-8 max-w-2xl leading-relaxed">
                  Membership dues are <span className="font-bold text-maroon">${organization.membershipDues}.00</span> for the {organization.membershipDuesLabel} academic year. Dues support our tours, workshops, and social events.
                  <br />
                  <a href={forms.membershipRegistration} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-white border border-maroon text-maroon font-bold tracking-wider uppercase text-xs rounded-sm hover:bg-maroon hover:text-white transition-all">
                    Fill Out Microsoft Form
                  </a>
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    <button 
                      onClick={() => copyToClipboard(organization.zelle)}
                      className="group relative px-6 py-4 bg-white border border-gray-200 rounded-sm shadow-sm min-w-[220px] text-left hover:border-maroon transition-all active:scale-[0.98]"
                    >
                      <div className="text-[0.65rem] font-bold uppercase tracking-widest text-maroon mb-1">Zelle</div>
                      <div className="text-gray-900 font-bold font-mono">{organization.zelle}</div>
                      <div className={`absolute top-2 right-2 text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm transition-all ${copiedText === organization.zelle ? "bg-green-100 text-green-700 opacity-100" : "bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100"}`}>
                        {copiedText === organization.zelle ? "Copied" : "Click to Copy"}
                      </div>
                    </button>

                    <button 
                      onClick={() => copyToClipboard(organization.cashapp)}
                      className="group relative px-6 py-4 bg-white border border-gray-200 rounded-sm shadow-sm min-w-[220px] text-left hover:border-maroon transition-all active:scale-[0.98]"
                    >
                      <div className="text-[0.65rem] font-bold uppercase tracking-widest text-green-700 mb-1">CashApp</div>
                      <div className="text-gray-900 font-bold font-mono">{organization.cashapp}</div>
                      <div className={`absolute top-2 right-2 text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm transition-all ${copiedText === organization.cashapp ? "bg-green-100 text-green-700 opacity-100" : "bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100"}`}>
                        {copiedText === organization.cashapp ? "Copied" : "Click to Copy"}
                      </div>
                    </button>
                  </div>

                  <div className="pt-8 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        const priceId = config.stripe.priceIds.membership;
                        if (priceId && !priceId.startsWith("price_your")) {
                          window.open(`https://buy.stripe.com/${priceId}`, '_blank');
                        } else {
                          // Fallback: open the membership form
                          window.open(forms.membershipRegistration, '_blank');
                        }
                      }}
                      className="w-full sm:w-auto px-10 py-4 bg-maroon text-white font-bold tracking-widest uppercase text-xs rounded-sm shadow-md hover:bg-maroon-dark transition-all flex items-center justify-center gap-3"
                    >
                      Pay Securely with Stripe
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

function BenefitCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-sm hover:border-maroon transition-all group">
      <div className="w-10 h-10 bg-gray-50 text-maroon rounded-sm flex items-center justify-center mb-4 transition-colors group-hover:bg-maroon group-hover:text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <h3 className="text-lg font-sans font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
