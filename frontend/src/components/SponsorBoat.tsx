// SponsorBoat — clickable sponsor logos rendered as illustrated sailboats from
// the FA26 Figma file. Each composite boat is laid out in its own absolute
// pixel space (Figma's native coords), then the wrapping <a> uses
// transform:scale to fluidly resize. This avoids the percentage-conversion
// drift that previously stretched / flipped logos.
import React from "react";
import { motion } from "framer-motion";

// Atomic boats (single SVG)
import mtbankSvg from "@/assets/fa26_boat_mtbank.svg";
import deshawSvg from "@/assets/fa26_boat_deshaw.svg";
import eySvg from "@/assets/fa26_boat_ey.svg";
import asmlSvg from "@/assets/fa26_boat_asml.svg";

// Composite boat parts (sub-vectors)
import imcSail from "@/assets/boats_imc/sail.svg";
import imcFlag from "@/assets/boats_imc/flag.svg";
import imcSub from "@/assets/boats_imc/sub.svg";
import imcTopsail from "@/assets/boats_imc/topsail.svg";
import imcHull from "@/assets/boats_imc/hull.svg";
import imcLogo from "@/assets/boats_imc/logo.png";

import visaFlag from "@/assets/boats_visa/flag.svg";
import visaSail from "@/assets/boats_visa/sail.svg";
import visaSub from "@/assets/boats_visa/sub.svg";
import visaTopsail from "@/assets/boats_visa/topsail.svg";
import visaHull from "@/assets/boats_visa/hull.svg";
import visaLogo from "@/assets/boats_visa/logo.png";

import mastraFlag from "@/assets/boats_mastra/flag.svg";
import mastraSail from "@/assets/boats_mastra/sail.svg";
import mastraSub from "@/assets/boats_mastra/sub.svg";
import mastraTopsail from "@/assets/boats_mastra/topsail.svg";
import mastraHull from "@/assets/boats_mastra/hull.svg";
import mastraLogo from "@/assets/boats_mastra/logo.svg";

import scmFlag from "@/assets/boats_scm/flag.svg";
import scmSail from "@/assets/boats_scm/sail.svg";
import scmSub from "@/assets/boats_scm/sub.svg";
import scmTopsail from "@/assets/boats_scm/topsail.svg";
import scmHull from "@/assets/boats_scm/hull.svg";
import scmLogo from "@/assets/boats_scm/logo.png";

import awakeFlag from "@/assets/boats_awake/flag.svg";
import awakeSail from "@/assets/boats_awake/sail.svg";
import awakeSub from "@/assets/boats_awake/sub.svg";
import awakeTopsail from "@/assets/boats_awake/topsail.svg";
import awakeHull from "@/assets/boats_awake/hull.svg";
import awakeLogo from "@/assets/boats_awake/logo.png";

export type SponsorKey =
  | "imc" | "visa" | "mtbank" | "mastra"
  | "scm" | "deshaw" | "ey" | "awake" | "asml";

interface SponsorInfo {
  key: SponsorKey;
  name: string;
  href: string;
}

export const SPONSORS: SponsorInfo[] = [
  { key: "imc",     name: "IMC Trading",   href: "https://www.imc.com/" },
  { key: "visa",    name: "Visa",          href: "https://www.visa.com/" },
  { key: "mtbank",  name: "M&T Bank",      href: "https://www.mtb.com/" },
  { key: "mastra",  name: "Mastra",        href: "https://mastra.ai/" },
  { key: "scm",     name: "Stevens Capital Management", href: "https://stevenscm.com/" },
  { key: "deshaw",  name: "D. E. Shaw & Co.", href: "https://www.deshaw.com/" },
  { key: "ey",      name: "EY",            href: "https://www.ey.com/" },
  { key: "awake",   name: "Awake Caffeinated Chocolate", href: "https://awakechocolate.com/" },
  { key: "asml",    name: "ASML",          href: "https://www.asml.com/" },
];

// Each composite boat is rendered inside a 308×257 px box (matches the
// average bounding box of Figma's per-boat group). Using absolute px positions
// (NOT percentages) preserves exact aspect ratios. The outer wrapper then
// scales the whole thing via CSS transform without any distortion.
//
// Coordinates below come straight from the Figma get_design_context output,
// converted from `left/top/width/height` (in px) of each sub-piece.

const BOAT_BOX = { w: 308, h: 257 };

type Piece = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  flipY?: boolean;
  contain?: boolean; // use object-contain when true
};

const ImcPieces: Piece[] = [
  { src: imcSail,    x: 86.86, y: 14.36,  w: 217.143, h: 153.889 },
  { src: imcFlag,    x: 18.6,  y: 151.46, w: 267.529, h: 90.527, rotate: -7.19 },
  { src: imcSub,     x: 12.99, y: 53.22,  w: 75.087,  h: 114.717 },
  { src: imcTopsail, x: 0,     y: 0,      w: 85.234,  h: 36.687 },
  { src: imcHull,    x: 17.35, y: 162.51, w: 276.665, h: 35.396 },
  // Logo: scaled up ~20% and recentered on the sail
  { src: imcLogo,    x: 120,   y: 55,     w: 115,     h: 90, contain: true, rotate: 4.25 },
];

const VisaPieces: Piece[] = [
  { src: visaFlag,    x: 16.63,  y: 159.58, w: 205.736, h: 66.032, rotate: -6.1 },
  { src: visaSail,    x: 0,      y: 14.14,  w: 167.857, h: 151.519 },
  { src: visaSub,     x: 166.92, y: 52.4,   w: 58.044,  h: 112.951 },
  { src: visaTopsail, x: 169.11, y: 0,      w: 65.888,  h: 36.122 },
  { src: visaHull,    x: 7.72,   y: 160.01, w: 213.869, h: 34.851 },
  // Logo: pulled out of subcropping; centered in the sail
  { src: visaLogo,    x: 0,      y: 56,     w: 145,     h: 75, rotate: 6.27, contain: true },
];

