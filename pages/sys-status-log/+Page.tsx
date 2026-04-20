import React from "react";

export default function Page() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-6">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-gray-400 font-sans tracking-widest uppercase text-xs font-bold">Credits</h1>
        <p className="text-gray-900 font-serif text-lg md:text-xl leading-relaxed">
          This website was created by the <a href="https://design-society-blog-f42aa.web.app" target="_blank" rel="noopener noreferrer" className="font-bold text-maroon hover:underline">Design Society Student Chapter</a> at the University of Texas at Dallas for the John Marshall Pre-Law Society.
          <br />
          <span className="text-gray-500 font-medium text-sm max-w-[300px] md:max-w-none leading-relaxed">
            © {new Date().getFullYear()} John Marshall Pre-Law Society <br className="md:hidden" />
            at the University of Texas at Dallas.
          </span>
          <br />
          <span className="text-gray-500 font-medium text-sm max-w-[300px] md:max-w-none leading-relaxed">
            All rights reserved.
          </span>
        </p>
        <div className="w-12 h-0.5 bg-gray-100 mx-auto"></div>
      </div>
    </div>
  );
}
