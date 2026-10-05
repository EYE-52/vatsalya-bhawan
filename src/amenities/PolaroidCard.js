import React from "react";
import { motion, useTransform } from "framer-motion";

const PolaroidCard = ({ item, index, total, smoothProgress, isTop, isMobile = false }) => {
  const isFirst = index === 0;

  const usableProgress = 0.96;
  const step = usableProgress / (total - 1);
  const startProg = Math.max(0, (index - 0.95) * step);
  const endProg = index * step;

  const startY = typeof window !== "undefined" ? Math.max(900, window.innerHeight + 250) : 1100;

  const yTransform = useTransform(
    smoothProgress,
    [startProg, endProg],
    [startY, item.offsetY]
  );
  const opacityTransform = useTransform(
    smoothProgress,
    [startProg, startProg + 0.04, endProg],
    [0, 1, 1]
  );
  const scaleTransform = useTransform(
    smoothProgress,
    [startProg, endProg],
    [0.90, 1.0]
  );
  const rotateTransform = useTransform(
    smoothProgress,
    [startProg, endProg],
    [item.rotation + (index % 2 === 0 ? 10 : -10), item.rotation]
  );
  const displayTransform = useTransform(
    smoothProgress,
    (p) => (p < startProg && !isFirst ? "none" : "block")
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        width: "96%",
        maxWidth: isMobile ? "450px" : "540px",
        background: "#ffffff",
        borderRadius: "3px",
        padding: isMobile ? "12px 12px 16px 12px" : "14px 14px 20px 14px",
        border: "1px solid rgba(0,0,0,0.08)",
        zIndex: index + 10,
        transformOrigin: "center center",
        boxSizing: "border-box",
        display: displayTransform,
        x: item.offsetX,
        y: isFirst ? item.offsetY : yTransform,
        opacity: isFirst ? 1 : opacityTransform,
        scale: isFirst ? 1 : scaleTransform,
        rotate: isFirst ? item.rotation : rotateTransform,
        willChange: "transform, opacity",
        boxShadow: isTop
          ? "0 28px 64px rgba(0,0,0,0.24), 0 4px 16px rgba(0,0,0,0.08)"
          : "0 12px 32px rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: isMobile ? "355px" : "425px",
          borderRadius: "2px",
          overflow: "hidden",
          background: "#0c0a09",
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(12,10,9,0.80)",
            backdropFilter: "blur(6px)",
            color: "#fbbf24",
            padding: "3px 10px",
            borderRadius: "4px",
            fontSize: isMobile ? "0.62rem" : "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {item.tag}
        </div>
      </div>

      <div style={{ marginTop: isMobile ? "10px" : "14px", padding: "0 4px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <span
            className="font-display"
            style={{
              fontSize: isMobile ? "1.02rem" : "1.18rem",
              fontWeight: 700,
              color: "#1c1917",
              letterSpacing: "0.01em",
              lineHeight: 1.25,
            }}
          >
            {item.title}
          </span>
          <span
            style={{
              fontSize: isMobile ? "0.74rem" : "0.82rem",
              fontWeight: 800,
              color: "#c2882b",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {item.num}/06
          </span>
        </div>
        <p
          style={{
            fontSize: isMobile ? "0.80rem" : "0.86rem",
            color: "#78716c",
            lineHeight: 1.45,
            margin: 0,
          }}
        >
          {item.short}
        </p>
      </div>
    </motion.div>
  );
};

export default PolaroidCard;
