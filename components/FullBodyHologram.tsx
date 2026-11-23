"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FullBodyHologram.module.css";

interface FullBodyHologramProps {
  slotSelector?: string;
}

export default function FullBodyHologram({
  slotSelector = "[data-figure-slot]",
}: FullBodyHologramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  const stateRef = useRef({
    base: 0,
    rot0: 0,
    swingT: 0,
    user: 0,
    vel: 0,
    resumeAt: 0,
    dragging: false,
    follow: 0,
    followTo: 0,
    ptrX: 0,
    ptrY: 0,
    ptrOn: 0,
    ptrGain: 0,
    energy: 0,
    burst: 0,
    away: 0,
    dir: 1,
    ripX: 0,
    ripY: 0,
    ripT: 99,
    assemble: 0,
    t0: 0,
    lastScroll: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });

    if (!gl) {
      console.warn("WebGL2 not supported, hologram disabled.");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = stateRef.current;
    state.lastScroll = window.scrollY;
    if (reduced) {
      state.assemble = 1;
    }

    let disposed = false;
    let rafId = 0;

    /* ---------- Shaders (matching lovelyfriendly.com molecules renderer) ---------- */
    const VS = `#version 300 es
in vec3 aPos; in vec3 aCol; in vec3 aNor; in vec4 aV0; in vec4 aV1; in vec4 aV2;
uniform vec2 uRot; uniform vec4 uMap; uniform vec3 uPtr; uniform vec3 uRip; uniform vec3 uSh; uniform vec4 uVW0, uVW1, uVW2;
uniform float uSize, uEps, uTime, uIdle, uAssemble, uEnergy, uDir, uDots, uFocusY, uPtrR, uWall, uBurst, uPersp, uEdge, uEdge2, uFlip;
out vec3 vCol; out vec3 vNor; out float vFade; out float vLum; out float vDepth; out float vSize;
float hash(float n){ return fract(sin(n) * 43758.5453); }
void main(){
  vec3 p = aPos / 30000.0; vec3 n = aNor; float id = float(gl_VertexID);
  float h = hash(id * 0.37), h2 = hash(id * 1.13 + 4.0), h3 = hash(id * 2.71 + 9.0);
  vec3 rnd = vec3(h, h2, h3) - 0.5;
  vec3 q = vec3(p.x * uRot.x + p.z * uRot.y, p.y, -p.x * uRot.y + p.z * uRot.x);
  vec3 nv = vec3(n.x * uRot.x + n.z * uRot.y, n.y, -n.x * uRot.y + n.z * uRot.x);
  float luma = dot(aCol, vec3(0.299, 0.587, 0.114)); vec3 colv = aCol;
  float vfade = 1.0;
  if (aV0.x + aV0.y + aV0.z + aV0.w + aV1.x + aV1.y + aV1.z + aV1.w + aV2.x + aV2.y + aV2.z + aV2.w > 0.0) {
    float lv = dot(aV0, uVW0) + dot(aV1, uVW1) + dot(aV2, uVW2);
    vfade = clamp(lv / max(luma, 0.004), 0.0, 1.0);
  }
  vFade = 1.0; vLum = luma; vDepth = 1.0;
  float size = uSize * (0.85 + 0.3 * h);
  bool gone = vfade < 0.04;
  if (uDots > 0.5) {
    float trust = 1.0;
    float tone = smoothstep(0.12, 0.82, luma);
    float shd = uWall * exp(-pow((p.x - uSh.x) / uSh.z, 2.0) - pow((p.y - uSh.y) / (uSh.z * 0.2), 2.0));
    tone *= 1.0 - 0.9 * shd;
    gone = gone || h2 > mix(0.82, 1.0, trust) || hash(id * 5.3 + 2.0) > mix(mix(0.55, 1.0, uWall), 1.0, tone);
    float F = abs(nv.z);
    float g = smoothstep(0.07, 0.28, abs(p.y - uFocusY));
    float amp = mix(0.6, 1.9, g) * (1.0 + 1.2 * (1.0 - trust)) * (1.0 + 3.0 * uEnergy) * uIdle;
    vec3 flow = vec3(sin(dot(p, vec3(7.1, 5.3, 6.7)) + uTime * 0.9), sin(dot(p, vec3(-5.9, 8.3, 4.1)) + uTime * 1.1 + 1.7), sin(dot(p, vec3(6.3, -4.7, 9.1)) + uTime * 0.7 + 3.1));
    float breath = sin(p.y * 9.0 - uTime * 1.2 + h * 0.6);
    vec3 j = vec3(sin(uTime * (1.5 + 2.0 * h) + h * 40.0), cos(uTime * (1.2 + 2.0 * h2) + h2 * 40.0), sin(uTime * (1.7 + h3) + h3 * 17.0));
    q += nv * breath * 0.0030 * mix(0.3, 1.0, F) * amp;
    q += (j - nv * dot(j, nv)) * 0.0019 * amp;
    q += (flow - nv * dot(flow, nv)) * 0.0017 * amp;
    if (h3 < 0.07) q += (nv * (0.006 + 0.012 * h) + flow * 0.006) * (0.5 + 0.5 * sin(uTime * 0.8 + h * 30.0)) * uIdle;

    // pointer swirl & parting
    vec2 d = q.xy - uPtr.xy; float r = length(d) + 1e-4;
    float f = exp(-r * r / (uPtrR * uPtrR)) * uPtr.z;
    q.xy += (d / r) * f * 0.013 * mix(0.5, 1.5, h) + vec2(-d.y, d.x) / r * f * 0.005;
    q.z += f * 0.015;

    // click ripple
    vec2 dr = q.xy - uRip.xy; float rr = length(dr) + 1e-4;
    float w = exp(-pow((rr - uRip.z * 0.55) / 0.03, 2.0)) * exp(-uRip.z * 2.5);
    q.xy += (dr / rr) * w * 0.02; q.z += w * 0.02;

    // scroll loosen
    q.y -= uDir * uEnergy * 0.03 * h * h;
    q += rnd * vec3(0.01, 0.02, 0.01) * uEnergy * (0.25 + h3);

    // scroll spin burst
    q += (nv * (0.02 + 0.05 * h) + rnd * 0.05 + vec3(0.0, 0.03 * (h2 - 0.3), 0.0)) * uBurst * (0.35 + h3);

    // assemble organic transition on initial page mount, feet first
    float delay = p.y * 0.55 + h * 0.3;
    float t = clamp(uAssemble * 1.85 - delay, 0.0, 1.0); float e = 1.0 - exp2(-10.0 * t);
    vec3 off = normalize(rnd + 1e-3) * (0.3 + 0.7 * h) + vec3(0.0, -0.12, 0.4 * h2);
    float sw = (1.0 - e) * 2.2; off.xz = mat2(cos(sw), -sin(sw), sin(sw), cos(sw)) * off.xz;
    q += off * (1.0 - e); vFade = smoothstep(0.0, 0.15, t);
    size = uSize * mix(0.62, 1.18, tone) * (0.8 + 0.4 * h) * mix(1.12, 0.9, g) * mix(0.6, 1.0, trust) * (1.0 + 0.2 * f) * (1.0 + 2.0 * (1.0 - e));
    vDepth = mix(smoothstep(-0.12, 0.12, q.z), 1.0, uWall);
    vLum = tone;
  }
  float pk = 1.0 / (1.0 - q.z * uPersp); q.x *= pk; q.y = 0.55 + (q.y - 0.55) * pk;
  gl_Position = gone ? vec4(2.0, 2.0, 2.0, 1.0) : vec4(q.x * uMap.x + uMap.y, q.y * uMap.z + uMap.w, clamp(-q.z * 3.0 + uEps, -0.98, 0.98), 1.0);
  vFade *= vfade; gl_PointSize = size; vSize = size;
  vCol = colv; vNor = nv;
}`;

    const FS = `#version 300 es
precision highp float;
in vec3 vCol; in vec3 vNor; in float vFade; in float vLum; in float vDepth; in float vSize;
uniform int uPass; uniform float uDim, uCut;
out vec4 o;
void main(){
  vec2 c = gl_PointCoord * 2.0 - 1.0; float r2 = dot(c, c);
  if (r2 > 1.0) discard;
  if (uPass == 4) { o = vec4(0.016, 0.085, 0.105, 1.0); return; } // dark body under the dots
  if (uPass == 5) { // one molecule
    vec3 n = normalize(vNor); float F = abs(n.z);
    vec3 ramp = mix(vec3(0.043, 0.227, 0.290), vec3(0.170, 0.640, 0.680), smoothstep(0.0, 0.6, vLum));
    ramp = mix(ramp, vec3(0.749, 0.961, 0.949), smoothstep(0.78, 1.0, vLum));
    vec3 col = mix(ramp, vCol, 0.30);
    col *= 0.62 + 0.42 * max(dot(n, normalize(vec3(-0.4, 0.5, 0.75))), 0.0);
    col += vec3(0.60, 0.92, 0.92) * pow(1.0 - F, 3.0) * 0.28; // rim light on shoulders, sleeves & hair
    col *= mix(0.6, 1.0, vDepth) * uDim;
    col *= 0.78 + 0.3 * sqrt(1.0 - r2); // small sphere lighting
    float a = (1.0 - smoothstep(1.0 - 2.4 / max(vSize, 2.4), 1.0, sqrt(r2))) * vFade;
    o = vec4(col * a, a); return;
  }
  discard;
}`;

    const compileShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const err = gl.getShaderInfoLog(s);
        gl.deleteShader(s);
        throw new Error("Shader compile error: " + err);
      }
      return s;
    };

    const createProgram = (
      vsSrc: string,
      fsSrc: string,
      attribs: string[]
    ) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compileShader(gl.VERTEX_SHADER, vsSrc));
      gl.attachShader(p, compileShader(gl.FRAGMENT_SHADER, fsSrc));
      attribs.forEach((name, i) => gl.bindAttribLocation(p, i, name));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error("Program link error: " + gl.getProgramInfoLog(p));
      }
      const u: Record<string, WebGLUniformLocation | null> = {};
      const numU = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < numU; i++) {
        const info = gl.getActiveUniform(p, i)!;
        u[info.name] = gl.getUniformLocation(p, info.name);
      }
      return { p, u };
    };

    let ptsProgram: { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
    try {
      ptsProgram = createProgram(VS, FS, [
        "aPos",
        "aCol",
        "aNor",
        "aV0",
        "aV1",
        "aV2",
      ]);
      for (let g = 3; g < 6; g++) gl.vertexAttrib4f(g, 0, 0, 0, 0);
    } catch (e) {
      console.error("Failed to build WebGL shaders:", e);
      return;
    }

    interface CloudModel {
      vao: WebGLVertexArrayObject;
      n: number;
      nb: number;
      prefix: number[];
    }

    let model: CloudModel | null = null;
    const HP = 1131;

    const buildCloud = (data: {
      n: number;
      nb: number;
      prefix: number[];
      pos: Int16Array;
      col: Uint8Array;
      nor: Int8Array;
      vd?: Uint8Array | null;
    }): CloudModel => {
      const vao = gl.createVertexArray()!;
      gl.bindVertexArray(vao);

      const attrs = [
        { buffer: data.pos, loc: 0, type: gl.SHORT, norm: false, size: 3 },
        { buffer: data.col, loc: 1, type: gl.UNSIGNED_BYTE, norm: true, size: 3 },
        { buffer: data.nor, loc: 2, type: gl.BYTE, norm: true, size: 3 },
      ];

      for (const a of attrs) {
        const b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, a.buffer as ArrayBufferView, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a.loc);
        gl.vertexAttribPointer(a.loc, a.size, a.type, a.norm, 0, 0);
      }

      if (data.vd) {
        const vb = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vb);
        gl.bufferData(gl.ARRAY_BUFFER, data.vd, gl.STATIC_DRAW);
        for (let q = 0; q < 3; q++) {
          gl.enableVertexAttribArray(3 + q);
          gl.vertexAttribPointer(3 + q, 4, gl.UNSIGNED_BYTE, true, 12, q * 4);
        }
      }

      gl.bindVertexArray(null);
      return { vao, n: data.n, nb: data.nb, prefix: data.prefix };
    };

    const unpack = (buf: ArrayBuffer) => {
      const head = new Uint32Array(buf, 0, 2);
      const n = head[0];
      const nb = head[1];
      const counts = new Uint32Array(buf, 8, nb);
      let off = 8 + 4 * nb;
      const dPos = new Int16Array(buf, off, n * 3);
      off += n * 6;
      const dCol = new Uint8Array(buf, off, n * 3);
      off += n * 3;
      const dNor = new Int8Array(buf, off, n * 3);
      off += n * 3;
      const dV =
        buf.byteLength >= off + n * 12 ? new Uint8Array(buf, off, n * 12) : null;
      const vd = dV ? new Uint8Array(n * 12) : null;
      if (dV && vd) {
        for (let cv = 0; cv < 12; cv++) {
          let av = 0;
          const bv = cv * n;
          for (let iv = 0; iv < n; iv++) {
            av = (av + dV[bv + iv]) & 255;
            vd[iv * 12 + cv] = av;
          }
        }
      }

      const pos = new Int16Array(n * 3);
      const col = new Uint8Array(n * 3);
      const nor = new Int8Array(n * 3);

      for (let c = 0; c < 3; c++) {
        let a = 0;
        let b = 0;
        let d = 0;
        const base = c * n;
        for (let i = 0; i < n; i++) {
          a = ((a + dPos[base + i]) << 16) >> 16;
          pos[i * 3 + c] = a;
          b = (b + dCol[base + i]) & 255;
          col[i * 3 + c] = b;
          d = ((d + dNor[base + i]) << 24) >> 24;
          nor[i * 3 + c] = d;
        }
      }

      const prefix = [0];
      for (let k = 0; k < nb; k++) prefix.push(prefix[k] + counts[k]);

      return { n, nb, prefix, pos, col, nor, vd };
    };

    const densify = (d: ReturnType<typeof unpack>, voxel: number) => {
      const n = d.n;
      const T = n < 600000 ? 3 : 2;
      const pos = new Int16Array(n * 3 * T);
      const col = new Uint8Array(n * 3 * T);
      const nor = new Int8Array(n * 3 * T);
      const vd = d.vd ? new Uint8Array(n * 12 * T) : null;
      let seed = 1234567;
      const rnd = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296 - 0.5;
      };

      for (let i = 0; i < n; i++) {
        const a = i * 3;
        const b = i * 3 * T;
        const nx = d.nor[a] / 127;
        const ny = d.nor[a + 1] / 127;
        const nz = d.nor[a + 2] / 127;
        let tx = -nz;
        let tz = nx;
        const tl = Math.hypot(tx, tz) || 1;
        tx /= tl;
        tz /= tl;
        const ux = ny * tz;
        const uy = nz * tx - nx * tz;
        const uz = -ny * tx;

        for (let k = 0; k < T; k++) {
          const j1 = rnd() * voxel;
          const j2 = rnd() * voxel;
          const o = b + k * 3;
          pos[o] = Math.round(d.pos[a] + tx * j1 + ux * j2);
          pos[o + 1] = Math.round(d.pos[a + 1] + uy * j2);
          pos[o + 2] = Math.round(d.pos[a + 2] + tz * j1 + uz * j2);
          col[o] = d.col[a];
          col[o + 1] = d.col[a + 1];
          col[o + 2] = d.col[a + 2];
          nor[o] = d.nor[a];
          nor[o + 1] = d.nor[a + 1];
          nor[o + 2] = d.nor[a + 2];
          if (vd && d.vd) {
            vd.set(d.vd.subarray(i * 12, i * 12 + 12), (i * T + k) * 12);
          }
        }
      }
      return {
        n: n * T,
        nb: d.nb,
        prefix: d.prefix.map((v) => v * T),
        pos,
        col,
        nor,
        vd,
      };
    };

    /* ---------- Load Data ---------- */
    const loadHologramData = async () => {
      try {
        let arrayBuf: ArrayBuffer | null = null;
        if ("DecompressionStream" in window) {
          try {
            const res = await fetch("/data/figure.bin.gz");
            if (res.ok && res.body) {
              const decompressed = res.body.pipeThrough(
                new DecompressionStream("gzip")
              );
              arrayBuf = await new Response(decompressed).arrayBuffer();
            }
          } catch {
            // Fallback to uncompressed bin
          }
        }

        if (!arrayBuf) {
          const res = await fetch("/data/figure.bin");
          if (!res.ok) throw new Error("Failed to load /data/figure.bin");
          arrayBuf = await res.arrayBuffer();
        }

        if (disposed) return;
        const rawCloud = unpack(arrayBuf);
        const denseCloud = densify(rawCloud, 30000 / 680);
        model = buildCloud(denseCloud);
        setIsReady(true);
      } catch (err) {
        console.error("Hologram data load failed:", err);
      }
    };

    loadHologramData();

    /* ---------- Rendering & Interaction ---------- */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      return dpr;
    };

    const draw = (now: number) => {
      if (disposed || !model) return;
      const slot = document.querySelector(slotSelector) as HTMLElement | null;
      if (!slot) return;

      const dpr = resize();
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      const r = slot.getBoundingClientRect();

      const theta = state.base + state.user + state.follow * state.away;
      const visible = r.height > 0 && r.bottom > -40 && r.top < H + 40;

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clearDepth(1);
      gl.depthMask(true);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      if (!visible) return;

      const cx = r.left + r.width / 2;
      const h = r.height;
      const spacing = (h * dpr) / HP;

      gl.useProgram(ptsProgram.p);
      gl.uniform2f(ptsProgram.u.uRot, Math.cos(theta), Math.sin(theta));
      gl.uniform4f(
        ptsProgram.u.uMap,
        (2 * h) / W,
        (2 * cx) / W - 1,
        (2 * h) / H,
        1 - (2 * r.bottom) / H
      );
      gl.uniform1f(ptsProgram.u.uTime, now / 1000);
      gl.uniform1f(ptsProgram.u.uDim, 1.3);
      gl.uniform1f(ptsProgram.u.uCut, 1.0);
      gl.uniform1f(ptsProgram.u.uIdle, reduced ? 0 : 1);
      gl.uniform1f(ptsProgram.u.uAssemble, state.assemble);
      gl.uniform1f(ptsProgram.u.uEnergy, state.energy);
      gl.uniform3f(
        ptsProgram.u.uPtr,
        (state.ptrX - cx) / h,
        (r.bottom - state.ptrY) / h,
        state.ptrGain
      );
      gl.uniform3f(
        ptsProgram.u.uRip,
        (state.ripX - cx) / h,
        (r.bottom - state.ripY) / h,
        state.ripT
      );
      gl.uniform1f(ptsProgram.u.uDir, state.dir);
      gl.uniform1f(ptsProgram.u.uFocusY, (r.bottom - H * 0.5) / h);
      gl.uniform1f(ptsProgram.u.uPtrR, 95 / h);
      gl.uniform4f(ptsProgram.u.uVW0, 1, 0, 0, 0);
      gl.uniform4f(ptsProgram.u.uVW1, 0, 0, 0, 0);
      gl.uniform4f(ptsProgram.u.uVW2, 0, 0, 0, 0);

      gl.bindVertexArray(model.vao);
      gl.uniform1f(ptsProgram.u.uWall, 0);
      gl.uniform1f(
        ptsProgram.u.uPersp,
        0.42 * Math.min(1, (1 - Math.cos(theta)) * 0.9)
      );
      gl.uniform1f(ptsProgram.u.uBurst, reduced ? 0 : state.burst * 0.16);

      // 1. Dark body under the dots (hides far side cleanly)
      const body =
        Math.min(1, Math.max(0, (state.assemble - 0.55) / 0.45)) *
        (1 - 0.15 * state.burst);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LESS);
      gl.depthMask(true);
      if (body > 0) {
        gl.enable(gl.BLEND);
        gl.blendColor(body, body, body, body * 0.9);
        gl.blendFuncSeparate(
          gl.CONSTANT_ALPHA,
          gl.ONE_MINUS_CONSTANT_ALPHA,
          gl.CONSTANT_ALPHA,
          gl.ONE_MINUS_CONSTANT_ALPHA
        );
        gl.uniform1f(ptsProgram.u.uDots, 0);
        gl.uniform1i(ptsProgram.u.uPass, 4);
        gl.uniform1f(ptsProgram.u.uEps, 0.03);
        gl.uniform1f(ptsProgram.u.uSize, Math.max(2, spacing * 2.4 * 1.6));
        gl.drawArrays(gl.POINTS, 0, model.prefix[3]);
      }

      // 2. Luminous particle molecules (exact lovelyfriendly.com dots look)
      const G = 1.85 * dpr;
      const buckets = Math.max(
        1,
        Math.min(model.nb, Math.round(Math.pow(spacing / G, 2) * model.nb))
      );
      const gap = spacing / Math.sqrt(buckets / model.nb);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthFunc(gl.LEQUAL);
      gl.uniform1f(ptsProgram.u.uDots, 1);
      gl.uniform1i(ptsProgram.u.uPass, 5);
      gl.uniform1f(ptsProgram.u.uEps, 0);
      gl.uniform1f(
        ptsProgram.u.uSize,
        Math.max(1.3 * dpr, Math.min(gap * 1.0, 2.1 * dpr))
      );
      gl.drawArrays(gl.POINTS, 0, model.prefix[buckets]);
      gl.disable(gl.BLEND);
    };

    let prev = 0;
    let spinGain = 0;

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - prev) / 1000 || 0);
      prev = now;

      if (!state.dragging) {
        state.user += state.vel * dt;
        state.vel *= Math.pow(0.04, dt);
        if (Math.abs(state.vel) < 0.01) state.vel = 0;
      }

      const free = !state.dragging && now > state.resumeAt;
      spinGain += ((free ? 1 : 0) - spinGain) * Math.min(1, dt * 3);

      // Scroll-driven rotation matching lovelyfriendly.com: faces viewer at head & feet, turns in between
      if (!reduced) {
        const slot = document.querySelector(slotSelector) as HTMLElement | null;
        if (slot) {
          const rr = slot.getBoundingClientRect();
          const vh = window.innerHeight;
          const p = Math.min(1, Math.max(0, (vh * 0.5 - rr.top) / rr.height));
          state.swingT += dt * spinGain;
          let sp = Math.min(1, Math.max(0, (p - 0.2) / 0.5));
          sp = sp * sp * (3 - 2 * sp);
          const away = Math.min(1, p / 0.12);
          const to =
            state.rot0 -
            Math.PI * 2 * sp +
            0.06 * Math.sin(state.swingT * 0.5) * away;
          state.burst = Math.sin(Math.PI * sp);
          state.away = away;
          state.base += (to - state.base) * Math.min(1, dt * 5);
        }
      }

      // Cursor follow & swirl
      state.follow += (state.followTo - state.follow) * Math.min(1, dt * 3.5);
      state.ptrGain +=
        (state.ptrOn - state.ptrGain) *
        Math.min(1, dt * (state.ptrOn > state.ptrGain ? 9 : 2.2));
      if (state.ptrOn > 0.25) state.ptrOn = Math.max(0.25, state.ptrOn - dt * 1.5);
      state.ripT += dt;

      // Scroll speed loosens particle cloud
      const sy = window.scrollY;
      const dv = sy - state.lastScroll;
      const v = Math.abs(dv) / Math.max(dt, 0.001);
      state.lastScroll = sy;
      if (dv) state.dir = dv > 0 ? 1 : -1;
      state.energy = Math.max(
        state.energy * Math.pow(0.012, dt),
        reduced ? 0 : Math.min(1, v / 3000)
      );

      // Smooth assembly from loose particles
      if (state.assemble < 1) {
        if (!state.t0) state.t0 = now;
        state.assemble = Math.min(1, (now - state.t0) / 2400);
      }

      draw(now);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    /* ---------- Pointer Drag & Hover ---------- */
    let ptr: {
      id: number;
      x: number;
      y: number;
      lx: number;
      lt: number;
      live: boolean;
    } | null = null;

    const inSlot = (x: number, y: number) => {
      const slot = document.querySelector(slotSelector) as HTMLElement | null;
      if (!slot) return false;
      const r = slot.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (
        e.button ||
        !inSlot(e.clientX, e.clientY) ||
        (e.target as HTMLElement)?.closest("a, button, input, nav, .feed, .zoom")
      ) {
        return;
      }
      ptr = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        lx: e.clientX,
        lt: e.timeStamp,
        live: false,
      };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!ptr || e.pointerId !== ptr.id) {
        if (e.pointerType === "mouse") {
          state.ptrX = e.clientX;
          state.ptrY = e.clientY;
          state.ptrOn = 1;
          if (!reduced) {
            state.followTo = (e.clientX / window.innerWidth - 0.5) * 0.2;
          }
          const sp = Math.hypot(e.movementX || 0, e.movementY || 0);
          state.ptrOn = Math.min(1, 0.25 + sp / 40);
        }
        return;
      }

      const dx = e.clientX - ptr.x;
      const dy = e.clientY - ptr.y;
      if (!ptr.live) {
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) {
          if (Math.abs(dy) > 12) ptr = null;
          return;
        }
        ptr.live = true;
        state.dragging = true;
        state.vel = 0;
      }

      const step = (e.clientX - ptr.lx) * 0.0075;
      const t = Math.max(1, e.timeStamp - ptr.lt);
      state.user += step;
      state.vel = (step / (t / 1000)) * 0.6;
      ptr.lx = e.clientX;
      ptr.lt = e.timeStamp;
      e.preventDefault();
    };

    const handleRelease = (e: PointerEvent) => {
      if (!ptr || e.pointerId !== ptr.id) return;
      if (!ptr.live && !reduced && inSlot(ptr.x, ptr.y)) {
        state.ripX = ptr.x;
        state.ripY = ptr.y;
        state.ripT = 0;
      }
      if (ptr.live) {
        state.dragging = false;
        state.resumeAt = performance.now() + 1400;
      }
      ptr = null;
    };

    const handlePointerLeave = () => {
      state.ptrOn = 0;
      state.followTo = 0;
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", handleRelease);
    window.addEventListener("pointercancel", handleRelease);
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handleRelease);
      window.removeEventListener("pointercancel", handleRelease);
      document.removeEventListener("pointerleave", handlePointerLeave);
      if (model) {
        gl.deleteVertexArray(model.vao);
      }
      gl.deleteProgram(ptsProgram.p);
    };
  }, [slotSelector]);

  return (
    <canvas
      id="figure-canvas"
      ref={canvasRef}
      className={`${styles.canvas} ${isReady ? styles.isReady : ""}`}
      aria-hidden="true"
    />
  );
}
