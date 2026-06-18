'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
}

// Draw a 4-pointed sparkle star
function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) {
  const inner = size * 0.3;
  const outer = size;

  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = '#e8cc78';

  ctx.beginPath();
  // Top point
  ctx.moveTo(0, -outer);
  ctx.lineTo(inner * 0.4, -inner);
  ctx.lineTo(outer, 0);
  ctx.lineTo(inner * 0.4, inner);
  ctx.lineTo(0, outer);
  ctx.lineTo(-inner * 0.4, inner);
  ctx.lineTo(-outer, 0);
  ctx.lineTo(-inner * 0.4, -inner);
  ctx.closePath();
  ctx.fill();

  // Soft glow around sparkle
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, outer * 1.4);
  gradient.addColorStop(0, `rgba(232, 204, 120, ${opacity * 0.6})`);
  gradient.addColorStop(0.5, `rgba(200, 160, 80, ${opacity * 0.15})`);
  gradient.addColorStop(1, 'rgba(200, 160, 80, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, outer * 1.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export default function StarfieldBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let prefersReduced = false;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReduced = mq.matches;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      // Sparse: ~60-80 sparkles total, feels premium not busy
      const area = canvas!.width * canvas!.height;
      const count = Math.floor(area / 35000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        size: Math.random() * 4 + 2.5,
        opacity: Math.random() * 0.5 + 0.15,
        speed: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    let frame = 0;
    function draw() {
      frame++;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      stars.forEach(star => {
        if (prefersReduced) {
          drawSparkle(ctx!, star.x, star.y, star.size, star.opacity);
          return;
        }

        // Subtle breathing
        const breathe = Math.sin(frame * star.speed + star.phase) * 0.3 + 0.7;
        const op = star.opacity * breathe;
        drawSparkle(ctx!, star.x, star.y, star.size, op);
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);

    const onChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
    };
    mq.addEventListener('change', onChange);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      mq.removeEventListener('change', onChange);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
  );
}
