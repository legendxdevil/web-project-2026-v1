'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ['Experience', 'Showcase', 'Design Grid', 'Gallery'];

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 w-full px-8 py-6 md:px-16 flex items-center justify-between pointer-events-none"
      >
        {/* Logo on the left side */}
        <div className="pointer-events-auto">
          <a
            href="#"
            className="flex items-center gap-2 font-mono font-bold tracking-widest text-lg text-foreground interactive-cursor"
          >
            <Shield className="h-5 w-5 text-foreground animate-pulse" />
            <span>AETHER</span>
          </a>
        </div>

        {/* Custom 2-Line Animated Menu Trigger Button on the right side */}
        <div className="pointer-events-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0D0D11] text-neon-yellow shadow-lg hover:scale-105 transition-all duration-300 interactive-cursor cursor-pointer"
            aria-label="Toggle menu"
          >
            {/* Custom 2-Line Morphing Icon */}
            <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5 relative">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-6 h-0.5 bg-neon-yellow block"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-6 h-0.5 bg-neon-yellow block"
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Fullscreen Sliding Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 180 }}
            className="fixed inset-0 z-40 w-full h-screen bg-[#0D0D11]/98 backdrop-blur-2xl flex flex-col justify-between p-12 md:p-24 select-none"
          >
            {/* Header spacer */}
            <div className="flex justify-between items-center mt-12">
              <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Navigation Menu</span>
            </div>

            {/* Huge Centered Vertical Menu List */}
            <nav className="flex flex-col items-center justify-center gap-6 md:gap-10 my-auto text-center">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + idx * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                    className="group flex items-baseline gap-4 md:gap-6 text-center font-black text-white hover:text-neon-yellow text-4xl sm:text-6xl md:text-8xl tracking-tighter leading-none transition-colors duration-200 cursor-pointer"
                  >
                    <span className="font-mono text-xs sm:text-sm text-neutral-600 font-normal self-end pb-1 md:pb-3">0{idx + 1}</span>
                    <span className="uppercase">{item}</span>
                  </button>
                </motion.div>
              ))}
            </nav>

            {/* Footer info in menu */}
            <div className="flex flex-col gap-4 text-left w-full max-w-7xl mx-auto">
              <span className="h-px bg-white/10 w-full" />
              <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>AETHER STUDIO</span>
                <span>&copy; {new Date().getFullYear()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
