import { SectionProps } from "./SectionProps";
import SponsorVessel from "../components/SponsorVessel";
import Waves from "../components/Waves";
import {
  getSponsorTier,
  SPONSORS,
  SPONSOR_TIER_ORDER,
} from "../config/sponsors";

const Sponsors: React.FC<SectionProps> = ({ className }) => {
  return (
    <section
      id="sponsors"
      className={`sponsor-harbor relative overflow-hidden bg-transparent px-5 pb-28 pt-10 sm:px-8 md:px-16 md:pb-36 md:pt-12 lg:px-32 ${className ?? ""}`}
    >
      <div className="relative z-20 mx-auto max-w-[1280px]">
        <div className="max-w-3xl">
          <h2 className="font-spartan text-5xl font-extrabold tracking-tight text-white1 md:text-7xl">
            OUR SPONSORS
          </h2>
        </div>

        <div className="relative mt-8 md:mt-10" aria-label="BigRed Hacks sponsors">
          {SPONSOR_TIER_ORDER.map((tier, rowIndex) => {
            const sponsors = SPONSORS.filter(
              (sponsor) => getSponsorTier(sponsor.contribution) === tier,
            );

            return (
              <div
                key={tier}
                role="list"
                className={`sponsor-fleet-row flex flex-wrap items-end justify-center gap-x-3 gap-y-1 sm:gap-x-5 md:gap-x-6 ${rowIndex > 0 ? "-mt-1 sm:-mt-3 md:-mt-5" : ""}`}
              >
                {sponsors.map((sponsor) => (
                  <div role="listitem" key={sponsor.name}>
                    <SponsorVessel sponsor={sponsor} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-10 h-24 w-full md:h-32">
        <Waves className="absolute inset-0" />
      </div>
    </section>
  );
};

export default Sponsors;
