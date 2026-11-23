export type ProjectCategory = "automation" | "vr" | "web";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectFeature {
  title: string;
  detail: string;
}

export interface ProjectItem {
  id: string;
  short: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: string;
  tagline: string;
  tags: string[];
  images: string[];
  /** Word the particles spell when the project has no screenshots. */
  glyph: string;
  demoUrl?: string;
  role: string;
  overview: string;
  challenge: string;
  solution: string;
  metrics: ProjectMetric[];
  features: ProjectFeature[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  line: string;
  relatedProjectId?: string;
}

export const PROFILE = {
  name: "Steven Lai",
  email: "www.a98590715@gmail.com",
  github: "https://github.com/ifung2020",
  cvPath: "/Steven_Lai_CV.pdf",
  portrait: "/profile.png",
  location: "Hong Kong",
  roles: [
    "Operations Automation",
    "Unity VR Developer",
    "IT Ops & Support",
    "HSUHK MSIM · 2026",
  ],
  lead: "I automate the repetitive parts of retail operations and build VR worlds that hold up under real crowds.",
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "clp-logistics",
    short: "CLP Shipment Flow",
    title: "Automated Shipment & Logistics Workflow",
    category: "automation",
    categoryLabel: "Decathlon HK",
    year: "2026",
    tagline: "Daily branch deliveries filtered, split by sport, and emailed as PDFs automatically.",
    tags: ["Apps Script", "PDF Export", "Logistics"],
    images: ["/projects/decathlon-logo.svg"],
    glyph: "CLP",
    role: "Automation Engineer · Omni Sports Leader (Decathlon HK — Tuen Mun)",
    overview:
      "An end-to-end Google Apps Script logistics pipeline built for the Decathlon HK Tuen Mun store that ingests corporate warehouse master files, isolates branch deliveries and customs-inspected parcels, exports sport-categorized PDF packing lists, and dispatches scheduled HTML email summaries before morning floor shifts.",
    challenge:
      "Every morning, store leaders had to manually download multi-branch master shipment spreadsheets from central logistics, filter thousands of rows for the Tuen Mun branch, separate customs-inspected boxes, and print individual sport-zone lists by hand — burning valuable opening-shift floor hours and risking missed priority cartons.",
    solution:
      "Adapted and engineered an automated Google Workspace pipeline bound to time-driven triggers and custom in-sheet operator menus. The script parses master CLP shipment feeds, groups cartons by sport department and customs hold status, formats print-ready A4 PDF manifests in Google Drive, and emails structured HTML digests directly to store team leads.",
    metrics: [
      { label: "DEPLOYMENT", value: "Decathlon HK (Tuen Mun)" },
      { label: "PIPELINE", value: "Master Sheet → Sport PDFs → HTML Email" },
      { label: "DAILY IMPACT", value: "Zero Manual Morning Sorting" },
    ],
    features: [
      {
        title: "Branch & Customs Filtering Engine",
        detail:
          "Automatically parses corporate warehouse spreadsheets to isolate Tuen Mun branch deliveries while flagging customs-inspected or high-priority cartons at the top of the manifest.",
      },
      {
        title: "Sport-Categorized PDF Packing Lists",
        detail:
          "Dynamically builds clean, print-ready PDF tables segmented by sport zone so floor leaders can distribute receiving lists straight to each department.",
      },
      {
        title: "Scheduled HTML Summary Dispatch",
        detail:
          "Runs on automated morning triggers to send an HTML overview table (total cartons, pallet breakdown, customs alerts) with attached PDFs to store staff.",
      },
      {
        title: "Custom In-Sheet Operator Controls",
        detail:
          "Added one-click Google Sheets menu actions allowing duty managers to re-run ad-hoc shipment batches or regenerate specific department PDFs on demand.",
      },
    ],
  },
  {
    id: "tm-logbook",
    short: "Store Logbook",
    title: "Store Logbook Sign-Out & Compliance",
    category: "automation",
    categoryLabel: "Decathlon HK",
    year: "2026",
    tagline: "Shift-report reminders, midnight zone audits, and one-click batch sign-out.",
    tags: ["Apps Script", "Safety", "Triggers"],
    images: ["/projects/decathlon-logo.svg"],
    glyph: "IN/OUT",
    role: "Automation Engineer · Omni Sports Leader (Decathlon HK — Tuen Mun)",
    overview:
      "A store-wide safety compliance and duty-handover automation system for Decathlon HK (Tuen Mun) that monitors opening, handover, and closing checklists, audits multi-zone staff/visitor sign-in logs at midnight, and provides a verified one-click batch sign-out workflow.",
    challenge:
      "Retail safety regulations require strict tracking of opening/closing shift reports and contractor/staff sign-outs across multiple store zones. When closing teams forgot to log out or missed a shift handover entry during peak hours, captains had to manually cross-check spreadsheet tabs late at night.",
    solution:
      "Built a multi-trigger Google Apps Script compliance watchdog paired with an interactive in-sheet management toolbar. Scheduled jobs check report completion before shift transitions, run a midnight multi-zone sign-out audit that alerts duty captains of any open entries, and let managers clear verified departures in a single batch click.",
    metrics: [
      { label: "COVERAGE", value: "Opening · Handover · Closing · Midnight Audit" },
      { label: "ADMIN OVERHEAD", value: "1-Click Batch Sign-Out" },
      { label: "COMPLIANCE", value: "Automated Captain Email Alerts" },
    ],
    features: [
      {
        title: "Shift-Report Reminder Triggers",
        detail:
          "Time-driven triggers verify that opening, mid-day handover, and closing safety reports are submitted on schedule, sending targeted prompts only when an entry is missing.",
      },
      {
        title: "Midnight Multi-Zone Safety Audit",
        detail:
          "Scans all store zone visitor and staff log tabs every night at midnight, compiling any unsigned entries into an instant compliance alert email for store captains.",
      },
      {
        title: "One-Click Verified Batch Sign-Out",
        detail:
          "Custom spreadsheet UI tool that validates open rows, stamps accurate departure timestamps across selected zones, and logs the authorizing duty manager.",
      },
      {
        title: "Validation & Guardrail Checks",
        detail:
          "Prevents accidental overwrites or incomplete log rows with schema validation and confirmation dialogs inside Google Sheets.",
      },
    ],
  },
  {
    id: "vr-horror",
    short: "Varlive VR Horror",
    title: "VR Horror Game — Varlive HK",
    category: "vr",
    categoryLabel: "Unity VR",
    year: "2024",
    tagline: "A commercial Halloween VR attraction with AI-driven scares and steady frame pacing.",
    tags: ["Unity", "C#", "AI State Machines"],
    images: [
      "/projects/horror/horror1.jpg",
      "/projects/horror/horror2.jpg",
      "/projects/horror/horror3.jpg",
      "/projects/horror/horror4.jpg",
      "/projects/horror/horror5.jpg",
    ],
    glyph: "VR",
    role: "Operations & VR Game Developer (Varlive HK)",
    overview:
      "A commercial location-based Unity VR horror attraction built from scratch for Varlive HK's Halloween season, combining finite-state-machine AI entities, spatial audio scares, and baked lighting optimized to sustain rock-solid VR frame rates across thousands of paying venue guests.",
    challenge:
      "Location-based VR venues require high visual atmosphere (fog, dynamic flashlights, shadow detail) without ever dropping below target headset frame rates—since frame stutter causes motion sickness and stalls venue throughput during back-to-back Halloween sessions.",
    solution:
      "Engineered the horror experience in Unity and C# around deterministic finite-state-machine (FSM) AI directors, aggressive draw-call batching, occlusion culling, and hybrid baked/realtime lighting—while managing venue VR rigs and networking on the floor to keep peak-hour downtime at zero.",
    metrics: [
      { label: "VENUE TRAFFIC", value: "Thousands of Concurrent Event Players" },
      { label: "ENGINE & AI", value: "Unity · C# Finite State Machines" },
      { label: "FLOOR UPTIME", value: "Zero Peak-Hour Downtime" },
    ],
    features: [
      {
        title: "Reactive AI State-Machine Enemies",
        detail:
          "Programmed C# NPC state machines (patrol, stalk, ambush, cooldown) driven by player gaze direction, proximity, and pacing timers so scares feel unpredictable on repeat runs.",
      },
      {
        title: "VR Frame-Pacing & Asset Optimization",
        detail:
          "Combined lightmap baking, GPU instancing, LOD chains, and strict occlusion culling to maintain comfortable headset frame times inside dark, fog-heavy corridors.",
      },
      {
        title: "Spatial Audio & Trigger Choreography",
        detail:
          "Layered 3D positional audio cues, flickering light rigs, and physics props synchronized with player locomotion to build tension before each encounter.",
      },
      {
        title: "Venue Rig Deployment & Live Ops",
        detail:
          "Deployed builds across multi-bay location-based VR hardware and handled rapid operator reset flows and hardware troubleshooting during sold-out Halloween nights.",
      },
    ],
  },
  {
    id: "central-market-vr",
    short: "Central Market 1841",
    title: "HK Traditional Market Museum VR",
    category: "vr",
    categoryLabel: "Unity VR",
    year: "2024",
    tagline: "Hong Kong's 1841 Central Market rebuilt as a walkable virtual museum.",
    tags: ["Unity", "Heritage", "Environment"],
    images: [
      "/projects/market/market1.jpg",
      "/projects/market/market2.jpg",
      "/projects/market/market3.jpg",
      "/projects/market/market4.jpg",
    ],
    glyph: "1841",
    role: "Unity VR Developer · Environment & Interaction Designer",
    overview:
      "A cultural heritage preservation project that reconstructs the history of Hong Kong's Central Market from 1841 onward inside a walkable Unity VR museum—featuring archival map rooms, historical photography galleries, and guided spatial storytelling.",
    challenge:
      "Historical archives of 19th- and 20th-century Hong Kong markets exist mostly as flat photographs and scattered floor plans, making it difficult for students and visitors to grasp the spatial scale and architectural evolution of Central Market over nearly two centuries.",
    solution:
      "Designed and built a multi-hall virtual museum in Unity that organizes archival maps, period photographs, and architectural models into curated 3D exhibition rooms with intuitive VR locomotion and interactive inspection stations.",
    metrics: [
      { label: "HERITAGE ERA", value: "1841 – Modern Central Market" },
      { label: "EXHIBITION ZONES", value: "Main Hall · Gallery · Archive · Map Room" },
      { label: "PLATFORM", value: "Unity 3D · VR Headset Walkable Tour" },
    ],
    features: [
      {
        title: "Four Curated Archival Exhibition Halls",
        detail:
          "Structured the virtual museum into distinct architectural spaces—Main Entrance Hall, Historical Photo Gallery, Archival Timeline Corridor, and the 1841 Map Room.",
      },
      {
        title: "High-Resolution Historical Map & Photo Inspection",
        detail:
          "Built VR gaze-and-controller interaction plaques that let visitors zoom into 1841 cartography, colonial street photographs, and market stall layouts without text shimmer.",
      },
      {
        title: "Period Lighting & Spatial Scale",
        detail:
          "Used physically based materials and warm museum lighting to highlight architectural proportions while keeping texture memory within standalone VR headset budgets.",
      },
      {
        title: "Accessible Comfort Locomotion",
        detail:
          "Implemented smooth teleport waypoints and comfort turn options so first-time museum visitors of all ages can explore without VR motion discomfort.",
      },
    ],
  },
  {
    id: "vr-edtech",
    short: "VR Learning",
    title: "VR Learning Modules",
    category: "vr",
    categoryLabel: "Unity EdTech",
    year: "2023",
    tagline: "Gamified ICT and STEM lessons in VR for primary tuition centres.",
    tags: ["Unity", "Oculus SDK", "EdTech"],
    images: [],
    glyph: "EDU",
    role: "Unity VR Developer · EdTech Curriculum Engineer",
    overview:
      "A suite of interactive Unity VR educational modules built with the Oculus SDK for primary school tuition centres in Hong Kong, turning abstract ICT and STEM concepts into hands-on spatial puzzles and gamified classroom challenges.",
    challenge:
      "Primary school students in after-school tuition centres often struggle to stay engaged with textbook-heavy ICT topics (logic gates, binary data flow, hardware components), while teachers need short, repeatable VR activities that fit into 15-minute lesson blocks.",
    solution:
      "Created bite-sized, controller-friendly Unity VR learning laboratories where students physically grab, wire, and test virtual computer and STEM components—receiving instant visual feedback, audio guidance, and score milestones.",
    metrics: [
      { label: "AUDIENCE", value: "Primary School Tuition Centres (HK)" },
      { label: "SDK & ENGINE", value: "Unity · Oculus SDK" },
      { label: "CURRICULUM", value: "Gamified ICT & STEM Modules" },
    ],
    features: [
      {
        title: "Tactile 3D ICT & Logic Puzzles",
        detail:
          "Replaced abstract worksheet diagrams with grabbable 3D circuit blocks, data packets, and hardware parts that snap together using Oculus Touch controllers.",
      },
      {
        title: "Child-Friendly Ergonomics & UI",
        detail:
          "Calibrated interaction reach, font sizes, and voice/visual prompts specifically for primary-school student height and zero prior VR experience.",
      },
      {
        title: "Gamified Scoring & Retention Loops",
        detail:
          "Added progressive level checkpoints, instant visual celebration cues, and time-challenge modes that boosted classroom participation and concept retention.",
      },
      {
        title: "Fast Classroom Session Reset",
        detail:
          "Built one-button teacher reset shortcuts so instructors can rotate groups of students through headsets smoothly during a single class period.",
      },
    ],
  },
  {
    id: "image-converter",
    short: "Image Converter",
    title: "Secure Offline Image Converter",
    category: "web",
    categoryLabel: "Web PWA",
    year: "2025",
    tagline: "Converts HEIC, SVG, PDF, PNG and JPG in the browser — files never leave the device.",
    tags: ["React", "TypeScript", "PWA"],
    images: ["/projects/image_converter_icon.png"],
    glyph: "PWA",
    demoUrl: "https://ifung2020.github.io/ifungconvertor/",
    role: "Frontend & PWA Engineer",
    overview:
      "A zero-server, privacy-first Progressive Web App built in React and TypeScript that batch-converts HEIC, SVG, PDF, PNG, WebP, and JPG files entirely inside the user's browser using client-side decoding and HTML5 Canvas/WebAssembly pipelines.",
    challenge:
      "Most free online file converters force users to upload personal photos or sensitive workplace PDFs/HEICs to third-party cloud servers with file-size limits, queues, and privacy risks.",
    solution:
      "Engineered a 100% client-side React + TypeScript web application deployed as an installable offline-capable PWA. Every decode, rasterization, quality adjustment, and ZIP/file download executes locally in browser memory—zero uploads, zero server latency, and complete data privacy.",
    metrics: [
      { label: "PRIVACY MODEL", value: "100% Client-Side (Zero Server Uploads)" },
      { label: "FORMATS", value: "HEIC · SVG · PDF · PNG · JPG · WebP" },
      { label: "ARCHITECTURE", value: "React · TypeScript · Offline PWA" },
    ],
    features: [
      {
        title: "Local HEIC, SVG & Multi-Page PDF Decoding",
        detail:
          "Handles Apple HEIC photos, vector SVGs, and PDF pages directly in the browser using client-side decoders and high-DPI canvas rendering.",
      },
      {
        title: "Zero-Upload Data Privacy Guarantee",
        detail:
          "All file buffers remain strictly inside local browser memory (`Blob` / `ArrayBuffer`), making it safe for internal retail documents and personal photos.",
      },
      {
        title: "Batch Queue & Quality Controls",
        detail:
          "Supports drag-and-drop multi-file batch conversion with configurable output format, resolution scaling, and compression quality sliders.",
      },
      {
        title: "Installable Offline PWA",
        detail:
          "Configured for instant static hosting on GitHub Pages with offline asset caching so it runs like a native desktop or mobile utility even without internet access.",
      },
    ],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "decathlon",
    company: "Decathlon HK",
    role: "Omni Sports Leader",
    period: "Now",
    line: "Automating shipment lists and store safety logbooks.",
    relatedProjectId: "clp-logistics",
  },
  {
    id: "varlive",
    company: "Varlive HK",
    role: "Ops & VR Game Dev",
    period: "1 yr",
    line: "Built a Halloween VR horror title; kept venue rigs running.",
    relatedProjectId: "vr-horror",
  },
  {
    id: "sandbox",
    company: "Sandbox VR HK",
    role: "VR Operations Leader",
    period: "1 yr",
    line: "Led the floor tech team at 100% session uptime.",
  },
  {
    id: "crimelab",
    company: "CrimeLab",
    role: "LARP Host & Gamemaster",
    period: "2021–22",
    line: "Wrote and ran live roleplay sessions.",
  },
];

export const FOCUS = [
  "Workflow Automation",
  "Unity VR Experiences",
  "Retail Operations",
  "IT Support & Hardware",
  "Web Tools & PWAs",
];

export const TOOLKIT = [
  ["Google Apps Script", "Unity", "C#", "Oculus SDK", "AI State Machines"],
  ["React", "Next.js", "TypeScript", "Sheets & Triggers", "Networking"],
];

export const LANGUAGES = "Cantonese · Mandarin · English";

export const EDUCATION = {
  school: "The Hang Seng University of Hong Kong",
  degree: "BSc Management Science & Information Management",
  graduation: "Dec 2026",
};
