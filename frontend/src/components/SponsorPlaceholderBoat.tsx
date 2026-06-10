import React from "react";
import { motion } from "framer-motion";

// A stylized boat with an "Arriving" / "Soon..." label on its sail. Used while
// the Sponsors section is in drafts. All shapes are inline SVG so the colors
// can be themed (green hull / blue hull) without per-asset PNG variants.
//
// Geometry roughly mirrors the Figma "soft sail" silhouette but is rendered
// at viewBox 360x260 so the wrapping <a> can scale it via CSS without any
// per-piece distortion drift.

interface PlaceholderBoatProps {
  label: string;
  hullColor: string;       // primary hull paint
  hullShadow: string;      // hull underwater shadow
  flagColor: string;       // mast pennant
  pxWidth?: number;
  index?: number;
  textColor?: string;      // sail text colour (defaults to navy)
}

const SponsorPlaceholderBoat: React.FC<PlaceholderBoatProps> = ({
  label,
  hullColor,
  hullShadow,
  flagColor,
  pxWidth = 320,
  index = 0,
  textColor = "#1a3a6c",
}) => {
  const aspect = 360 / 260;
  return (
    <motion.div
      className="relative pointer-events-none select-none"
      style={{ width: `${pxWidth}px`, height: `${pxWidth / aspect}px` }}
      animate={{
        y: [0, -5, 0, 4, 0],
        rotate: [0, 1.1, 0, -1.1, 0],
      }}
      transition={{
        duration: 4 + (index % 3) * 0.6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.3,
      }}
    >
      <svg
        viewBox="0 0 360 260"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full overflow-visible"
      >
        {/* Mast */}
        <path d="M 95 15 L 95 200" stroke="#1a3a6c" strokeWidth="2.4" />

        {/* Pennant flag */}
        <path
          d="M 95 18 Q 130 8 145 28 Q 130 22 100 30 Z"
          fill={flagColor}
          stroke="#1a3a6c"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Topsail (small front sail) */}
        <path
          d="M 95 22 Q 60 35 50 75 Q 80 70 95 60 Z"
          fill="#eaf3fb"
          stroke="#1a3a6c"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Main sail */}
        <path
          d="M 95 22 Q 250 35 285 175 Q 200 168 95 175 Z"
          fill="#f1f6fb"
          stroke="#1a3a6c"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Sail crease */}
        <path d="M 95 22 Q 195 100 95 175" stroke="#cfdbe9" strokeWidth="1.5" fill="none" />

        {/* Hull */}
        <path
          d="M 25 180 Q 60 222 180 222 Q 295 222 335 180 Q 290 200 180 200 Q 70 200 25 180 Z"
          fill={hullColor}
          stroke="#1a3a6c"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Hull shadow on water */}
        <path
          d="M 35 230 Q 90 252 200 252 Q 305 252 330 232 Q 280 245 200 245 Q 90 245 35 230 Z"
          fill={hullShadow}
          opacity="0.55"
        />

        {/* Sail label — Spartan Bold per Figma 362:914/362:915 (32px on a
            268px-wide boat). Color #03506d, tracking -3% (-0.96/32px). */}
        <text
          x="190"
          y="120"
          textAnchor="middle"
          fontFamily="'League Spartan', system-ui, sans-serif"
          fontWeight="700"
          fontStyle="normal"
          fontSize="40"
          letterSpacing="-1.2"
          fill={textColor}
        >
          {label}
        </text>
      </svg>
    </motion.div>
  );
};

export default SponsorPlaceholderBoat;
