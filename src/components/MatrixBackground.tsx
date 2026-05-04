'use client';
import { useEffect, useRef } from 'react';

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 13;
    const chars = '01アイウエオカキクケコサシスセソタチ10110100';
    let cols = Math.floor(canvas.width / fontSize);
    let drops: number[] = new Array(cols).fill(1);

    const draw = () => {
      cols = Math.floor(canvas.width / fontSize);
      if (drops.length !== cols) {
        drops = new Array(cols).fill(1);
      }

      ctx.fillStyle = 'rgba(11, 13, 23, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Vary opacity for depth effect
        const opacity = 0.08 + Math.random() * 0.12;
        ctx.fillStyle = `rgba(124, 58, 237, ${opacity})`;
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 60);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
