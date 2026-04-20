import React, { useEffect, useState } from "react";

export default function Page() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#1a1a1a] selection:bg-none flex flex-col items-center justify-center font-mono cursor-default overflow-hidden">
      {/* This page looks like a broken loading screen or a background process until hovered */}
      <div className={`transition-opacity duration-[3000ms] ${show ? 'opacity-100' : 'opacity-0'}`}>
        <div className="space-y-1">
          <p className="text-[0.6rem] opacity-20">SYSTEM_STATUS: OK</p>
          <p className="text-[0.6rem] opacity-20">METRICS_LOG_ID: {Math.random().toString(36).substring(7)}</p>
          <p className="text-[0.6rem] opacity-20">BUILD_UUID: 550e8400-e29b-41d4-a716-446655440000</p>
        </div>

        <div className="mt-20 group">
          {/* The Actual Credit - hidden in plain sight, only reveals on deliberate hover */}
          <h1 className="text-[0.7rem] md:text-sm font-light tracking-[0.5em] transition-all duration-700 group-hover:text-white/40 group-hover:tracking-[0.8em] uppercase">
            Platform Engineered by 
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ml-2 font-bold text-white/60">
              Taufeeq Ali
            </span>
          </h1>
          <div className="h-px w-0 group-hover:w-full bg-white/10 mt-2 transition-all duration-1000"></div>
        </div>

        <div className="absolute bottom-10 left-10 opacity-[0.03] text-[0.5rem] rotate-90 origin-left">
          PROPRIETARY_CODE_STAMP_2025_TA
        </div>
      </div>
      
      {/* Fake Console Output to distract developers */}
      <div className="absolute top-0 left-0 w-full p-4 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="text-[0.5rem] leading-tight flex flex-col gap-1">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i}>
              [LOG] {new Date().toISOString()} : RX_PACKET_ID_{i} : STATUS_VERIFIED
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
