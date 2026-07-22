import React, { useState } from "react";
import { Calendar, ArrowRight, MapPin, ExternalLink, School } from "lucide-react";
import tourData from "../../data/law-school-tours.json";
import { Carousel } from "../../components/ui/carousel";
import { YearSelect } from "../../components/ui/year-select";
import { Drawer } from "../../components/ui/drawer";
import config from "../../data/site-config.json";

export default function Page() {
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(tourData.tours[0].year);
  
  const closeDrawer = () => setSelectedTour(null);

  const currentCohort = tourData.tours.find(t => t.year === selectedYear);

  return (
    <div className="pb-24 bg-gray-50 min-h-screen relative">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden bg-black">
        <img 
          src="https://images.unsplash.com/photo-1597670964482-c6050c616e5c?auto=format&fit=crop&q=80&w=2000" 
          alt="Law School Tours" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight text-white">Law School Tours</h1>
          <p className="text-lg md:text-xl font-light text-white/90 leading-relaxed max-w-2xl mx-auto italic">
            Stepping onto the campuses where your legal future begins.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto -mt-20 relative z-20 px-6 md:px-12">
        <div className="bg-white p-12 md:p-16 border border-gray-200 shadow-2xl rounded-sm flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
               <div className="w-1.5 h-10 bg-maroon rounded-full"></div>
               <h2 className="text-3xl font-serif font-bold text-gray-900">Experience Law Schools Firsthand</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg font-light">
              Our Law School Tours program provides members with the unique opportunity to visit various law schools across Texas and beyond. Meet admissions officers, tour facilities, and get a feel for the environment where you'll spend three transformative years.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
               <div className="space-y-1">
                  <div className="text-maroon font-bold text-2xl font-serif text-center md:text-left">15+</div>
                  <div className="text-gray-400 uppercase tracking-widest text-[0.6rem] font-bold font-sans text-center md:text-left">Schools Visited</div>
               </div>
               <div className="space-y-1">
                  <div className="text-maroon font-bold text-2xl font-serif text-center md:text-left">200+</div>
                  <div className="text-gray-400 uppercase tracking-widest text-[0.6rem] font-bold font-sans text-center md:text-left">Miles Traveled</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Grid Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-200 pb-12">
          <div className="text-left space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-gray-400">
              Campus Expeditions
            </h3>
            <h4 className="text-5xl font-serif font-bold text-gray-900 leading-none">
              {selectedYear} Tours
            </h4>
          </div>
          <YearSelect 
            years={tourData.tours.map(t => t.year)} 
            selectedYear={selectedYear} 
            onYearChange={setSelectedYear} 
          />
        </div>

        <div className="pt-8">
          <Carousel itemsToShow={3}>
            {currentCohort?.schools.map((school, idx) => (
              <TourCard key={idx} {...school} onClick={() => setSelectedTour(school)} />
            )) || []}
          </Carousel>
        </div>
      </section>

      {/* Tour Detail Drawer */}
      <Drawer isOpen={!!selectedTour} onClose={closeDrawer}>
        {selectedTour && (
          <div className="max-w-4xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-12 items-center md:items-start">
            <div className="w-full md:w-1/2 aspect-video rounded-sm overflow-hidden shadow-xl border-4 border-white">
              <img 
                src={selectedTour.image} 
                alt={selectedTour.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex-1 mt-4 md:mt-0 text-center md:text-left space-y-6">
              <div>
                <span className={`px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-widest border mb-4 inline-block ${
                  selectedTour.status === 'Upcoming' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {selectedTour.status}
                </span>
                <h3 className="font-serif text-4xl font-bold text-gray-900 mb-2">{selectedTour.name}</h3>
                <div className="flex items-center gap-2 text-gray-500 justify-center md:justify-start">
                  <MapPin className="size-4" />
                  <span className="text-sm">{selectedTour.location}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400 mb-2">About the Visit</div>
                <p className="text-gray-700 text-lg leading-relaxed font-light italic border-l-4 border-gold pl-6 text-left">
                  "{selectedTour.description}"
                </p>
              </div>

              {selectedTour.status === 'Upcoming' && (
                <div className="pt-6">
                  <a 
                    href={config.forms.tourRegistration}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-maroon text-white font-bold tracking-widest uppercase text-xs rounded-sm hover:bg-maroon/90 shadow-lg transition-all active:scale-95"
                  >
                    Register for Tour via Microsoft Forms
                    <ArrowRight className="size-3.5 ml-2" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function TourCard({ name, location, date, status, image, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white border border-gray-200 rounded-sm overflow-hidden hover:border-maroon/20 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[0.55rem] font-bold uppercase tracking-widest border ${
          status === 'Upcoming' ? 'bg-green-500 text-white border-green-600' : 'bg-gray-100 text-gray-500 border-gray-200'
        }`}>
          {status}
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Calendar className="size-3" />
            <span className="text-[0.6rem] font-bold uppercase tracking-widest">{date}</span>
          </div>
          <h5 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-maroon transition-colors leading-tight">{name}</h5>
        </div>
        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-2 text-gray-500">
             <MapPin className="size-3" />
             <span className="text-[0.65rem] font-bold uppercase tracking-widest">{location}</span>
           </div>
           <ArrowRight className="size-4 text-maroon opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
}
