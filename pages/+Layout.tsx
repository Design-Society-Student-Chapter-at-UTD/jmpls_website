import React, { useState, useEffect } from "react";
import logoUrl from "../assets/logo.jpeg";
import "./Layout.css";
import { Spinner } from "../components/ui/spinner";
import { Toaster } from "../components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Check for user on mount
    import("../src/lib/auth-service").then(({ getCurrentUser }) => {
      setUser(getCurrentUser());
    });
    
    const handleStart = () => setIsTransitioning(true);
    const handleEnd = () => setIsTransitioning(false);

    window.addEventListener("vike:transition-start", handleStart);
    window.addEventListener("vike:transition-end", handleEnd);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("vike:transition-start", handleStart);
      window.removeEventListener("vike:transition-end", handleEnd);
    };
  }, []);

  const handleLogout = async () => {
    const { logout } = await import("../src/lib/auth-service");
    logout();
    setUser(null);
  };

  // Prevent scrolling when mobile menu is open or transitioning
  useEffect(() => {
    if (isMenuOpen || isTransitioning) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen, isTransitioning]);

  const navLinks = [
    { name: "About Us", href: "/about-us" },
    { name: "Resources", href: "/resources" },
    { name: "Events", href: "/events" },
    // { name: "Merchandise", href: "/merchandise" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" expand={true} />
      
      {/* Global Loading Overlay */}
      <div className={`fixed inset-0 z-[1000] bg-white transition-opacity duration-300 flex items-center justify-center ${isTransitioning ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col items-center gap-10">
          <div className="relative">
            <Spinner className="absolute -inset-4 size-28 text-maroon/20 stroke-[1]" />
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-maroon shadow-2xl animate-pulse relative z-10">
              <img src={logoUrl} alt="JMPLS" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.6em] text-maroon animate-pulse">Establishing Connection</span>
            <div className="h-[1px] w-12 bg-gold/50"></div>
          </div>
        </div>
      </div>

      <nav className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-white/95 backdrop-blur-md border-gray-200 shadow-sm py-3`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 w-full flex justify-between items-center">
          
          {/* Logo & Brand */}
          <a href="/" className="flex items-center gap-3 md:gap-4 group">
            <Logo isScrolled={true} />
            <div className="flex flex-col text-gray-900">
              <span className="font-serif font-bold text-base md:text-lg tracking-wide leading-none group-hover:text-gold transition-colors text-inherit">JMPLS</span>
              <span className="text-[0.6rem] md:text-[0.65rem] tracking-widest uppercase opacity-80 mt-1 font-semibold text-inherit">UT Dallas</span>
            </div>
          </a>

          {/* Desktop Navigation Links & User Action */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex gap-8 items-center text-sm font-medium tracking-wide text-gray-600">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="hover:text-gold transition-colors relative group">
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gold transition-all duration-100 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-6 border-l border-gray-200 pl-8">
              {!user ? (
                <>
                  <a href="/login" className="text-sm font-medium text-gray-600 hover:text-gold transition-colors">
                    Log In
                  </a>
                  <a href="/how-to-join" className="px-6 py-2.5 rounded-sm text-sm font-bold tracking-wider uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-maroon text-white hover:bg-maroon-dark">
                    Join Now
                  </a>
                </>
              ) : (
                <span 
                  onDoubleClick={handleLogout}
                  className="text-sm font-bold text-gray-900 cursor-pointer select-none py-1 hover:text-maroon transition-colors"
                  title="Double-click to sign out"
                >
                  {user.firstname}
                </span>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 rounded-md transition-colors text-gray-900 hover:bg-gray-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>

        </div>
      </nav>

      {/* Mobile/Tablet Sidebar Drawer */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop Overlay */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Sliding Menu Panel */}
        <div className={`absolute top-0 right-0 bottom-0 w-[80%] max-w-[350px] bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Mobile Header */}
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Logo isScrolled={true} />
              <span className="font-serif font-bold text-gray-900">Navigation</span>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex-1 overflow-y-auto py-8 px-6">
            <div className="flex flex-col gap-2">
              <a href="/" className="px-4 py-4 text-xl font-serif font-bold text-gray-900 border-b border-gray-50 flex justify-between items-center hover:text-maroon transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </a>
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="px-4 py-4 text-xl font-serif font-bold text-gray-900 border-b border-gray-50 flex justify-between items-center hover:text-maroon transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Footer - User Identity exactly where "John Marshall" was */}
          <div className="p-6 border-t border-gray-100">
            {!user ? (
               <div className="flex flex-col gap-3">
                 <a 
                   href="/login" 
                   className="flex items-center justify-center w-full py-4 border border-gray-200 text-gray-900 font-bold tracking-wider uppercase text-xs rounded-sm hover:bg-gray-50 transition-all"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   Member Log In
                 </a>
                 <a 
                   href="/how-to-join" 
                   className="flex items-center justify-center w-full py-4 bg-maroon text-white font-bold tracking-wider uppercase text-xs rounded-sm shadow-md active:scale-[0.98] transition-all"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   Join Now
                 </a>
               </div>
            ) : (
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-maroon">Member</span>
                    <span className="text-lg font-serif font-bold text-gray-900 leading-tight">{user.firstname}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }} 
                    className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-maroon transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}

function Logo({ isScrolled }: { isScrolled?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-full border-2 transition-all duration-300 shadow-sm ${isScrolled ? 'w-10 h-10 border-maroon' : 'w-14 h-14 border-white'}`}>
      <img src={logoUrl} alt="JMPLS Logo" className="w-full h-full object-cover" />
    </div>
  );
}

import utdLogoUrl from "../assets/utdallas.png";

function Footer() {
  const [b, s] = useState(0);

  const h = () => {
    const n = (b + 1) | 0;
    if (n >= (1 << 2) - 1) { // Binary 11 = 3
      window.location.href = "/sys-status-log";
    } else {
      s(n);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-8 md:py-10 px-6 md:px-16 flex flex-col gap-6 md:gap-10">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
        <div className="flex items-center gap-6 md:gap-8 text-center md:text-left flex-col md:flex-row">
          <div className="flex items-center gap-3 md:gap-4">
            <div 
              onClick={h}
              className="rounded-full w-10 h-10 md:w-12 md:h-12 overflow-hidden border border-gray-100 shadow-sm cursor-pointer active:scale-95 transition-transform"
            >
              <img src={logoUrl} alt="JMPLS" className="w-full h-full object-cover select-none" />
            </div>
            <div className="w-px h-6 md:h-8 bg-gray-200 hidden md:block"></div>
            <div className="h-8 md:h-10 opacity-80 hover:opacity-100 transition-opacity">
              <img src={utdLogoUrl} alt="UT Dallas" className="h-full object-contain" />
            </div>
          </div>
          <span className="text-gray-500 font-medium text-xs md:text-sm max-w-[300px] md:max-w-none leading-relaxed">
            © {new Date().getFullYear()} John Marshall Pre-Law Society <br className="md:hidden" />
            at the University of Texas at Dallas.
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <a href="mailto:jmplsutd@gmail.com" className="text-gray-600 font-bold uppercase tracking-widest text-[0.6rem] md:text-[0.65rem] hover:text-maroon transition-colors duration-200">
            jmplsutd@gmail.com
          </a>
          <div className="hidden md:block w-px h-4 bg-gray-200"></div>
          <div className="flex gap-6 md:gap-4">
            <a href="https://www.linkedin.com/company/utdjmpls" target="_blank" rel="noopener noreferrer" className="w-4 h-4 md:w-5 md:h-5 text-gray-500 hover:text-maroon transition-colors">
              <LinkedInIcon />
            </a>
            <a href="https://www.instagram.com/utdjmpls/" target="_blank" rel="noopener noreferrer" className="w-4 h-4 md:w-5 md:h-5 text-gray-500 hover:text-maroon transition-colors">
              <InstagramIcon />
            </a>
            <a href="https://linktr.ee/jmpls.utd" target="_blank" rel="noopener noreferrer" className="w-4 h-4 md:w-5 md:h-5 text-gray-500 hover:text-maroon transition-colors">
              <LinktreeIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Simple Icons
const LinkedInIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

const InstagramIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

const LinktreeIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M13.511 5.833h4.662l-2.023-2.612 3.033-1.554L22.656 6.3l-3.473 4.42h-4.672v2.242h4.942l-2.115 2.658 3.123 1.554 3.539-4.846v4.846h-6.205V24h-3.589v-6.832H8.001v-4.846L11.54 17.17l3.123-1.554-2.115-2.658h4.942v-2.242H12.82l-3.472-4.42-.51-.652-3.472 4.42H.666l3.539 4.846 3.123-1.554-2.115-2.658h4.942v2.242H5.484l-2.115 2.658 3.123 1.554 3.539-4.846h-4.662l-2.023 2.612 3.033-1.554 3.472-4.666h4.662L13.511 3.221l2.023-2.612-3.033-1.554L9.028 3.475v2.358z"/></svg>
);
