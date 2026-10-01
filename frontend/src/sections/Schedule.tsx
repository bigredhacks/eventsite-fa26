import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { SectionProps } from "./SectionProps";
import boatThumb from "@/assets/fa26_thumb_boat.png";

// Each row of the grid covers exactly one hour starting at 9 AM.
// startHour / durationHours are expressed in hours from the top of the grid
// (so 9 AM = 0, 10 AM = 1, etc).

type Block = {
  label: string;
  time: string;
  startHour: number;
  durationHours: number;
  shade?: "light" | "medium" | "dark";
  // Optional column override (for overlapping blocks like Career Fair).
  // Values: "full" (default), "left", "right".
  side?: "full" | "left" | "right";
  // True when this is a single-moment "marker" event (e.g. Projects
  // Due 9:00) rather than a span. Markers render as a slim chip and
  // don't push the next event downward, so a 9:00 marker won't shift a
  // 9:15 long event into the 10AM row.
  marker?: boolean;
  // Where the event happens. Omit for online-only items (e.g. deadlines).
  location?: string;
};

type Day = {
  date: string;
  blocks: Block[];
};

const HOURS = [
  "9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM",
  "6PM","7PM","8PM","9PM","10PM","11PM",
];

const DAYS: Day[] = [
  {
    date: "10/2",
    blocks: [
      { label: "Check-In",         time: "18:00",       startHour: 9,  durationHours: 1, shade: "medium", location: "Klarman Atrium" },
      { label: "Opening Ceremony", time: "19:00",       startHour: 10,    durationHours: 0.75, shade: "light", location: "Goldwin Smith GSH132" },
      { label: "Team Matching",    time: "19:45",       startHour: 10.75,   durationHours: 0.25, shade: "medium", side: "right", location: "Klarman Atrium" },
      { label: "Dinner",           time: "20:00",       startHour: 11,  durationHours: 0.5, shade: "medium", side: "left", location: "Klarman Atrium" },
      { label: "Figma Workshop",   time: "20:30-21:20", startHour: 11.5, durationHours: 50 / 60, shade: "light", location: "Goldwin Smith GSH132" },
      { label: "SpaceX Workshop",  time: "21:30-22:20", startHour: 12.5, durationHours: 50 / 60, shade: "light", location: "Goldwin Smith GSH132" },
      { label: "Team Registration Due", time: "23:59", startHour: 14, durationHours: 0.5, shade: "dark", marker: true}
    ],
  },
  {
    date: "10/3",
    blocks: [
      { label: "Breakfast",   time: "9:00",        startHour: 0,    durationHours: 0.5, shade: "medium", marker: true, location: "PSB Main Floor/Clark Atrium" },
      { label: "Raffle Draw!", time: "10:30", startHour: 1.5, durationHours: 0.5, shade: "dark", marker: true, location: "PSB Main Floor/Clark Atrium" },
      // Workshops + Career Fair overlap; render them side-by-side.
      { label: "Workshops",   time: "11:30-17:30", startHour: 2.5,  durationHours: 6, shade: "light",  side: "left", location: "PSB 120" },
      { label: "Career Fair + Lunch", time: "12:00-14:00", startHour: 3,    durationHours: 2,   shade: "medium", side: "right", location: "PSB Main Floor/Clark Atrium" },
      { label: "Dinner",      time: "18:00",       startHour: 9,  durationHours: 0.5, shade: "light", location: "PSB Main Floor/Clark Atrium" },
      { label: "Ice Cream Drop", time: "20:00", startHour: 11, durationHours: 0.5, shade: "medium", marker: true, location: "PSB Main Floor/Clark Atrium" },
      { label: "Cup Stacking Competition", time: "21:30", startHour: 12.5, durationHours: 0.5, shade: "medium", marker: true, location: "PSB Main Floor/Clark Atrium" },
      { label: "Spicy Ramen Competition", time: "23:30", startHour: 14.5, durationHours: 0.5, shade: "medium", marker: true, location: "PSB Main Floor/Clark Atrium" },
    ],
  },
  {
    date: "10/4",
    blocks: [
      { label: "Projects Due",            time: "8:30",       startHour: 0,    durationHours: 0.5, shade: "dark",  marker: true },
      { label: "Judging",                 time: "9:00-10:30", startHour: 0, durationHours: 1.5, shade: "medium", location: "PSB Main Floor/Clark Atrium" },
      { label: "Lunch", time: "10:30", startHour: 1.5, durationHours: 0.5, shade: "light", marker: true, location: "PSB Main Floor/Clark Atrium" },
      { label: "Finalist Demos",           time: "11:30-12:30", startHour: 2.5, durationHours: 1, shade: "light", location: "Baker 200" },
      { label: "Awards + Closing Ceremony", time: "13:00-14:00",    startHour: 4,    durationHours: 1,   shade: "medium", location: "Baker 200" },
      { label: "Hackathon Ends!", time: "14:00", startHour: 5, durationHours: 0.5, shade: "dark", marker: true },
    ],
  },
];

