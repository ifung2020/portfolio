"use client";

import { useEffect, useRef } from "react";

interface MorphParticle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  bright: boolean;
  phase: number;
}

interface ParticleGlyphCanvasProps {
  glyph: string;
  label: string;
}

const PARTICLE_COUNT = 1350;

export default function ParticleGlyphCanvas({
  glyph,
  label,
}: ParticleGlyphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<MorphParticle[]>([]);
  const targetGlyphRef = useRef<string>(glyph);

  useEffect(() => {
    targetGlyphRef.current = glyph;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(280, Math.round(rect.width));
    const h = Math.max(180, Math.round(rect.height));

    const targets = sampleGlyphTargets(glyph, w, h, PARTICLE_COUNT);
    const list = particlesRef.current;

    if (list.length === 0) {
      particlesRef.current = targets.map((t) => ({
        x: t.x + (Math.random() - 0.5) * 140,
        y: t.y + (Math.random() - 0.5) * 90,
        tx: t.x,
        ty: t.y,
        vx: 0,
        vy: 0,
        size: t.size,
        alpha: t.alpha,
        bright: t.bright,
        phase: Math.random() * Math.PI * 2,
      }));
    } else {
      for (let i = 0; i < list.length; i++) {
        const t = targets[i % targets.length];
        list[i].tx = t.x;
        list[i].ty = t.y;
        list[i].size = t.size;
        list[i].alpha = t.alpha;
        list[i].bright = t.bright;
      }
    }
  }, [glyph]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let rafId = 0;
    let mouseX = -9999;
    let mouseY = -9999;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(280, Math.round(rect.width));
      height = Math.max(180, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targets = sampleGlyphTargets(
        targetGlyphRef.current,
        width,
        height,
        PARTICLE_COUNT
      );

      if (particlesRef.current.length === 0) {
        particlesRef.current = targets.map((t) => ({
          x: reduced ? t.x : t.x + (Math.random() - 0.5) * 120,
          y: reduced ? t.y : t.y + (Math.random() - 0.5) * 80,
          tx: t.x,
          ty: t.y,
          vx: 0,
          vy: 0,
          size: t.size,
          alpha: t.alpha,
          bright: t.bright,
          phase: Math.random() * Math.PI * 2,
        }));
      } else {
        for (let i = 0; i < particlesRef.current.length; i++) {
          const t = targets[i % targets.length];
          particlesRef.current[i].tx = t.x;
          particlesRef.current[i].ty = t.y;
          if (reduced) {
            particlesRef.current[i].x = t.x;
            particlesRef.current[i].y = t.y;
          }
        }
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = time * 0.0018;
      const list = particlesRef.current;

      for (let i = 0; i < list.length; i++) {
        const p = list[i];

        if (!reduced) {
          let tx = p.tx + Math.sin(t + p.phase) * 1.1;
          let ty = p.ty + Math.cos(t * 0.9 + p.phase) * 1.1;

          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const d2 = dx * dx + dy * dy;
          if (d2 < 6400 && d2 > 0.1) {
            const dist = Math.sqrt(d2);
            const push = (1 - dist / 80) * 28;
            tx += (dx / dist) * push;
            ty += (dy / dist) * push;
          }

          p.vx += (tx - p.x) * 0.11;
          p.vy += (ty - p.y) * 0.11;
          p.vx *= 0.78;
          p.vy *= 0.78;
          p.x += p.vx;
          p.y += p.vy;
        }

        ctx.fillStyle = p.bright
          ? `rgba(255, 255, 255, ${p.alpha})`
          : `rgba(56, 177, 186, ${p.alpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      if (!reduced) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onPointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    resize();
    rafId = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-label={`Interactive morphing particle emblem reading ${glyph} for ${label}`}
    />
  );
}

function sampleGlyphTargets(
  glyph: string,
  width: number,
  height: number,
  count: number
) {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const octx = off.getContext("2d");

  const pts: { x: number; y: number; size: number; alpha: number; bright: boolean }[] = [];

  if (octx) {
    octx.clearRect(0, 0, width, height);
    octx.fillStyle = "#ffffff";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    const fontSize = Math.min(height * 0.56, (width * 0.82) / Math.max(2.2, glyph.length * 0.55));
    octx.font = `900 ${Math.round(fontSize)}px "Sofia Sans Extra Condensed", Impact, "Arial Narrow", sans-serif`;
    octx.fillText(glyph, width / 2, height / 2 + fontSize * 0.04);

    const imgData = octx.getImageData(0, 0, width, height).data;
    const raw: { x: number; y: number }[] = [];
    const step = width < 420 ? 3 : 4;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (imgData[(y * width + x) * 4 + 3] > 120) {
          raw.push({ x, y });
        }
      }
    }

    if (raw.length > 0) {
      for (let i = 0; i < count; i++) {
        // Reserve 15% of points as ambient orbital mist
        if (i > count * 0.85) {
          pts.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: 1.0 + Math.random() * 0.9,
            alpha: 0.14 + Math.random() * 0.2,
            bright: Math.random() > 0.7,
          });
        } else {
          const pick = raw[Math.floor((i / (count * 0.85)) * raw.length) % raw.length];
          pts.push({
            x: pick.x + (Math.random() - 0.5) * 3.5,
            y: pick.y + (Math.random() - 0.5) * 3.5,
            size: 1.3 + Math.random() * 1.4,
            alpha: 0.55 + Math.random() * 0.45,
            bright: Math.random() > 0.65,
          });
        }
      }
      return pts;
    }
  }

  for (let i = 0; i < count; i++) {
    pts.push({
      x: width * 0.2 + Math.random() * width * 0.6,
      y: height * 0.25 + Math.random() * height * 0.5,
      size: 1.6,
      alpha: 0.6,
      bright: i % 3 === 0,
    });
  }
  return pts;
}
