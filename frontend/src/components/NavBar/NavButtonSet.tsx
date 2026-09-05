import React from "react";
import NavButton from "./NavButton";

type Props = {
  onLinkClick?: () => void;
  activeTarget?: string | null;
};

// Per Figma frame 362:199: nav items are ABOUT / TRACKS / SCHEDULE / FAQ
// followed by an APPLY pill (dark-navy #03506d background, white text).
// All text is uppercase, Spartan Medium, 32px, tracking -2.24px on desktop.
const NAV_LINK_CLASSES =
  "font-spartan font-medium uppercase text-white1 leading-none " +
  "tracking-[-0.07em] transition-[opacity,transform,color] " +
  "text-2xl md:text-[clamp(20px,1.7vw,30px)]";

const NavButtonSet: React.FC<Props> = ({
  onLinkClick,
  activeTarget,
}) => {
  return (
    <>
      <NavButton
        targetId="about"
        onClick={onLinkClick}
        active={activeTarget === "about"}
        className={NAV_LINK_CLASSES}
      >
        About
      </NavButton>
      <NavButton
        targetId="tracks"
        onClick={onLinkClick}
        active={activeTarget === "tracks"}
        className={NAV_LINK_CLASSES}
      >
        Tracks
      </NavButton>
      <NavButton
        targetId="schedule"
        onClick={onLinkClick}
        active={activeTarget === "schedule"}
        className={NAV_LINK_CLASSES}
      >
        Schedule
      </NavButton>
      <NavButton
        targetId="faq"
        onClick={onLinkClick}
        active={activeTarget === "faq"}
        className={NAV_LINK_CLASSES}
      >
        FAQ
      </NavButton>
      {/* APPLY pill — Figma 362:207: dark navy bg, white text, 50px radius */}
      <a
        href="https://brh-registration-portal.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onLinkClick}
        className={
          NAV_LINK_CLASSES +
          " nav-apply inline-flex items-center justify-center whitespace-nowrap bg-sky4 text-white1 rounded-full px-6 py-3"
        }
      >
        <span className="nav-apply__label">Apply</span>
      </a>
    </>
  );
};

export default NavButtonSet;
