import { useEffect, useState } from "react";
import brhLogoWhite from "@/assets/brh_logo_white.png";
import menuOpenButton from "@/assets/menu_open.png";
import menuCloseButton from "@/assets/menu_close.png";
import NavButtonSet from "./NavButtonSet";

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const currentScrollY = window.scrollY;
        setIsScrolled(currentScrollY > 48);

        const markerY = window.innerHeight * 0.32;
        let nextSection: string | null = null;
        for (const id of ["about", "tracks", "schedule", "faq"]) {
          const section = document.getElementById(id);
          if (section && section.getBoundingClientRect().top <= markerY) {
            nextSection = id;
          }
        }
        setActiveSection(nextSection);
        setIsMobileMenuOpen(false);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header
      data-navbar
      className={`
        fixed inset-x-0 top-0 z-100 h-fit pointer-events-none
        transition-[padding] duration-500 ease-out
        ${isScrolled
          ? "md:pt-3 md:px-8 md:pr-32 pt-3 pl-3 pr-24"
          : "md:py-4 md:pl-12 md:pr-32 py-3 pl-6 pr-24"}`}
    >
      <div
        className={`nav-trail-shell pointer-events-auto relative z-[100] flex items-center justify-between overflow-visible
          ${isScrolled ? "nav-trail-shell--scrolled md:px-5 md:py-2 px-3 py-2" : ""}
          ${isMobileMenuOpen ? "nav-trail-shell--menu-open" : ""}`}
      >
        <img
          src={brhLogoWhite}
          alt="BRH logo"
          className="nav-brand relative z-[100] w-auto"
        />

        <nav
          aria-label="Primary navigation"
          className="relative z-[2] hidden md:flex items-center gap-[clamp(20px,2.5vw,50px)]"
        >
          <NavButtonSet
            onLinkClick={toggleMobileMenu}
            activeTarget={activeSection}
          />
        </nav>

        <button
          onClick={toggleMobileMenu}
          className="nav-menu-button relative z-[100] md:hidden grid h-11 w-11 place-items-center rounded-full transition-transform duration-300 ease-in-out"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <img
            src={isMobileMenuOpen ? menuCloseButton : menuOpenButton}
            alt=""
            className={`transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      <div
        className={`
          md:hidden overflow-hidden fixed top-0 left-0
          w-full z-90
          mobile-nav-panel bg-sky4/96 backdrop-blur-xl
          transition-[max-height] duration-500 ease-in-out
          ${isMobileMenuOpen ? "max-h-[100vh]" : "max-h-0 overflow-hidden"}
        `}
      >
        <div
          className="flex flex-col items-center justify-end
          gap-2.5 pt-24 pb-6 px-6 text-2xl uppercase tracking-wide"
        >
          <NavButtonSet
            onLinkClick={toggleMobileMenu}
            activeTarget={activeSection}
          />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
