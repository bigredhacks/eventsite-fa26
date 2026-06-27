import React from "react";
import NavButton from "./NavButton";

type Props = {
  setDisableHideUntil: React.Dispatch<React.SetStateAction<number>>;
  onLinkClick?: () => void;
};

// Per Figma frame 362:199: nav items are ABOUT / TRACKS / SCHEDULE / FAQ
// followed by an APPLY pill (dark-navy #03506d background, white text).
// All text is uppercase, Spartan Medium, 32px, tracking -2.24px on desktop.
const NAV_LINK_CLASSES =
  "font-spartan font-medium uppercase text-white1 leading-none " +
  "tracking-[-0.07em] hover:opacity-80 transition-opacity " +
  "text-2xl md:text-[clamp(20px,1.7vw,30px)]";

const NavButtonSet: React.FC<Props> = ({
  setDisableHideUntil,
  onLinkClick,
}) => {
  return (
    <>
      <NavButton
        targetId="about"
        setDisableHideUntil={setDisableHideUntil}
        onClick={onLinkClick}
        className={NAV_LINK_CLASSES}
      >
        About
      </NavButton>
      <NavButton
        targetId="tracks"
        setDisableHideUntil={setDisableHideUntil}
        onClick={onLinkClick}
        className={NAV_LINK_CLASSES}
      >
        Tracks
      </NavButton>
      <NavButton
        targetId="schedule"
        setDisableHideUntil={setDisableHideUntil}
        onClick={onLinkClick}
        className={NAV_LINK_CLASSES}
      >
        Schedule
      </NavButton>
      <NavButton
        targetId="faq"
        setDisableHideUntil={setDisableHideUntil}
        onClick={onLinkClick}
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
          " bg-sky4 text-white1 rounded-full px-6 py-3 hover:opacity-90"
        }
      >
        Apply
      </a>
    </>
  );
};

export default NavButtonSet;
