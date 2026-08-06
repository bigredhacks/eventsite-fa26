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
      const targetY = section.getBoundingClientRect().top + window.scrollY;
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
