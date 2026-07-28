'use client';

import { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

export function InteractiveSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const points: Point3D[] = [];
    const N = 400; // Number of points
    const baseRadius = Math.min(width, height) * 0.28; // Sphere radius

    // Initialize points evenly on sphere surface using Fibonacci sphere algorithm
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y

      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const theta = 2 * Math.PI * i / goldenRatio; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        x: x * baseRadius,
        y: y * baseRadius,
        z: z * baseRadius,
        baseX: x * baseRadius,
        baseY: y * baseRadius,
        baseZ: z * baseRadius,
      });
    }

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left - width / 2;
      mouseRef.current.y = e.clientY - rect.top - height / 2;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let angleX = 0.003; // Base rotation speeds
    let angleY = 0.004;
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const centerX = width / 2;
      const centerY = height / 2;

      // Slow drift angles
      angleX += 0.001;
      angleY += 0.0015;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Perspective projection focal length
      const focalLength = baseRadius * 1.5;

      // Draw lines between nearby points for a subtle plexus web effect
      const projected: { sx: number; sy: number; sz: number; size: number; opacity: number }[] = [];

      for (const p of points) {
        // Rotate around Y-axis
        let x1 = p.baseX * cosY - p.baseZ * sinY;
        let z1 = p.baseX * sinY + p.baseZ * cosY;

        // Rotate around X-axis
        let y2 = p.baseY * cosX - z1 * sinX;
        let z2 = p.baseY * sinX + z1 * cosX;

        // Perspective scale factor
        const scale = focalLength / (focalLength + z2);
        let projX = centerX + x1 * scale;
        let projY = centerY + y2 * scale;

        // Mouse displacement force
        if (mouse.active) {
          const dx = projX - (centerX + mouse.x);
          const dy = projY - (centerY + mouse.y);
          const dist = Math.hypot(dx, dy);
          const hoverRadius = 150;

          if (dist < hoverRadius) {
            const force = (hoverRadius - dist) / hoverRadius;
            // Push points away in 2D space
            projX += (dx / (dist || 1)) * force * 35;
            projY += (dy / (dist || 1)) * force * 35;
          }
        }

        const normZ = (z2 + baseRadius) / (baseRadius * 2); // 0 (back) to 1 (front)
        const opacity = normZ * 0.7 + 0.15;
        const size = normZ * 2.8 + 1.2;

        projected.push({ sx: projX, sy: projY, sz: z2, size, opacity });
      }

      // Sort by depth (back to front) for correct painter's layering
      projected.sort((a, b) => b.sz - a.sz);

      // Render points
      for (const p of projected) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(241, 255, 10, ${p.opacity})`; // Neon Yellow Brand Color
        ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-65 pointer-events-auto cursor-none"
    />
  );
}