const MastraPieces: Piece[] = [
  { src: mastraFlag,    x: 22.44, y: 137.06, w: 220.16,  h: 74.498, rotate: -7.19 },
  { src: mastraSail,    x: 76.61, y: 12.67,  w: 191.528, h: 135.736 },
  { src: mastraSub,     x: 11.46, y: 46.94,  w: 66.229,  h: 101.185 },
  { src: mastraTopsail, x: 0,     y: 0,      w: 75.179,  h: 32.359 },
  { src: mastraHull,    x: 15.3,  y: 143.34, w: 244.029, h: 31.22 },
  { src: mastraLogo,    x: 99.84, y: 65.29,  w: 124.993, h: 34.518, contain: true },
];

const ScmPieces: Piece[] = [
  { src: scmFlag,    x: 11.55,  y: 168.48, w: 213.589, h: 76.324, rotate: -8.38 },
  { src: scmSail,    x: 0,      y: 14.99,  w: 171.429, h: 160.591 },
  { src: scmSub,     x: 170.47, y: 55.53,  w: 59.279,  h: 119.714 },
  { src: scmTopsail, x: 172.71, y: 0,      w: 67.29,   h: 38.285 },
  { src: scmHull,    x: 7.89,   y: 169.59, w: 218.42,  h: 36.938 },
  // Logo: scaled up ~25% from the previous shrink, centered on the sail
  { src: scmLogo,    x: 40,     y: 65,     w: 75,      h: 70, rotate: -6.82, contain: true },
];

const AwakePieces: Piece[] = [
  { src: awakeFlag,    x: 11.39,  y: 156.1,  w: 322.143, h: 108.212, rotate: -7.04 },
  { src: awakeSail,    x: 102.02, y: 15.54,  w: 255.061, h: 166.454 },
  { src: awakeSub,     x: 15.26,  y: 57.56,  w: 88.199,  h: 124.084 },
  { src: awakeTopsail, x: 0,      y: 0,      w: 100.118, h: 39.683 },
  { src: awakeHull,    x: 20.38,  y: 175.78, w: 324.977, h: 38.286 },
  { src: awakeLogo,    x: 131.31, y: 60.29,  w: 158.109, h: 79.055, contain: true },
];

const COMPOSITE_PIECES: Partial<Record<SponsorKey, Piece[]>> = {
  imc: ImcPieces,
  visa: VisaPieces,
  mastra: MastraPieces,
  scm: ScmPieces,
  awake: AwakePieces,
};

const ATOMIC: Partial<Record<SponsorKey, string>> = {
  mtbank: mtbankSvg,
  deshaw: deshawSvg,
  ey: eySvg,
  asml: asmlSvg,
};

const PieceImg: React.FC<{ p: Piece }> = ({ p }) => (
  <img
    src={p.src}
    alt=""
    className={`absolute pointer-events-none select-none ${p.contain ? "object-contain" : ""}`}
    style={{
      left: `${p.x}px`,
      top: `${p.y}px`,
      width: `${p.w}px`,
      height: `${p.h}px`,
      transform: p.rotate
        ? `rotate(${p.rotate}deg)${p.flipY ? " scaleY(-1)" : ""}`
        : p.flipY
        ? "scaleY(-1)"
        : undefined,
    }}
  />
);

const Composite: React.FC<{ pieces: Piece[] }> = ({ pieces }) => (
  <div className="absolute inset-0">
    <div
      className="absolute"
      style={{
        left: 0,
        top: 0,
        width: `${BOAT_BOX.w}px`,
        height: `${BOAT_BOX.h}px`,
        transform: "scale(var(--boat-scale, 1))",
        transformOrigin: "top left",
      }}
    >
      {pieces.map((p, i) => (
        <PieceImg key={i} p={p} />
      ))}
    </div>
  </div>
);

interface SponsorBoatProps {
  sponsor: SponsorInfo;
  index: number;
  /** Pixel width of the rendered boat. Composite boats scale their inner 308×257 box to match. */
  pxWidth?: number;
}

const SponsorBoat: React.FC<SponsorBoatProps> = ({ sponsor, index, pxWidth = 192 }) => {
  const atomic = ATOMIC[sponsor.key];
  const pieces = COMPOSITE_PIECES[sponsor.key];
  const scale = pxWidth / BOAT_BOX.w;
  const pxHeight = BOAT_BOX.h * scale;

  return (
    <motion.a
      href={sponsor.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={sponsor.name}
      className="block relative cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow1/60 rounded-lg"
      style={{ width: `${pxWidth}px`, height: `${pxHeight}px`, ["--boat-scale" as string]: String(scale) }}
      animate={{
        y: [0, -5, 0, 4, 0],
        rotate: [0, 1.1, 0, -1.1, 0],
      }}
      transition={{
        duration: 4 + (index % 3) * 0.6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.25,
      }}
      whileHover={{ scale: 1.06, y: -8 }}
      whileFocus={{ scale: 1.06 }}
    >
      {atomic && (
        <img
          src={atomic}
          alt={sponsor.name}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          style={sponsor.key === "deshaw" ? { transform: "scaleX(-1)" } : undefined}
        />
      )}
      {pieces && <Composite pieces={pieces} />}
    </motion.a>
  );
};

export default SponsorBoat;
