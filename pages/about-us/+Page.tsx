import React, { useState, useEffect } from "react";
import { ChevronDown, BookOpen, FileText, X } from "lucide-react";
import officersData from "../../data/officers.json";
import constitution from "../../data/constitution.json";
import { Drawer } from "../../components/ui/drawer";
import { YearSelect } from "../../components/ui/year-select";

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
  const [selectedYear, setSelectedYear] = useState(officersData[0].year);
  const [activeArticle, setActiveArticle] = useState<number>(1);
  const closeDrawer = () => setSelectedOfficer(null);

  // Track scroll position for constitution TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const num = parseInt(entry.target.getAttribute("data-article") || "1");
            setActiveArticle(num);
          }
        });
      },
      { rootMargin: "-120px 0px -60% 0px" }
    );
    const els = document.querySelectorAll("[data-article]");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToArticle = (num: number) => {
    const el = document.querySelector(`[data-article="${num}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-gray-100 pb-8">
          <div className="text-left">
            <h2 className="text-maroon text-4xl font-serif font-bold">{selectedYear} Executive Board</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl">Meet the dedicated student leaders driving the vision and operations of the John Marshall Pre-Law Society.</p>
          </div>
          <YearSelect 
            years={officersData.map(c => c.year)} 
            selectedYear={selectedYear} 
            onYearChange={setSelectedYear} 
          />
        </div>
        
        {/* Profile Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {officersData
            .find(c => c.year === selectedYear)
            ?.members.map((member, idx) => (
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

      {/* ── Constitution & Bylaws ──────────────────────────────── */}
      <section className="border-t border-gray-200 mt-20 pt-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-maroon text-4xl font-serif font-bold">Constitution &amp; Bylaws</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {constitution.documentTitle}
            </p>
            <p className="mt-2 text-gray-400 text-sm font-bold uppercase tracking-widest">
              Last Amended: {constitution.lastAmended}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Mobile TOC */}
            <MobileTOC
              articles={constitution.articles}
              activeArticle={activeArticle}
              onSelect={scrollToArticle}
            />

            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <nav className="sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="size-4 text-maroon" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Articles</span>
                </div>
                <ul className="space-y-1 border-l-2 border-gray-100">
                  {constitution.articles.map((article) => (
                    <li key={article.number}>
                      <button
                        onClick={() => scrollToArticle(article.number)}
                        className={`w-full text-left pl-4 py-2.5 text-sm transition-all border-l-2 -ml-[2px] ${
                          activeArticle === article.number
                            ? "border-maroon text-maroon font-semibold"
                            : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-widest block leading-tight">
                          Article {romanize(article.number)}
                        </span>
                        <span className="text-xs mt-0.5 block leading-tight">{article.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">
              {/* Preamble */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="size-5 text-gold" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Preamble</h3>
                </div>
                <p className="text-lg md:text-xl leading-relaxed text-gray-700 italic font-serif border-l-4 border-gold pl-6">
                  {constitution.preamble}
                </p>
              </div>

              {/* Articles */}
              {constitution.articles.map((article) => (
                <section
                  key={article.number}
                  data-article={article.number}
                  id={`article-${article.number}`}
                  className="mb-16 scroll-mt-28"
                >
                  <h3 className="text-3xl font-serif font-bold text-gray-900 mb-1">
                    Article {romanize(article.number)}
                  </h3>
                  <p className="text-lg text-gray-500 font-medium mb-8 pb-6 border-b border-gray-100">
                    {article.title}
                  </p>
                  <div className="space-y-8">
                    {article.sections.map((section, idx) => (
                      <div key={idx}>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-maroon mb-3">
                          {section.heading}
                        </h4>
                        <p className="text-base leading-relaxed text-gray-700">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- constitution helpers ---------- */

function romanize(num: number): string {
  const map: [number, string][] = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let result = "";
  let n = num;
  for (const [val, str] of map) {
    while (n >= val) {
      result += str;
      n -= val;
    }
  }
  return result;
}

function MobileTOC({ articles, activeArticle, onSelect }: {
  articles: { number: number; title: string }[];
  activeArticle: number;
  onSelect: (num: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-gray-100 -mx-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-8 py-4 text-sm font-bold uppercase tracking-widest text-gray-700"
      >
        <span>Article {romanize(activeArticle)} — {articles.find((a) => a.number === activeArticle)?.title}</span>
        {open ? <X className="size-4" /> : <ChevronDown className="size-4" />}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full bg-white border-b border-gray-100 shadow-lg z-40 max-h-[60vh] overflow-y-auto">
          <ul className="py-2">
            {articles.map((article) => (
              <li key={article.number}>
                <button
                  onClick={() => { onSelect(article.number); setOpen(false); }}
                  className={`w-full text-left px-8 py-3 text-sm transition-colors ${
                    activeArticle === article.number
                      ? "bg-maroon/5 text-maroon font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-widest block">Article {romanize(article.number)}</span>
                  <span className="text-xs mt-0.5 block text-gray-500">{article.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
