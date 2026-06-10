import { useEffect, useState } from "react";
import brhLogoWhite from "@/assets/brh_logo_white.png";
import menuOpenButton from "@/assets/menu_open.png";
import menuCloseButton from "@/assets/menu_close.png";
import NavButtonSet from "./NavButtonSet";

const NavBar: React.FC = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [disableHideUntil, setDisableHideUntil] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const threshold = 100;

  useEffect(() => {
    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      if (currentTime < disableHideUntil) {
        setLastScrollY(currentScrollY);
        return;
      }
      if (Math.abs(scrollDelta) < threshold) {
        return;
      }
      if (scrollDelta > 0) {
        setShow(false);
      } else {
        setShow(true);
      }
      setIsMobileMenuOpen(false);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, disableHideUntil]);

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
    <div
      className={`
        fixed top-0 w-full z-100 h-fit
        bg-transparent
        md:py-4 py-3
        md:pl-12 pl-6
        md:pr-32 pr-6
        transition-transform duration-500
         ${show ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex items-center justify-between">
        <img src={brhLogoWhite} alt="BRH logo" className="md:h-16 h-12 z-100" />

        <div className="hidden md:flex items-center gap-[clamp(20px,2.5vw,50px)]">
          <NavButtonSet
            setDisableHideUntil={setDisableHideUntil}
            onLinkClick={toggleMobileMenu}
          />
        </div>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden transition-transform duration-300 ease-in-out h-12 z-100"
        >
          <img
            src={isMobileMenuOpen ? menuCloseButton : menuOpenButton}
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
          bg-sky3/95 backdrop-blur-sm
          transition-[max-height] duration-500 ease-in-out
          ${isMobileMenuOpen ? "max-h-[100vh]" : "max-h-0 overflow-hidden"}
        `}
      >
        <div
          className="flex flex-col items-center justify-end
          gap-2.5 pt-24 pb-6 px-6 text-2xl uppercase tracking-wide"
        >
          <NavButtonSet
            setDisableHideUntil={setDisableHideUntil}
            onLinkClick={toggleMobileMenu}
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
