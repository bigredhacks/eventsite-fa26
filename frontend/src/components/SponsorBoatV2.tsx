// SponsorBoatV2 — sponsor draft boats. Each variant is rendered from the
// Figma-exported transparent PNG (with the "Arriving" / "Soon..." text
// already baked into the sail). Once partners are confirmed each boat
// will swap to a logo-bearing variant.

import React from "react";
import { motion } from "framer-motion";

import arrivingBoat from "@/assets/sponsor_arriving.png";
import soonBoat from "@/assets/sponsor_soon.png";
import mastraBoat from "@/assets/sponsor_mastra.png";

export type BoatVariant = "arriving" | "soon" | "mastra";

interface SponsorBoatV2Props {
  variant: BoatVariant;
  pxWidth?: number;
  index?: number;
  // When true, the boat fills its parent's width (parent supplies sizing
  // via percentage). Used by the Sponsors section's aspect-locked layout.
  fill?: boolean;
}

const SRC: Record<BoatVariant, string> = {
  arriving: arrivingBoat,
  soon: soonBoat,
  mastra: mastraBoat,
};

const SponsorBoatV2: React.FC<SponsorBoatV2Props> = ({
  variant,
  pxWidth = 360,
  index = 0,
  fill = false,
}) => (
  <motion.img
    src={SRC[variant]}
    alt=""
    aria-hidden
    draggable={false}
    className="block pointer-events-none select-none"
    style={
      fill
        ? { width: "100%", height: "auto" }
        : { width: `${pxWidth}px`, height: "auto" }
    }
    animate={{
      y: [0, -5, 0, 4, 0],
      rotate: [0, 1.2, 0, -1.2, 0],
    }}
    transition={{
      duration: 4 + (index % 3) * 0.6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: index * 0.3,
    }}
  />
);

export default SponsorBoatV2;
