import { SectionProps } from "./SectionProps";
import SponsorBoatV2 from "../components/SponsorBoatV2";
import Waves from "../components/Waves";

// Per Figma node 362:262 — sponsors are still in drafts. Three boats are
// laid out on a 1565 × 696 frame: title at top-left, mastra (yellow)
// upper-right, arriving (green) + soon (blue) clustered along the
// horizontal middle of the lower half. We place each boat as a percentage
// of an inner aspect-locked layout box so the proportions match Figma 1:1
// regardless of viewport width.
//
// Figma coords (Frame 45 = the boats container, 1565 × 543, sits below the
// 153px title block). Boat positions are relative to Frame 45's top-left:
//   mastra:   x=1372, y=0,   w=268, h=212
//   arriving: x=454,  y=263, w=420, h=280
//   soon:     x=482,  y=271, w=357, h=264

const BOX_W = 1565;
const BOX_H = 743;

const pct = (x: number, y: number, w: number) => ({
  left: `${(x / BOX_W) * 100}%`,
  top: `${(y / BOX_H) * 100}%`,
  width: `${(w / BOX_W) * 100}%`,
});

const Sponsors: React.FC<SectionProps> = ({ className }) => {
  return (
    <section
      id="sponsors"
      className={`
        relative
        bg-transparent
        md:px-32 px-8
        md:pt-8 pt-10
        md:pb-0 pb-24
        ${className ?? ""}`}
    >
      <h2 className="font-spartan font-extrabold text-white1 text-5xl md:text-7xl tracking-tight relative z-20">
        OUR SPONSORS
      </h2>

      {/* Aspect-locked layout box that mirrors the Figma 1565×696 frame.
          Boats are absolutely positioned by percentage of this box so the
          spacing matches Figma exactly. */}
      <div
        className="relative w-full mt-4 z-20"
        style={{ aspectRatio: `${BOX_W} / ${BOX_H}` }}
      >
        {/* Mastra-style yellow accent boat — upper right */}
        <div className="absolute" style={pct(1372, 0, 268)}>
          <SponsorBoatV2 variant="mastra" index={2} fill />
        </div>

        {/* Arriving (green) — lower middle, sits just left of Soon with a
            ~28px gap between them. Frame x=31 puts its right edge at
            x=454, leaving a 28-unit gap to Soon's left edge at x=482. */}
        <div className="absolute" style={pct(31, 263, 420)}>
          <SponsorBoatV2 variant="arriving" index={0} fill />
        </div>

        {/* Soon (blue) — lower middle, just right of Arriving */}
        <div className="absolute" style={pct(482, 271, 357)}>
          <SponsorBoatV2 variant="soon" index={1} fill />
        </div>
      </div>

      {/* Animated waves at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 z-10">
        <Waves className="absolute inset-0" />
      </div>
    </section>
  );
};

export default Sponsors;
