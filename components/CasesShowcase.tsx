"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { PROJECTS, ProjectCategory, ProjectItem } from "@/data/portfolio";
import ParticleGlyphCanvas from "./ParticleGlyphCanvas";
import SplitChars from "./SplitChars";
import styles from "./CasesShowcase.module.css";

type FilterValue = "all" | ProjectCategory;

const FILTERS: { id: FilterValue; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "automation", label: "AUTOMATION" },
  { id: "vr", label: "UNITY VR" },
  { id: "web", label: "WEB" },
];

interface MarqueeSlide {
  key: string;
  project: ProjectItem;
  img?: string;
  sceneIdx: number;
  label: string;
}

const MARQUEE_BASE: MarqueeSlide[] = [
  {
    key: "clp",
    project: PROJECTS[0],
    img: "/projects/decathlon-logo.svg",
    sceneIdx: 0,
    label: "CLP Shipment Flow — Decathlon HK",
  },
  {
    key: "h1",
    project: PROJECTS[2],
    img: "/projects/horror/horror1.jpg",
    sceneIdx: 0,
    label: "Varlive VR Horror — Scene 1",
  },
  {
    key: "m1",
    project: PROJECTS[3],
    img: "/projects/market/market1.jpg",
    sceneIdx: 0,
    label: "Central Market 1841 — Hall",
  },
  {
    key: "log",
    project: PROJECTS[1],
    img: "/projects/decathlon-logo.svg",
    sceneIdx: 0,
    label: "Store Logbook Compliance — Decathlon HK",
  },
  {
    key: "h2",
    project: PROJECTS[2],
    img: "/projects/horror/horror2.jpg",
    sceneIdx: 1,
    label: "Varlive VR Horror — Scene 2",
  },
  {
    key: "m2",
    project: PROJECTS[3],
    img: "/projects/market/market2.jpg",
    sceneIdx: 1,
    label: "Central Market 1841 — Gallery",
  },
  {
    key: "pwa",
    project: PROJECTS[5],
    img: "/projects/image_converter_icon.png",
    sceneIdx: 0,
    label: "Secure Offline Image Converter",
  },
  {
    key: "h3",
    project: PROJECTS[2],
    img: "/projects/horror/horror3.jpg",
    sceneIdx: 2,
    label: "Varlive VR Horror — Scene 3",
  },
  {
    key: "m3",
    project: PROJECTS[3],
    img: "/projects/market/market3.jpg",
    sceneIdx: 2,
    label: "Central Market 1841 — Archive",
  },
  { key: "edu", project: PROJECTS[4], sceneIdx: 0, label: "VR Learning Modules" },
  {
    key: "h4",
    project: PROJECTS[2],
    img: "/projects/horror/horror4.jpg",
    sceneIdx: 3,
    label: "Varlive VR Horror — Scene 4",
  },
  {
    key: "m4",
    project: PROJECTS[3],
    img: "/projects/market/market4.jpg",
    sceneIdx: 3,
    label: "Central Market 1841 — Map Room",
  },
  {
    key: "h5",
    project: PROJECTS[2],
    img: "/projects/horror/horror5.jpg",
    sceneIdx: 4,
    label: "Varlive VR Horror — Scene 5",
  },
];

