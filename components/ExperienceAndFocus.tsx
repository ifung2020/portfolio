"use client";

import { EDUCATION, EXPERIENCES, FOCUS, LANGUAGES, TOOLKIT } from "@/data/portfolio";
import SplitChars from "./SplitChars";
import styles from "./ExperienceAndFocus.module.css";

interface BrandLogoTile {
  id: string;
  name: string;
  category: string;
  renderMark: () => React.ReactNode;
}

const TOOLKIT_LOGOS: BrandLogoTile[] = [
  {
    id: "unity",
    name: "Unity",
    category: "VR / 3D Engine",
    renderMark: () => (
      <svg viewBox="0 0 128 128" width="44" height="44" aria-hidden="true">
        {/* Official Unity 3-shaded isometric cube mark */}
        <path
          fill="#7C8B95"
          d="m63.991 128 51.702-29.855-19.817-11.461-20.26 11.704a1.151 1.151 0 0 1-1.125-.009 1.145 1.145 0 0 1-.568-.975V69.608c0-.819.424-1.56 1.133-1.968L99.13 53.737a1.119 1.119 0 0 1 1.124.009c.352.195.572.564.576.966V78.11l19.83 11.454V29.855L63.99 62.566Z"
        />
        <path
          fill="#B4C2CA"
          d="m52.397 98.401-20.27-11.718-19.832 11.46L63.991 128V62.566L7.34 29.854V89.56l19.825-11.45V54.714c.009-.401.225-.77.572-.966a1.13 1.13 0 0 1 1.13-.009L52.953 67.64a2.275 2.275 0 0 1 1.133 1.97v27.8a1.156 1.156 0 0 1-.565.98 1.131 1.131 0 0 1-1.124.012Z"
        />
        <path
          fill="#FFFFFF"
          d="M68.959 0v22.9L89.22 34.597c.348.203.555.576.555.984 0 .403-.212.772-.555.975L65.137 50.468a2.302 2.302 0 0 1-2.27 0L38.791 36.556a1.122 1.122 0 0 1-.56-.975 1.127 1.127 0 0 1 .56-.984L59.048 22.9V0L7.339 29.855l56.652 32.711 56.665-32.71Z"
        />
      </svg>
    ),
  },
  {
    id: "apps-script",
    name: "Apps Script",
    category: "Google Workspace",
    renderMark: () => (
      <svg viewBox="0 0 192 192" width="44" height="44" aria-hidden="true">
        {/* Official Google Apps Script product logo (gstatic productlogos v10) */}
        <path
          d="M30.51,123.53c-11.05,0-20.01,8.95-20.01,19.98s8.96,19.98,20.01,19.98h100.06v-39.97H30.51z"
          fill="#EA4335"
        />
        <ellipse cx="30.51" cy="143.52" fill="#FFFFFF" rx="10.01" ry="9.99" />
        <path
          d="M61.38,68.62c-8.94-6.49-21.46-4.51-27.95,4.42c-6.5,8.93-4.51,21.43,4.43,27.91l80.95,58.73l23.53-32.33L61.38,68.62z"
          fill="#FBBC04"
        />
        <ellipse cx="49.62" cy="84.79" fill="#FFFFFF" rx="10.01" ry="9.99" />
        <path
          d="M118.68,42.31c-3.42-10.5-14.7-16.24-25.22-12.83C82.95,32.89,77.2,44.17,80.61,54.66l30.92,95.02l38.06-12.35L118.68,42.31z"
          fill="#34A853"
        />
        <ellipse cx="99.64" cy="48.49" fill="#FFFFFF" rx="10.01" ry="9.99" />
        <path
          d="M167.67,29.48c-10.51-3.41-21.8,2.33-25.22,12.83l-30.92,95.02c-3.42,10.5,2.34,21.77,12.85,25.18c10.51,3.41,21.8-2.33,25.22-12.83l30.92-95.02C183.93,44.17,178.18,32.89,167.67,29.48z"
          fill="#4285F4"
        />
        <ellipse cx="161.48" cy="48.49" fill="#FFFFFF" rx="10.01" ry="9.99" />
        <ellipse cx="130.56" cy="143.51" fill="#FFFFFF" rx="10.01" ry="9.99" />
      </svg>
    ),
  },
  {
    id: "csharp",
    name: "C#",
    category: "Gameplay & Logic",
    renderMark: () => (
      <svg viewBox="0 0 128 128" width="44" height="44" aria-hidden="true">
        {/* Official C# hexagon emblem (Devicon) */}
        <path
          fill="#9B4F96"
          d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"
        />
        <path
          fill="#68217A"
          d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"
        />
        <path
          fill="#FFFFFF"
          d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM97 66.2l.9-4.3h-4.2v-4.7h5.1L100 51h4.9l-1.2 6.1h3.8l1.2-6.1h4.8l-1.2 6.1h2.4v4.7h-3.3l-.9 4.3h4.2v4.7h-5.1l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6h-2.4v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8l-.9 4.3z"
        />
      </svg>
    ),
  },
  {
    id: "react",
    name: "React",
    category: "Frontend UI",
    renderMark: () => (
      <svg viewBox="0 0 24 24" width="44" height="44" fill="#61DAFB" aria-hidden="true">
        {/* Official React atom mark */}
        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
      </svg>
    ),
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Web Framework",
    renderMark: () => (
      <svg viewBox="0 0 128 128" width="44" height="44" aria-hidden="true">
        {/* Official Next.js circular mark with gradient diagonal N */}
        <circle cx="64" cy="64" r="60" fill="#000000" stroke="#FFFFFF" strokeWidth="4" />
        <path
          fill="url(#nextjs-grad-a)"
          d="M106.317 112.014 49.167 38.4H38.4v51.179h8.614v-40.24l52.54 67.884a64.216 64.216 0 0 0 6.763-5.209z"
        />
        <path fill="url(#nextjs-grad-b)" d="M81.778 38.4h8.533v51.2h-8.533z" />
        <defs>
          <linearGradient
            id="nextjs-grad-a"
            x1="109"
            x2="144.5"
            y1="116.5"
            y2="160.5"
            gradientTransform="scale(.71111)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="nextjs-grad-b"
            x1="121"
            x2="120.799"
            y1="54"
            y2="106.875"
            gradientTransform="scale(.71111)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Type-Safe Code",
    renderMark: () => (
      <svg viewBox="0 0 128 128" width="44" height="44" aria-hidden="true">
        {/* Official TypeScript emblem (Devicon) */}
        <rect x="2" y="2" width="124" height="124" rx="14" fill="#3178C6" />
        <path
          fill="#FFFFFF"
          d="M102.23 58.91a15.56 15.56 0 0 1 7.82 4.5 20.58 20.58 0 0 1 3 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 0 0-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 0 0 .54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 0 1-9.52-.1 23 23 0 0 1-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 0 1 1.15-.73L82 101l3.59-2.08.75 1.11a16.78 16.78 0 0 0 4.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 0 0 .69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 0 1-3.43-6.25 25 25 0 0 1-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 0 1 9.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.27H28.88v-5a49.19 49.19 0 0 1 .12-5.17C29.08 59 39 59 51 59h21.89z"
        />
      </svg>
    ),
  },
];

export default function ExperienceAndFocus() {
  const openCase = (projectId?: string) => {
    if (!projectId) return;
    window.dispatchEvent(new CustomEvent("select-case", { detail: projectId }));
    const el = document.getElementById("cases");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.wrapper} aria-label="Experience, Focus, and Toolkit">
      <div className={styles.inner}>
        {/* Row 1: EXPERIENCE (left) + EDUCATION (right) */}
        <div className={styles.expRow} id="experience">
          <div className={styles.expCol}>
            <h2 className={`display ${styles.secHeading}`} data-rv="chars">
              <SplitChars text="EXPERIENCE" />
            </h2>

            <ul className={styles.expList} data-rv="list">
              {EXPERIENCES.map((exp) => (
                <li key={exp.id} className={styles.expItem}>
                  {exp.relatedProjectId ? (
                    <button
                      type="button"
                      className={styles.expBtn}
                      onClick={() => openCase(exp.relatedProjectId)}
                    >
                      <span className={styles.expTop}>
                        <span className={styles.expCompany}>{exp.company}</span>
                        <span className={styles.expMeta}>
                          {exp.role} · {exp.period}
                        </span>
                      </span>
                      <span className={styles.expLine}>{exp.line}</span>
                    </button>
                  ) : (
                    <div className={styles.expStatic}>
                      <span className={styles.expTop}>
                        <span className={styles.expCompany}>{exp.company}</span>
                        <span className={styles.expMeta}>
                          {exp.role} · {exp.period}
                        </span>
                      </span>
                      <span className={styles.expLine}>{exp.line}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.badgeEduCol}>
            <div className={styles.eduBlock} data-rv="rise">
              <h2 className={`display ${styles.secHeadingSmall}`} data-rv="chars">
                <SplitChars text="EDUCATION" />
              </h2>
              <p className={styles.eduSchool}>{EDUCATION.school}</p>
              <p className={styles.eduMeta}>
                {EDUCATION.degree}
                <br />
                Expected {EDUCATION.graduation}
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Toolkit Brand Logos Grid + TOOLKIT */}
        <div className={styles.collageRow}>
          <div className={styles.logoGrid} aria-label="Toolkit brand logos">
            {TOOLKIT_LOGOS.map((item) => (
              <div key={item.id} className={styles.logoTile} data-rv="rise">
                <span className={styles.logoMark}>{item.renderMark()}</span>
                <span className={styles.logoName}>{item.name}</span>
                <span className={styles.logoCat}>{item.category}</span>
              </div>
            ))}
          </div>

          <div className={styles.toolkitCol}>
            <h2 className={`display ${styles.secHeading}`} data-rv="chars">
              <SplitChars text="TOOLKIT" />
            </h2>
            <div className={styles.toolkitCols} data-rv="list">
              {TOOLKIT.map((col, idx) => (
                <ul key={idx} className={styles.plainList}>
                  {col.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              ))}
            </div>
            <p className={styles.languages} data-rv="rise">
              {LANGUAGES}
            </p>
          </div>
        </div>

        {/* Row 3: FOCUSED ON + BUILT FOR REAL OPERATIONS */}
        <div className={styles.focusRow}>
          <div className={styles.focusLeft}>
            <h2 className={`display ${styles.secHeading}`} data-rv="chars">
              <SplitChars text="FOCUSED ON" />
            </h2>
            <ul className={styles.plainList} data-rv="list">
              {FOCUS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.focusRight}>
            <h2 className={`display ${styles.secHeading}`} data-rv="chars">
              <SplitChars text="BUILT FOR" />
              <br />
              <SplitChars text="REAL OPERATIONS" startIndex={9} />
            </h2>
            <p className={styles.narrative} data-rv="rise">
              At Decathlon HK I turned daily manual warehouse spreadsheets and multi-zone safety logbooks into automated Google Workspace pipelines. Before that, across Varlive and Sandbox VR, I shipped commercial Unity VR titles and kept high-traffic venue hardware running at 100% uptime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
