import { motion } from "framer-motion";

const Waves: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`pointer-events-none select-none ${className ?? ""}`} aria-hidden>
    <motion.svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 w-[200%] h-full"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
    >
      <path
        d="M0 40 Q 90 0 180 40 T 360 40 T 540 40 T 720 40 T 900 40 T 1080 40 T 1260 40 T 1440 40 V90 H0 Z"
        fill="rgba(255,255,255,0.18)"
      />
      <path
        d="M1440 40 Q 1530 0 1620 40 T 1800 40 T 1980 40 T 2160 40 T 2340 40 T 2520 40 T 2700 40 T 2880 40 V90 H1440 Z"
        fill="rgba(255,255,255,0.18)"
      />
    </motion.svg>
    <motion.svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 w-[200%] h-[60%]"
      animate={{ x: ["-50%", "0%"] }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    >
      <path
        d="M0 30 Q 60 0 120 30 T 240 30 T 360 30 T 480 30 T 600 30 T 720 30 T 840 30 T 960 30 T 1080 30 T 1200 30 T 1320 30 T 1440 30 V60 H0 Z"
        fill="rgba(255,255,255,0.30)"
      />
      <path
        d="M1440 30 Q 1500 0 1560 30 T 1680 30 T 1800 30 T 1920 30 T 2040 30 T 2160 30 T 2280 30 T 2400 30 T 2520 30 T 2640 30 T 2760 30 T 2880 30 V60 H1440 Z"
        fill="rgba(255,255,255,0.30)"
      />
    </motion.svg>
  </div>
);

export default Waves;
