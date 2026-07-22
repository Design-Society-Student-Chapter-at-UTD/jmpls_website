import React, { useState, useEffect } from "react";
import heroBgUrl from "../../assets/images/campus-tour-trellis.jpg";

export default function Page() {
  return (
    <>
      <section className="relative flex flex-col justify-center min-h-[90vh] w-full overflow-hidden text-white pb-16">
        <img 
          src={heroBgUrl} 
          alt="UTD Campus" 
          className="absolute inset-0 w-full h-full object-cover -z-20 brightness-50 transform scale-105 animate-[pulse_30s_ease-in-out_infinite_alternate]" 
        />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-black/80 via-black/50 to-transparent -z-10"></div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-2xl px-4 md:px-8 border-l-4 border-gold bg-black/20 md:bg-black/10 py-8 md:py-12 backdrop-blur-sm rounded-sm">
            
            {/* Main Typographical Hierarchy */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl mb-4 font-serif font-extrabold tracking-wide drop-shadow-xl text-white leading-tight">
              The John Marshall <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gold pr-2">Pre-Law Society</span>
            </h1>
            
            {/* Mission Subtitle */}
            <p className="text-base sm:text-lg md:text-xl font-sans font-light mb-8 md:mb-10 text-white/90 drop-shadow-md leading-relaxed tracking-wide max-w-xl">
              Fostering excellence, advocacy, and community for aspiring legal professionals at the University of Texas at Dallas.
            </p>
            
            {/* Dual CTAs - Stacked on Mobile, Row on Desktop */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <a href="/about-us" className="px-8 py-3.5 bg-maroon text-white font-bold tracking-wider uppercase text-xs sm:text-sm rounded-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-maroon/30 transition-all duration-300 text-center">
                Explore Our Society
              </a>
              <a href="/events" className="px-8 py-3.5 bg-transparent border-2 border-white/80 text-white font-bold tracking-wider uppercase text-xs sm:text-sm rounded-sm hover:bg-white hover:text-black transition-all duration-300 text-center">
                Upcoming Events
              </a>
            </div>
            
          </div>
        </div>
      </section>

      <section id="explore" className="bg-maroon text-white py-16 px-8 text-center border-t-4 border-gold z-10 relative shadow-md">
        <p className="font-serif text-3xl italic font-normal tracking-wide text-white">Primus Gradus in Dia Legis</p>
      </section>

      <section className="py-32 px-[5%] max-w-[1400px] mx-auto bg-gray-50/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Featured Events</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the opportunities awaiting you at JMPLS. From law school tours to advocacy panels, we offer a comprehensive suite of pre-law experiences.</p>
        </div>
        
        <Carousel />
        
        <div className="mt-16 text-center">
          <a href="/events" className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 text-gray-800 font-bold tracking-wider uppercase text-sm rounded-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
            View Full Calendar 
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>
    </>
  );
}

import carouselData from "../../data/home-carousel.json";

function Carousel() {
  const images = carouselData;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-[550px] md:h-[650px] rounded-sm overflow-hidden shadow-md group">
      {images.map((img, idx) => (
        <div 
          key={idx} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img src={img.image} alt={img.title} className="w-full h-full object-cover transform scale-105 transition-transform duration-[10s] ease-out" style={{ transform: idx === currentIndex ? 'scale(1)' : 'scale(1.05)' }} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-12 md:p-16">
            <h3 className="text-white font-serif text-3xl md:text-5xl font-bold tracking-wide drop-shadow-md transition-all duration-700 delay-300" style={{ transform: idx === currentIndex ? 'translateY(0)' : 'translateY(20px)', opacity: idx === currentIndex ? 1 : 0 }}>
              {img.title}
            </h3>
            <p className="text-white/80 max-w-2xl text-base md:text-lg mt-4 transition-all duration-700 delay-500 font-light leading-relaxed" style={{ transform: idx === currentIndex ? 'translateY(0)' : 'translateY(20px)', opacity: idx === currentIndex ? 1 : 0 }}>
              {img.description}
            </p>
          </div>
        </div>
      ))}
      
      {/* Controls */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 border border-white/50 transition-all outline-none cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 border border-white/50 transition-all outline-none cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center gap-3 z-20">
        {images.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-500 outline-none ${idx === currentIndex ? 'bg-gold w-10 shadow-[0_0_8px_rgba(233,131,0,0.8)]' : 'bg-white/50 hover:bg-white/90'}`}
          />
        ))}
      </div>
    </div>
  );
}
