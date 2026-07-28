'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroReveal } from '@/components/sections/hero-reveal';
import { InteractiveSphere } from '@/components/ui/interactive-sphere';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    name: 'BEN NAKAMURA',
    role: 'CREATIVE DIRECTOR',
    image: '/team/ben.png',
    desc: 'TRANSFORMING PIXELS INTO DYNAMIC HIGH-FIDELITY EXPERIENCES.',
  },
  {
    name: 'CLIO MARSH',
    role: 'DESIGN LEAD',
    image: '/team/clio.png',
    desc: 'SHAPING GRAPHIC AESTHETICS AND VECTOR COMPONENT GEOMETRY.',
  },
  {
    name: 'YONI TANAKA',
    role: 'DEVELOPER',
    image: '/team/yoni.png',
    desc: 'TUNING HARDWARE ACCELERATION AND SMOOTH INTERACTION MATH.',
  },
  {
    name: 'MAREN COLE',
    role: 'ARTIST',
    image: '/team/maren.png',
    desc: 'CREATING IMMERSIVE PARALLAX DEPTHS AND BRAND NARRATIVES.',
  },
];

const brandsRow1 = ['OPAL', 'OASIS', 'ARC', 'MAINPOINT', 'CLOUDFORM', 'VERTEX', 'APEX', 'AETHER', 'PIXEL'];
const brandsRow2 = ['VERTEX', 'APEX', 'AETHER', 'PIXEL', 'OPAL', 'OASIS', 'ARC', 'MAINPOINT', 'CLOUDFORM'];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalTextRef = useRef<HTMLDivElement>(null);
  const horizontalTriggerRef = useRef<HTMLDivElement>(null);

  // GSAP Horizontal Scroll Pinning & Parallax Background Text
  useGSAP(() => {
    if (!horizontalSectionRef.current || !horizontalTriggerRef.current) return;

    const getScrollAmount = () => {
      if (!horizontalSectionRef.current) return 0;
      return horizontalSectionRef.current.scrollWidth - window.innerWidth;
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: horizontalTriggerRef.current,
        pin: true,
        scrub: 1.5,
        start: 'top top',
        end: () => `+=${getScrollAmount()}`,
        invalidateOnRefresh: true,
      },
    });

    // Translate cards horizontally (wrapped in functional getter to support font-load refresh)
    tl.to(horizontalSectionRef.current, {
      x: () => -getScrollAmount(),
      ease: 'none',
    }, 0);

    // Parallax shift on the background text (wrapped in functional getter to support font-load refresh)
    if (horizontalTextRef.current) {
      tl.to(horizontalTextRef.current, {
        x: () => {
          if (!horizontalTextRef.current) return 0;
          return -(horizontalTextRef.current.scrollWidth - window.innerWidth) * 0.45;
        },
        ease: 'none',
      }, 0);
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, { scope: horizontalTriggerRef });

  return (
    <>
      {!isLoading && <Navbar />}

      <main className="w-full">
        <HeroReveal onComplete={() => setIsLoading(false)} />

        {/* SECTION 1: TYPOGRAPHIC SPEC/manifesto */}
        <section id="experience" className="relative py-32 px-6 md:px-12 bg-background border-t border-black/10">
          <div className="mx-auto max-w-7xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/75 font-bold">MANIFESTO</span>
            
            <div className="mt-8 flex flex-col gap-12">
              <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tight leading-[0.95] text-foreground uppercase max-w-5xl">
                CONCEPT DRIVEN // <br />
                VISUAL CULTURE // <br />
                FOUND IN PARIS
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 border-t border-black/10 pt-12">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-neutral-800 leading-relaxed max-w-md">
                    LOREM IPSUM IS A DUMMY TEXT GENERATOR DESIGNED TO ILLUMINATE COMPILING DESIGN FLOWS. AETHER COMBINES THE GRAPHIC PRECISION OF SWISS TYPOGRAPHY WITH THE PERFORMANCE OF MODERN GRAPHICS CARDS.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-neutral-700 leading-relaxed max-w-md">
                    WE DESIGN ELASTIC INTERFACES THAT ADAPT TO THE CURSOR. DIRECT HARDWARE ACCELERATION RUNS INTERACTIVE SEQUENCES AT 60FPS WITH MINIMAL LAYOUT STUTTER.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: MEET THE OBSESSIVES (Horizontal team scroll - INVERTED TO BLACK) */}
        <section id="showcase" ref={horizontalTriggerRef} className="relative bg-[#0D0D11] text-white overflow-hidden">
          <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
            
            {/* Massive Parallax Background Text */}
            <div 
              ref={horizontalTextRef}
              className="absolute left-0 top-[12%] whitespace-nowrap text-[16vw] font-black uppercase tracking-tighter leading-none select-none text-white/5 select-none pointer-events-none will-change-transform"
            >
              MEET THE OBSESSIVES MEET THE OBSESSIVES
            </div>

            {/* Horizontal cards container */}
            <div 
              ref={horizontalSectionRef} 
              className="relative z-10 flex gap-8 md:gap-12 px-12 xl:pl-[200px] items-center will-change-transform"
            >
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="w-[280px] sm:w-[340px] shrink-0 flex flex-col gap-6"
                >
                  {/* Duotone Portrait Wrapper */}
                  <div className="relative aspect-[3/4] w-full bg-[#0D0D11] overflow-hidden rounded-lg border border-white/10 group">
                    {/* Yellow overlay with mix-blend-color for pure duotone style */}
                    <div className="absolute inset-0 bg-neon-yellow mix-blend-color z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale filter contrast-125 brightness-95 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Member details */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-extrabold tracking-tight leading-none uppercase text-white">
                      {member.name}
                    </h3>
                    <span className="font-mono text-[10px] tracking-widest font-bold text-neon-yellow">
                      {member.role}
                    </span>
                    <p className="font-mono text-[10px] leading-relaxed uppercase text-neutral-400 mt-1 max-w-[280px]">
                      {member.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Tag */}
            <div className="absolute left-12 bottom-12 font-mono text-[10px] uppercase tracking-widest text-white/40">
              [ SCROLL TO EXPLORE THE CREW ]
            </div>
          </div>
        </section>

        {/* SECTION 3: BRANDS WE HAVE SHAPED (Infinite marquees - YELLOW BACKGROUND) */}
        <section id="brands" className="py-32 px-6 md:px-12 bg-background border-b border-black/10 relative overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/75 font-bold">PARTNERS</span>
              <h2 className="text-4xl sm:text-5xl font-black uppercase text-foreground mt-4 tracking-tight">
                BRANDS WE HAVE SHAPED
              </h2>
            </div>
          </div>

          {/* Marquee Rows */}
          <div className="flex flex-col gap-6 w-full max-w-[100vw] overflow-hidden">
            {/* Row 1: Scrolling Left */}
            <div className="w-full overflow-hidden flex select-none">
              <div className="animate-marquee-left flex gap-6 px-3">
                {[...brandsRow1, ...brandsRow1].map((brand, idx) => (
                  <div
                    key={idx}
                    className="px-8 py-4 rounded-full border border-foreground/15 text-foreground font-mono text-sm uppercase tracking-wider bg-foreground/5 hover:bg-foreground hover:text-background transition-all duration-300 interactive-cursor"
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Scrolling Right */}
            <div className="w-full overflow-hidden flex select-none">
              <div className="animate-marquee-right flex gap-6 px-3">
                {[...brandsRow2, ...brandsRow2].map((brand, idx) => (
                  <div
                    key={idx}
                    className="px-8 py-4 rounded-full border border-foreground/15 text-foreground font-mono text-sm uppercase tracking-wider bg-foreground/5 hover:bg-foreground hover:text-background transition-all duration-300 interactive-cursor"
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: CTA SPHERE (INVERTED TO BLACK FOR DOT GLOW) */}
        <section id="cta" className="relative h-[80vh] md:h-screen w-full bg-[#0D0D11] flex flex-col justify-center items-center overflow-hidden px-6">
          {/* Interactive Dotted Sphere Canvas overlay */}
          <InteractiveSphere />

          {/* Centered CTA text */}
          <div className="relative z-10 text-center flex flex-col items-center gap-6 max-w-4xl select-none pointer-events-none">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-neon-yellow font-bold">
              GET IN TOUCH
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none uppercase tracking-tight">
              YOUR NEXT BIG <br />
              THING STARTS HERE
            </h2>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 max-w-md leading-relaxed mt-2">
              COLLABORATING WITH AMBITIOUS BRANDS TO BUILD HYPER-INTERACTIVE DIGITAL LANDSCAPES.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
