import React, { useEffect, useRef } from 'react';

const COLORS = ['#ff3c6e', '#00e5b4', '#ffe033', '#7c3aed', '#2563eb', '#f97316', '#ec4899'];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

export default function Confetti({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn particles
    particles.current = Array.from({ length: 120 }, () => ({
      x: randomBetween(0, canvas.width),
      y: randomBetween(-80, -10),
      w: randomBetween(7, 14),
      h: randomBetween(4, 8),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: randomBetween(0, Math.PI * 2),
      rotSpeed: randomBetween(-0.12, 0.12),
      vx: randomBetween(-1.5, 1.5),
      vy: randomBetween(2, 5),
      opacity: 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07; // gravity
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height * 0.7) p.opacity -= 0.025;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (alive) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        zIndex: 9999, width: '100%', height: '100%',
      }}
    />
  );
}
