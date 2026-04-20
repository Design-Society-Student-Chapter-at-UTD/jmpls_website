import React from "react";
import { FileText, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";

export default function Page() {
  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <section className="bg-maroon text-white py-24 px-8 text-center border-b-4 border-gold">
        <h1 className="text-5xl md:text-6xl mb-6 font-serif font-bold tracking-wide text-white">Upcoming Events</h1>
        <p className="font-serif italic text-xl opacity-90 max-w-3xl mx-auto tracking-widest leading-relaxed text-white">
          Join us for law school tours, monthly GBMs, and the Beyond the Bar series.
        </p>
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-8 space-y-24">
        
        {/* Active Calendar */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-gold rounded-full"></div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Events Calendar</h2>
          </div>
          <div className="bg-white border border-gray-200 h-[600px] md:h-[800px] overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <iframe 
              src="https://calendar.google.com/calendar/embed?src=jmplsutd%40gmail.com&ctz=America%2FChicago" 
              style={{ border: 0, width: '100%', height: '100%' }} 
              frameBorder="0" 
              scrolling="yes"
              title="JMPLS Calendar"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Past Events Archive */}
        <div className="space-y-12 pb-24">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-maroon rounded-full"></div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Past Events Archive</h2>
              </div>
              <p className="text-gray-500">A look back at our community and advocacy milestones.</p>
            </div>
            <a 
              href="/beyond-the-bar" 
              className="flex items-center justify-center gap-2 px-8 py-4 md:py-3 bg-maroon text-white font-bold tracking-widest uppercase text-[0.65rem] rounded-sm hover:bg-maroon/90 transition-all shadow-md active:scale-95 w-full md:w-auto"
            >
              Beyond the Bar series
              <ArrowRight className="size-3.5" />
            </a>
          </div>
          
          <PastEventsCarousel />
        </div>

      </section>
    </div>
  );
}

function PastEventsCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const events = [
    { title: "The 2024 Law Gala", date: "Nov 2024", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200", desc: "Our annual formal networking event hosted at the Davidson-Gundy Center." },
    { title: "Moot Court Competition", date: "Oct 2024", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200", desc: "Student advocates competing in high-stakes appellate oral arguments." },
    { title: "LSAT Intensive Camp", date: "Aug 2024", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200", desc: "A rigorous 3-day deep dive into logic games and reading comprehension." }
  ];

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  }, [events.length]);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  }, [events.length]);

  React.useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative group overflow-hidden rounded-sm bg-black aspect-[3/4] md:aspect-[21/9] shadow-2xl">
      {events.map((evt, idx) => (
        <div 
          key={idx} 
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
        >
          <img src={evt.image} alt={evt.title} className="w-full h-full object-cover brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 md:p-16">
            <div className="text-gold font-bold uppercase tracking-widest text-[0.6rem] mb-2">{evt.date}</div>
            <h3 className="text-white text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">{evt.title}</h3>
            <p className="text-white/70 max-w-xl text-sm md:text-lg leading-relaxed italic">
              "{evt.desc}"
            </p>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95"
        >
          <ChevronLeft className="size-6" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-1/2 md:-translate-x-1/2 flex gap-2">
        {events.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-10 bg-gold' : 'w-3 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}
