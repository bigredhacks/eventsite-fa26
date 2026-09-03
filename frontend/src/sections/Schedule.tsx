import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
      { label: "Check-In",         time: "16:30",       startHour: 7.5,  durationHours: 1.5, shade: "light" },
      { label: "Opening Ceremony", time: "18:00",       startHour: 9,    durationHours: 0.5, shade: "medium" },
      { label: "Dinner",           time: "18:30",       startHour: 9.5,  durationHours: 0.5, shade: "light" },
      { label: "Team Matching",    time: "19:00",       startHour: 10,   durationHours: 0.5, shade: "medium" },
      { label: "Workshops",        time: "19:30-22:30", startHour: 10.5, durationHours: 3,   shade: "light" },
    ],
  },
  {
    date: "10/3",
    blocks: [
      { label: "Breakfast",   time: "9:00",        startHour: 0,    durationHours: 0.5, shade: "medium", marker: true },
      // Workshops + Career Fair overlap; render them side-by-side.
      { label: "Workshops",   time: "11:30-17:00", startHour: 2.5,  durationHours: 5.5, shade: "light",  side: "left" },
      { label: "Career Fair", time: "12:00-14:00", startHour: 3,    durationHours: 2,   shade: "medium", side: "right" },
      { label: "Dinner",      time: "18:30",       startHour: 9.5,  durationHours: 0.5, shade: "light" },
    ],
  },
  {
    date: "10/4",
    blocks: [
      { label: "Projects Due",            time: "9:00",       startHour: 0,    durationHours: 0.5, shade: "dark",  marker: true },
      { label: "Judging",                 time: "9:15-13:00", startHour: 0.25, durationHours: 3.75, shade: "medium" },
      { label: "Awards + Closing Ceremony", time: "13:00",    startHour: 4,    durationHours: 1,   shade: "light" },
    ],
  },
];

const ROW_HEIGHT_PX = 60;
// Minimum vertical space for normal event blocks (regardless of duration)
// so titles + times have breathing room. The grid layout intentionally
// loses minute-accuracy in favor of readability.
const MIN_BLOCK_HEIGHT_PX = 64;
// Minimum height for marker events (single-moment markers like
// "Projects Due 9:00"). Smaller than MIN_BLOCK_HEIGHT_PX so a 9:00
// marker doesn't visually claim the entire 9–10AM row and confuse
// readers about when the next event actually starts.
const MIN_MARKER_HEIGHT_PX = 36;

// Map dayIndex (0=10/2, 1=10/3, 2=10/4) to absolute calendar dates for
// the .ics export. Year/month locked to the FA26 hackathon weekend.
const EVENT_DATE_BY_INDEX: Record<number, [number, number, number]> = {
  0: [2026, 10, 2],
  1: [2026, 10, 3],
  2: [2026, 10, 4],
};

// Convert a `startHour` (offset in hours from 9 AM on the day) to a tuple
// (hour, minute) and whether this should roll over into the next day. The
// schedule extends past midnight on the first day (workshops 19:30–22:30
// is fine, but anything spilling past 23:59 would need rollover handling).
const hoursToHm = (h: number) => {
  const baseHour = 9 + Math.floor(h);
  const min = Math.round((h - Math.floor(h)) * 60);
  return { hour: baseHour, min };
};

const pad2 = (n: number) => String(n).padStart(2, "0");

