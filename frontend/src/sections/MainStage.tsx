// MainStage — single 1670×7310 ghost canvas that mirrors the Figma
// "draft - no sponsors" frame (node 362:2). Every illustrated SVG vector
// is rendered inside this canvas at its exact absolute pixel position, so
// nothing is clipped by section boundaries.
//
// The canvas scales fluidly with the viewport via `aspectRatio`: at any
// width the contents preserve the Figma 1670:7310 layout. Section content
// (Tracks, Schedule, FAQ, etc.) is overlaid on top in normal flow via
// absolutely-positioned section wrappers placed at the same Y coords.
//
// Reference: team Figma file, frame 362:2.

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// SKY
import backCloud from "@/assets/fa26_back_cloud.svg";
import middleCloud from "@/assets/fa26_middle_cloud.svg";
import frontCloud from "@/assets/fa26_front_cloud.svg";

// MOUNTAINS / HILLS
import bigMountain from "@/assets/fa26_big_mountain.svg";
import smallMountain from "@/assets/fa26_small_mountain.svg";
import smallHill from "@/assets/fa26_small_hill.svg";
import aboutHill from "@/assets/fa26_about_hill.svg";
import darkestHill from "@/assets/fa26_darkest_hill.svg";
import lightGreen from "@/assets/fa26_light_green_mountain.svg";
import leftMountain from "@/assets/fa26_left_mountain.svg";
import leftSmallMountain from "@/assets/fa26_left_small_mountain.svg";
import rightMountain from "@/assets/fa26_right_mountain.svg";
import rightSmallMountain from "@/assets/fa26_right_small_mountain.svg";

// BUILDINGS
import beachHouse from "@/assets/fa26_beach_house.svg";
import lighthouseCliff from "@/assets/fa26_lighthouse_cliff.png";
import group98 from "@/assets/fa26_group98.png";

// BRIDGE / WATER
import bridge from "@/assets/fa26_bridge.svg";
import vector74 from "@/assets/fa26_vector_74.svg";
import vector87 from "@/assets/fa26_vector_87.svg";
import vector88 from "@/assets/fa26_vector_88.svg";
import vector116 from "@/assets/fa26_vector_116.svg";
import vector117 from "@/assets/fa26_vector_117.svg";

// FOREGROUND DECORATIONS
import group83 from "@/assets/fa26_group83.svg";

import Train from "../components/Train";

// Figma canvas dimensions (frame 362:2). STAGE_H is set so the stage's
// rendered pixel height matches the actual document height — preventing
// navy (html background) from showing through anywhere the stage doesn't
// cover. SVG positions and sizes are independent of STAGE_H by design
// (`top = y × viewport_w / STAGE_W`), so growing this constant keeps
// every asset visually pinned to its current pixel position.
export const STAGE_W = 1670;
export const STAGE_H = 6225;

const pct = (x: number, y: number, w: number, h: number) => ({
  left: `${(x / STAGE_W) * 100}%`,
  top: `${(y / STAGE_H) * 100}%`,
  width: `${(w / STAGE_W) * 100}%`,
  height: `${(h / STAGE_H) * 100}%`,
});

