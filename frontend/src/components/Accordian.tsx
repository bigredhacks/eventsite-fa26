import React, { useState } from "react";
import faqPin from "@/assets/fa26_faq_pin.svg";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setActiveIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-full">
      {items.map((item, index) => {
        const open = activeIndices.includes(index);
        return (
          <div key={index} className="font-bevietnam mb-8 md:mb-12">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-start gap-3 text-left"
            >
              <img
                src={faqPin}
                alt=""
                className={`w-7 h-7 md:w-9 md:h-9 mt-1 shrink-0 transition-transform duration-300 ${
                  open ? "rotate-45" : "rotate-0"
                }`}
              />
              <h3 className="text-white1 text-lg md:text-2xl leading-snug font-normal hover:text-yellow1 transition-colors">
                {item.title}
              </h3>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-400 pl-10 md:pl-12 ${
                open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-white1/85 text-base md:text-lg font-light leading-snug">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
