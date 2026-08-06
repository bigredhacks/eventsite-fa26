import React, { useId } from "react";
import { motion, type MotionValue } from "framer-motion";

// Train rendered as inline SVG. Per Figma node 210:160 + 198:2:
// short orange engine on the LEFT — same height as the carriages —
// followed by two red passenger cars with identical small gaps between
// every unit. Each carriage carries a strip of light-blue windows.
//
// Geometry (viewBox 600x96). Each unit owns its body, undercarriage, and
// wheels so it can rotate independently around the coupling nearest the
// locomotive. That articulation lets the consist follow a curved rail.

type AngleValue = number | MotionValue<number>;

export interface TrainArticulation {
  engine?: AngleValue;
  frontCar?: AngleValue;
  rearCar?: AngleValue;
}

export type TrainSegment = "engine" | "front-car" | "rear-car";

interface TrainProps {
  className?: string;
  style?: React.CSSProperties;
  flip?: boolean;
  wheelRotation?: MotionValue<number>;
  wheelSpinDuration?: number;
  articulation?: TrainArticulation;
  visibleSegment?: TrainSegment;
}

const ROOF = "#3b1418";
const RED = "#6e181c";
const ORANGE = "#e9842b";
const ORANGE_DARK = "#cf6815";
const WINDOW = "#b0caf6";
const FRAME = "#1a3a6c";
const INK = "#2b2430";
const METAL = "#4f5a65";

