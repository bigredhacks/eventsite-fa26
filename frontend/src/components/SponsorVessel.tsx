import { motion } from "framer-motion";
import {
  getSponsorTier,
  type SponsorProfile,
  type SponsorTier,
} from "../config/sponsors";

const TIER_COLORS: Record<
  SponsorTier,
  { accent: string; hull: string; hullShadow: string }
> = {
  flagship: {
    accent: "#c8494f",
    hull: "#2a4c26",
    hullShadow: "#1d3c20",
  },
  partner: {
    accent: "#f0c66a",
    hull: "#03506d",
    hullShadow: "#063e54",
  },
  supporter: {
    accent: "#b6d995",
    hull: "#397b78",
    hullShadow: "#2a5d62",
  },
};

interface SponsorVesselProps {
  sponsor: SponsorProfile;
}

const SAIL_LOGO_CENTER = { x: 208, y: 122 };

const SponsorVessel: React.FC<SponsorVesselProps> = ({ sponsor }) => {
  const tier = getSponsorTier(sponsor.contribution);
  const colors = TIER_COLORS[tier];
  const isDarkSail = sponsor.logoTone === "light";
  const logoWidth = sponsor.logoWidth ?? 198;
  const logoHeight = sponsor.logoHeight ?? 58;
  const logoX = SAIL_LOGO_CENTER.x - logoWidth / 2;
  const logoY = SAIL_LOGO_CENTER.y - logoHeight / 2;

  return (
    <motion.a
      href={sponsor.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${sponsor.name}`}
      title={sponsor.name}
      data-tier={tier}
      className="sponsor-vessel group block shrink-0 rounded-[38%] focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow1/80 focus-visible:ring-offset-4 focus-visible:ring-offset-sky3"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <svg
        viewBox="0 0 380 260"
        role="img"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible drop-shadow-[0_12px_12px_rgba(3,80,109,0.22)] transition-[filter] duration-300 group-hover:drop-shadow-[0_18px_15px_rgba(3,80,109,0.3)]"
      >
        <ellipse cx="192" cy="237" rx="142" ry="10" fill="#d9eff8" opacity="0.28" />
        <path
          d="M75 34V190"
          stroke="#68462d"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M80 37C101 39 119 46 136 58C116 66 97 66 80 61V37Z"
          fill={colors.accent}
          stroke="#18445a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M86 62C166 47 252 51 328 73C332 74 334 77 334 81V168C334 175 330 179 323 179H86V62Z"
          fill={isDarkSail ? "#164f63" : "#fff8e6"}
          stroke={isDarkSail ? "#f4ead0" : "#18445a"}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M98 163C178 154 259 158 322 170"
          fill="none"
          stroke={isDarkSail ? "#f4ead0" : "#18445a"}
          strokeWidth="2"
          opacity="0.24"
        />
        <image
          href={sponsor.logo}
          x={logoX}
          y={logoY}
          width={logoWidth}
          height={logoHeight}
          preserveAspectRatio="xMidYMid meet"
        />
        <path
          d="M40 184H346L321 226C274 238 108 238 61 220L40 184Z"
          fill={colors.hull}
          stroke="#173c4f"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M57 211C125 224 255 225 326 211L321 226C274 238 108 238 61 220L57 211Z"
          fill={colors.hullShadow}
        />
        <path d="M45 190H340L334 200H50L45 190Z" fill={colors.accent} />
      </svg>
    </motion.a>
  );
};

export default SponsorVessel;
