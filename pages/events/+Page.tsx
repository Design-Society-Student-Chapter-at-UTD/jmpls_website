import React, { useState } from "react";
import { FileText, ChevronRight, ChevronLeft, ArrowRight, Calendar, MapPin, ExternalLink } from "lucide-react";
import eventHistory from "../../data/event-history.json";
import { Drawer } from "../../components/ui/drawer";

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const closeDrawer = () => setSelectedEvent(null);

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
              <p className="text-gray-500">A look back at our community and advocacy milestones. Click on an event to see more.</p>
            </div>
            <a 
              href="/beyond-the-bar" 
              className="flex items-center justify-center gap-2 px-8 py-4 md:py-3 bg-maroon text-white font-bold tracking-widest uppercase text-[0.65rem] rounded-sm hover:bg-maroon/90 transition-all shadow-md active:scale-95 w-full md:w-auto"
            >
              Beyond the Bar series
              <ArrowRight className="size-3.5" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventHistory.map((event, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedEvent(event)}
                className="group bg-white border border-gray-200 rounded-sm overflow-hidden hover:border-maroon/20 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-maroon rounded-full shadow-sm">
                    {event.date}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-maroon transition-colors mb-4">{event.title}</h3>
                  <p className="text-gray-600 font-light text-sm line-clamp-3 mb-6 italic">"{event.description}"</p>
                  <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center text-maroon text-[0.65rem] font-bold uppercase tracking-widest">
                    View Details
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Event Details Drawer */}
      <Drawer isOpen={!!selectedEvent} onClose={closeDrawer}>
        {selectedEvent && (
          <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-full md:w-1/2 aspect-video rounded-sm overflow-hidden shadow-xl">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-maroon font-bold uppercase tracking-widest text-xs mb-2">
                    <Calendar className="size-3.5" />
                    {selectedEvent.date}
                  </div>
                  <h3 className="font-serif text-4xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h3>
                  <p className="text-gray-700 text-lg leading-relaxed font-light border-l-4 border-gold pl-6 italic">
                    {selectedEvent.longDescription}
                  </p>
                </div>

                {selectedEvent.hasLinks !== false && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h4 className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400">Resources & Links</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedEvent.links.map((link: any, i: number) => (
                        <a 
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-sm hover:border-maroon transition-colors group"
                        >
                          <span className="text-sm font-bold text-gray-700">{link.name}</span>
                          <ExternalLink className="size-3.5 text-gray-400 group-hover:text-maroon transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
