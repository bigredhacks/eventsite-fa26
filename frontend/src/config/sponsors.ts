import mechanizeLogo from "@/assets/sponsors/mechanize.svg";
import scmLogo from "@/assets/sponsors/scm.svg";
import afterQueryLogo from "@/assets/sponsors/afterquery.svg";
import sandiaLogo from "@/assets/sponsors/sandia.png";
import spacexLogo from "@/assets/sponsors/spacex.png";
import lactiqLogo from "@/assets/sponsors/lactiq.webp";
import waftechLogo from "@/assets/sponsors/waftech.webp";
import photonLogo from "@/assets/sponsors/photon.svg";
import capitalOneLogo from "@/assets/sponsors/capital-one.svg";
import mtbLogo from "@/assets/sponsors/mtb.svg";
import asmlLogo from "@/assets/asml_logo.png";
import awakeLogo from "@/assets/awake_chocolate_logo.png";

export type SponsorTier = "flagship" | "partner" | "supporter";

export interface SponsorProfile {
  name: string;
  href?: string;
  logo: string;
  contribution: number | null;
  tier?: SponsorTier;
  logoTone: "dark" | "light";
  logoWidth?: number;
  logoHeight?: number;
  logoOffsetX?: number;
  logoOffsetY?: number;
}

export const getSponsorTier = (
  contribution: SponsorProfile["contribution"],
  tier?: SponsorTier,
): SponsorTier => {
  if (tier) return tier;
  if (contribution !== null && contribution >= 5000) return "flagship";
  if (contribution !== null && contribution >= 2500) return "partner";
  return "supporter";
};

export const SPONSOR_TIER_ORDER: SponsorTier[] = [
  "flagship",
  "partner",
  "supporter",
];

// Contributions determine vessel size unless a tier is explicitly supplied.
// This supports confirmed tiers when contribution amounts are not available.
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
    name: "SpaceX",
    href: "https://x.ai/api?utm_source=bigred_hacks&utm_medium=inperson&utm_campaign=2026_q3_bigredhacks",
    logo: spacexLogo,
    contribution: 5000,
    logoTone: "dark",
    logoWidth: 196,
    // Preserve the uploaded PNG's aspect ratio, including transparent padding.
    logoHeight: 110.25,
    // Balance the wordmark optically against the long, light swoosh.
    logoOffsetX: 10,
    logoOffsetY: 0,
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
    name: "LactiQ Intelligence",
    href: "https://lactiqintel.com/",
    logo: lactiqLogo,
    contribution: null,
    tier: "partner",
    logoTone: "dark",
    logoWidth: 180,
    logoHeight: 77.4,
  },
  {
    name: "WAFTECH",
    href: "https://www.waf-tech.com/",
    logo: waftechLogo,
    contribution: null,
    tier: "partner",
    logoTone: "dark",
    logoWidth: 218,
    logoHeight: 87,
  },
  {
    name: "Photon",
    href: "https://photon.codes/",
    logo: photonLogo,
    contribution: null,
    tier: "partner",
    logoTone: "dark",
    logoWidth: 200,
    logoHeight: 54,
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
    name: "AWAKE Chocolate",
    href: "https://awakechocolate.com/",
    logo: awakeLogo,
    contribution: 0,
    logoTone: "light",
    logoWidth: 202,
    logoHeight: 58,
  },
];
