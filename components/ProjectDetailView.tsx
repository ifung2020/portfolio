"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProjectItem } from "@/data/portfolio";
import ParticleGlyphCanvas from "./ParticleGlyphCanvas";
import styles from "./ProjectDetailView.module.css";

interface ProjectDetailViewProps {
  project: ProjectItem;
  index: number;
  total: number;
  prevProject: ProjectItem;
  nextProject: ProjectItem;
}

export default function ProjectDetailView({
  project,
  index,
  total,
  prevProject,
  nextProject,
}: ProjectDetailViewProps) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const images = project.images;
  const safeScene = images.length > 0 ? sceneIdx % images.length : 0;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        {/* Top Navigation Bar */}
        <nav className={styles.topBar} aria-label="Case study navigation">
          <Link href="/#cases" className={`u-link ${styles.backLink}`}>
            &larr; Back to Cases
          </Link>
          <span className={styles.caseBadge}>
            CASE {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} &middot;{" "}
            {project.categoryLabel} &middot; {project.year}
          </span>
        </nav>

        {/* Hero Title & Metadata */}
        <header className={styles.heroHeader}>
          <div>
            <p className={styles.eyebrow}>
              {project.categoryLabel} &middot; {project.year}
            </p>
            <h1 className={`display ${styles.title}`}>{project.title}</h1>
          </div>

          <div className={styles.heroSide}>
            <p className={styles.tagline}>{project.tagline}</p>
            <p className={styles.roleLine}>{project.role}</p>
            <div className={styles.tagRow}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tagPill}>
                  {tag}
                </span>
              ))}
            </div>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.extBtn}
              >
                Launch Live Web App &rarr;
              </a>
            )}
          </div>
        </header>

        {/* 3-Column Metrics Strip */}
        <section className={styles.metricsGrid} aria-label="Project specifications">
          {project.metrics.map((m) => (
            <div key={m.label} className={styles.metricCard}>
              <span className={styles.metricLabel}>{m.label}</span>
              <span className={styles.metricValue}>{m.value}</span>
            </div>
          ))}
        </section>

        {/* Visual Showcase Stage */}
        <section className={styles.visualSection} aria-label="Project visual showcase">
          <div className={styles.visualStage}>
            {images.length > 0 ? (
              <>
                <Image
                  src={images[safeScene]}
                  alt={`${project.title} — scene ${safeScene + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1440px) 95vw, 1360px"
                  className={
                    project.id === "image-converter"
                      ? styles.imgContain
                      : styles.imgCover
                  }
                />
                {images.length > 1 && (
                  <div className={styles.stageControls}>
                    <span className={styles.stageCounter}>
                      SCENE {safeScene + 1} / {images.length}
                    </span>
                    <div className={styles.stageBtns}>
                      <button
                        type="button"
                        className={styles.stageBtn}
                        onClick={() =>
                          setSceneIdx((p) => (p - 1 + images.length) % images.length)
                        }
                      >
                        &larr; Prev
                      </button>
                      <button
                        type="button"
                        className={styles.stageBtn}
                        onClick={() => setSceneIdx((p) => (p + 1) % images.length)}
                      >
                        Next &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <ParticleGlyphCanvas glyph={project.glyph} label={project.title} />
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbStrip} aria-label="Scene thumbnails">
              {images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  className={`${styles.thumbBtn} ${
                    idx === safeScene ? styles.thumbBtnActive : ""
                  }`}
                  onClick={() => setSceneIdx(idx)}
                  aria-label={`Select scene ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${project.title} thumbnail ${idx + 1}`}
                    fill
                    sizes="130px"
                    className={styles.imgCover}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Executive Overview + Challenge / Engineering Solution */}
        <section className={styles.editorialSection} aria-label="Case study overview">
          <div className={styles.overviewBlock}>
            <p className={styles.secLabel}>OVERVIEW</p>
            <p className={styles.overviewText}>{project.overview}</p>
          </div>

          <div className={styles.splitGrid}>
            <div className={styles.splitCol}>
              <p className={styles.secLabel}>01 / THE CHALLENGE</p>
              <h2 className={`display ${styles.splitHeading}`}>
                OPERATIONAL BOTTLENECK
              </h2>
              <p className={styles.splitBody}>{project.challenge}</p>
            </div>

            <div className={styles.splitCol}>
              <p className={styles.secLabel}>02 / THE SOLUTION</p>
              <h2 className={`display ${styles.splitHeading}`}>
                ENGINEERING ARCHITECTURE
              </h2>
              <p className={styles.splitBody}>{project.solution}</p>
            </div>
          </div>
        </section>

        {/* Key Features & Deliverables */}
        <section className={styles.featuresSection} aria-label="Key capabilities">
          <p className={styles.secLabel}>03 / KEY DELIVERABLES</p>
          <h2 className={`display ${styles.featuresHeading}`}>
            SYSTEM CAPABILITIES
          </h2>

          <div className={styles.featuresGrid}>
            {project.features.map((feat, idx) => (
              <div key={feat.title} className={styles.featureCard}>
                <span className={styles.featureNum}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.featureTitle}>{feat.title}</h3>
                <p className={styles.featureDetail}>{feat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Case Switcher */}
        <nav className={styles.bottomNav} aria-label="Next and previous projects">
          <div className={styles.navColPrev}>
            <span className={styles.navSub}>&larr; PREVIOUS CASE</span>
            <Link
              href={`/projects/${prevProject.id}`}
              className={`display ${styles.navBigLink}`}
            >
              {prevProject.short}
            </Link>
          </div>

          <div className={styles.navColCenter}>
            <Link href="/#cases" className={`u-link ${styles.backLink}`}>
              All Cases
            </Link>
          </div>

          <div className={styles.navColNext}>
            <span className={styles.navSub}>NEXT CASE &rarr;</span>
            <Link
              href={`/projects/${nextProject.id}`}
              className={`display ${styles.navBigLink}`}
            >
              {nextProject.short}
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
