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
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

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

import Train, { type TrainSegment } from "../components/Train";

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

const stageX = (x: number) => `${(x / STAGE_W) * 100}%`;
const stageY = (y: number) => `${(y / STAGE_H) * 100}%`;

type Point = { x: number; y: number };
type Cubic = { p0: Point; p1: Point; p2: Point; p3: Point };

// Vector 116 is the visible outer rail in the hero. Keeping its source
// Bezier data here makes the train rig sample the exact same curve that is
// painted behind it instead of approximating the curve with scroll stops.
const HERO_RAIL_X = 368;
const HERO_RAIL_Y = 897;
const HERO_RAIL_W = 1019;
const HERO_RAIL_H = 214;
const HERO_RAIL_VIEWBOX_W = 1024;
const HERO_RAIL_VIEWBOX_H = 218.698;
const HERO_RAIL_CUBICS: Cubic[] = [
  {
    p0: { x: 1021.5, y: 216.197 },
    p1: { x: 1021.5, y: 216.197 },
    p2: { x: 919.089, y: 149.566 },
    p3: { x: 846.5, y: 122.197 },
  },
  {
    p0: { x: 846.5, y: 122.197 },
    p1: { x: 797.385, y: 103.679 },
    p2: { x: 768.171, y: 97.8943 },
    p3: { x: 717, y: 86.1975 },
  },
  {
    p0: { x: 717, y: 86.1975 },
    p1: { x: 665.361, y: 74.3936 },
    p2: { x: 635.805, y: 70.5723 },
    p3: { x: 583.5, y: 62.1975 },
  },
  {
    p0: { x: 583.5, y: 62.1975 },
    p1: { x: 484.039, y: 46.272 },
    p2: { x: 327.5, y: 30.6975 },
    p3: { x: 327.5, y: 30.6975 },
  },
  {
    p0: { x: 327.5, y: 30.6975 },
    p1: { x: 327.5, y: 30.6975 },
    p2: { x: 249.182, y: 21.8601 },
    p3: { x: 199, y: 16.1975 },
  },
  {
    p0: { x: 199, y: 16.1975 },
    p1: { x: 148.818, y: 10.5349 },
    p2: { x: 109.633, y: 4.02242 },
    p3: { x: 52, y: 2.69746 },
  },
  {
    p0: { x: 52, y: 2.69746 },
    p1: { x: 32.6742, y: 2.25317 },
    p2: { x: 2.50001, y: 2.69746 },
    p3: { x: 2.50001, y: 2.69746 },
  },
];

const cubicAt = (a: number, b: number, c: number, d: number, t: number) => {
  const inverse = 1 - t;
  return inverse ** 3 * a
    + 3 * inverse ** 2 * t * b
    + 3 * inverse * t ** 2 * c
    + t ** 3 * d;
};

const railYAtStageX = (stagePositionX: number) => {
  const lastSegment = HERO_RAIL_CUBICS[HERO_RAIL_CUBICS.length - 1];
  const localX = Math.min(
    HERO_RAIL_CUBICS[0].p0.x,
    Math.max(
      lastSegment.p3.x,
      (stagePositionX - HERO_RAIL_X) * (HERO_RAIL_VIEWBOX_W / HERO_RAIL_W),
    ),
  );
  const segment = HERO_RAIL_CUBICS.find(
    ({ p0, p3 }) => localX <= p0.x && localX >= p3.x,
  ) ?? lastSegment;

  // Every source segment runs right-to-left, so binary-searching its x
  // coordinate gives a stable parametric sample without a path API or DOM
  // measurement in the scroll loop.
  let low = 0;
  let high = 1;
  for (let index = 0; index < 18; index += 1) {
    const middle = (low + high) / 2;
    const middleX = cubicAt(
      segment.p0.x,
      segment.p1.x,
      segment.p2.x,
      segment.p3.x,
      middle,
    );
    if (middleX > localX) low = middle;
    else high = middle;
  }

  const t = (low + high) / 2;
  const localY = cubicAt(
    segment.p0.y,
    segment.p1.y,
    segment.p2.y,
    segment.p3.y,
    t,
  );
  return HERO_RAIL_Y + localY * (HERO_RAIL_H / HERO_RAIL_VIEWBOX_H);
};