const Train: React.FC<TrainProps> = ({
  className,
  style,
  flip,
  wheelRotation,
  wheelSpinDuration,
  articulation,
  visibleSegment,
}) => {
  const id = useId().replace(/:/g, "");
  const redGradient = `${id}-red`;
  const orangeGradient = `${id}-orange`;
  const windowGradient = `${id}-window`;
  const shadow = `${id}-shadow`;
  const showEngine = !visibleSegment || visibleSegment === "engine";
  const showFrontCar = !visibleSegment || visibleSegment === "front-car";
  const showRearCar = !visibleSegment || visibleSegment === "rear-car";

  const wheel = (cx: number) => (
    <motion.g
      key={cx}
      style={wheelRotation ? {
        rotate: wheelRotation,
        transformBox: "fill-box",
        transformOrigin: "center",
      } : undefined}
      animate={!wheelRotation && wheelSpinDuration
        ? { rotate: -360 }
        : undefined}
      transition={!wheelRotation && wheelSpinDuration
        ? { duration: wheelSpinDuration, repeat: Infinity, ease: "linear" }
        : undefined}
    >
      <circle cx={cx} cy="79" r="10" fill={INK} />
      <circle cx={cx} cy="79" r="6.2" fill="#596571" stroke="#222b35" strokeWidth="1.2" />
      <path d={`M${cx - 5} 79H${cx + 5}M${cx} 74V84`} stroke="#c5d1d8" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx={cx} cy="79" r="1.8" fill="#dbe5ea" />
    </motion.g>
  );

  const articulatedStyle = (
    angle: AngleValue | undefined,
    originX: number,
  ) => angle === undefined ? undefined : {
    rotate: angle,
    transformBox: "view-box" as const,
    originX: originX / 600,
    originY: 72 / 96,
  };

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: flip ? "scaleX(-1)" : style?.transform,
        transformOrigin: "center",
      }}
    >
      <svg
        viewBox="0 0 600 96"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={redGradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8d2c30" />
            <stop offset="0.55" stopColor={RED} />
            <stop offset="1" stopColor="#541217" />
          </linearGradient>
          <linearGradient id={orangeGradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6a451" />
            <stop offset="1" stopColor={ORANGE} />
          </linearGradient>
          <linearGradient id={windowGradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e8f2ff" />
            <stop offset="0.38" stopColor={WINDOW} />
            <stop offset="1" stopColor="#83a9dd" />
          </linearGradient>
          <filter id={shadow} x="-10%" y="-30%" width="120%" height="170%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#172637" floodOpacity="0.34" />
          </filter>
        </defs>

        {/* A soft contact shadow visually seats the articulated consist. */}
        {!visibleSegment && (
          <ellipse cx="300" cy="88" rx="282" ry="5" fill="#172637" opacity="0.22" />
        )}

        {/* Flexible couplers remain behind the cars as their hinge angles move. */}
        {(!visibleSegment || visibleSegment === "front-car") && (
          <g>
            <path d="M68 67L86 67M310 67L328 67" stroke={METAL} strokeWidth="5" strokeLinecap="round" />
            <circle cx="77" cy="67" r="3.4" fill={INK} />
            <circle cx="319" cy="67" r="3.4" fill={INK} />
          </g>
        )}

        {/* Locomotive: pivots at its rear coupling (x=72). */}
        {showEngine && <motion.g
          data-train-segment="engine"
          style={articulatedStyle(articulation?.engine, 72)}
        >
          <g filter={`url(#${shadow})`}>
            <path
              d="M4 14Q4 8 10 8H66Q72 8 72 14V72H4Z"
              fill={`url(#${orangeGradient})`}
              stroke={INK}
              strokeWidth="2.2"
            />
            <path d="M4 14Q4 8 10 8H66Q72 8 72 14V20H4Z" fill={ORANGE_DARK} />
            <rect x="17" y="28" width="38" height="28" rx="2" fill={`url(#${windowGradient})`} stroke={FRAME} strokeWidth="1.8" />
            <path d="M20 31H52L45 36H20Z" fill="white" opacity="0.35" />
            <rect x="58" y="45" width="8" height="18" rx="1.5" fill="#b85016" opacity="0.8" />
            <path d="M9 72H68" stroke={INK} strokeWidth="7" strokeLinecap="round" />
            <path d="M12 70H66" stroke={METAL} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          </g>
          {wheel(22)}
          {wheel(57)}
        </motion.g>}

        {/* Front passenger car: pivots at the locomotive-side coupling. */}
        {showFrontCar && <motion.g
          data-train-segment="front-car"
          style={articulatedStyle(articulation?.frontCar, 82)}
        >
          <g filter={`url(#${shadow})`}>
            <rect x="82" y="8" width="232" height="64" rx="4" fill={`url(#${redGradient})`} stroke={INK} strokeWidth="2.2" />
            <path d="M86 8H310Q314 8 314 12V18H82V12Q82 8 86 8Z" fill={ROOF} />
            {[96, 148, 200, 252].map((x, index) => (
              <g key={`a-${index}`}>
                <rect x={x} y="27" width="42" height="27" rx="2" fill={`url(#${windowGradient})`} stroke={FRAME} strokeWidth="1.7" />
                <path d={`M${x + 3} 30H${x + 38}L${x + 31} 34H${x + 3}Z`} fill="white" opacity="0.28" />
              </g>
            ))}
            <path d="M84 62H312" stroke="#c65a5e" strokeWidth="2" opacity="0.58" />
            <path d="M87 72H309" stroke={INK} strokeWidth="7" strokeLinecap="round" />
            <path d="M90 70H306" stroke={METAL} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          </g>
          {wheel(102)}
          {wheel(290)}
        </motion.g>}

        {/* Rear passenger car: its larger hinge correction follows the
            shallower tangent at the back of the curved track. */}
        {showRearCar && <motion.g
          data-train-segment="rear-car"
          style={articulatedStyle(articulation?.rearCar, 324)}
        >
          <g filter={`url(#${shadow})`}>
            <rect x="324" y="8" width="272" height="64" rx="4" fill={`url(#${redGradient})`} stroke={INK} strokeWidth="2.2" />
            <path d="M328 8H592Q596 8 596 12V18H324V12Q324 8 328 8Z" fill={ROOF} />
            {[340, 400, 460, 520].map((x, index) => (
              <g key={`b-${index}`}>
                <rect x={x} y="27" width="48" height="27" rx="2" fill={`url(#${windowGradient})`} stroke={FRAME} strokeWidth="1.7" />
                <path d={`M${x + 3} 30H${x + 44}L${x + 36} 34H${x + 3}Z`} fill="white" opacity="0.28" />
              </g>
            ))}
            <path d="M326 62H594" stroke="#c65a5e" strokeWidth="2" opacity="0.58" />
            <path d="M329 72H590" stroke={INK} strokeWidth="7" strokeLinecap="round" />
            <path d="M332 70H587" stroke={METAL} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          </g>
          {wheel(350)}
          {wheel(568)}
        </motion.g>}
      </svg>
    </div>
  );
};

export default Train;
