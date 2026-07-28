'use client';

import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, moved: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moved = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.moved = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const maxAge = 25; // Lifespan of trail segments in frames
    const baseWidth = 26; // Initial stroke thickness at the cursor head

    let animationFrameId: number;

    const render = () => {
      const points = pointsRef.current;
      const mouse = mouseRef.current;

      // 1. Add current point and interpolate intermediate points if mouse moved fast
      if (mouse.moved) {
        const lastPoint = points[points.length - 1];
        if (lastPoint) {
          const dx = mouse.x - lastPoint.x;
          const dy = mouse.y - lastPoint.y;
          const dist = Math.hypot(dx, dy);

          // Interpolate points every 3px to guarantee an unbroken solid line at speed
          const steps = Math.floor(dist / 3);
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            points.push({
              x: lastPoint.x + dx * t,
              y: lastPoint.y + dy * t,
              age: 0,
            });
          }
        } else {
          points.push({ x: mouse.x, y: mouse.y, age: 0 });
        }
        mouse.moved = false;
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;
      }

      // 2. Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 3. Update points age and remove expired points
      for (let i = 0; i < points.length; i++) {
        points[i].age += 1;
      }
      pointsRef.current = points.filter((p) => p.age < maxAge);

      // 4. Draw continuous tapered line trail
      if (pointsRef.current.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#F1FF0A'; // Neon Yellow Brand Color

        for (let i = 1; i < pointsRef.current.length; i++) {
          const p1 = pointsRef.current[i - 1];
          const p2 = pointsRef.current[i];

          // Calculate age ratio (0 at mouse/head, 1 at tail)
          const ageRatio = p2.age / maxAge;
          const width = baseWidth * (1 - ageRatio);

          if (width > 0.1) {
            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-screen z-50 pointer-events-none select-none"
    />
  );
}
