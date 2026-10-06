import React, { useState, useEffect } from "react";

import bookingLogo from "./assets/ota-logo/Booking-Logo.png";
import agodaLogo from "./assets/ota-logo/agoda-logo.png";
import airbnbLogo from "./assets/ota-logo/airbnb-logo.png";
import easeMyTripLogo from "./assets/ota-logo/ease-my-trip-logo.png";
import goibiboLogo from "./assets/ota-logo/goibibo-logo.png";
import hotelsComLogo from "./assets/ota-logo/hotels_com-logo.png";
import makemytripLogo from "./assets/ota-logo/makemytrip-logo.png";
import tripadvisorLogo from "./assets/ota-logo/tripadvisor-logo.png";

const platformRatings = [
  {
    name: "Booking.com",
    logo: bookingLogo,
    score: "9.2",
    outOf: "/ 10",
    label: "Superb",
  },
  {
    name: "Tripadvisor",
    logo: tripadvisorLogo,
    score: "4.8",
    outOf: "/ 5",
    label: "Excellent",
  },
  {
    name: "MakeMyTrip",
    logo: makemytripLogo,
    score: "4.2",
    outOf: "/ 5",
    label: "Exceptional",
  },
  {
    name: "Goibibo",
    logo: goibiboLogo,
    score: "4.3",
    outOf: "/ 5",
    label: "Excellent",
  },
  {
    name: "Agoda",
    logo: agodaLogo,
    score: "4.8",
    outOf: "/ 5",
    label: "Superb",
  },
  {
    name: "Airbnb",
    logo: airbnbLogo,
    score: "4.9",
    outOf: "/ 5",
    label: "Superhost",
  },
  {
    name: "EaseMyTrip",
    logo: easeMyTripLogo,
    score: "4.7",
    outOf: "/ 5",
    label: "Great Choice",
  },
  {
    name: "Hotels.com",
    logo: hotelsComLogo,
    score: "4.6",
    outOf: "/ 5",
    label: "Verified",
  },
];

const RatingCard = ({ p, isLast = false, isDesktop = false }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: isDesktop ? "1 1 0px" : "0 0 auto",
      minWidth: isDesktop ? 0 : "150px",
      padding: isDesktop ? "0 10px" : "0 18px",
      borderRight: isLast ? "none" : "1px dashed rgba(0, 0, 0, 0.15)",
      cursor: "default",
      userSelect: "none",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        height: "42px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "8px",
        width: "100%",
      }}
    >
      <img
        src={p.logo}
        alt={p.name}
        loading="lazy"
        decoding="async"
        style={{
          maxHeight: "36px",
          maxWidth: isDesktop ? "100%" : "125px",
          width: "auto",
          objectFit: "contain",
        }}
      />
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "3px",
        lineHeight: 1.1,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <span
        style={{
          fontSize: "1.42rem",
          fontWeight: 800,
          color: "#1c1917",
          letterSpacing: "-0.01em",
        }}
      >
        {p.score}
      </span>
      <span
        style={{
          fontSize: "0.92rem",
          fontWeight: 700,
          color: "#78716c",
        }}
      >
        {p.outOf}
      </span>
    </div>

    <span
      style={{
        fontSize: "0.82rem",
        fontWeight: 550,
        color: "#78716c",
        marginTop: "4px",
        whiteSpace: "nowrap",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {p.label}
    </span>
  </div>
);

const BookingPlatforms = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const marqueeList = [...platformRatings, ...platformRatings, ...platformRatings];

  return (
    <section
      id="platforms"
      style={{
        background: "#faf7f2",
        padding: isMobile ? "22px 0" : "38px 0",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes otaMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .ota-marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: otaMarquee 28s linear infinite;
        }
        .ota-marquee-track:hover,
        .ota-marquee-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          padding: isMobile ? "0" : "0 30px",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {isMobile && (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "40px",
                background: "linear-gradient(to right, #faf7f2, transparent)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                width: "40px",
                background: "linear-gradient(to left, #faf7f2, transparent)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          </>
        )}

        {isMobile ? (
          <div
            style={{
              overflowX: "hidden",
              width: "100%",
              padding: "6px 0",
              cursor: "grab",
            }}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`ota-marquee-track ${isPaused ? "ota-marquee-paused" : ""}`}
            >
              {marqueeList.map((p, idx) => (
                <RatingCard key={`${p.name}-${idx}`} p={p} isDesktop={false} />
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              overflow: "hidden",
              padding: "6px 0",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                minWidth: "175px",
                flexShrink: 0,
                paddingRight: "22px",
                paddingLeft: "4px",
                borderRight: "1px dashed rgba(0, 0, 0, 0.16)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              <h3
                className="font-display"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#c2882b",
                  lineHeight: 1.22,
                  letterSpacing: "0.01em",
                  margin: 0,
                }}
              >
                VATSALYA Bhawan
                <br />
                <span style={{ color: "#c2882b", fontWeight: 700 }}>
                  Ayodhya
                </span>
              </h3>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#57534e",
                  fontWeight: 600,
                  marginTop: "6px",
                  marginBottom: 0,
                  whiteSpace: "nowrap",
                }}
              >
                Top Ratings Across OTAs
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                width: "100%",
                justifyContent: "space-between",
                minWidth: 0,
              }}
            >
              {platformRatings.map((p, idx) => (
                <RatingCard
                  key={p.name}
                  p={p}
                  isDesktop={true}
                  isLast={idx === platformRatings.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingPlatforms;
