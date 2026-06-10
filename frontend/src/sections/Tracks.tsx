import { SectionProps } from "./SectionProps";
import { tracks } from "../config/config";
import TrackCard from "../components/TrackCard";

const Tracks: React.FC<SectionProps> = ({ className }) => {
  return (
    <section
      id="tracks"
      className={`
        relative
        flex flex-col items-start
        bg-transparent
        overflow-y-visible overflow-x-clip
        md:px-32 px-8
        md:pt-20 pt-12
        md:pb-[28vw] pb-72
         ${className ?? ""}`}
    >
      <h2 className="font-spartan font-extrabold text-white1 text-5xl md:text-7xl tracking-tight mb-12">
        TRACKS
      </h2>

      <div
        className="grid w-full
          md:grid-cols-3 grid-cols-2
          md:gap-x-12 gap-x-3
          md:gap-y-10 gap-y-4
          z-10"
      >
        {tracks.map((track, index) => (
          <TrackCard
            key={index}
            title={track.title}
            description={track.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Tracks;
