import React from "react";
import { ShoppingBag, Tag, Star, ArrowRight } from "lucide-react";

export default function Page() {
  const products = [
    {
      name: "Society Quarter-Zip",
      category: "Apparel",
      price: "$45.00",
      description: "Premium weight navy quarter-zip with embroidered society crest. Perfect for professional-casual events.",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "JMPLS Professional Padfolio",
      category: "Accessories",
      price: "$25.00",
      description: "Vegan leather debossed padfolio with internal business card slots and high-quality notepad.",
      image: "https://images.unsplash.com/photo-1544816153-165c77bb3286?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Gold Member Lapel Pin",
      category: "Accessories",
      price: "$10.00",
      description: "Polished gold-plated society insignia with a butterfly clutch back.",
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <section className="bg-maroon py-24 px-6 text-center border-b-4 border-gold">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight text-ivory">Society Selection</h1>
          <p className="text-white/80 text-lg md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed">
            Wear your ambition. Official JMPLS merchandise for the modern professional.
          </p>
        </div>
      </section>

      {/* Product Feed */}
      <section className="py-20 px-6 md:px-16 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <div key={idx} className="group border border-gray-100 flex flex-col hover:shadow-2xl hover:border-maroon/10 transition-all duration-700 bg-white">
              <div className="relative h-80 overflow-hidden bg-gray-50">
                 <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                 />
                 <div className="absolute top-4 left-4 py-1 px-3 bg-white text-[0.6rem] font-bold uppercase tracking-widest text-maroon shadow-sm border border-gray-100">
                    {product.category}
                 </div>
              </div>
              
              <div className="p-8 space-y-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-maroon transition-colors">{product.name}</h3>
                  <span className="font-bold text-lg text-gray-900">{product.price}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 italic">
                  "{product.description}"
                </p>
                <button className="w-full py-4 border-2 border-gray-100 font-bold uppercase tracking-widest text-[0.65rem] text-gray-900 hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-300 flex items-center justify-center gap-3">
                   Purchase Inquiry
                   <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Ordering */}
        <div className="mt-20 bg-gray-900 p-12 md:p-16 text-center space-y-8 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {Array.from({length: 64}).map((_, i) => (
                    <div key={i} className="border border-white/20"></div>
                  ))}
              </div>
           </div>
           
           <div className="relative z-10 space-y-4">
             <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Consolidated Orders</h2>
             <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
               Need merchandise for a specific cohort or graduation gift? We offer tiered pricing for bulk professional apparel orders.
             </p>
             <div className="pt-6">
                <a href="mailto:jmplsutd@gmail.com" className="inline-block py-4 px-10 bg-gold text-maroon font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors">
                   Consult an Officer
                </a>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
