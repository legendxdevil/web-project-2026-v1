'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RotateCcw, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { useLenis } from '@/components/layout/smooth-scroll-provider';

// DigitColumn component for the mechanical odometer rolling numbers
function DigitColumn({ value }: { value: number }) {
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!columnRef.current) return;
    gsap.to(columnRef.current, {
      yPercent: -value * 10,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [value]);

  return (
    <div className="relative h-[1em] w-[0.62em] overflow-hidden leading-none select-none">
      <div ref={columnRef} className="flex flex-col">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <span key={num} className="h-[1em] w-full flex items-center justify-center leading-none text-center">
            {num}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HeroReveal({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const yellowCoverRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const bgImageRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const lenis = useLenis();

  // Helper function to stop scroll
  const lockScroll = () => {
    lenis?.stop();
    document.documentElement.classList.add('lenis-stopped');
    document.body.style.overflow = 'hidden';
  };

  // Helper function to start scroll
  const unlockScroll = () => {
    lenis?.start();
    document.documentElement.classList.remove('lenis-stopped');
    document.body.style.overflow = 'auto';
  };

  const runAnimation = () => {
    setIsLoading(true);
    lockScroll();

    // Reset pre-animation states
    gsap.set(yellowCoverRef.current, { yPercent: 0, display: 'flex' });
    gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left center', y: 0 });
    setCount(0);
    
    gsap.set(bgImageRef.current, { scale: 1.2 });
    gsap.set(mainTitleRef.current, {
      y: 80,
      opacity: 0,
    });
    gsap.set(scrollIndicatorRef.current, {
      y: 30,
      opacity: 0,
    });

    const progressObj = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        unlockScroll();
        gsap.set(yellowCoverRef.current, { display: 'none' });
        if (onComplete) onComplete();
      }
    });

    // 1. Counter Tick up (for rolling number state updates)
    tl.to(progressObj, {
      value: 100,
      duration: 3.2,
      ease: 'power2.out',
      onUpdate: () => {
        setCount(Math.floor(progressObj.value));
      },
    }, 0);

    // 2. Butter-smooth Progress Bar scaleX Animation (GPU-accelerated, runs concurrently with count)
    tl.to(progressBarRef.current, {
      scaleX: 1,
      duration: 3.2,
      ease: 'power2.out',
    }, 0);

    // 3. Wipe Cover Upwards (the nested line and bottom-right text naturally slide up with it)
    tl.to(yellowCoverRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power4.inOut',
    }, '+=0.2');

    // 3. Zoom Reveal Background Media
    tl.to(bgImageRef.current, {
      scale: 1,
      duration: 2.0,
      ease: 'power3.out',
    }, '-=1.3');

    // 4. Content Slide Up
    tl.to(mainTitleRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.4,
      ease: 'power3.out',
    }, '-=1.0');

    tl.to(scrollIndicatorRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.0,
      ease: 'power3.out',
    }, '-=0.8');
  };

  // Sync scroll lock when lenis updates on mount
  useEffect(() => {
    if (isLoading) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [lenis, isLoading]);

  useGSAP(() => {
    runAnimation();
  }, { scope: containerRef });

  // Math conversions for digits
  const hundreds = Math.floor(count / 100) % 10;
  const tens = Math.floor(count / 10) % 10;
  const units = count % 10;

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-background overflow-hidden select-none">
      
      {/* FULL-SCREEN PRELOADER PANEL OVERLAY */}
      <div
        ref={yellowCoverRef}
        className="fixed inset-0 w-full h-screen z-50 bg-[#0D0D11] flex flex-col justify-end items-end p-8 md:p-16 select-none"
      >
        {/* Large Odometer Counter in bottom right */}
        <div
          ref={textContainerRef}
          className="flex items-center gap-4 md:gap-8 font-black text-neon-yellow text-5xl sm:text-7xl md:text-[8rem] tracking-tighter leading-none mb-4"
        >
          <span>LOADING</span>
          <div className="flex select-none">
            <DigitColumn value={hundreds} />
            <DigitColumn value={tens} />
            <DigitColumn value={units} />
            <span>%</span>
          </div>
        </div>

        {/* Bottom Progress Bar Line */}
        <div
          ref={progressBarRef}
          className="absolute bottom-0 left-0 h-3 bg-neon-yellow w-full"
        />
      </div>

      {/* REVEALED HERO CONTENT (FULL SCREEN VIEWPORT) */}
      <section className="relative w-full h-full flex flex-col justify-between p-8 md:p-16">
        
        {/* Full Viewport Background image */}
        <div ref={bgImageRef} className="absolute inset-0 -z-10 w-full h-full scale-120 select-none pointer-events-none">
          <Image
            src="/hero_couch_woman.png"
            alt="Creative director editorial reveal background"
            fill
            priority
            className="object-cover brightness-[0.75]"
          />
        </div>

        {/* Top padding to account for floating absolute navbar */}
        <div className="h-16" />

        {/* Bottom Content Area: Staggered Title and Indicators */}
        <div className="mt-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-8 z-20">
          <div>
            <h2
              ref={mainTitleRef}
              className="text-7xl md:text-[12rem] font-extrabold tracking-tighter text-neon-yellow select-none leading-none drop-shadow-lg"
            >
              How.
            </h2>
          </div>

          {/* Mouse Scroll / Down Arrow Indicator */}
          <div ref={scrollIndicatorRef} className="flex items-center gap-4">
            <div className="flex flex-col text-left">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Discover</span>
              <span className="text-xs text-white font-medium mt-1">Scroll Down</span>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('experience');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-neutral-900/60 text-white hover:bg-white hover:text-black transition-all duration-300 interactive-cursor cursor-pointer"
            >
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Subtle Re-Trigger Floating Button (Bottom Right) */}
        {!isLoading && (
          <div className="absolute top-28 right-8 md:right-16 z-30">
            <button
              onClick={runAnimation}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900/80 border border-white/10 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-white/30 transition-all duration-300 interactive-cursor cursor-pointer"
              title="Re-play preloader reveal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
