import React, { useState, useEffect, useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import { amenityList } from "./amenities/amenitiesData";
import PolaroidCard from "./amenities/PolaroidCard";

const Amenities = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const containerRef = useRef(null);

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 1024);
      }, 120);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      const normalized = Math.min(1, Math.max(0, latest / 0.96));
      const idx = Math.min(
        amenityList.length - 1,
        Math.floor(normalized * amenityList.length)
      );
      setActiveIdx(idx);
    });
  }, [smoothProgress]);

  const currentAmenity = amenityList[activeIdx] || amenityList[0];

  return (
    <section
      id="amenities"
      ref={containerRef}
      style={{
        position: "relative",
        height: "280vh",
        background: "#f7f4ee",
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          padding: isMobile ? "24px 14px 16px 14px" : "36px 32px 24px 32px",
          boxSizing: "border-box",
          zIndex: 10,
        }}
      >
        <div className="container-section w-full">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.1fr 1fr",
              gap: isMobile ? "16px" : "64px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                textAlign: isMobile ? "center" : "left",
                maxWidth: isMobile ? "100%" : "520px",
              }}
            >
              <h2
                className="font-display"
                style={{
                  fontSize: isMobile
                    ? "clamp(1.5rem, 5.5vw, 2.0rem)"
                    : "clamp(2.0rem, 3.4vw, 2.8rem)",
                  fontWeight: 700,
                  color: "#1c1917",
                  lineHeight: 1.18,
                  margin: "0 0 16px 0",
                }}
              >
                Thoughtful Comforts for Your{" "}
                <span style={{ color: "#c2882b", fontStyle: "italic" }}>
                  Sacred Journey
                </span>
              </h2>

              <p
                style={{
                  color: "#57534e",
                  fontSize: isMobile ? "0.88rem" : "1.02rem",
                  lineHeight: 1.6,
                  margin: isMobile ? "0 0 16px 0" : "0 0 24px 0",
                  fontWeight: 400,
                }}
              >
                Every amenity at Vatsalya Bhawan is designed to make your pilgrimage restorative, convenient, and deeply peaceful.
              </p>

              {!isMobile && (
                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "#1c1917",
                      }}
                    >
                      {currentAmenity.title}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "#fef3c7",
                        color: "#92400e",
                      }}
                    >
                      {currentAmenity.tag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.84rem",
                      color: "#78716c",
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    {currentAmenity.details}
                  </p>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: isMobile ? "460px" : "550px",
                  height: isMobile ? "500px" : "590px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {amenityList.map((item, idx) => (
                  <PolaroidCard
                    key={item.num}
                    item={item}
                    index={idx}
                    total={amenityList.length}
                    smoothProgress={smoothProgress}
                    isTop={idx === activeIdx}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Amenities;
