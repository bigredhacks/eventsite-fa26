import { motion } from "framer-motion";

const streaks = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  top: 8 + Math.round((i * 11) % 80),
  duration: 6 + (i % 4) * 1.5,
  delay: i * 0.6,
  opacity: 0.18 + ((i * 7) % 12) / 100,
  width: 80 + (i * 23) % 140,
}));

const WindStreaks: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className ?? ""}`} aria-hidden>
    {streaks.map((s) => (
      <motion.svg
        key={s.id}
        viewBox="0 0 200 8"
        preserveAspectRatio="none"
        className="absolute"
        style={{ top: `${s.top}%`, height: "6px", width: `${s.width}px` }}
        initial={{ x: "-30vw", opacity: 0 }}
        animate={{ x: "120vw", opacity: [0, s.opacity, s.opacity, 0] }}
        transition={{
          duration: s.duration,
          repeat: Infinity,
          delay: s.delay,
          ease: "easeOut",
        }}
      >
        <path
          d="M0 4 Q 50 0 100 4 T 200 4"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.5"
          fill="none"
        />
      </motion.svg>
    ))}
  </div>
);

export default WindStreaks;
