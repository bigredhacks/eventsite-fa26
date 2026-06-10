// MLH 2026 trust badge — fixed to the top right of the viewport so it
// stays anchored as the user scrolls (and doesn't slide off-screen during
// overscroll bounces). Uses the dark/blue MLH badge variant to match the
// Figma design.
const MLHBadge: React.FC = () => {
  return (
    <a
      id="mlh-trust-badge"
      href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=blue"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-0 right-4 md:right-2 w-16 md:w-24 z-[200]"
    >
      <img
        src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-blue.svg"
        alt="Major League Hacking 2026 Hackathon Season"
        className="w-full"
      />
    </a>
  );
};

export default MLHBadge;
