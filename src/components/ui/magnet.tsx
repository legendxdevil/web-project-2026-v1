'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MagnetProps {
  children: React.ReactNode;
  range?: number;
  speed?: number;
}

export function Magnet({ children, range = 80, speed = 0.35 }: MagnetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(x, y);

      if (distance < range) {
        // Smoothly pull toward mouse coordinates
        gsap.to(el, {
          x: x * 0.4,
          y: y * 0.4,
          duration: speed,
          ease: 'power2.out',
        });
      } else {
        // Return to center with elastic spring bounce
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [range, speed]);

  return (
    <div ref={containerRef} className="inline-block">
      {children}
    </div>
  );
}