const ROW_HEIGHT_PX = 72;
// Minimum vertical space for normal event blocks (regardless of duration)
// so titles + times have breathing room. The grid layout intentionally
// loses minute-accuracy in favor of readability.
const MIN_BLOCK_HEIGHT_PX = 45;
// Minimum height for marker events (single-moment markers like
// "Projects Due 9:00"). Smaller than MIN_BLOCK_HEIGHT_PX so a 9:00
// marker doesn't visually claim the entire 9–10AM row and confuse
// readers about when the next event actually starts.
const MIN_MARKER_HEIGHT_PX = 36;
const BLOCK_INSET_PX = 4; 

const LocationLine: React.FC<{ location?: string }> = ({ location }) =>
  location ? (
    <p className="flex items-start gap-1 font-bevietnam text-xs text-white1/85 leading-tight">
      <FaMapMarkerAlt aria-hidden className="shrink-0 text-[10px] mt-0.5" />
      <span>{location}</span>
    </p>
  ) : null;

const shadeBg = (s: Block["shade"]) =>
  s === "dark" ? "bg-green7" : s === "medium" ? "bg-green3" : "bg-green2";

const blockSideStyle = (side?: Block["side"]) => {
  switch (side) {
    case "left":
      return "left-2 right-1/2 mr-1";
    case "right":
      return "left-1/2 right-2 ml-1";
    default:
      return "left-2 right-2";
  }
};