type TrainRigSpec = {
  leftWheelX: number;
  rightWheelX: number;
  pivotX: number;
};

type TrainPose = { angle: number; top: number };

const TRAIN_WIDTH = 539;
const TRAIN_VIEWBOX_W = 600;
const TRAIN_VIEWBOX_H = 96;
const TRAIN_PIVOT_Y = 72;
const TRAIN_WHEEL_CONTACT_Y = 89;
const TRAIN_SCALE = TRAIN_WIDTH / TRAIN_VIEWBOX_W;

// X coordinates are in the displayed (mirrored) train coordinate system.
// Each rigid body gets its own axle pair and locomotive-side pivot.
const TRAIN_RIG: Record<TrainSegment, TrainRigSpec> = {
  "rear-car": {
    leftWheelX: 32,
    rightWheelX: 250,
    pivotX: 276,
  },
  "front-car": {
    leftWheelX: 310,
    rightWheelX: 498,
    pivotX: 518,
  },
  engine: {
    leftWheelX: 543,
    rightWheelX: 578,
    pivotX: 528,
  },
};

const trainPoseAt = (trainLeft: number, rig: TrainRigSpec): TrainPose => {
  const pivotStageX = trainLeft + rig.pivotX * TRAIN_SCALE;
  const contactY = (TRAIN_WHEEL_CONTACT_Y - TRAIN_PIVOT_Y) * TRAIN_SCALE;
  const leftWheelX = (rig.leftWheelX - rig.pivotX) * TRAIN_SCALE;
  const rightWheelX = (rig.rightWheelX - rig.pivotX) * TRAIN_SCALE;
  let radians = 0;

  // Rotating the axle offsets also changes their sampled x positions. A
  // handful of fixed-point passes converges the chassis chord onto the rail.
  for (let index = 0; index < 5; index += 1) {
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const leftStageX = pivotStageX + cosine * leftWheelX - sine * contactY;
    const rightStageX = pivotStageX + cosine * rightWheelX - sine * contactY;
    radians = Math.atan2(
      railYAtStageX(rightStageX) - railYAtStageX(leftStageX),
      rightStageX - leftStageX,
    );
  }

  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const leftStageX = pivotStageX + cosine * leftWheelX - sine * contactY;
  const leftRailY = railYAtStageX(leftStageX);
  const rotatedLeftContactY = sine * leftWheelX + cosine * contactY;

  return {
    angle: radians * (180 / Math.PI),
    top: leftRailY - TRAIN_PIVOT_Y * TRAIN_SCALE - rotatedLeftContactY,
  };
};