export default function CasesShowcase() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [activeId, setActiveId] = useState<string>(PROJECTS[0].id);
  const [sceneIdx, setSceneIdx] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [lightbox, setLightbox] = useState<{
    project: ProjectItem;
    index: number;
  } | null>(null);

  const visibleProjects =
    filter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === filter);

  const activeIdx = visibleProjects.findIndex((p) => p.id === activeId);
  const safeIdx = activeIdx >= 0 ? activeIdx : 0;
  const activeProject = visibleProjects[safeIdx] || PROJECTS[0];

  const selectProject = useCallback(
    (projectId: string, initialScene = 0) => {
      if (projectId === activeId && initialScene === sceneIdx) return;
      const targetIdx = visibleProjects.findIndex((p) => p.id === projectId);
      setDirection(targetIdx >= safeIdx ? 1 : -1);
      setActiveId(projectId);
      setSceneIdx(initialScene);
    },
    [activeId, safeIdx, sceneIdx, visibleProjects]
  );

  const handleFilter = (next: FilterValue) => {
    setFilter(next);
    setSceneIdx(0);
    setDirection(1);
    const list =
      next === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === next);
    if (list.length > 0 && !list.some((p) => p.id === activeId)) {
      setActiveId(list[0].id);
    }
  };

  const stepProject = (dir: 1 | -1) => {
    if (visibleProjects.length <= 1) return;
    setDirection(dir);
    const nextIdx =
      (safeIdx + dir + visibleProjects.length) % visibleProjects.length;
    setActiveId(visibleProjects[nextIdx].id);
    setSceneIdx(0);
  };

  useEffect(() => {
    const onSelectCase = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (!custom.detail) return;
      const match = PROJECTS.find((p) => p.id === custom.detail);
      if (match) {
        setFilter("all");
        setDirection(1);
        setActiveId(match.id);
        setSceneIdx(0);
      }
    };

    window.addEventListener("select-case", onSelectCase);
    return () => window.removeEventListener("select-case", onSelectCase);
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const stepLightbox = useCallback((dir: 1 | -1) => {
    setLightbox((prev) => {
      if (!prev) return null;
      const len = prev.project.images.length;
      return { ...prev, index: (prev.index + dir + len) % len };
    });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") stepLightbox(1);
      if (e.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, stepLightbox]);

  const currentImages = activeProject.images;
  const safeScene = currentImages.length > 0 ? sceneIdx % currentImages.length : 0;

  return (
    <MotionConfig reducedMotion="user">
      <section className={styles.section} id="cases" aria-label="Selected Cases">
        {/* Header Bar */}
        <div className={styles.headerInner}>
          <div className={styles.titlePair}>
            <h2 className={`display ${styles.heading}`} data-rv="chars">
              <SplitChars text="CASES" />
            </h2>
          </div>

          <div
            className={styles.pills}
            role="tablist"
            aria-label="Filter projects"
          >
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`${styles.filterPill} ${
                    active ? styles.filterPillActive : ""
                  }`}
                  onClick={() => handleFilter(f.id)}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Morphing Spotlight Stage */}
        <div className={styles.stageInner}>
          <div className={styles.stageGrid}>
            {/* Left Visual Frame (Real Photos OR Live Morphing Particle Glyph) */}
            <div className={styles.visualFrame}>
              {currentImages.length > 0 ? (
                <div className={styles.photoStage}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentImages[safeScene]}
                      initial={{ opacity: 0.25, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.25, scale: 0.98 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className={styles.photoFill}
                    >
                      <Image
                        src={currentImages[safeScene]}
                        alt={`${activeProject.title} — frame ${safeScene + 1}`}
                        fill
                        sizes="(max-width: 960px) 100vw, 54vw"
                        className={
                          activeProject.id === "image-converter"
                            ? styles.imgContain
                            : styles.imgCover
                        }
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className={styles.frameControls}>
                    <span className={styles.frameCounter}>
                      {currentImages.length > 1
                        ? `${safeScene + 1} / ${currentImages.length}`
                        : activeProject.category === "automation"
                        ? "DECATHLON"
                        : "PWA"}
                    </span>
                    <div className={styles.frameBtns}>
                      {currentImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            className={styles.ctrlBtn}
                            onClick={() =>
                              setSceneIdx(
                                (p) =>
                                  (p - 1 + currentImages.length) %
                                  currentImages.length
                              )
                            }
                            aria-label="Previous image"
                          >
                            Prev
                          </button>
                          <button
                            type="button"
                            className={styles.ctrlBtn}
                            onClick={() =>
                              setSceneIdx((p) => (p + 1) % currentImages.length)
                            }
                            aria-label="Next image"
                          >
                            Next
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        className={styles.ctrlBtn}
                        onClick={() =>
                          setLightbox({
                            project: activeProject,
                            index: safeScene,
                          })
                        }
                      >
                        Zoom
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.glyphStage}>
                  <ParticleGlyphCanvas
                    glyph={activeProject.glyph}
                    label={activeProject.title}
                  />
                  <span className={styles.glyphCaption}>
                    {activeProject.categoryLabel} · {activeProject.year}
                  </span>
                </div>
              )}

              {/* 2px teal bottom bar (lovelyfriendly.com zoom indicator) */}
              <div className={styles.tealBar}>
                <span
                  className={styles.tealFill}
                  style={{
                    width: `${((safeIdx + 1) / Math.max(1, visibleProjects.length)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Right Minimal Metadata + Direct Project Switcher */}
            <div className={styles.infoCol}>
              <div className={styles.copySlot}>
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, y: direction >= 0 ? 14 : -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: direction >= 0 ? -12 : 12 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.copyBlock}
                  >
                    <p className={styles.meta}>
                      {activeProject.categoryLabel} · {activeProject.year}
                    </p>
                    <h3 className={`display ${styles.projectTitle}`}>
                      <Link
                        href={`/projects/${activeProject.id}`}
                        className={styles.projectTitleLink}
                      >
                        {activeProject.title}
                      </Link>
                    </h3>
                    <p className={styles.tagline}>{activeProject.tagline}</p>
                    <p className={styles.tags}>
                      {activeProject.tags.join(" · ")}
                    </p>

                    <div className={styles.actions}>
                      <Link
                        href={`/projects/${activeProject.id}`}
                        className={`u-link ${styles.actionLink}`}
                      >
                        Project details &rarr;
                      </Link>
                      {visibleProjects.length > 1 && (
                        <button
                          type="button"
                          className={`u-link ${styles.actionLink}`}
                          onClick={() => stepProject(1)}
                        >
                          Next case &rarr;
                        </button>
                      )}
                      {currentImages.length > 0 && (
                        <button
                          type="button"
                          className={`u-link ${styles.actionLink}`}
                          onClick={() =>
                            setLightbox({
                              project: activeProject,
                              index: safeScene,
                            })
                          }
                        >
                          Fullscreen &rarr;
                        </button>
                      )}
                      {activeProject.demoUrl && (
                        <a
                          href={activeProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`u-link ${styles.actionLink}`}
                        >
                          Launch PWA &rarr;
                        </a>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Compact Index List — Hover to preview in stage, click project name to open detail page */}
              <ul className={styles.indexList} aria-label="Open project details">
                {visibleProjects.map((project, i) => {
                  const isActive = project.id === activeProject.id;
                  return (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.id}`}
                        aria-current={isActive ? "true" : undefined}
                        className={`${styles.indexBtn} ${
                          isActive ? styles.indexBtnActive : ""
                        }`}
                        onMouseEnter={() => selectProject(project.id, 0)}
                        onFocus={() => selectProject(project.id, 0)}
                      >
                        <span className={styles.indexNum}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.indexName}>
                          {project.short}
                        </span>
                        <span className={styles.indexYear}>{project.year}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Full-Bleed Continuous Horizontal Marquee Strip (.feed) */}
        <div
          className={styles.feedViewport}
          aria-label="Project gallery marquee"
        >
          <div className={styles.feedTrack}>
            {[...MARQUEE_BASE, ...MARQUEE_BASE].map((slide, i) => (
              <button
                key={`${slide.key}-${i}`}
                type="button"
                className={styles.feedCard}
                onClick={() => {
                  setFilter("all");
                  selectProject(slide.project.id, slide.sceneIdx);
                  if (slide.img) {
                    setLightbox({
                      project: slide.project,
                      index: slide.sceneIdx,
                    });
                  } else {
                    const el = document.getElementById("cases");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                aria-label={slide.label}
              >
                {slide.img ? (
                  <Image
                    src={slide.img}
                    alt={slide.label}
                    fill
                    sizes="280px"
                    className={
                      slide.project.id === "image-converter"
                        ? styles.feedImgContain
                        : styles.feedImgCover
                    }
                  />
                ) : (
                  <div className={styles.feedGlyphCard}>
                    <span className={`display ${styles.feedGlyphText}`}>
                      {slide.project.glyph}
                    </span>
                    <span className={styles.feedGlyphSub}>
                      {slide.project.short}
                    </span>
                  </div>
                )}
                <span className={styles.feedHoverBar} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        {/* Fullscreen Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.modalBackdrop}
              role="dialog"
              aria-modal="true"
              aria-label={lightbox.project.title}
              onClick={closeLightbox}
            >
              <div
                className={styles.modalBox}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalHead}>
                  <div>
                    <h3 className={`display ${styles.modalTitle}`}>
                      {lightbox.project.title}
                    </h3>
                    <p className={styles.modalCount}>
                      {lightbox.index + 1} / {lightbox.project.images.length}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.modalPill}
                    onClick={closeLightbox}
                  >
                    CLOSE
                  </button>
                </div>

                <div className={styles.modalStage}>
                  <Image
                    src={lightbox.project.images[lightbox.index]}
                    alt={`${lightbox.project.title} frame ${lightbox.index + 1}`}
                    fill
                    sizes="92vw"
                    className={styles.modalImg}
                  />
                </div>

                {lightbox.project.images.length > 1 && (
                  <div className={styles.modalNav}>
                    <button
                      type="button"
                      className={styles.modalPill}
                      onClick={() => stepLightbox(-1)}
                    >
                      &larr; PREV
                    </button>
                    <button
                      type="button"
                      className={styles.modalPill}
                      onClick={() => stepLightbox(1)}
                    >
                      NEXT &rarr;
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}
