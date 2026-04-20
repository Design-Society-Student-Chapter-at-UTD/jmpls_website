import React, { useState } from "react";
import officersData from "../../data/officers.json";
import { Drawer } from "../../components/ui/drawer";

// Dynamically load all officer images so Vite bundles them
const imageGlob = import.meta.glob("../../assets/images/officers/*", { eager: true, import: "default" });

function getOfficerImage(filename: string) {
  const path = `../../assets/images/officers/${filename}`;
  return (imageGlob[path] as string) || "";
}

interface Officer {
  name: string;
  role: string;
  imageFileName: string;
  bio: string;
}

export default function Page() {
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const closeDrawer = () => setSelectedOfficer(null);

  return (
    <div className="pb-24 bg-white min-h-screen relative">
      <section className="bg-maroon text-white py-24 px-8 text-center border-b-4 border-gold">
        <h1 className="text-6xl mb-6 font-serif font-bold text-white tracking-wide">About Us</h1>
        <p className="font-serif italic text-xl opacity-90 max-w-3xl mx-auto tracking-widest text-white leading-relaxed">
          Dedicated to fostering a community of aspiring legal professionals at UT Dallas.
        </p>
      </section>

      <section className="max-w-6xl mx-auto mt-20 px-8 pb-16 border-b border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          <div className="lg:col-span-3 text-lg leading-relaxed text-gray-700">
            <h2 className="text-maroon text-4xl mb-8 font-serif font-bold border-b-2 border-gray-100 pb-4">Our Mission</h2>
            <p className="mb-6 indent-8">
              The John Marshall Pre-Law Society (JMPLS) provides students with the necessary resources, 
              mentorship, and networking opportunities to succeed in their journey toward law school.
            </p>
            <p className="indent-8">
              From law school tours to LSAT workshops and networking mixers with legal professionals, 
              we bridge the gap between undergraduate studies and a legal career. We serve as the 
              premier organization for students aiming to transition from undergraduate studies to legal practice.
            </p>
          </div>
          
          <div className="lg:col-span-2 bg-gray-50 p-10 border-l-4 border-maroon rounded-sm shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">Quick Facts</h3>
            <ul className="space-y-4 text-gray-700 font-medium tracking-wide">
              <li className="flex items-center gap-3">
                <span className="text-gold text-xl">►</span> Founded to support UTD students
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold text-xl">►</span> Open to all majors
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold text-xl">►</span> Weekly events & workshops
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold text-xl">►</span> Strong alumni network
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto mt-20 px-8">
        <div className="text-center mb-16">
          <h2 className="text-maroon text-4xl font-serif font-bold">2025 – 2026 Executive Board</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Meet the dedicated student leaders driving the vision and operations of the John Marshall Pre-Law Society this year.</p>
        </div>
        
        {/* Profile Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {officersData.map((member, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedOfficer(member)}
              className="bg-white border text-center border-gray-200 rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              <div className="w-full h-80 bg-gray-100 overflow-hidden relative">
                <img 
                  src={getOfficerImage(member.imageFileName)} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-maroon p-2 rounded-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-center">
                <h3 className="font-serif text-3xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-gold font-bold uppercase tracking-wider text-sm">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reusable Drawer for Officer Bios */}
      <Drawer isOpen={!!selectedOfficer} onClose={closeDrawer}>
        {selectedOfficer && (
           <div className="max-w-4xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
              <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-sm overflow-hidden shadow-lg border-4 border-white">
                <img 
                  src={getOfficerImage(selectedOfficer.imageFileName)} 
                  alt={selectedOfficer.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="flex-1 mt-4 md:mt-0">
                <h3 className="font-serif text-4xl font-bold text-gray-900 mb-2">{selectedOfficer.name}</h3>
                <div className="inline-block px-4 py-1.5 bg-maroon/10 text-maroon font-bold uppercase tracking-wider text-sm rounded-sm mb-8">
                  {selectedOfficer.role}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-gold pl-6 text-left">
                  "{selectedOfficer.bio}"
                </p>
              </div>
           </div>
        )}
      </Drawer>
    </div>
  );
}
