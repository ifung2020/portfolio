import { PROFILE } from "@/data/portfolio";
import FullBodyHologram from "./FullBodyHologram";
import SplitChars from "./SplitChars";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero} id="top" aria-label="Introduction">
      {/* Edge-to-edge condensed teal wordmark */}
      <div className={styles.wordmarkWrap}>
        <h1 className={`display ${styles.wordmark}`} data-rv="chars">
          <SplitChars text="STEVEN LAI" />
        </h1>
      </div>

      {/* Central interactive 3D full-body streetwear particle hologram */}
      <div className={styles.stage}>
        {/* Full-body 3D figure slot anchoring the hologram */}
        <div
          className={styles.figureSlot}
          data-figure-slot
          role="img"
          aria-label="Steven Lai — interactive 3D full-body particle hologram"
        />

        {/* WebGL2 Fixed Viewport Renderer */}
        <FullBodyHologram slotSelector="[data-figure-slot]" />

        {/* 3-Axis Swiss Poster Grid Overlay */}
        <div className={styles.posterGrid}>
          {/* Right Axis Greeting */}
          <div className={styles.greeting} data-rv="rise">
            <p className={styles.greetingText}>
              HELLO
              <br />
              I&apos;M STEVEN
              <br />
              LAI
            </p>
          </div>

          {/* Left Axis Roles */}
          <ul className={styles.roles} data-rv="list" aria-label="Roles">
            {PROFILE.roles.map((role) => (
              <li key={role} className={styles.roleItem}>
                {role}
              </li>
            ))}
          </ul>

          {/* Center-Right Editorial Lead */}
          <div className={styles.bioLead} data-rv="rise">
            <p className={styles.leadCopy}>{PROFILE.lead}</p>
            <div className={styles.leadLinks}>
              <a href="#cases" className={`u-link ${styles.leadLink}`}>
                Explore cases &rarr;
              </a>
              <a
                href={PROFILE.cvPath}
                target="_blank"
                rel="noopener noreferrer"
                className={`u-link ${styles.leadLink}`}
              >
                Download CV &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