const MainStage: React.FC = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  // Hero-section progress drives the top-hill train's travel along its
  // train tracks. The train should complete its run by the time the user
  // has scrolled past the hero — so we tie progress to the hero section's
  // scroll bounds (0 when hero top at viewport top, 1 when hero bottom
  // crosses viewport top).
  const [heroEl, setHeroEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setHeroEl(document.getElementById("hero"));
  }, []);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroEl ? { current: heroEl } : stageRef,
    offset: ["start start", "end start"],
  });
  // Train tracks (Vector 116/117) sweep from x≈317 / y≈773 at the top-left
  // down to x≈1196 / y≈950 at the right (CSS px on a 1440 viewport). The
  // train's bottom edge needs to ride the rail-top, not float above it.
  // Home position is pct(457, 820, 539, 72) — so home_top in css ≈ 707px,
  // and the new container height ≈ 62css (matches the SVG's natural 600x80
  // aspect, no more vertical stretching). trainY translates so the bottom
  // (= home_top + 62 + dy) lands on the rail top: 820..920 css → dy 51..151.
  const trainX = useTransform(heroProgress, [0, 1], [-60, 356]);
  // trainY is calibrated so the train's bottom-right corner (after the
  // current rotate) rides the rail line at every progress: ~34 css px
  // lower at the start than the previous home position, ~27 css px
  // higher at the end. Rails span y=773→950 (left→right) so the
  // bottom-right corner lands within ~5px of the rail top throughout.
  const trainY = useTransform(heroProgress, [0, 1], [40, 94]);
  const trainRotate = useTransform(heroProgress, [0, 1], [6, 14]);

  return (
    <div
      ref={stageRef}
      id="main-stage"
      aria-hidden
      className="absolute inset-x-0 top-0 pointer-events-none select-none overflow-hidden -z-10"
      style={{
        // Keep the Figma 1670x7310 aspect ratio so every SVG stays at its
        // designed proportions. The canvas height is naturally bounded by
        // the page width × (7310/1670). On a 1440px viewport this is
        // ~6303px, which closely matches the actual document height.
        aspectRatio: `${STAGE_W} / ${STAGE_H}`,
        // Vertical sky gradient sampled from Figma — light blue-grey at the
        // very top, settles into the main #81b7e3 sky for most of the
        // canvas. The deep navy footer color is NOT included here because
        // the footer paints its own sky4 background, so the canvas can end
        // exactly where the footer starts.
        backgroundImage:
          "linear-gradient(to bottom, var(--color-sky1) 0%, var(--color-sky2) 4%, var(--color-sky3) 12%, var(--color-sky3) 100%)",
      }}
    >
      {/* ============================ SKY (y < 1500) ============================ */}
      <img src={backCloud}   alt="" className="absolute" style={pct(421, 170, 1217, 781)} />
      <img src={middleCloud} alt="" className="absolute" style={pct(2043, 547, 1090, 688)} />
      <img src={frontCloud}  alt="" className="absolute" style={pct(1586, 724, 927, 600)} />

      {/* Back mountains */}
      <img src={bigMountain}   alt="" className="absolute" style={pct(-58, 439, 949, 512)} />
      <img src={smallMountain} alt="" className="absolute" style={pct(298, 647, 431, 285)} />

      {/* Hill stack */}
      <img src={smallHill}   alt="" className="absolute" style={pct(469, 695, 1458, 403)} />
      <img src={aboutHill}   alt="" className="absolute" style={pct(-73, 780, 1559, 1186)} />

      {/* Train tracks behind the top-hill train */}
      <img src={vector116} alt="" className="absolute" style={pct(368, 897, 1019, 214)} />
      <img src={vector117} alt="" className="absolute" style={pct(490, 893, 917, 211)} />

      {/* Top hill train — Figma 362:672 (457, 820, 539, 141). Travels
          along the train tracks (Vector 116/117) as the user scrolls
          through the hero. The outer motion.div translates along the
          track curve via scroll progress; the inner div bobs subtly. */}
      <motion.div
        className="absolute"
        style={{
          ...pct(457, 820, 539, 72),
          x: trainX,
          y: trainY,
          rotate: trainRotate,
          transformOrigin: "center center",
        }}
      >
        <div className="absolute inset-0 animate-train-bob">
          <Train className="absolute inset-0" flip />
        </div>
      </motion.div>

      {/* Darkest hill — overlays the train so it disappears into the slope */}
      <img src={darkestHill} alt="" className="absolute" style={pct(659, 957, 1438, 1103)} />

      {/* ============================ BRIDGE LANDSCAPE (y ≈ 1500..2400) ======== */}
      {/* Vector 74 — green hill behind the bridge */}
      <img src={vector74} alt="" className="absolute" style={pct(336, 1649, 1171, 441)} />

      {/* Light green mountain visible behind the bridge */}
      <img src={lightGreen} alt="" className="absolute" style={pct(-3, 1577, 1086, 516)} />

      {/* Bridge */}
      <img src={bridge} alt="" className="absolute z-[10]" style={pct(89, 1739, 1217, 454)} />

      {/* Bottom train animates right→left across the bridge deck.
          z=15 — above the bridge, BELOW cliffs so it appears to enter / exit
          behind the rocky cliffs. Width / height match Figma 362:716. */}
      <motion.div
        className="absolute z-[15] pointer-events-none"
        style={{
          top: `${(1670 / STAGE_H) * 100}%`,
          width: `${(559 / STAGE_W) * 100}%`,
          height: `${(82 / STAGE_H) * 100}%`,
        }}
        initial={{ x: "100vw" }}
        animate={{ x: "-50vw" }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, -3, 0, 2, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Train className="absolute inset-0" />
        </motion.div>
      </motion.div>

      {/* Cliffs (= brown rocky mountains) flanking the bridge — z=20 so they
          OVERLAY the bridge AND the train, clipping the train as it
          enters / exits. */}
      <img src={leftMountain}       alt="" className="absolute z-[20]" style={pct(0,    1660, 404, 599)} />
      <img src={leftSmallMountain}  alt="" className="absolute z-[20]" style={pct(213,  1879, 322, 362)} />
      <img src={rightMountain}      alt="" className="absolute z-[20]" style={pct(1001, 1532, 670, 740)} />
      <img src={rightSmallMountain} alt="" className="absolute z-[20]" style={pct(841,  1998, 220, 243)} />

      {/* River / water — Figma Vector 88 (left) + Vector 87 (right) below the bridge */}
      <img src={vector88} alt="" className="absolute z-[8]"  style={pct(-1, 2057, 647, 244)} />
      <img src={vector87} alt="" className="absolute z-[8]"  style={pct(683, 2113, 986, 177)} />

      {/* Group 83 — small flowers */}
      <img src={group83} alt="" className="absolute" style={pct(533, 2097, 309, 60)} />

      {/* ============================ BEACH HOUSE ============= */}
      {/* Figma had the beach house at y=3136, but Tracks now has extra
          bottom padding (28vw) so the visual gap between Tracks cards and
          Schedule has grown. Push the beach house down to sit centered in
          that new gap rather than overlapping the Tracks content. */}
      <img src={beachHouse} alt="" className="absolute" style={pct(-214, 3336, 718, 301)} />

      {/* ============================ LIGHTHOUSE CLIFF =============== */}
      {/* Pulled up from Figma's y=5436 so it hugs the FAQ content above
          rather than floating into the Sponsors section. */}
      <img src={lighthouseCliff} alt="" className="absolute" style={pct(1260, 5050, 428, 834)} />

      {/* Pulsing yellow halo behind the lighthouse — overlays the baked-in
          halo from the PNG with a radial-gradient circle that scales up
          and down to simulate a rotating beam. Centered on the halo's
          actual pixel position in the lighthouse PNG (PNG coords ~275,81
          in a 411×835 image, mapped to stage coords via the lighthouse's
          placement at pct(1260, 5050, 428, 834)). */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          ...pct(1446, 5031, 200, 200),
          background:
            "radial-gradient(circle, rgba(240,198,106,0.85) 0%, rgba(255,228,169,0.55) 40%, rgba(240,198,106,0) 70%)",
          mixBlendMode: "screen",
        }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ============================ GROUP 98 (left cliff) =============== */}
      {/* Pulled up to match the lighthouse on the right. */}
      <img src={group98} alt="" className="absolute" style={pct(-19, 5550, 261, 308)} />
    </div>
  );
};

export default MainStage;
