import React from "react";
import { ChevronDown } from "lucide-react";

interface YearSelectProps {
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
  label?: string;
}

export function YearSelect({ years, selectedYear, onYearChange, label = "Select Academic Year" }: YearSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 ml-1">
        {label}
      </label>
      <div className="relative inline-block w-full md:w-64">
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="appearance-none w-full bg-white border border-gray-200 text-gray-900 py-3 px-4 pr-10 rounded-sm leading-tight focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon font-serif font-bold transition-all cursor-pointer"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <ChevronDown className="size-4" />
        </div>
      </div>
    </div>
  );
}
