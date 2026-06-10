import React from "react";

// Train rendered as inline SVG. Per Figma node 210:160 + 198:2:
// short orange engine on the LEFT — same height as the carriages —
// followed by two red passenger cars with identical small gaps between
// every unit. Each carriage carries a strip of light-blue windows.
//
// Geometry (viewBox 600x80):
//   engine 60w  | gap 4 | carA 248w | gap 4 | carB 280w | (total 596)
//   all three units share the same y/height.

interface TrainProps {
  className?: string;
  style?: React.CSSProperties;
  flip?: boolean;
}

const ROOF = "#3b1418";
const RED = "#6e181c";
const ORANGE = "#e9842b";
const ORANGE_DARK = "#cf6815";
const WINDOW = "#b0caf6";
const FRAME = "#1a3a6c";

const BODY_TOP = 6;
const BODY_HEIGHT = 68;
const ROOF_HEIGHT = 10;
const WINDOW_TOP = 22;
const WINDOW_HEIGHT = 34;

const Train: React.FC<TrainProps> = ({ className, style, flip }) => (
  <div
    className={className}
    style={{ ...style, transform: flip ? "scaleX(-1)" : style?.transform }}
  >
    <svg
      viewBox="0 0 600 80"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
    >
      {/* Engine — orange, single window, SAME height as carriages */}
      <g>
        <rect x="0" y={BODY_TOP} width="60" height={BODY_HEIGHT} rx="2" fill={ORANGE} stroke={FRAME} strokeWidth="1.6" />
        <rect x="0" y={BODY_TOP} width="60" height={ROOF_HEIGHT} fill={ORANGE_DARK} />
        <rect x="14" y={WINDOW_TOP} width="34" height={WINDOW_HEIGHT} rx="1" fill={WINDOW} stroke={FRAME} strokeWidth="1.2" />
      </g>

      {/* Carriage A — 4 windows, gap of 4px after engine */}
      <g>
        <rect x="64" y={BODY_TOP} width="248" height={BODY_HEIGHT} rx="2" fill={RED} stroke={FRAME} strokeWidth="1.6" />
        <rect x="64" y={BODY_TOP} width="248" height={ROOF_HEIGHT} fill={ROOF} />
        {[80, 134, 188, 242].map((x, i) => (
          <rect key={`a-${i}`} x={x} y={WINDOW_TOP} width="50" height={WINDOW_HEIGHT} rx="1" fill={WINDOW} stroke={FRAME} strokeWidth="1.2" />
        ))}
      </g>

      {/* Carriage B — 4 windows, identical 4px gap */}
      <g>
        <rect x="316" y={BODY_TOP} width="280" height={BODY_HEIGHT} rx="2" fill={RED} stroke={FRAME} strokeWidth="1.6" />
        <rect x="316" y={BODY_TOP} width="280" height={ROOF_HEIGHT} fill={ROOF} />
        {[332, 392, 452, 512].map((x, i) => (
          <rect key={`b-${i}`} x={x} y={WINDOW_TOP} width="56" height={WINDOW_HEIGHT} rx="1" fill={WINDOW} stroke={FRAME} strokeWidth="1.2" />
        ))}
      </g>
    </svg>
  </div>
);

export default Train;
