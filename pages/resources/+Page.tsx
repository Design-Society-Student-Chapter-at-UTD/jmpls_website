import React from "react";
import { FileText, Link as LinkIcon, BookOpen, Download } from "lucide-react";

export default function Page() {
  const resourceCategories = [
    {
      title: "LSAT Preparation",
      description: "Official practice tests, study guides, and diagnostic tools to help you master the LSAT exam.",
      items: [
        { name: "LSAC PrepPlus", type: "External Portal" },
        { name: "7Sage Study Schedule", type: "PDF Guide" },
        { name: "Khan Academy LSAT Hub", type: "Course" }
      ]
    },
    {
      title: "Law School Applications",
      description: "Templates and strategies for personal statements, diversity statements, and addenda.",
      items: [
        { name: "Personal Statement Guide", type: "Document" },
        { name: "Reference Letter Request Template", type: "Word Doc" },
        { name: "Application Timeline 2026", type: "Sheet" }
      ]
    }
  ];

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
          {resourceCategories.map((category, idx) => (
            <div key={idx} className="group p-8 border border-gray-100 bg-white rounded-sm transition-all duration-500">
              <div className="flex items-start justify-between mb-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-maroon transition-colors">{category.title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-sm">{category.description}</p>
                </div>
                <div className="p-3 bg-white border border-gray-100 shadow-sm rounded-sm">
                  <BookOpen className="size-6 text-maroon" />
                </div>
              </div>

              <div className="space-y-3">
                {category.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-sm hover:border-gold transition-colors cursor-pointer group/item">
                    <div className="flex items-center gap-4">
                      <FileText className="size-4 text-gray-400 group-hover/item:text-maroon transition-colors" />
                      <span className="text-sm font-bold text-gray-700">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Alert */}
        <div className="mt-20 p-10 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center text-center space-y-4">
          <Download className="size-8 text-gray-300" />
          <h3 className="text-xl font-serif font-bold text-gray-400">More Resources Incoming</h3>
          <p className="text-gray-400 text-sm max-w-md italic">
            Our Academic Affairs team is currently digitizing our physical library of Law School manuals and alumni interview transcripts.
          </p>
        </div>
      </section>
    </div>
  );
}
