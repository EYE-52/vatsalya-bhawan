import React from "react";
import { motion, useTransform } from "framer-motion";

const GalleryItem = ({ img, index, progressSmooth, total, onSelect }) => {
  const relativeIndex = useTransform(progressSmooth, (p) => index - p * (total - 1));

  const translateY = useTransform(relativeIndex, [-2, -1, 0, 1, 2], [-380, -200, 0, 200, 380]);
  const scale = useTransform(relativeIndex, [-2, -1, 0, 1, 2], [0.82, 0.92, 1.0, 0.92, 0.82]);
  const rotateX = useTransform(relativeIndex, [-2, -1, 0, 1, 2], [18, 9, 0, -9, -18]);
  const opacity = useTransform(relativeIndex, [-2.5, -2, -1, 0, 1, 2, 2.5], [0, 0.25, 0.65, 1, 0.65, 0.25, 0]);
  const zIndex = useTransform(relativeIndex, [-2, -1, 0, 1, 2], [10, 20, 30, 20, 10]);

  return (
    <motion.div
      onClick={() => onSelect(index)}
      style={{
        position: "absolute",
        width: "100%",
        maxWidth: "min(1400px, 99vw)",
        height: "clamp(540px, 81vh, 860px)",
        translateY,
        scale,
        rotateX,
        opacity,
        zIndex,
        willChange: "transform, opacity",
        transformStyle: "preserve-3d",
        cursor: "pointer",
        perspective: "1200px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 28px 64px rgba(0,0,0,0.85), 0 0 32px rgba(245,158,11,0.2)",
          border: "2px solid rgba(245,158,11,0.45)",
          background: "#0a0807",
        }}
      >
        <img
          src={img.src}
          alt={img.label}
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
            inset: 0,
            background: "linear-gradient(to top, rgba(10,8,7,0.88) 0%, rgba(10,8,7,0.15) 45%, transparent 100%)",
            display: "flex",
            alignItems: "flex-end",
            padding: "20px 24px",
          }}
        >
          <h3 className="font-serif" style={{ fontSize: "clamp(1.2rem, 2.8vw, 1.65rem)", color: "#fff", fontWeight: 600, margin: 0 }}>
            {img.label}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryItem;
