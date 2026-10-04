import React, { useEffect, useRef } from "react";
import Images from "./utils/images";

const stats = [
  { value: "500m", label: "from Ram Janmabhoomi" },
  { value: "160M+", label: "Visitors to Ayodhya in 2024" },
  { value: "24/7", label: "Front Desk Support" },
  { value: "100%", label: "Pure Vegetarian Meals" },
];

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{ background: "var(--cream)", padding: "96px 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "64px", alignItems: "center" }}>

          {/* Image collage */}
          <div className="reveal" style={{ position: "relative" }}>
            <div style={{ position: "relative", paddingBottom: "110%" }}>
              {/* Main image */}
              <img
                src={Images.frontView}
                alt="Vatsalya Bhawan building and front view"
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: "75%", height: "75%",
                  objectFit: "cover", borderRadius: "4px",
                  boxShadow: "var(--shadow-card)",
                }}
              />
              {/* Secondary image */}
              <img
                src={Images.commonRoom2}
                alt="Cozy room interior"
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: "55%", height: "55%",
                  objectFit: "cover", borderRadius: "4px",
                  boxShadow: "var(--shadow-card)",
                  border: "4px solid var(--cream)",
                }}
              />
              {/* Gold badge */}
              <div
                style={{
                  position: "absolute", top: "48%", right: "20%",
                  background: "linear-gradient(135deg, #b45309, #d97706)",
                  color: "white", borderRadius: "50%",
                  width: "90px", height: "90px",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em",
                  textTransform: "uppercase", textAlign: "center",
                  boxShadow: "0 8px 24px rgba(180,83,9,0.4)",
                  zIndex: 3,
                }}
              >
                <span style={{ fontSize: "1.5rem", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>★</span>
                Premium<br/>Stay
              </div>
              {/* Decorative border element */}
              <div
                style={{
                  position: "absolute", top: "-12px", left: "-12px",
                  width: "80px", height: "80px",
                  border: "2px solid var(--gold-light)",
                  borderRadius: "4px", zIndex: 0,
                }}
              />
            </div>
          </div>

          {/* Text content */}
          <div>
            <div className="ornament reveal">
              <div className="ornament-line" />
              <div className="ornament-diamond" />
              <div className="ornament-line" />
            </div>
            <span className="section-label reveal">About Us</span>
            <h2
              className="font-display reveal"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--saffron-deep)", lineHeight: 1.2, margin: "0.5rem 0 1.25rem" }}
            >
              Your Sacred Home<br />
              <em style={{ fontStyle: "italic", color: "var(--saffron-light)" }}>Away from Home</em>
            </h2>

            <p className="reveal" style={{ color: "var(--text-mid)", lineHeight: 1.85, marginBottom: "1rem", fontSize: "0.975rem" }}>
              Nestled in the holy city of Ayodhya — the birthplace of Lord Shri Ram — <strong>Vatsalya Bhawan</strong> is a sanctuary of warmth, devotion, and modern comfort. Located at <strong>Tarun Pura Road, Kaniganj</strong>, we are just 500 metres from the sacred Shri Ram Janmabhoomi Temple.
            </p>
            <p className="reveal" style={{ color: "var(--text-mid)", lineHeight: 1.85, marginBottom: "2rem", fontSize: "0.975rem" }}>
              Whether you are a devoted pilgrim seeking proximity to the divine or a leisure traveller exploring this ancient land, our hospitality is crafted to make your journey truly memorable.
            </p>

            {/* Features list */}
            <ul className="reveal" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "2.5rem" }}>
              {[
                "500m walk to Shri Ram Janmabhoomi Temple",
                "Hanuman Garhi Temple nearby",
                "AC & Non-AC rooms for every budget",
                "Free Wi-Fi & 24/7 Power Backup",
                "Pure vegetarian meals available",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "var(--text-mid)", fontSize: "0.9rem" }}>
                  <span style={{ color: "var(--gold)", fontSize: "0.8rem", marginTop: "2px", flexShrink: 0 }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="reveal">
              <a href="#rooms" className="btn-gold">Explore Our Rooms</a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1px",
            marginTop: "72px",
            background: "var(--parchment)",
            borderRadius: "6px",
            overflow: "hidden",
            boxShadow: "var(--shadow-warm)",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--cream)",
                padding: "28px 20px",
                textAlign: "center",
                borderRight: "1px solid var(--cream-dark)",
              }}
            >
              <p
                className="font-display"
                style={{ fontSize: "2rem", fontWeight: 800, color: "var(--saffron-mid)", lineHeight: 1 }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