// Build one .ics file containing every schedule block. Calendar files support
// multiple VEVENT records, so a single download can import the full weekend.
const downloadFullSchedule = () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

  const eventLines = DAYS.flatMap((day, dayIndex) =>
    day.blocks.flatMap((block) => {
      const [year, month, calendarDay] = EVENT_DATE_BY_INDEX[dayIndex];
      const start = hoursToHm(block.startHour);
      const end = hoursToHm(block.startHour + block.durationHours);
      // These are floating local times so calendar apps preserve the listed
      // event times when importing the schedule.
      const dt = (h: number, m: number) =>
        `${year}${pad2(month)}${pad2(calendarDay)}T${pad2(h)}${pad2(m)}00`;
      const uid = `brh-fa26-${dayIndex}-${block.startHour}-${block.label
        .replace(/\s+/g, "-")
        .toLowerCase()}@bigredhacks.com`;

      return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${timestamp}`,
        `DTSTART:${dt(start.hour, start.min)}`,
        `DTEND:${dt(end.hour, end.min)}`,
        `SUMMARY:${block.label}`,
        "LOCATION:Cornell University",
        "DESCRIPTION:BigRed//Hacks 2026 — added from the event schedule.",
        "END:VEVENT",
      ];
    }),
  );

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BigRedHacks//FA26//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...eventLines,
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bigredhacks-2026-full-schedule.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

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
        <div className="flex min-w-0 flex-1 -translate-y-1 justify-end sm:-translate-y-2.5">
          <button
            type="button"
            onClick={downloadFullSchedule}
            className="
              inline-flex min-h-12 w-24 shrink-0 items-center justify-center rounded-full
              border border-white1/20 bg-sky4
              px-4 py-3 text-center font-spartan text-xs font-bold uppercase
              leading-[1.1] tracking-wide text-white1
              shadow-[0_5px_16px_rgba(14,40,47,0.2)]
              transition-[transform,background-color,box-shadow] duration-150
              hover:-translate-y-0.5 hover:bg-red1 hover:shadow-lg
              active:translate-y-0 active:scale-[0.98]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white1/70
              sm:min-h-0 sm:w-auto sm:whitespace-nowrap sm:px-5 sm:py-3 sm:text-sm
            "
            aria-label="Add the full BigRed Hacks schedule to your calendar"
          >
            <span className="translate-y-0.5 sm:translate-y-0">
              Add to calendar
            </span>
          </button>
        </div>
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
                  <span className="min-w-0 font-bevietnam text-base font-bold leading-tight sm:text-lg">
                    {block.label}
                  </span>
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
            // short back-to-back events overlap. Side-by-side blocks
            // (left/right) are tracked separately so they don't push
            // each other down.
            type Laid = { b: Block; topPx: number; heightPx: number };
            const lastBottomBySide: Record<string, number> = {};
            const laid: Laid[] = day.blocks.map((b) => {
              const sideKey = b.side ?? "full";
              const naturalTop = b.startHour * ROW_HEIGHT_PX;
              const minTop = lastBottomBySide[sideKey] ?? 0;
              const topPx = Math.max(naturalTop, minTop);
              // Markers use a smaller min-height so a single-moment event
              // doesn't claim the full hour row; non-markers expand to the
              // standard MIN_BLOCK_HEIGHT_PX for readability.
              const minH = b.marker
                ? MIN_MARKER_HEIGHT_PX
                : MIN_BLOCK_HEIGHT_PX;
              const heightPx = Math.max(b.durationHours * ROW_HEIGHT_PX, minH);
              // Markers DO push the next event down — by their own
              // (smaller) marker height — so a 9:00 marker chip doesn't
              // visually collide with a 9:15 long event. They just don't
              // claim a full hour of vertical space the way a normal
              // event would.
              lastBottomBySide[sideKey] = topPx + heightPx;
              return { b, topPx, heightPx };
            });
            // Column needs to grow to fit the last block's bottom if our
            // min-height pushes anything past the natural 15-hour grid.
            const columnHeight = Math.max(
              HOURS.length * ROW_HEIGHT_PX,
              ...laid.map((l) => l.topPx + l.heightPx),
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

                {/* Event blocks are informational; the section-level action
                    above exports the complete schedule in one calendar file. */}
                {laid.map(({ b, topPx, heightPx }, i) => (
                  <div
                    key={i}
                    className={`
                      absolute ${blockSideStyle(b.side)} ${shadeBg(b.shade)}
                      rounded-lg ${b.marker ? "px-3 py-1.5" : "p-2 md:p-3"}
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
                    {b.marker ? (
                      <div className="flex items-center justify-between gap-2 h-full">
                        <p className="font-bevietnam font-bold text-white1 text-sm md:text-base leading-none">
                          {b.label}
                        </p>
                        <p className="font-bevietnam font-bold text-white1 text-xs md:text-sm whitespace-nowrap leading-none">
                          {b.time}
                        </p>
                      </div>
                    ) : b.side === "left" || b.side === "right" ? (
                      <div className="flex flex-col">
                        <p className="font-bevietnam font-bold text-white1 text-sm md:text-base leading-tight">
                          {b.label}
                        </p>
                        <p className="font-bevietnam font-bold text-white1 text-xs md:text-sm leading-tight mt-0.5">
                          {b.time}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bevietnam font-bold text-white1 text-sm md:text-base leading-tight">
                          {b.label}
                        </p>
                        <p className="font-bevietnam font-bold text-white1 text-xs md:text-sm whitespace-nowrap">
                          {b.time}
                        </p>
                      </div>
                    )}
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
