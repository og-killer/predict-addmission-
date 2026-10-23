import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { ACADEMIC_QUOTES, AcademicQuote } from '../types';

export const AcademicQuotesBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ACADEMIC_QUOTES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const currentQuote: AcademicQuote = ACADEMIC_QUOTES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ACADEMIC_QUOTES.length) % ACADEMIC_QUOTES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ACADEMIC_QUOTES.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 border border-slate-800 shadow-md">
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Quote Icon & Content */}
        <div className="flex items-start gap-3.5 max-w-4xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0 mt-0.5">
            <Quote className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm sm:text-base font-serif italic text-slate-100 leading-relaxed">
              "{currentQuote.quote}"
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-amber-400">{currentQuote.author}</span>
              <span className="text-slate-500" aria-hidden="true">·</span>
              <span className="text-slate-400">{currentQuote.designation}</span>
            </div>
          </div>
        </div>

        {/* Carousel Dots & Controls */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <div className="flex items-center gap-1 mr-2">
            {ACADEMIC_QUOTES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to quote ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-6 bg-blue-400' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handlePrev}
            aria-label="Previous quote"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next quote"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
