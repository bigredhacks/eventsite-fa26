import logSvg from "@/assets/fa26_track_card.svg";

interface TrackCardProps {
  title: string;
  description: string;
}

// Match Figma frame 310:191 — 466×266 wood log with text positioned via
// percentages so it scales fluidly and never clips.
const TrackCard: React.FC<TrackCardProps> = ({ title, description }) => {
  return (
    <div className="relative w-full hover:scale-[1.04] transition-transform duration-300" style={{ aspectRatio: "466 / 266" }}>
      <img
        src={logSvg}
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[12%] pt-[18%] pb-[12%] gap-[4%]">
        <h3 className="font-spartan font-extrabold text-white1 text-[clamp(16px,2.6vw,38px)] leading-none tracking-tight whitespace-nowrap drop-shadow-md">
          {title}
        </h3>
        <p className="font-bevietnam font-normal text-white1 text-[clamp(10px,1.25vw,18px)] leading-snug drop-shadow-md">
          {description}
        </p>
      </div>
    </div>
  );
};

export default TrackCard;
