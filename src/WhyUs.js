import React from "react";
import { Sparkles, HeartHandshake, ShieldCheck, MapPin, Coffee } from "lucide-react";

const pillars = [
  {
    num: "01",
    stat: "500 M",
    title: "WALKING DISTANCE TO RAM JANMABHOOMI",
    highlight: "Avoid Vehicle Barricades & Morning Traffic",
    desc: "Located directly in the revered inner corridor of Ayodhya Dham. Attend the early morning 6:00 AM Mangala Aarti or late evening Shringar Aarti with a gentle 5-minute stroll.",
    icon: MapPin,
    badge: "Prime Location",
  },
  {
    num: "02",
    stat: "9.2 / 10",
    title: "BOOKING.COM PILGRIM CHOICE RECOGNITION",
    highlight: "Consistently Celebrated by Devotees",
    desc: "Earned through spotless cleanliness, prompt attention to guest needs, and unwavering traditional hospitality that turns first-time visitors into repeat family pilgrims.",
    icon: ShieldCheck,
    badge: "Verified Trust",
  },
  {
    num: "03",
    stat: "24 × 7",
    title: "DEDICATED SENIOR & MEDICAL CARE",
    highlight: "Peace of Mind for Elderly Pilgrims",
    desc: "Traveling with senior parents? Enjoy ground-floor and elevator accessibility, on-call doctor assistance, wheelchair guidance, and 24/7 front desk personnel always ready to help.",
    icon: HeartHandshake,
    badge: "Compassionate Care",
  },
  {
    num: "04",
    stat: "100%",
    title: "PURE SATVIK & PEACEFUL LIVING",
    highlight: "Sanctified Vegetarian Environment",
    desc: "Strictly vegetarian and alcohol-free property filled with divine calmness. Wake up to the sacred sound of temple bells and savor warm, wholesome vegetarian cuisine.",
    icon: Coffee,
    badge: "Spiritual Harmony",
  },
];

const WhyUs = () => {
  return (
    <section
      id="why-us"
      style={{
        background: "#0f0d0c",
        color: "#fef3c7",
        padding: "90px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(194,136,43,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-section relative z-10">
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#fbbf24",
              fontWeight: 700,
              fontSize: "0.76rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            <Sparkles size={14} />
            WHY CHOOSE VATSALYA BHAWAN
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.18,
              margin: 0,
            }}
          >
            The Preferred Choice for Pilgrims in{" "}
            <span style={{ color: "#fbbf24", fontStyle: "italic" }}>
              Ayodhya
            </span>
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "1.1rem",
              marginTop: "14px",
              maxWidth: "600px",
              margin: "14px auto 0 auto",
            }}
          >
            Four genuine pillars that make your stay distinctly peaceful, respectful, and effortless.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "28px",
          }}
        >
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.num}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(251, 191, 36, 0.2)",
                  borderRadius: "14px",
                  padding: "32px 26px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backdropFilter: "blur(6px)",
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.55)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.2)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "24px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#fbbf24",
                        background: "rgba(251, 191, 36, 0.12)",
                        padding: "4px 10px",
                        borderRadius: "4px",
                      }}
                    >
                      {p.badge}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        color: "rgba(255,255,255,0.25)",
                      }}
                    >
                      {p.num}
                    </span>
                  </div>

                  <div
                    className="font-display"
                    style={{
                      fontSize: "clamp(2.4rem, 4vw, 3.2rem)",
                      fontWeight: 800,
                      color: "#fbbf24",
                      lineHeight: 1,
                      marginBottom: "12px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {p.stat}
                  </div>

                  <h3
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      color: "#ffffff",
                      textTransform: "uppercase",
                      margin: "0 0 6px 0",
                    }}
                  >
                    {p.title}
                  </h3>

                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#fde68a",
                      marginBottom: "14px",
                    }}
                  >
                    {p.highlight}
                  </div>

                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "rgba(255, 255, 255, 0.72)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  <Icon size={18} color="#fbbf24" />
                  <span style={{ fontSize: "0.78rem" }}>Vatsalya Bhawan Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
