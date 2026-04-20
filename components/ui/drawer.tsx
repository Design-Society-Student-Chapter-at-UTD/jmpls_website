import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: string;
}

export function Drawer({ isOpen, onClose, children, maxHeight = "85vh" }: DrawerProps) {
  const [persistentChildren, setPersistentChildren] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (isOpen) {
      setPersistentChildren(children);
    }
  }, [isOpen, children]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[110] bg-white rounded-t-sm shadow-2xl transition-transform duration-500 overflow-y-auto ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight }}
      >
        <div className="relative">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-gray-100 text-gray-400 rounded-sm hover:bg-gray-200 hover:text-maroon transition-colors z-[120]"
          >
            <X className="size-6" />
          </button>

          {/* Content */}
          <div className="w-full">
            {persistentChildren}
          </div>
        </div>
      </div>
    </>
  );
}
