"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PROFILE, PROJECTS } from "@/data/portfolio";
import SplitChars from "./SplitChars";
import styles from "./ParticleWaveFooter.module.css";

interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  previewUrl: string;
}

const PLAYLIST: PlaylistTrack[] = [
  {
    id: "505",
    title: "505",
    artist: "Arctic Monkeys",
    album: "Favourite Worst Nightmare",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d1/0d/ab/d10dabc8-cceb-e718-401f-01516b009460/mzaf_13845311225859403599.plus.aac.p.m4a",
  },
  {
    id: "babydoll",
    title: "Babydoll",
    artist: "Dominic Fike",
    album: "Don't Forget About Me, Demos",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1e/bb/88/1ebb8866-ba1f-1a8b-8e82-90bc9ba0c1ed/mzaf_10828213515596552720.plus.aac.p.m4a",
  },
  {
    id: "cicada",
    title: "Cicada",
    artist: "Good Kid",
    album: "Can We Hang Out Sometime?",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ab/4b/a7/ab4ba732-a684-9f54-dfcc-a5e32ee27bfc/mzaf_7299946333970899566.plus.aac.p.m4a",
  },
  {
    id: "push",
    title: "Push",
    artist: "Connor Price & Nic D",
    album: "About Time",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b8/b7/78/b8b778e3-c641-10ec-23d8-e400a1553654/mzaf_16801231991966062714.plus.aac.p.m4a",
  },
];

