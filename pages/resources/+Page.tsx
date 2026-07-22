import React from "react";
import { FileText, ExternalLink, BookOpen } from "lucide-react";
import resourcesData from "../../data/resources.json";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-maroon py-24 px-6 text-center border-b-4 border-gold">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">Academic Resources</h1>
          <p className="text-white text-lg md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed">
            Curated resources and documentation to support your journey from undergraduate study to the legal profession.
          </p>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="py-20 px-6 md:px-16 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {resourcesData.map((category, idx) => (
            <div key={idx} className="group p-8 border border-gray-100 bg-white rounded-sm transition-all duration-500 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between mb-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-maroon transition-colors">{category.category}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-sm">{category.description}</p>
                </div>
                <div className="p-3 bg-white border border-gray-100 shadow-sm rounded-sm">
                  <BookOpen className="size-6 text-maroon" />
                </div>
              </div>

              <div className="space-y-3">
                {category.links.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-sm hover:border-gold transition-colors cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="size-4 text-gray-400 group-hover/item:text-maroon transition-colors" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700">{link.title}</span>
                        <span className="text-[0.65rem] text-gray-400">{link.description}</span>
                      </div>
                    </div>
                    <ExternalLink className="size-3.5 text-gray-300 group-hover/item:text-maroon transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}
