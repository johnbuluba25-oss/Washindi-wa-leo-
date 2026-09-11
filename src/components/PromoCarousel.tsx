import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import { Advertisement } from '../types';

interface PromoCarouselProps {
  banners: Advertisement[];
  onActionClick: (link: string) => void;
}

export const PromoCarousel: React.FC<PromoCarouselProps> = ({ banners, onActionClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl bg-slate-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Graphic with Gradient Overlay */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070c18] via-[#070c18]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070c18] via-[#070c18]/70 to-transparent" />
      </div>

      {/* Banner Content */}
      <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end">
        {currentBanner.badgeText && (
          <div className="inline-flex items-center gap-1 self-start px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black tracking-wide uppercase mb-2 shadow-sm">
            <Sparkles className="w-3 h-3 fill-slate-950" />
            <span>{currentBanner.badgeText}</span>
          </div>
        )}

        <h3 className="text-lg sm:text-2xl md:text-3xl font-black font-display text-white tracking-tight leading-snug max-w-xl text-shadow">
          {currentBanner.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg line-clamp-2">
          {currentBanner.description}
        </p>

        <div className="mt-3 sm:mt-4 flex items-center gap-3">
          <button
            id={`btn-carousel-cta-${currentIndex}`}
            onClick={() => onActionClick(currentBanner.buttonLink)}
            className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <span>{currentBanner.buttonText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            id="btn-carousel-prev"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white flex items-center justify-center border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Previous Banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            id="btn-carousel-next"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white flex items-center justify-center border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Next Banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicator Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              id={`btn-carousel-dot-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
