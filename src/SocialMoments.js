import React from "react";
import { Sparkles } from "lucide-react";
import Images from "./utils/images";

const stayMoments = [
  { img: Images.frontView, caption: "Twilight at Vatsalya Bhawan" },
  { img: Images.roomView1, caption: "Sacred Sunrise from Private Balcony" },
  { img: Images.godImage, caption: "Peaceful Devotional Living" },
  { img: Images.commonRoom1, caption: "Welcoming Pilgrims Day & Night" },
  { img: Images.roomDeluxe, caption: "Restful Sanctuaries after Aarti" },
  { img: Images.mainGate, caption: "500m Walk to Ram Janmabhoomi" },
];

const SocialMoments = () => {
  return (
    <section id="social" style={{ background: "#ffffff", padding: "70px 0" }}>
      <div className="container-section">
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#c2882b",
              fontWeight: 700,
              fontSize: "0.76rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            <Sparkles size={14} />
            FOLLOW THE STAY
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.7rem, 3.2vw, 2.5rem)",
              fontWeight: 700,
              color: "#1c1917",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Glimpses of Ayodhya & Our{" "}
            <span style={{ color: "#c2882b", fontStyle: "italic" }}>
              Sacred Abode
            </span>
          </h2>
          <p
            style={{
              color: "#78716c",
              fontSize: "0.98rem",
              marginTop: "8px",
              maxWidth: "500px",
              margin: "8px auto 0 auto",
            }}
          >
            Connect with our community and stay updated with festival aarti times and Ayodhya yatra tips.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "14px",
          }}
        >
          {stayMoments.map((m, idx) => (
            <div
              key={idx}
              style={{
                position: "relative",
                height: "190px",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                cursor: "pointer",
              }}
            >
              <img
                src={m.img}
                alt={m.caption}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.35s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "12px",
                  opacity: 0.9,
                }}
              >
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  {m.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMoments;
