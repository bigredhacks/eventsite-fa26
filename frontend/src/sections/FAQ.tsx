import { SectionProps } from "./SectionProps";
import Accordion from "../components/Accordian";
import { faqData } from "../config/config";

// The lighthouse + cliff illustration is rendered statically in MainStage
// at the canvas-level y coord (Figma 362:775); FAQ only owns the text
// overlay so it lays cleanly on top of the landscape.

const FAQ: React.FC<SectionProps> = ({ className }) => {
  const midPoint = Math.ceil(faqData.length / 2);
  const left = faqData.slice(0, midPoint);
  const right = faqData.slice(midPoint);

  const transform = (data: typeof faqData) =>
    data.map((item) => ({ title: item.question, content: item.answer }));

  return (
    <section
      id="faq"
      // Lock the section to the all-expanded height so toggling accordion
      // items doesn't push later sections (Sponsors, Footer) up or down.
      style={{ minHeight: "1064px" }}
      className={`
        relative
        bg-transparent
        md:px-32 px-8
        md:pt-32 pt-20 md:pb-0 pb-0
         ${className ?? ""}`}
    >
      <h2 className="font-spartan font-extrabold text-white1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight mb-12 md:mb-20 lg:max-w-[75%]">
        FREQUENTLY ASKED QUESTIONS
      </h2>

      <div className="flex flex-col lg:flex-row lg:gap-16 relative z-10 lg:max-w-[75%]">
        <div className="w-full lg:w-1/2">
          <Accordion items={transform(left)} />
        </div>
        <div className="w-full lg:w-1/2">
          <Accordion items={transform(right)} />
        </div>
      </div>
    </section>
  );
};

export default FAQ;