export default function ParticleWaveFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const freqRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const playingRef = useRef(false);
  const trackIdxRef = useRef(0);

  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [statusText, setStatusText] = useState(
    `${PLAYLIST[0].artist} — ${PLAYLIST[0].title}`
  );
  const [copied, setCopied] = useState(false);

  const activeTrack = PLAYLIST[trackIdx] || PLAYLIST[0];

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    trackIdxRef.current = trackIdx;
  }, [trackIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;

    const cols = 124;
    const rows = 44;
    const history: Float32Array[] = Array.from(
      { length: rows },
      () => new Float32Array(cols)
    );
    let smoothLevel = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(320, Math.round(rect.width));
      height = Math.max(200, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = reduced ? 1.4 : time * 0.0011;
      const isPlaying = playingRef.current;

      // Shift spectrum history back by one row (front row = live spectrum, back rows = recent seconds)
      for (let r = rows - 1; r > 0; r--) {
        history[r].set(history[r - 1]);
      }

      const analyser = analyserRef.current;
      const freq = freqRef.current;
      let targetLevel = 0;

      if (isPlaying && analyser && freq) {
        analyser.getByteFrequencyData(freq);
        const usable = Math.min(freq.length, 72);
        let sum = 0;
        for (let c = 0; c < cols; c++) {
          // Symmetric spectrum centered across the wave
          const norm = Math.abs((c / (cols - 1)) * 2 - 1);
          const bin = Math.min(usable - 1, Math.floor(Math.pow(norm, 1.35) * usable));
          const v = freq[bin] / 255;
          history[0][c] = history[0][c] * 0.35 + v * 0.65;
          sum += v;
        }
        targetLevel = Math.min(1, (sum / cols) * 2.1);
      } else {
        for (let c = 0; c < cols; c++) {
          history[0][c] *= 0.88;
        }
      }

      smoothLevel += (targetLevel - smoothLevel) * 0.12;

      const fov = width * 0.72;
      const centerX = width * 0.5;
      const centerY = height * 0.62;
      const spanX = width * 1.92;
      const spanZ = 520;

      for (let r = rows - 1; r >= 0; r--) {
        const nz = 1 - r / (rows - 1); // 1 = front row (now), 0 = far back (history)
        const z = 110 + (1 - nz) * spanZ;
        const scale = fov / (fov + z);
        const rowSpec = history[r];

        for (let c = 0; c < cols; c++) {
          const nx = c / (cols - 1) - 0.5;
          const x3d = nx * spanX;
          const edgeMask = Math.cos(nx * Math.PI * 0.86);
          if (edgeMask <= 0.02) continue;

          // Gentle idle breath when paused + real FFT terrain when 505 is playing
          const idleWave =
            Math.sin(nx * 7.2 + t * 0.9 + nz * 2.2) * 32 +
            Math.cos(nz * 5.0 - t * 0.7 + nx * 3.0) * 22;
          const specEnergy = rowSpec[c] * 145;
          const yWave = idleWave * (1 - smoothLevel * 0.55) + specEnergy;

          const y3d =
            -yWave * edgeMask +
            (nz - 0.5) * 62 +
            pointerY * 22 * (nz - 0.5);

          const px = centerX + (x3d + pointerX * 38) * scale;
          const py = centerY + y3d * scale;
          if (px < -4 || px > width + 4 || py < -4 || py > height + 4) continue;

          const crest = Math.max(0, Math.min(1, (yWave + 48) / 165));
          const depthFade = 0.22 + nz * 0.78;
          const alpha = Math.min(0.96, depthFade * edgeMask * (0.36 + crest * 0.75));
          const dotSize = Math.max(1.2, (1.15 + crest * 1.65) * scale * 1.65);

          ctx.fillStyle =
            crest > 0.68
              ? `rgba(191, 239, 242, ${alpha})`
              : `rgba(56, 177, 186, ${alpha})`;
          ctx.fillRect(px, py, dotSize, dotSize);
        }
      }

      if (!reduced) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      pointerY = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    };

    resize();
    rafId = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const ensureAudioEngine = (initialUrl: string) => {
    if (!audioRef.current) {
      const audio = new Audio(initialUrl);
      audio.crossOrigin = "anonymous";
      audio.loop = false;
      audio.preload = "auto";
      audio.addEventListener("error", () => {
        setPlaying(false);
        setStatusText("Preview unavailable");
      });
      audio.addEventListener("ended", () => {
        const nextIdx = (trackIdxRef.current + 1) % PLAYLIST.length;
        const nextTrack = PLAYLIST[nextIdx];
        trackIdxRef.current = nextIdx;
        setTrackIdx(nextIdx);
        audio.src = nextTrack.previewUrl;
        audio.load();
        audio
          .play()
          .then(() => {
            setPlaying(true);
            setStatusText(
              `Playing · ${nextTrack.artist} — ${nextTrack.title} (30s preview)`
            );
          })
          .catch(() => {
            setPlaying(false);
          });
      });
      audioRef.current = audio;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        const ac = new AudioCtx();
        const analyser = ac.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.78;
        const src = ac.createMediaElementSource(audio);
        src.connect(analyser);
        analyser.connect(ac.destination);
        audioCtxRef.current = ac;
        analyserRef.current = analyser;
        freqRef.current = new Uint8Array(analyser.frequencyBinCount);
      }
    }
    return audioRef.current;
  };

  const playTrackAtIndex = async (idx: number) => {
    const nextIdx = (idx + PLAYLIST.length) % PLAYLIST.length;
    const target = PLAYLIST[nextIdx];
    trackIdxRef.current = nextIdx;
    setTrackIdx(nextIdx);

    try {
      const audio = ensureAudioEngine(target.previewUrl);
      const ac = audioCtxRef.current;

      if (audio.src !== target.previewUrl) {
        audio.pause();
        audio.src = target.previewUrl;
        audio.load();
      }

      if (ac && ac.state === "suspended") {
        await ac.resume();
      }
      await audio.play();
      setPlaying(true);
      setStatusText(`Playing · ${target.artist} — ${target.title} (30s preview)`);
    } catch {
      setPlaying(false);
      setStatusText(`${target.artist} — ${target.title}`);
    }
  };

  const togglePlay = async () => {
    try {
      const audio = ensureAudioEngine(activeTrack.previewUrl);
      const ac = audioCtxRef.current;

      if (playing) {
        audio.pause();
        setPlaying(false);
        setStatusText(`Paused · ${activeTrack.artist} — ${activeTrack.title}`);
      } else {
        if (audio.src !== activeTrack.previewUrl) {
          audio.src = activeTrack.previewUrl;
          audio.load();
        }
        if (ac && ac.state === "suspended") {
          await ac.resume();
        }
        await audio.play();
        setPlaying(true);
        setStatusText(
          `Playing · ${activeTrack.artist} — ${activeTrack.title} (30s preview)`
        );
      }
    } catch {
      setPlaying(false);
      setStatusText("Click Listen to start audio");
    }
  };

  const handleTrackClick = (idx: number) => {
    if (idx === trackIdx) {
      void togglePlay();
    } else {
      void playTrackAtIndex(idx);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <div className={styles.wrap}>
      {/* Playlist + Live Spectrum Particle Field (mirrors lovelyfriendly.com) */}
      <section className={styles.waveSection} aria-label="Playlist and Audio Visualizer">
        <div className={styles.waveInner}>
          <div className={styles.waveLeft}>
            <h2 className={`display ${styles.waveHeading}`} data-rv="chars">
              <SplitChars text="WHAT I" />
              <br />
              <SplitChars text="LISTEN TO" startIndex={6} />
            </h2>
            <p className={styles.waveDesc} data-rv="rise">
              {activeTrack.artist} — {activeTrack.title}
            </p>
            <p className={styles.trackStatus} aria-live="polite">
              {statusText}
            </p>
            <div className={styles.controlRow} data-rv="rise">
              <button
                type="button"
                className={`u-link ${styles.waveLink} ${
                  playing ? styles.waveLinkActive : ""
                }`}
                aria-pressed={playing}
                onClick={togglePlay}
              >
                {playing ? "Pause" : "Listen \u2192"}
              </button>
              <button
                type="button"
                className={`u-link ${styles.navBtn}`}
                onClick={() => void playTrackAtIndex(trackIdx - 1)}
                aria-label="Previous track"
              >
                &larr; Prev
              </button>
              <button
                type="button"
                className={`u-link ${styles.navBtn}`}
                onClick={() => void playTrackAtIndex(trackIdx + 1)}
                aria-label="Next track"
              >
                Next &rarr;
              </button>
            </div>
          </div>

          <div className={styles.waveActions} data-rv="rise">
            <ul className={styles.trackList} aria-label="Playlist tracks">
              {PLAYLIST.map((track, idx) => {
                const isActive = idx === trackIdx;
                const isTrackPlaying = isActive && playing;
                return (
                  <li key={track.id} className={styles.trackItem}>
                    <button
                      type="button"
                      className={`${styles.trackBtn} ${
                        isActive ? styles.trackBtnActive : ""
                      }`}
                      onClick={() => handleTrackClick(idx)}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span className={styles.trackNum}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.trackTitle}>{track.title}</span>
                      <span className={styles.trackArtist}>{track.artist}</span>
                      <span className={styles.trackState}>
                        {isTrackPlaying ? "PLAYING" : isActive ? "SELECTED" : "PLAY"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className={styles.canvasShell}>
          <canvas
            ref={canvasRef}
            className={styles.waveCanvas}
            aria-label={`Live audio spectrum particle wave for ${activeTrack.artist} ${activeTrack.title}`}
          />
        </div>
      </section>

      {/* Iconic GET IN TOUCH Poster Footer */}
      <footer className={styles.footer} id="contact">
        <div className={styles.footerInner}>
          <div className={styles.dividerRow}>
            <span className={styles.touchLabel}>GET IN TOUCH</span>
            <span className={styles.hairline} data-rv="line" aria-hidden="true" />
          </div>

          <div className={styles.footerSplit}>
            {/* Left Giant Condensed Links */}
            <div className={styles.bigLinks} data-rv="list">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`display ${styles.bigLink}`}
              >
                GITHUB
              </a>
              <a
                href={PROFILE.cvPath}
                target="_blank"
                rel="noopener noreferrer"
                className={`display ${styles.bigLink}`}
              >
                RESUME
              </a>
              <a
                href={`mailto:${PROFILE.email}`}
                className={`display ${styles.bigLink}`}
              >
                EMAIL
              </a>
            </div>

            {/* Right Quick Index + Copyable Email */}
            <div className={styles.rightCol}>
              <ul className={styles.smallLinks} data-rv="list">
                {PROJECTS.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/projects/${project.id}`}
                      className={`u-link ${styles.smallLink}`}
                    >
                      {project.short}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className={styles.emailBlock}>
                <button
                  type="button"
                  className={`u-link ${styles.emailBtn}`}
                  onClick={handleCopyEmail}
                  aria-label={`Copy ${PROFILE.email}`}
                >
                  {copied ? `Copied — ${PROFILE.email}` : PROFILE.email}
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
