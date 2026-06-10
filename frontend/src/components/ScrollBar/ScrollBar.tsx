import { useEffect, useRef, useState } from "react";
import boat from "@/assets/fa26_thumb_boat.png";

interface ScrollBarProps {
  ratio: number;
}

const TRACK_TOP_PX = 148; // matches the MLH banner tip
const TRACK_BOTTOM_PX = 60;

// Right-edge alignment: every fixed element on the right rail centers on the
// vertical line at `right: 2rem + 32px` (i.e. 32px in from the 2rem inset).
//   - MLH badge:  w-16 (64px), right: 2rem            → center = 2rem + 32px
//   - track:      w-2  (8px),  right: 2rem + 28px     → center = 2rem + 32px
//   - boat thumb: w-12 (48px), right: 2rem + 8px      → center = 2rem + 32px

export default function ScrollBar({ ratio }: ScrollBarProps) {
  const thumbRef = useRef<HTMLImageElement>(null);
  const [thumbTop, setThumbTop] = useState(TRACK_TOP_PX);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!thumbRef.current) return;
    const vh = window.innerHeight;
    const trackLength = vh - TRACK_TOP_PX - TRACK_BOTTOM_PX;
    const thumbH = thumbRef.current.clientHeight;
    const maxThumbMove = trackLength - thumbH;

    const r = Math.max(0, Math.min(ratio, 1));
    setThumbTop(TRACK_TOP_PX + r * maxThumbMove);
  }, [ratio]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging || !thumbRef.current) return;

      const vh = window.innerHeight;
      const maxPageScroll = document.documentElement.scrollHeight - vh;
      const trackLength = vh - TRACK_TOP_PX - TRACK_BOTTOM_PX;
      const thumbH = thumbRef.current.clientHeight;
      const maxThumbMove = trackLength - thumbH;

      let newTop = e.clientY - thumbH / 2;
      newTop = Math.max(
        TRACK_TOP_PX,
        Math.min(newTop, TRACK_TOP_PX + maxThumbMove)
      );

      const newRatio = (newTop - TRACK_TOP_PX) / maxThumbMove;
      window.scrollTo(0, newRatio * maxPageScroll);
    };

    const onMouseUp = () => setDragging(false);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  return (
    <img
      ref={thumbRef}
      src={boat}
      alt="scroll thumb"
      onMouseDown={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      className="
        fixed
        w-12 h-auto
        z-[60]
        cursor-grab
        active:cursor-grabbing
        select-none
      "
      style={{
        top: `${thumbTop}px`,
        right: "calc(2rem + 8px)",
        // The PNG has ~10.4% transparent rows above the visible boat (50px
        // of 480px). Shift the image up so its visible top aligns with the
        // track top — otherwise the banner tip → boat connection has a gap.
        transform: "translateY(-10.4%)",
      }}
    />
  );
}
