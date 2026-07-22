import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import speakerData from "../../data/beyond-the-bar.json";
import { Drawer } from "../../components/ui/drawer";
import { Carousel } from "../../components/ui/carousel";
import { YearSelect } from "../../components/ui/year-select";
import config from "../../data/site-config.json";

export default function Page() {
  const [selectedSpeaker, setSelectedSpeaker] = React.useState<any>(null);
  const [selectedYear, setSelectedYear] = React.useState(speakerData.cohorts[0].year);
  const closeDrawer = () => setSelectedSpeaker(null);

  return (
    <div className="pb-24 bg-gray-50 min-h-screen relative">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden bg-black">
        <img 
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000" 
          alt="Beyond the Bar" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight text-white">Beyond the Bar</h1>
          <p className="text-lg md:text-xl font-light text-white/90 leading-relaxed max-w-2xl mx-auto italic">
            Connecting aspiring legal minds with the architects of justice and policy.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto -mt-20 relative z-20 px-6 md:px-12">
        <div className="bg-white p-12 md:p-16 border border-gray-200 shadow-2xl rounded-sm flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
               <div className="w-1.5 h-10 bg-maroon rounded-full"></div>
               <h2 className="text-3xl font-serif font-bold text-gray-900">What is Beyond the Bar?</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg font-light">
              Beyond the Bar is a flagship series hosted by the John Marshall Pre-Law Society at UT Dallas. 
              Each month, we bridge the gap between classroom theory and real-world practice by hosting 
              attorneys, judges, and politicians who share their professional journeys.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
               <div className="space-y-1">
                  <div className="text-maroon font-bold text-2xl font-serif text-center md:text-left">12+</div>
                  <div className="text-gray-400 uppercase tracking-widest text-[0.6rem] font-bold font-sans text-center md:text-left">Annual Speakers</div>
               </div>
               <div className="space-y-1">
                  <div className="text-maroon font-bold text-2xl font-serif text-center md:text-left">500+</div>
                  <div className="text-gray-400 uppercase tracking-widest text-[0.6rem] font-bold font-sans text-center md:text-left">Students Reached</div>
               </div>
            </div>
          </div>
          
          {/* Dynamic Registration Card */}
          <div className="w-full md:w-1/3 bg-gray-50 border border-gray-100 p-8 rounded-sm">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-maroon">Program Status</h3>
                <span className={`px-2 py-0.5 rounded-full text-[0.55rem] font-bold uppercase tracking-widest border ${
                  speakerData.programConfig.status === 'Open' ? 'bg-green-50 text-green-700 border-green-200' :
                  speakerData.programConfig.status === 'Waitlist' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {speakerData.programConfig.status}
                </span>
             </div>

             <div className="flex items-center gap-3 text-gray-900 mb-6 font-serif text-xl border-b border-gray-200 pb-4 font-bold">
                <Calendar className="size-5 text-gray-400" />
                {speakerData.programConfig.nextSessionDate === 'TBD' ? 'Next Session TBD' : speakerData.programConfig.nextSessionDate}
             </div>

             {speakerData.programConfig.status === 'Open' && (
               <a 
                 href={config.forms.beyondTheBarSignup}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center justify-center w-full py-4 bg-maroon text-white font-bold tracking-widest uppercase text-xs rounded-sm hover:bg-maroon/90 shadow-lg transition-all active:scale-95"
               >
                 Register Now
                 <ArrowRight className="size-3.5 ml-2" />
               </a>
             )}

             {speakerData.programConfig.status === 'Waitlist' && (
               <button className="w-full py-4 bg-black text-white font-bold tracking-widest uppercase text-xs rounded-sm hover:bg-gray-900 transition-all active:scale-95">
                 Join the Waitlist
               </button>
             )}

             {speakerData.programConfig.status === 'Closed' && (
               <div className="text-center py-4 px-2 bg-gray-100 border border-gray-200 text-gray-500 text-[0.65rem] font-bold uppercase tracking-widest rounded-sm italic">
                  Sign-ups are currently closed
               </div>
             )}
          </div>
        </div>
      </section>

      {/* Year Selection and Speakers Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-200 pb-12">
          <div className="text-left space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-gray-400">
              Speaker Series
            </h3>
            <h4 className="text-5xl font-serif font-bold text-gray-900 leading-none">
              {selectedYear} Cohort
            </h4>
          </div>
          <YearSelect 
            years={speakerData.cohorts.map(c => c.year)} 
            selectedYear={selectedYear} 
            onYearChange={setSelectedYear} 
          />
        </div>

        <div className="pt-8">
          <Carousel itemsToShow={3}>
            {speakerData.cohorts
              .find(c => c.year === selectedYear)
              ?.speakers.map((s, idx) => (
                <SpeakerCard key={idx} {...s} onClick={() => setSelectedSpeaker(s)} />
              )) || []}
          </Carousel>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center py-12">
         <div className="bg-maroon py-16 px-8 rounded-sm text-white shadow-xl">
            <h2 className="text-3xl text-white font-serif font-bold mb-6">Become a Speaker</h2>
            <p className="text-white/80 font-light mb-10 max-w-xl mx-auto leading-relaxed">
               Are you a legal professional or policymaker looking to inspire the next generation of attorneys? We would love to have you on our stage.
            </p>
            <a href="mailto:jmplsutd@gmail.com" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-maroon font-bold tracking-widest uppercase text-xs rounded-sm hover:-translate-y-1 transition-all shadow-lg active:scale-95">
               Contact the Program Board
               <ArrowRight className="size-4" />
            </a>
         </div>
      </section>

      {/* Speaker Bio Drawer */}
      <Drawer isOpen={!!selectedSpeaker} onClose={closeDrawer}>
        {selectedSpeaker && (
          <div className="max-w-4xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-12 items-center md:items-start">
            <div className="w-48 h-64 md:w-64 md:h-80 flex-shrink-0 rounded-sm overflow-hidden shadow-xl border-4 border-white">
              <img 
                src={selectedSpeaker.image} 
                alt={selectedSpeaker.name} 
                className="w-full h-full object-cover object-top" 
              />
            </div>
            
            <div className="flex-1 mt-4 md:mt-0 text-center md:text-left">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-maroon mb-2 block">{selectedSpeaker.role}</span>
              <h3 className="font-serif text-5xl font-bold text-gray-900 mb-6">{selectedSpeaker.name}</h3>
              <div className="space-y-8">
                <div>
                   <div className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400 mb-2">Speaker Biography</div>
                   <p className="text-gray-700 text-xl leading-relaxed font-light italic border-l-4 border-gold pl-6 text-left">
                     "{selectedSpeaker.bio}"
                   </p>
                </div>
                <div>
                   <div className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400 mb-2">Featured Topic</div>
                   <p className="text-gray-900 font-serif text-2xl font-bold">
                     {selectedSpeaker.topic}
                   </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function SpeakerCard({ name, role, topic, image, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white border border-gray-200 rounded-sm overflow-hidden hover:border-maroon/20 hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      <div className="relative h-80 overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-8">
        <div className="flex flex-col gap-1 mb-6">
          <span className="text-[0.6rem] font-bold uppercase tracking-widest text-maroon">{role}</span>
          <h5 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-maroon transition-colors">{name}</h5>
        </div>
        <div className="pt-6 border-t border-gray-100">
           <div className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 mb-2">Core Discussion</div>
           <p className="text-gray-600 font-light italic leading-relaxed line-clamp-1">"{topic}"</p>
        </div>
      </div>
    </div>
  );
}
