// src/components/ScrollDownIndicator.js
import { useState, useEffect } from "react";

export default function ScrollDownIndicator() {
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      const bottomGap = fullHeight - (scrollTop + viewportHeight);

      // 바닥 근처에서만 사라짐
      if (bottomGap < 150) setShowArrow(false);
      else setShowArrow(true);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollNext = () => {
    window.scrollTo({
      top: window.scrollY + 500,
      behavior: "smooth",
    });
  };

  if (!showArrow) return null;

  return (
    <div style={styles.arrowWrap} onClick={scrollNext}>
      <div style={styles.arrowContent}>
        {/* SVG 화살표 */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          style={styles.arrowIcon}
        >
          <path
            d="M12 5v14M5 12l7 7 7-7"
            stroke="#888"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span style={styles.arrowText}>SCROLL</span>
      </div>

      {/* 글로벌 애니메이션 */}
      <style jsx global>{`
        @keyframes blinkArrow {
          0% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  arrowWrap: {
    position: "fixed",
    bottom: "22px",
    left: "50%",
    transform: "translateX(-50%)",
    animation: "blinkArrow 1.4s infinite",
    cursor: "pointer",
    zIndex: 999,
  },

  arrowContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
  },

  arrowIcon: { display: "block" },

  arrowText: {
    fontSize: "14px",
    color: "#888",
    letterSpacing: "1px",
  },
};
