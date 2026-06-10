// Vertical scroll track — starts at 148px (where the MLH banner's
// pointed tip ends) so the banner appears to "connect" with the rail.
// w-2 (8px) centered on the right rail at `right: 2rem + 32px`.
const ScrollBarTrack: React.FC = () => {
  return (
    <div
      className="fixed top-[148px] bottom-[60px] w-2 bg-white1/30 rounded-full z-[55] pointer-events-none select-none"
      style={{ right: "calc(2rem + 28px)" }}
      aria-hidden
    />
  );
};

export default ScrollBarTrack;