const MainStage: React.FC = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
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
  // Smooth wheel/track travel so high-resolution trackpads do not expose
  // individual scroll deltas. Every waypoint is expressed in the Figma
  // stage coordinate system; unlike pixel translate values, these scale at
  // exactly the same rate as the rails at every viewport width.
  const smoothHeroProgress = useSpring(heroProgress, {
    stiffness: 145,
    damping: 30,
    mass: 0.28,
    restDelta: 0.0005,
  });
  const trainStops = [0, 0.16, 0.32, 0.48, 1];
  const trainLeftStage = useTransform(
    smoothHeroProgress,
    trainStops,
    [390, 510, 690, 890, 890],
  );
  const trainLeft = useTransform(trainLeftStage, stageX);
  const rearCarPose = useTransform(trainLeftStage, (left) =>
    trainPoseAt(left, TRAIN_RIG["rear-car"]));
  const rearCarTop = useTransform(rearCarPose, ({ top }) => stageY(top));
  const rearCarRotate = useTransform(rearCarPose, ({ angle }) => angle);
  const frontCarPose = useTransform(trainLeftStage, (left) =>
    trainPoseAt(left, TRAIN_RIG["front-car"]));
  const frontCarTop = useTransform(frontCarPose, ({ top }) => stageY(top));
  const frontCarRotate = useTransform(frontCarPose, ({ angle }) => angle);
  const enginePose = useTransform(trainLeftStage, (left) =>
    trainPoseAt(left, TRAIN_RIG.engine));
  const engineTop = useTransform(enginePose, ({ top }) => stageY(top));
  const engineRotate = useTransform(enginePose, ({ angle }) => angle);
  const trainOpacity = useTransform(
    smoothHeroProgress,
    [0, 0.45, 0.52, 1],
    [1, 1, 0, 0],
  );
  const wheelRotation = useTransform(
    smoothHeroProgress,
    [0, 0.48, 1],
    [0, -3000, -3000],
  );

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
      <img data-hero-rail src={vector116} alt="" className="absolute drop-shadow-[0_1px_0_rgba(255,255,255,0.18)]" style={pct(368, 897, 1019, 214)} />
      <img data-hero-rail src={vector117} alt="" className="absolute drop-shadow-[0_1px_0_rgba(255,255,255,0.18)]" style={pct(490, 893, 917, 211)} />

      {/* Top hill train — three independently rigged rigid bodies. Every
          axle pair is seated on Vector 116, so the consist bends with the
          painted rail instead of rotating as one long plank. */}
      <motion.div
        data-hero-train-unit="rear-car"
        className="absolute will-change-transform"
        style={{
          left: trainLeft,
          top: rearCarTop,
          width: stageX(TRAIN_WIDTH),
          aspectRatio: `${TRAIN_VIEWBOX_W} / ${TRAIN_VIEWBOX_H}`,
          rotate: rearCarRotate,
          opacity: trainOpacity,
          transformOrigin: `${(TRAIN_RIG["rear-car"].pivotX / TRAIN_VIEWBOX_W) * 100}% ${(TRAIN_PIVOT_Y / TRAIN_VIEWBOX_H) * 100}%`,
        }}
      >
        <Train className="absolute inset-0" flip wheelRotation={wheelRotation} visibleSegment="rear-car" />
      </motion.div>
      <motion.div
        data-hero-train-unit="front-car"
        className="absolute will-change-transform"
        style={{
          left: trainLeft,
          top: frontCarTop,
          width: stageX(TRAIN_WIDTH),
          aspectRatio: `${TRAIN_VIEWBOX_W} / ${TRAIN_VIEWBOX_H}`,
          rotate: frontCarRotate,
          opacity: trainOpacity,
          transformOrigin: `${(TRAIN_RIG["front-car"].pivotX / TRAIN_VIEWBOX_W) * 100}% ${(TRAIN_PIVOT_Y / TRAIN_VIEWBOX_H) * 100}%`,
        }}
      >
        <Train className="absolute inset-0" flip wheelRotation={wheelRotation} visibleSegment="front-car" />
      </motion.div>
      <motion.div
        data-hero-train-unit="engine"
        className="absolute will-change-transform"
        style={{
          left: trainLeft,
          top: engineTop,
          width: stageX(TRAIN_WIDTH),
          aspectRatio: `${TRAIN_VIEWBOX_W} / ${TRAIN_VIEWBOX_H}`,
          rotate: engineRotate,
          opacity: trainOpacity,
          transformOrigin: `${(TRAIN_RIG.engine.pivotX / TRAIN_VIEWBOX_W) * 100}% ${(TRAIN_PIVOT_Y / TRAIN_VIEWBOX_H) * 100}%`,
        }}
      >
        <Train className="absolute inset-0" flip wheelRotation={wheelRotation} visibleSegment="engine" />
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
          aspectRatio: "600 / 96",
        }}
        initial={{ x: reduceMotion ? "26vw" : "100vw" }}
        animate={{ x: reduceMotion ? "26vw" : "-50vw" }}
        transition={reduceMotion
          ? { duration: 0 }
          : { duration: 26, repeat: Infinity, ease: "linear" }}
      >
        <div className="bridge-train-suspension absolute inset-0">
          <Train
            className="absolute inset-0"
            wheelSpinDuration={reduceMotion ? undefined : 0.6}
          />
        </div>
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
