/**
 * Static knowledge base of every public page on the site.
 *
 * The chatbot's system prompt is built from these entries and the LLM is
 * constrained to suggest only `path` values that appear here. This prevents
 * hallucinated links and keeps responses tightly scoped to the actual site.
 *
 * To add or rename a page, edit this file and the bot picks it up immediately.
 */

export type KnowledgeCategory =
  | "core"
  | "physio"
  | "fitness"
  | "rehab"
  | "group"
  | "training"
  | "content"
  | "legal";

export type KnowledgeEntry = {
  /** Route path the bot can recommend. Must start with "/". */
  path: string;
  /** Human-readable page title shown in suggested-link pills. */
  title: string;
  category: KnowledgeCategory;
  /** 1–2 sentence description used by the LLM to decide relevance. */
  summary: string;
  /** Phrases / synonyms a visitor might use when asking about this page. */
  keywords: string[];
};

export const SITE_KNOWLEDGE: readonly KnowledgeEntry[] = [
  // ─────────────────────────────────────────────────────────── Core ──
  {
    path: "/",
    title: "Home",
    category: "core",
    summary:
      "Landing page introducing Postura by Physio (Dr Priyanshi Pandya, PT) — combining evidence-based physiotherapy with structured fitness programs for posture, mobility, and long-term wellness.",
    keywords: ["home", "homepage", "main", "overview", "postura"],
  },
  {
    path: "/about",
    title: "About Us",
    category: "core",
    summary:
      "Learn about Dr Priyanshi Pandya (PT), the brand's vision and mission, treatment philosophy, and the story behind Postura by Physio.",
    keywords: ["about", "doctor", "physiotherapist", "story", "mission", "vision"],
  },
  {
    path: "/services",
    title: "All Services",
    category: "core",
    summary:
      "Overview of every physiotherapy and fitness service offered, with structured fitness solutions for different lifestyles and goals.",
    keywords: ["services", "all services", "offerings", "what do you offer"],
  },
  {
    path: "/contact-us",
    title: "Contact Us",
    category: "core",
    summary:
      "Get in touch — phone, WhatsApp, email, working days, and an enquiry form. Doorstep and society-based services available.",
    keywords: ["contact", "phone", "email", "whatsapp", "address", "reach", "get in touch"],
  },
  {
    path: "/book-a-session",
    title: "Book a Session",
    category: "core",
    summary:
      "Online booking for a consultation or therapy session — pick a date and time slot that works for you.",
    keywords: ["book", "booking", "appointment", "schedule", "session", "consultation", "reserve"],
  },

  // ────────────────────────────────────────────────────── Physiotherapy ──
  {
    path: "/physiotherapy",
    title: "Physiotherapy",
    category: "physio",
    summary:
      "Core physiotherapy services covering pain management, posture correction, advanced treatments, and a personalised approach timeline.",
    keywords: ["physiotherapy", "physio", "pain", "posture", "treatment", "therapy"],
  },
  {
    path: "/physiotherapy-management",
    title: "Physiotherapy Management",
    category: "physio",
    summary:
      "Structured physiotherapy management programs with assessment, treatment planning, and progress tracking for chronic and acute conditions.",
    keywords: [
      "physiotherapy management",
      "treatment plan",
      "chronic pain",
      "back pain",
      "neck pain",
      "joint pain",
      "rehabilitation plan",
    ],
  },
  {
    path: "/patient-interaction",
    title: "Patient Interaction (Health Assessment)",
    category: "physio",
    summary:
      "Interactive questionnaire that suggests the right program for your body based on your lifestyle, pain points, and goals.",
    keywords: [
      "assessment",
      "questionnaire",
      "health check",
      "which program",
      "recommend",
      "self assessment",
      "evaluation",
    ],
  },

  // ──────────────────────────────────────────────────── Fitness programs ──
  {
    path: "/pilates-program",
    title: "Pilates Program",
    category: "fitness",
    summary:
      "Mat and reformer-style Pilates focusing on core strength, flexibility, balance, and body alignment under physiotherapist supervision.",
    keywords: ["pilates", "core", "reformer", "mat pilates", "flexibility", "alignment"],
  },
  {
    path: "/yoga-program",
    title: "Yoga Program",
    category: "fitness",
    summary:
      "Therapeutic yoga sessions blending traditional asana with physiotherapy principles for stress relief, mobility, and breath work.",
    keywords: ["yoga", "asana", "stretching", "stress", "breathing", "pranayama", "meditation"],
  },
  {
    path: "/aerobics-program",
    title: "Aerobics Program",
    category: "fitness",
    summary:
      "Low-impact and high-energy aerobics for cardiovascular health, weight management, and stamina, designed safely for all fitness levels.",
    keywords: ["aerobics", "cardio", "weight loss", "stamina", "dance fitness", "endurance"],
  },

  // ───────────────────────────────────────────────────── Specialised rehab ──
  {
    path: "/pre-post-natal",
    title: "Pre & Post Natal Care",
    category: "rehab",
    summary:
      "Pregnancy-safe physiotherapy and exercise for prenatal support and postpartum recovery, including pelvic floor and core rehabilitation.",
    keywords: [
      "pregnancy",
      "prenatal",
      "antenatal",
      "postnatal",
      "postpartum",
      "after delivery",
      "mother",
      "pelvic floor",
      "diastasis",
    ],
  },
  {
    path: "/geriatric-rehabilitation",
    title: "Geriatric Rehabilitation",
    category: "rehab",
    summary:
      "Gentle, evidence-based rehabilitation for seniors — fall prevention, balance, joint mobility, and strength training tailored to age-related needs.",
    keywords: [
      "elderly",
      "senior",
      "old age",
      "geriatric",
      "fall prevention",
      "balance",
      "arthritis",
      "parents",
    ],
  },
  {
    path: "/athlete-rehab",
    title: "Athlete Rehab",
    category: "rehab",
    summary:
      "Sports-specific rehabilitation and return-to-play protocols for athletes recovering from injuries or improving performance.",
    keywords: [
      "athlete",
      "sports",
      "injury",
      "sports injury",
      "return to play",
      "performance",
      "ACL",
      "ligament",
      "muscle tear",
    ],
  },

  // ──────────────────────────────────────────── Group / corporate / couples ──
  {
    path: "/corporate-professionals",
    title: "Corporate Professionals",
    category: "group",
    summary:
      "Workplace wellness programs for desk-job professionals — ergonomic assessments, posture correction, and on-site sessions for IT and corporate teams.",
    keywords: [
      "corporate",
      "office",
      "desk job",
      "workplace",
      "IT",
      "ergonomic",
      "company",
      "employees",
      "work from home",
    ],
  },
  {
    path: "/society-exercise",
    title: "Society Exercise Programs",
    category: "group",
    summary:
      "On-site group fitness and physiotherapy programs hosted at residential societies — yoga, aerobics, and physio for community wellness.",
    keywords: [
      "society",
      "community",
      "residential",
      "apartment",
      "neighbours",
      "group class",
      "society program",
    ],
  },
  {
    path: "/couple-exercise-program",
    title: "Couple Exercise Program",
    category: "group",
    summary:
      "Partner workout sessions designed for couples — shared motivation, improved bonding, and balanced fitness routines for both partners.",
    keywords: ["couple", "partner", "duo", "spouse", "together", "couples workout"],
  },

  // ──────────────────────────────────────────────────── Equipment training ──
  {
    path: "/swiss-ball-training",
    title: "Swiss Ball Training",
    category: "training",
    summary:
      "Training with the Swiss (stability) ball for core strength, balance, posture, and rehabilitation under guided supervision.",
    keywords: ["swiss ball", "stability ball", "exercise ball", "fitball", "core ball"],
  },
  {
    path: "/theraband-training",
    title: "Theraband Training",
    category: "training",
    summary:
      "Resistance band (Theraband) training for progressive strengthening, rehab, and joint stability — adaptable for any level.",
    keywords: ["theraband", "resistance band", "elastic band", "rubber band exercise"],
  },
  {
    path: "/flexibar-training",
    title: "Flexibar Training",
    category: "training",
    summary:
      "Flexibar (vibration bar) training for deep core activation, posture, and neuromuscular control through oscillation-based exercises.",
    keywords: ["flexibar", "vibration bar", "oscillation", "core training"],
  },

  // ───────────────────────────────────────────────────────────── Content ──
  {
    path: "/gallery",
    title: "Gallery",
    category: "content",
    summary:
      "Photo gallery of in-clinic and on-site sessions across yoga, pilates, aerobics, corporate wellness, and society programs.",
    keywords: ["gallery", "photos", "pictures", "images", "session photos", "visuals"],
  },
  {
    path: "/blogs",
    title: "Blogs",
    category: "content",
    summary:
      "Articles and tips on physiotherapy, posture, fitness, recovery, and wellness written by the Postura team.",
    keywords: ["blog", "blogs", "articles", "tips", "advice", "posts", "read"],
  },
  {
    path: "/testimonials",
    title: "Testimonials",
    category: "content",
    summary:
      "Real reviews and recovery stories from clients who completed physiotherapy or fitness programs with Postura by Physio.",
    keywords: ["testimonials", "reviews", "stories", "feedback", "ratings", "what clients say"],
  },

  // ─────────────────────────────────────────────────────────────── Legal ──
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    category: "legal",
    summary: "How Postura by Physio collects, uses, and protects your personal data.",
    keywords: ["privacy", "privacy policy", "data", "gdpr", "cookies"],
  },
  {
    path: "/terms-and-conditions",
    title: "Terms & Conditions",
    category: "legal",
    summary: "Terms of use, booking and cancellation policy, and service conditions.",
    keywords: [
      "terms",
      "conditions",
      "policy",
      "cancellation",
      "refund",
      "legal",
      "agreement",
    ],
  },
];

/** Set of valid paths — used server-side to validate LLM-suggested links. */
export const ALLOWED_PATHS: ReadonlySet<string> = new Set(
  SITE_KNOWLEDGE.map((entry) => entry.path)
);

/** Look up an entry by exact path. */
export function findEntryByPath(path: string): KnowledgeEntry | undefined {
  return SITE_KNOWLEDGE.find((entry) => entry.path === path);
}
