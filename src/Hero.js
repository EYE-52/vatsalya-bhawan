import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Images from "./utils/images";
import ayodhyaSwagatam from "./assets/ayodhya-swagatam-mobile.webp";

const Hero = () => {
  const { scrollY } = useScroll();

  const heroContentOpacity = useTransform(scrollY, [650, 1150], [1, 0]);
  const heroPointerEvents = useTransform(scrollY, (val) => (val > 1050 ? "none" : "auto"));

  const scrollToNext = (e) => {
    e.preventDefault();
    const target = document.getElementById("room-showcase") || document.getElementById("rooms");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      style={{
        position: "relative",
        height: "180vh",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0a09",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden" }}>
          <img
            src={Images.frontView}
            alt="Vatsalya Bhawan Ayodhya Exterior"
            fetchPriority="high"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              animation: "kenburns 18s ease-in-out infinite alternate",
              transformOrigin: "center center",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background:
              "linear-gradient(to bottom, rgba(12,10,9,0.52) 0%, rgba(12,10,9,0.60) 50%, rgba(12,10,9,0.88) 100%)",
          }}
        />

        <motion.div
          style={{
            position: "absolute",
            top: "clamp(58vh, 61vh, 64vh)",
            left: 0,
            right: 0,
            zIndex: 10,
            maxWidth: "1080px",
            width: "100%",
            margin: "0 auto",
            padding: "0 8px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: "translateY(-50%)",
            opacity: heroContentOpacity,
            pointerEvents: heroPointerEvents,
          }}
        >
          <img
            src={ayodhyaSwagatam}
            alt="अयोध्या की पावन नगरी में आपका स्वागत है"
            decoding="async"
            style={{
              width: "100%",
              maxWidth: "min(88vw, 860px)",
              height: "auto",
              objectFit: "contain",
              display: "block",
              filter:
                "drop-shadow(0 4px 22px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 20px rgba(251, 191, 36, 0.28)) brightness(0.98) saturate(1.05)",
              animation: "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both",
            }}
          />
        </motion.div>

        <motion.button
          onClick={scrollToNext}
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "max(20px, env(safe-area-inset-bottom, 20px))",
            left: 0,
            right: 0,
            margin: "0 auto",
            width: "max-content",
            zIndex: 25,
            background: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            color: "#fbbf24",
            textShadow: "0 2px 14px rgba(0,0,0,0.95), 0 0 12px rgba(251, 191, 36, 0.4)",
            opacity: heroContentOpacity,
            pointerEvents: heroPointerEvents,
            cursor: "pointer",
          }}
        >
          <span
            className="font-display"
            style={{
              fontSize: "0.70rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#fbbf24",
            }}
          >
            Explore the Stay
          </span>
          <ChevronDown size={16} color="#fbbf24" strokeWidth={2.5} />
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;