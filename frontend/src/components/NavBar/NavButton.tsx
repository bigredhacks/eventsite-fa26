import React from "react";
import { smoothScrollTo } from "../../utils/smoothScrollTo.tsx";

type NavButtonProps = {
  targetId: string;
  children: React.ReactNode;
  className?: string;
  setDisableHideUntil?: (time: number) => void;
  onClick?: () => void;
};

const NavButton: React.FC<NavButtonProps> = ({
  targetId,
  children,
  className,
  setDisableHideUntil,
  onClick,
}) => {
  const handleClick = () => {
    const section = document.getElementById(targetId);
    const scrollSpeed = 500;
    if (section) {
      if (setDisableHideUntil) {
        setDisableHideUntil(Date.now() + scrollSpeed + 100);
      }
      const targetY = section.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(targetY, scrollSpeed);
    }
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`hover:underline ${className ?? ""}`}
    >
      {children}
    </button>
  );
};

export default NavButton;
