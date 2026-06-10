// Hero — text overlay only. The illustrated landscape (clouds, mountains,
// hills, bridge, train, cliffs, water) is rendered by MainStage as a single
// 1670×7310 ghost canvas at App root, so this component only contains the
// hero text + about text positioned at their absolute Figma Y coords.

import { STAGE_W, STAGE_H } from "./MainStage";

const pct = (x: number, y: number, w: number, h: number) => ({
  left: `${(x / STAGE_W) * 100}%`,
  top: `${(y / STAGE_H) * 100}%`,
  width: `${(w / STAGE_W) * 100}%`,
  height: `${(h / STAGE_H) * 100}%`,
});

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-full"
      style={{ aspectRatio: `${STAGE_W} / 2392` }}
    >
      {/* Hero title text — Figma 362:25 (762, 401, 742, 357), reframed
          relative to this section's 0..2392 viewport */}
      <div
        className="absolute font-spartan font-extrabold text-red1 leading-[1.05] tracking-[-0.02em]"
        style={{
          left: `${(762 / STAGE_W) * 100}%`,
          top: `${(401 / 2392) * 100}%`,
          width: `${(742 / STAGE_W) * 100}%`,
          height: `${(357 / 2392) * 100}%`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <h1 className="text-[6.3vw] md:text-[6.3vw]">
          BIGRED//<br />HACKS 2026
        </h1>
        <p className="text-[4.8vw] md:text-[4.8vw] mt-[1vw]">10.03 - 10.05</p>
      </div>

      {/* ABOUT text — Figma node 362:772 (103, 1115, 784, 413).
          id="about" is the navbar's About link target; scroll-margin-top
          leaves clearance for the fixed navbar so the heading isn't
          hidden behind it after navigation. */}
      <div
        id="about"
        className="absolute z-[5] text-white1 scroll-mt-24 md:scroll-mt-32"
        style={{
          left: `${(103 / STAGE_W) * 100}%`,
          top: `${(1115 / 2392) * 100}%`,
          width: `${(784 / STAGE_W) * 100}%`,
        }}
      >
        <h2 className="font-spartan font-extrabold text-[4.3vw] tracking-tight mb-[1.5vw]">ABOUT</h2>
        <div className="font-bevietnam font-light leading-snug space-y-[1vw] text-[1.5vw]">
          <p>BigRed//Hacks is Cornell University's tight-knit, student-run hackathon organization, attracting hundreds of students from around the globe.</p>
          <p>Since our inception in 2014, we've been on a mission to foster technological innovation by creating an inclusive and collaborative environment.</p>
          <p>We are committed to lowering the barriers to entry into technology, ensuring that all participants, regardless of background, have access to the resources they need.</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
// re-export pct helper if needed elsewhere
export { pct };