const Schedule: React.FC<SectionProps> = ({ className }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  // Track scroll progress through this section. Boats translate vertically
  // proportional to how far the section has been scrolled into view so they
  // appear to "sail" past the schedule grid.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Left boat sails UP (top moves from bottom toward top) as the user scrolls.
  // Right boat sails DOWN (top moves from top toward bottom).
  const leftBoatY = useTransform(scrollYProgress, [0, 1], ["80%", "5%"]);
  const rightBoatY = useTransform(scrollYProgress, [0, 1], ["5%", "80%"]);

  // Rendered height (content + padding) of each desktop block, keyed by
  // `${date}-${index}`. Titles and locations wrap differently depending on
  // column width, so blocks grow to fit their content instead of relying on
  // fixed minimums that would clip text at narrower widths.
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [contentHeights, setContentHeights] = useState<Record<string, number>>({});
  useLayoutEffect(() => {
    const measure = () => {
      const next: Record<string, number> = {};
      for (const [key, el] of Object.entries(blockRefs.current)) {
        const block = el?.parentElement;
        if (!el || !block) continue;
        const style = getComputedStyle(block);
        next[key] =
          el.offsetHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      }
      setContentHeights((prev) =>
        Object.keys(next).every((k) => prev[k] === next[k]) ? prev : next,
      );
    };
    measure();
    // Content height only depends on block width, so this can't loop.
    const observer = new ResizeObserver(measure);
    Object.values(blockRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="schedule"
      className={`
        relative
        flex flex-col items-center
        bg-transparent
        md:px-12 px-4
        md:py-20 py-12
         ${className ?? ""}`}
    >
      {/* Left boat — sails UP as you scroll. Bow faces upward so it
          points the way it's traveling. */}
      <motion.img
        src={boatThumb}
        alt=""
        aria-hidden
        className="hidden md:block absolute left-3 lg:left-8 w-16 lg:w-20 pointer-events-none select-none z-10"
        style={{ top: leftBoatY, rotate: 0 }}
      />
      {/* Right boat — sails DOWN as you scroll. Rotated 180° so its
          bow points downward in the direction of travel. */}
      <motion.img
        src={boatThumb}
        alt=""
        aria-hidden
        className="hidden md:block absolute right-3 lg:right-8 w-16 lg:w-20 pointer-events-none select-none z-10"
        style={{ top: rightBoatY, rotate: 180 }}
      />

      <div className="relative z-20 mb-10 flex w-full max-w-2xl items-center xl:max-w-[80%]">
        <h2 className="shrink-0 font-spartan font-extrabold text-white1 text-[clamp(2rem,11vw,3rem)] md:text-7xl tracking-tight">
          SCHEDULE
        </h2>
      </div>

      {/* On phones, tablets, and compact laptops, each day becomes its own
          agenda card. A four-column timeline does not leave enough width for
          readable overlapping events until the wide-desktop breakpoint. */}
      <div className="xl:hidden relative z-20 w-full max-w-2xl space-y-4">
        {DAYS.map((day) => (
          <article
            key={day.date}
            className="overflow-hidden rounded-[24px] bg-green6 shadow-[2px_4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <header className="border-b border-white1/15 px-5 py-4">
              <h3 className="font-spartan text-3xl font-extrabold text-white1">
                {day.date}
              </h3>
            </header>

            <div className="space-y-2 p-3">
              {day.blocks.map((block, blockIndex) => (
                <div
                  key={`${block.label}-${blockIndex}`}
                  className={`
                    ${shadeBg(block.shade)}
                    flex min-h-16 w-full items-center justify-between gap-4
                    rounded-2xl px-4 py-3 text-left text-white1
                  `}
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="font-bevietnam text-base font-bold leading-tight sm:text-lg">
                      {block.label}
                    </span>
                    <LocationLine location={block.location} />
                  </div>
                  <span className="shrink-0 rounded-full bg-green7/35 px-3 py-1.5 font-bevietnam text-xs font-bold leading-none sm:text-sm">
                    {block.time}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden xl:block bg-green6 rounded-[28px] shadow-[2px_4px_4px_0_rgba(0,0,0,0.25)] p-8 overflow-x-auto relative z-20 w-full max-w-[80%]">
        {/* Date header */}
        <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-x-4 mb-4 font-spartan font-extrabold text-white1 text-2xl md:text-4xl text-center">
          <div />
          {DAYS.map((d) => (
            <div key={d.date}>{d.date}</div>
          ))}
        </div>

        {/* Grid body */}
        <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-x-4">
          {/* Time column */}
          <div className="font-bevietnam text-white1/90 text-sm md:text-base text-right">
            {HOURS.map((h) => (
              <div
                key={h}
                style={{ height: `${ROW_HEIGHT_PX}px` }}
                className="flex items-start justify-end pr-1"
              >
                {h}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map((day) => {
            // Pre-compute each block's actual top px. We start with the
            // duration-accurate top (startHour * ROW_HEIGHT_PX) but clamp
            // it forward so each block sits below the previous block's
            // bottom — this preserves min-block-height without letting
            // short back-to-back events overlap. Left and right blocks
            // don't push each other down (so they can sit side-by-side),
            // but both clear any full-width block above them, and a
            // full-width block clears everything above it.
            type Laid = { b: Block; topPx: number; heightPx: number };
            const lastBottomBySide: Record<string, number> = {};
            const laid: Laid[] = day.blocks.map((b, i) => {
              const sideKey = b.side ?? "full";
              const naturalTop = b.startHour * ROW_HEIGHT_PX;
              const minTop = sideKey !== "full"
                ? Math.max(lastBottomBySide[sideKey] ?? 0, lastBottomBySide.full ?? 0)
                : Math.max(0, ...Object.values(lastBottomBySide));
              const topPx = Math.max(naturalTop, minTop);
              // Markers use a smaller min-height so a single-moment event
              // doesn't claim the full hour row; non-markers expand to the
              // standard MIN_BLOCK_HEIGHT_PX for readability. Either way a
              // block grows to fit its measured content (wrapped titles,
              // location lines) so nothing is clipped.
              const minH = b.marker
                ? MIN_MARKER_HEIGHT_PX
                : MIN_BLOCK_HEIGHT_PX;
              // The slot reserves room for the block plus BLOCK_INSET_PX of
              // breathing space below it, so it must fit the measured content.
              const slotHeightPx = Math.max(
                b.durationHours * ROW_HEIGHT_PX,
                minH,
                (contentHeights[`${day.date}-${i}`] ?? 0) + BLOCK_INSET_PX,
              );
              const heightPx = slotHeightPx - BLOCK_INSET_PX;
              // Markers DO push the next event down — by their own
              // (smaller) marker height — so a 9:00 marker chip doesn't
              // visually collide with a 9:15 long event. They just don't
              // claim a full hour of vertical space the way a normal
              // event would.
              lastBottomBySide[sideKey] = topPx + slotHeightPx;
              return { b, topPx, heightPx };
            });
            // Column needs to grow to fit the last block's bottom if our
            // min-height pushes anything past the natural 15-hour grid.
            const columnHeight = Math.max(
              HOURS.length * ROW_HEIGHT_PX,
              ...laid.map((l) => l.topPx + l.heightPx + BLOCK_INSET_PX),
            );
            return (
              <div
                key={day.date}
                className="relative bg-green4 rounded-lg"
                style={{ height: `${columnHeight}px` }}
              >
                {/* Hour grid lines */}
                {HOURS.map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-t border-white1/15"
                    style={{ top: `${i * ROW_HEIGHT_PX}px` }}
                  />
                ))}

                {/* Event blocks are informational while the schedule remains tentative. */}
                {laid.map(({ b, topPx, heightPx }, i) => (
                  <div
                    key={i}
                    className={`
                      absolute ${blockSideStyle(b.side)} ${shadeBg(b.shade)}
                      rounded-lg ${b.marker ? "px-3 py-1.5 flex flex-col justify-center" : "p-2 md:p-3"}
                      text-left overflow-hidden
                    `}
                    style={{
                      top: `${topPx}px`,
                      height: `${heightPx}px`,
                    }}
                  >
                    {/* Markers: title + time on a single centered row so
                        a slim chip doesn't have lopsided whitespace.
                        Half-width (side=left/right) blocks stack title +
                        time vertically so the time string can't overflow
                        the narrow column. Full-width blocks keep the
                        title-left / time-right inline layout. */}
                    <div ref={(el) => { blockRefs.current[`${day.date}-${i}`] = el; }}>
                      {b.marker ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-bevietnam font-bold text-white1 text-sm md:text-base leading-none">
                              {b.label}
                            </p>
                            <p className="font-bevietnam font-bold text-white1 text-xs md:text-sm whitespace-nowrap leading-none">
                              {b.time}
                            </p>
                          </div>
                          <LocationLine location={b.location} />
                        </div>
                      ) : b.side === "left" || b.side === "right" ? (
                        <div className="flex flex-col">
                          <p className="font-bevietnam font-bold text-white1 text-sm md:text-base leading-tight">
                            {b.label}
                          </p>
                          <p className="font-bevietnam font-bold text-white1 text-xs md:text-sm leading-tight mt-0.5">
                            {b.time}
                          </p>
                          <div className="mt-0.5">
                            <LocationLine location={b.location} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bevietnam font-bold text-white1 text-sm md:text-base leading-tight">
                              {b.label}
                            </p>
                            <p className="font-bevietnam font-bold text-white1 text-xs md:text-sm whitespace-nowrap">
                              {b.time}
                            </p>
                          </div>
                          <LocationLine location={b.location} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
