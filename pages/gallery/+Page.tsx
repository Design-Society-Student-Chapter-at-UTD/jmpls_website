import React, { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";
import galleryData from "../../data/gallery.json";

export default function Page() {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => {
    return ["All", ...new Set(galleryData.map((p) => p.category))];
  }, []);

  const filtered = useMemo(() => {
    return filter === "All"
      ? galleryData
      : galleryData.filter((p) => p.category === filter);
  }, [filter]);

  const currentIndex = selectedImage
    ? filtered.findIndex((p) => p.id === selectedImage.id)
    : -1;

  const goNext = () => {
    if (currentIndex < filtered.length - 1) {
      setSelectedImage(filtered[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filtered[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-maroon text-white py-24 px-8 text-center border-b-4 border-gold">
        <h1 className="text-5xl md:text-6xl mb-6 font-serif font-bold text-white tracking-wide">Photo Gallery</h1>
        <p className="font-serif italic text-xl opacity-90 max-w-3xl mx-auto tracking-widest text-white leading-relaxed">
          Moments captured from our events, tours, and speaker series.
        </p>
      </section>

      {/* Filter Bar */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12 pb-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <Grid3X3 className="size-5 text-maroon" />
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
              {filtered.length} {filtered.length === 1 ? "Photo" : "Photos"}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === cat
                    ? "bg-maroon text-white shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedImage(photo)}
              className="group relative overflow-hidden rounded-sm cursor-pointer bg-gray-100 aspect-[4/3]"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-white font-serif text-xl font-bold leading-tight">{photo.title}</h3>
                <p className="text-white/70 text-sm mt-1">{photo.date}</p>
              </div>
              {/* Category badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[0.55rem] font-bold uppercase tracking-widest text-maroon rounded-full shadow-sm">
                {photo.category}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-400 italic">No photos in this category yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center">
          {/* Close */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 z-10 p-2 text-white/70 hover:text-white transition-colors"
          >
            <X className="size-8" />
          </button>

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain transition-all duration-500"
            />

            {/* Prev / Next */}
            {currentIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors"
              >
                <ChevronLeft className="size-10 md:size-12" />
              </button>
            )}
            {currentIndex < filtered.length - 1 && (
              <button
                onClick={goNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors"
              >
                <ChevronRight className="size-10 md:size-12" />
              </button>
            )}
          </div>

          {/* Caption */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-center">
            <h3 className="text-white font-serif text-2xl font-bold">{selectedImage.title}</h3>
            <p className="text-white/60 text-sm mt-1 max-w-xl mx-auto">{selectedImage.description}</p>
            <span className="inline-block mt-2 text-[0.55rem] font-bold uppercase tracking-widest text-gold">
              {selectedImage.category} — {selectedImage.date}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
