import { usePageContext } from "vike-react/usePageContext";
import { MoveLeft, Mail } from "lucide-react";
import logoUrl from "../../assets/logo.jpeg";

export default function Page() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="max-w-md w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Large Branded Visual */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-maroon/5 blur-[100px] rounded-full scale-150"></div>
          <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full border-4 border-white shadow-2xl overflow-hidden">
            <img src={logoUrl} alt="JMPLS Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
            An unexpected error has occurred.
          </h1>
          <p className="text-gray-500 text-base max-w-sm mx-auto leading-relaxed">
            Please notify us of this issue so we can resolve it immediately. 
            You can reach our technical team at <a href="mailto:jmplsutd@gmail.com" className="text-maroon font-bold hover:underline">jmplsutd@gmail.com</a>.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-6 pt-4">
          <a 
            href="/" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-maroon text-white font-bold uppercase tracking-[0.2em] text-[0.7rem] rounded-sm shadow-xl hover:bg-maroon-dark hover:-translate-y-1 transition-all active:scale-[0.98]"
          >
            <MoveLeft className="size-4" />
            Return home
          </a>
          
          <div className="h-px w-12 bg-gray-200"></div>
        
        </div>
      </div>
    </div>
  );
}
