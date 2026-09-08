import { useEffect, useState } from "react";

// September 9, 2026 at 11:59 PM in Ithaca (Eastern Daylight Time).
const APPLICATION_DEADLINE = Date.parse("2026-09-09T23:59:00-04:00");

function remainingSeconds() {
  return Math.max(0, Math.ceil((APPLICATION_DEADLINE - Date.now()) / 1000));
}

export default function ApplicationCountdown() {
  const [seconds, setSeconds] = useState(remainingSeconds);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const remaining = remainingSeconds();
      setSeconds(remaining);
      if (remaining === 0) window.clearInterval(interval);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const countdown = [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ].map((value) => String(value).padStart(2, "0")).join(":");
  const isClosed = seconds === 0;

  return (
    <div
      className={`nav-countdown${isClosed ? " nav-countdown--closed" : ""}`}
      role={isClosed ? "status" : "timer"}
      aria-live="off"
      aria-label={isClosed
        ? "No longer taking applications"
        : `Application deadline: September 9, 2026 at 11:59 PM Eastern. ${countdown} remaining.`}
      title="Application deadline: September 9, 2026 at 11:59 PM Eastern"
    >
      {isClosed ? (
        <span className="nav-countdown__label">No longer taking applications</span>
      ) : (
        <>
          <span className="nav-countdown__label">Applications due in</span>
          <span className="nav-countdown__time">{countdown}</span>
        </>
      )}
    </div>
  );
}
