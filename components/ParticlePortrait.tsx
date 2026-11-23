"use client";

import { useEffect, useRef } from "react";
import { PROFILE } from "@/data/portfolio";
import styles from "./ParticlePortrait.module.css";

interface Particle {
  tx: number;
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: "teal" | "white" | "soft";
  phase: number;
  isRain: boolean;
  rainSpeed: number;
}

export default function ParticlePortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let disposed = false;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let mouseX = -9999;
    let mouseY = -9999;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = PROFILE.portrait;

    const buildParticles = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(300, Math.round(rect.width));
      height = Math.max(460, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const list: Particle[] = [];

      // Subtle vertical rain-like stipple columns matching lovelyfriendly.com atmosphere
      const colCount = Math.min(20, Math.max(10, Math.floor(width / 74)));
      for (let c = 0; c < colCount; c++) {
        const colX = ((c + 0.5) / colCount) * width + Math.sin(c * 7.3) * 16;
        const dots = 38;
        for (let d = 0; d < dots; d++) {
          const px = colX + (Math.random() - 0.5) * 20;
          const py = Math.random() * height;
          list.push({
            tx: px,
            ty: py,
            x: px,
            y: py,
            vx: 0,
            vy: 0,
            size: 1.0 + Math.random() * 1.0,
            alpha: 0.1 + Math.random() * 0.22,
            color: Math.random() > 0.78 ? "white" : "teal",
            phase: Math.random() * Math.PI * 2,
            isRain: true,
            rainSpeed: 0.14 + Math.random() * 0.24,
          });
        }
      }

      // Dense organic stipple sampling of Steven's portrait (sky removed cleanly)
      if (img.complete && img.naturalWidth > 0) {
        const sampleSize = width < 700 ? 116 : 168;
        const off = document.createElement("canvas");
        off.width = sampleSize;
        off.height = sampleSize;
        const octx = off.getContext("2d");

        if (octx) {
          const srcSize = Math.min(img.naturalWidth, img.naturalHeight);
          const sx = (img.naturalWidth - srcSize) / 2;
          const sy = Math.max(0, (img.naturalHeight - srcSize) * 0.2);
          octx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, sampleSize, sampleSize);

          const data = octx.getImageData(0, 0, sampleSize, sampleSize).data;

          const figSize = Math.min(
            width * (width < 700 ? 0.96 : 0.48),
            height * 0.84,
            640
          );
          const originX = (width - figSize) / 2;
          const originY = width < 700 ? 6 : Math.max(6, height * 0.02);

          for (let y = 0; y < sampleSize; y += 1) {
            for (let x = 0; x < sampleSize; x += 1) {
              const i = (y * sampleSize + x) * 4;
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];

              const nx = x / sampleSize;
              const ny = y / sampleSize;

              // Exclude bright sky & ocean backdrop cleanly
              const isBlueBackdrop =
                b > 125 && b - r > 22 && g > 95 && ny < 0.86;
              if (isBlueBackdrop) continue;

              // Smooth oval mask around head + shoulders
              const dx = (nx - 0.5) * 2;
              const dy = (ny - 0.52) * 2;
              const radial = Math.sqrt(dx * dx * 0.92 + dy * dy * 0.82);
              if (radial > 1.08) continue;

              const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

              // Edge contrast catches glasses frame, eyes, hair silhouette & neckline
              let edge = 0;
              if (x + 2 < sampleSize && y + 2 < sampleSize) {
                const ir = (y * sampleSize + (x + 2)) * 4;
                const id = ((y + 2) * sampleSize + x) * 4;
                const diff =
                  Math.abs(r - data[ir]) +
                  Math.abs(g - data[ir + 1]) +
                  Math.abs(r - data[id]) +
                  Math.abs(g - data[id + 1]);
                edge = Math.min(1, diff / 170);
              }

              // Keep silhouette rich in teal across hair/shoulders, crisp white on face & glasses
              const isDarkSilhouette = lum < 0.26;
              const keepProb = isDarkSilhouette
                ? 0.24 + edge * 0.45
                : 0.32 + lum * 0.48 + edge * 0.35;

              if (Math.random() > keepProb) continue;

              const edgeFade = Math.max(0, Math.min(1, (1.08 - radial) * 2.6));
              const bottomFade =
                ny > 0.78 ? Math.max(0, 1 - (ny - 0.78) / 0.22) : 1;

              const alpha = Math.min(
                0.96,
                (isDarkSilhouette
                  ? 0.36 + edge * 0.42
                  : 0.45 + lum * 0.52) *
                  edgeFade *
                  bottomFade
              );

              if (alpha < 0.1) continue;

              // Organic jitter eliminates grid artifacts
              const jitter = width < 700 ? 3.2 : 4.2;
              const tx = originX + nx * figSize + (Math.random() - 0.5) * jitter;
              const ty = originY + ny * figSize + (Math.random() - 0.5) * jitter;

              const angle = Math.random() * Math.PI * 2;
              const spread = reduced ? 0 : 75 + Math.random() * 220;

              let color: "teal" | "white" | "soft" = "teal";
              if (lum > 0.68 || (edge > 0.46 && lum > 0.35)) {
                color = "white";
              } else if (isDarkSilhouette && Math.random() > 0.55) {
                color = "soft";
              }

              list.push({
                tx,
                ty,
                x: tx + Math.cos(angle) * spread,
                y: ty + Math.sin(angle) * spread,
                vx: 0,
                vy: 0,
                size: 1.15 + lum * 1.1 + edge * 0.55,
                alpha,
                color,
                phase: Math.random() * Math.PI * 2,
                isRain: false,
                rainSpeed: 0,
              });
            }
          }
        }
      }

      particles = list;
    };

    const renderFrame = (time: number) => {
      if (disposed) return;
      ctx.clearRect(0, 0, width, height);

      const t = time * 0.0012;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.isRain) {
          if (!reduced) {
            p.y += p.rainSpeed;
            if (p.y > height) p.y = 0;
          }
          ctx.fillStyle =
            p.color === "white"
              ? `rgba(255, 255, 255, ${p.alpha})`
              : `rgba(56, 177, 186, ${p.alpha})`;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          continue;
        }

        if (!reduced) {
          const driftX = Math.sin(t + p.phase) * 0.9;
          const driftY = Math.cos(t * 0.8 + p.phase) * 0.9;
          let targetX = p.tx + driftX;
          let targetY = p.ty + driftY;

          const mdx = p.x - mouseX;
          const mdy = p.y - mouseY;
          const distSq = mdx * mdx + mdy * mdy;
          const radius = 92;
          if (distSq < radius * radius && distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / radius) * 28;
            targetX += (mdx / dist) * force;
            targetY += (mdy / dist) * force;
          }

          p.vx += (targetX - p.x) * 0.095;
          p.vy += (targetY - p.y) * 0.095;
          p.vx *= 0.81;
          p.vy *= 0.81;
          p.x += p.vx;
          p.y += p.vy;
        }

        if (p.color === "white") {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        } else if (p.color === "soft") {
          ctx.fillStyle = `rgba(38, 126, 140, ${p.alpha})`;
        } else {
          ctx.fillStyle = `rgba(56, 177, 186, ${p.alpha})`;
        }
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      if (!reduced) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const handleResize = () => {
      buildParticles();
      if (reduced) renderFrame(0);
    };

    const start = () => {
      if (disposed) return;
      buildParticles();
      rafId = requestAnimationFrame(renderFrame);
    };

    if (img.complete && img.naturalWidth > 0) {
      start();
    } else {
      img.onload = start;
      img.onerror = start;
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-label="Interactive teal and white particle silhouette portrait of Steven Lai"
    />
  );
}
