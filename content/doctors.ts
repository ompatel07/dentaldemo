import type { Doctor } from "./types";

/**
 * Doctor profiles lead with a philosophy of care rather than a wall of
 * degrees - the credentials are there, but second. Fictional demo data.
 */

export const doctors: Doctor[] = [
  {
    slug: "ira-mehta",
    name: "Dr. Ira Mehta",
    role: "Founder, Prosthodontics & Smile Design",
    philosophy:
      "I would rather talk a patient out of eight veneers than sell them. The best cosmetic dentistry is the kind nobody can point to.",
    bio: "Ira founded the atelier in 2014 after eight years rebuilding full mouths in Mumbai and a fellowship year with a ceramist in Milan. She still designs every veneer case herself, on paper first, and keeps a drawer of rejected mock-ups to show patients what restraint looks like.",
    credentials: [
      "MDS Prosthodontics, Gujarat University",
      "Fellowship, Digital Smile Design",
      "Visiting faculty, Advanced Ceramics",
    ],
    languages: ["English", "Hindi", "Gujarati"],
    focus: ["Smile design", "Veneers", "Full-mouth rehabilitation"],
    yearsExperience: 19,
    portrait: {
      src: "/images/doctor-ira-mehta.jpg",
      alt: "Portrait of Dr. Ira Mehta",
      width: 1000,
      height: 1250,
    },
  },
  {
    slug: "kabir-shah",
    name: "Dr. Kabir Shah",
    role: "Implantology & Oral Surgery",
    philosophy:
      "Surgery should be boring. Every surprise in an operating room is a planning failure that happened three weeks earlier.",
    bio: "Kabir has placed more than four thousand implants and plans each one digitally before touching an instrument. He teaches guided surgery to postgraduates on weekends, mostly so he can argue with them about bone grafting.",
    credentials: [
      "MDS Oral & Maxillofacial Surgery",
      "Fellow, ICOI",
      "Certified, Straumann Guided Surgery",
    ],
    languages: ["English", "Hindi", "Gujarati", "Marathi"],
    focus: ["Implants", "Bone grafting", "Wisdom teeth"],
    yearsExperience: 16,
    portrait: {
      src: "/images/doctor-kabir-shah.jpg",
      alt: "Portrait of Dr. Kabir Shah",
      width: 1000,
      height: 1250,
    },
  },
  {
    slug: "anaya-raval",
    name: "Dr. Anaya Raval",
    role: "Endodontics & Pain Management",
    philosophy:
      "People do not fear dentists. They fear not being believed when they say it still hurts. I start by believing them.",
    bio: "Anaya handles the appointments other clinics refer away: the retreatments, the cracked molars, the patients who have been told the pain is in their head. She works under a microscope, narrates every step out loud, and has never once said the words just relax.",
    credentials: [
      "MDS Conservative Dentistry & Endodontics",
      "Microscopic endodontics certification",
      "Advanced sedation provider",
    ],
    languages: ["English", "Hindi", "Gujarati"],
    focus: ["Root canals", "Retreatment", "Dental anxiety"],
    yearsExperience: 12,
    portrait: {
      src: "/images/doctor-anaya-raval.jpg",
      alt: "Portrait of Dr. Anaya Raval",
      width: 1000,
      height: 1250,
    },
  },
  {
    slug: "vivaan-desai",
    name: "Dr. Vivaan Desai",
    role: "Paediatric Dentistry & Teen Aligners",
    philosophy:
      "A four-year-old who leaves laughing is worth more to me than a filling done today. The filling can wait a fortnight. Trust cannot.",
    bio: "Vivaan runs the children's room, which has its own entrance, its own chair and a strict rule that no instrument appears before it has been introduced by name. Parents report that their children ask to come back, which he considers the only metric that matters.",
    credentials: [
      "MDS Paedodontics & Preventive Dentistry",
      "Certified Invisalign First provider",
      "Behaviour-guidance training, AAPD curriculum",
    ],
    languages: ["English", "Hindi", "Gujarati"],
    focus: ["Children", "Teen aligners", "Preventive care"],
    yearsExperience: 10,
    portrait: {
      src: "/images/doctor-vivaan-desai.jpg",
      alt: "Portrait of Dr. Vivaan Desai",
      width: 1000,
      height: 1250,
    },
  },
];

export const doctorBySlug = (slug: string) => doctors.find((d) => d.slug === slug);
