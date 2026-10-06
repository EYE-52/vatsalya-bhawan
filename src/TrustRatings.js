import React from "react";
import { Star, ShieldCheck } from "lucide-react";
import BookingPlatforms from "./BookingPlatforms";
import googleReviewLogo from "./assets/ota-logo/google-review-logo.png";
import { useGoogleReviews } from "./utils/googleReviews";

const TrustRatings = () => {
  const googleData = useGoogleReviews();

  return (
    <section id="trust" style={{ background: "#faf7f2" }}>
      <div
        style={{
          padding: "54px 20px 28px 20px",
          maxWidth: "1280px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "9px",
            padding: "6px 18px 6px 8px",
            borderRadius: "9999px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.6) 100%)",
            border: "1px solid rgba(217, 119, 6, 0.3)",
            boxShadow: "0 4px 20px -2px rgba(217, 119, 6, 0.16), 0 1px 3px rgba(0, 0, 0, 0.04)",
            backdropFilter: "blur(12px)",
            marginBottom: "20px",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(180, 83, 9, 0.35)",
            }}
          >
            <ShieldCheck size={14} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontSize: "0.76rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 800,
              background: "linear-gradient(90deg, #92400e 0%, #b45309 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            TRUSTED BY OUR GUESTS
          </span>
        </div>

        <h2
          className="font-display"
          style={{
            fontSize: "clamp(1.6rem, 3.2vw, 2.5rem)",
            fontWeight: 700,
            color: "#1c1917",
            lineHeight: 1.25,
            margin: "0 0 24px 0",
          }}
        >
          “One of the Most Peaceful Stays for Our{" "}
          <span style={{ color: "#c2882b", fontStyle: "italic" }}>
            Ayodhya Pilgrimage
          </span>”
        </h2>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.09)",
            borderRadius: "16px",
            boxShadow: "0 12px 36px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
            padding: "20px 28px",
            maxWidth: "510px",
            width: "100%",
            boxSizing: "border-box",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingRight: "22px",
              borderRight: "1px solid rgba(0,0,0,0.11)",
            }}
          >
            <img
              src={googleReviewLogo}
              alt="Google Reviews"
              loading="lazy"
              decoding="async"
              style={{
                maxHeight: "56px",
                maxWidth: "185px",
                width: "auto",
                objectFit: "contain",
                marginBottom: "5px",
              }}
            />
            <span
              style={{
                fontSize: "0.82rem",
                color: "#78716c",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              Verified Guest Ratings
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: "22px",
            }}
          >
            <div
              style={{
                fontSize: "3.2rem",
                fontWeight: 800,
                color: "#1c1917",
                lineHeight: 1.0,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {googleData.rating.toFixed(1)}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3.5px",
                color: "#f59e0b",
                marginTop: "7px",
                marginBottom: "5px",
              }}
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={19} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <div
              style={{
                fontSize: "0.92rem",
                fontWeight: 600,
                color: "#57534e",
              }}
            >
              {googleData.totalReviews}+ reviews
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              height: "1px",
              width: "48px",
              background: "linear-gradient(to right, transparent, rgba(194, 136, 43, 0.45))",
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "clamp(0.82rem, 1.8vw, 0.92rem)",
              fontWeight: 600,
              color: "#57534e",
              letterSpacing: "0.02em",
            }}
          >
            Recognized with stellar guest reviews & high ratings across leading travel platforms (OTAs)
          </p>
          <div
            style={{
              height: "1px",
              width: "48px",
              background: "linear-gradient(to left, transparent, rgba(194, 136, 43, 0.45))",
            }}
          />
        </div>
      </div>

      <BookingPlatforms />
    </section>
  );
};

export default TrustRatings;
