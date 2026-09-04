import mechanizeLogo from "@/assets/sponsors/mechanize.svg";
import scmLogo from "@/assets/sponsors/scm.svg";
import afterQueryLogo from "@/assets/sponsors/afterquery.svg";
import elevenLabsLogo from "@/assets/sponsors/elevenlabs.svg";
import sandiaLogo from "@/assets/sponsors/sandia.png";
import cursorLogo from "@/assets/sponsors/cursor.svg";
import capitalOneLogo from "@/assets/sponsors/capital-one.svg";
import teloraLogo from "@/assets/sponsors/telora.svg";
import mtbLogo from "@/assets/sponsors/mtb.svg";
import asmlLogo from "@/assets/asml_logo.png";
import awakeLogo from "@/assets/awake_chocolate_logo.png";

export type SponsorTier = "flagship" | "partner" | "supporter";

export interface SponsorProfile {
  name: string;
  href: string;
  logo: string;
  contribution: number | null;
  logoTone: "dark" | "light";
  logoWidth?: number;
  logoHeight?: number;
}

export const getSponsorTier = (
  contribution: SponsorProfile["contribution"],
): SponsorTier => {
  if (contribution !== null && contribution >= 5000) return "flagship";
  if (contribution !== null && contribution >= 2500) return "partner";
  return "supporter";
};

export const SPONSOR_TIER_ORDER: SponsorTier[] = [
  "flagship",
  "partner",
  "supporter",
];

// Contribution values are the only source of visual rank. Updating a value
// automatically moves the sponsor into one of the three vessel sizes.
export const SPONSORS: SponsorProfile[] = [
  {
    name: "Capital One",
    href: "https://www.capitalone.com/",
    logo: capitalOneLogo,
    contribution: 6500,
    logoTone: "dark",
    logoWidth: 202,
    logoHeight: 72,
  },
  {
    name: "ASML",
    href: "https://www.asml.com/en",
    logo: asmlLogo,
    contribution: 6500,
    logoTone: "light",
    logoWidth: 190,
    logoHeight: 54,
  },
  {
    name: "Cursor",
    href: "https://cursor.com/",
    logo: cursorLogo,
    contribution: 5000,
    logoTone: "dark",
    logoWidth: 196,
    logoHeight: 50,
  },
  {
    name: "Sandia National Laboratories",
    href: "https://www.sandia.gov/about/",
    logo: sandiaLogo,
    contribution: 4500,
    logoTone: "light",
    logoWidth: 142,
    logoHeight: 74,
  },
  {
    name: "AfterQuery",
    href: "https://www.afterquery.com/",
    logo: afterQueryLogo,
    contribution: 2500,
    logoTone: "dark",
    logoWidth: 205,
    logoHeight: 46,
  },
  {
    name: "M&T Bank",
    href: "https://www.mtb.com/",
    logo: mtbLogo,
    contribution: 2500,
    logoTone: "light",
    logoWidth: 190,
    logoHeight: 48,
  },
  {
    name: "Mechanize",
    href: "https://www.mechanize.work/",
    logo: mechanizeLogo,
    contribution: 2000,
    logoTone: "dark",
    logoWidth: 72,
    logoHeight: 72,
  },
  {
    name: "Stevens Capital Management",
    href: "https://www.scm-lp.com/",
    logo: scmLogo,
    contribution: 2000,
    logoTone: "dark",
    logoWidth: 89,
    logoHeight: 73,
  },
  {
    name: "ElevenLabs",
    href: "https://elevenlabs.io/",
    logo: elevenLabsLogo,
    contribution: 0,
    logoTone: "dark",
    logoWidth: 205,
    logoHeight: 43,
  },
  {
    name: "AWAKE Chocolate",
    href: "https://awakechocolate.com/",
    logo: awakeLogo,
    contribution: 0,
    logoTone: "light",
    logoWidth: 202,
    logoHeight: 58,
  },
  {
    name: "Telora",
    href: "https://telora.com/",
    logo: teloraLogo,
    contribution: null,
    logoTone: "light",
    logoWidth: 74,
    logoHeight: 74,
  },
];
