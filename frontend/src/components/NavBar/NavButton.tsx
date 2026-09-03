import React from "react";
import { smoothScrollTo } from "../../utils/smoothScrollTo.tsx";

type NavButtonProps = {
  targetId: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
};

const NavButton: React.FC<NavButtonProps> = ({
  targetId,
  children,
  className,
  onClick,
  active,
}) => {
  const handleClick = () => {
    const section = document.getElementById(targetId);
    const scrollSpeed = 500;
    if (section) {
      const navbar = document.querySelector<HTMLElement>("[data-navbar]");
      // Leave a small visual gap below the fixed navbar. Measuring the real
      // rendered height keeps the destination clear across mobile, tablet,
      // and desktop navbar states instead of relying on a breakpoint-specific
      // hard-coded offset.
      // The bar grows slightly as it changes from its top-of-page treatment
      // into the scrolled treatment, so the extra 24px also absorbs that
      // transition without allowing the destination to slip underneath it.
      const navbarClearance = (navbar?.getBoundingClientRect().height ?? 0) + 24;
      const targetY = Math.max(
        0,
        section.getBoundingClientRect().top + window.scrollY - navbarClearance,
      );
      smoothScrollTo(targetY, scrollSpeed);
    }
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`nav-link ${active ? "nav-link--active" : ""} ${className ?? ""}`}
      aria-current={active ? "location" : undefined}
    >
      <span className="relative z-[1]">{children}</span>
    </button>
  );
};

export default NavButton;
