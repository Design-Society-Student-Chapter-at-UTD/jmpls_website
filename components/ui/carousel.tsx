import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode[];
  itemsToShow?: number;
}

export function Carousel({ children, itemsToShow = 3 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    if (currentIndex + itemsToShow < children.length) {
      setCurrentIndex(currentIndex + itemsToShow);
    }
  };

  const prev = () => {
    if (currentIndex - itemsToShow >= 0) {
      setCurrentIndex(currentIndex - itemsToShow);
    }
  };

  const canNext = currentIndex + itemsToShow < children.length;
  const canPrev = currentIndex > 0;

  return (
    <div className="relative w-full">
      <div className="flex gap-8 overflow-hidden">
        {children.slice(currentIndex, currentIndex + itemsToShow).map((child, idx) => (
          <div key={idx} className="flex-1 transition-all duration-500 animate-in fade-in slide-in-from-right-4">
            {child}
          </div>
        ))}
        {/* Fill empty spots to maintain layout if fewer than itemsToShow are left */}
        {children.length > itemsToShow && children.slice(currentIndex, currentIndex + itemsToShow).length < itemsToShow && (
          Array.from({ length: itemsToShow - children.slice(currentIndex, currentIndex + itemsToShow).length }).map((_, i) => (
            <div key={`empty-${i}`} className="flex-1 invisible" />
          ))
        )}
      </div>

      {children.length > itemsToShow && (
        <div className="flex justify-center mt-12 gap-4">
          <button
            onClick={prev}
            disabled={!canPrev}
            className={`p-4 rounded-full border transition-all ${
              canPrev 
                ? "border-maroon text-maroon hover:bg-maroon hover:text-white" 
                : "border-gray-200 text-gray-200 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            className={`p-4 rounded-full border transition-all ${
              canNext 
                ? "border-maroon text-maroon hover:bg-maroon hover:text-white" 
                : "border-gray-200 text-gray-200 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      )}
    </div>
  );
}
