import logSvg from "@/assets/fa26_track_card.svg";

interface TrackCardProps {
  title: string;
  description: string;
}

// Match Figma frame 310:191 — 466×266 wood log with text positioned via
// percentages so it scales fluidly and never clips.
const TrackCard: React.FC<TrackCardProps> = ({ title, description }) => {
  return (
    <article
      data-track-card
      className="track-card relative w-full transition-transform duration-300 ease-out hover:-translate-y-[1.5%] hover:scale-[1.025]"
      style={{ aspectRatio: "466 / 266" }}
    >
      <img
        src={logSvg}
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none select-none drop-shadow-[0_3px_2px_rgba(42,44,31,0.22)]"
      />
      <div className="track-card__content absolute inset-0 flex flex-col items-center justify-center text-center">
        <h3 className="track-card__title font-spartan font-extrabold text-white1 tracking-tight drop-shadow-md">
          {title}
        </h3>
        <p className="track-card__description font-bevietnam font-normal text-white1 drop-shadow-md">
          {description}
        </p>
      </div>
    </article>
  );
};

export default TrackCard;
