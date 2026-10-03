import React, { useEffect, useRef } from "react";
import { Check } from "lucide-react";

const rooms = [
  {
    name: "Standard Room",
    tagline: "Simple & Comfortable",
    description: "Perfect for solo pilgrims and budget-conscious travellers. Clean, cozy, and thoughtfully equipped.",
    image: "/assets/room-image-2.jpeg",
    badge: "Best Value",
    badgeColor: "#059669",
    features: ["Comfortable Bed", "Private Bathroom", "Free Wi-Fi", "Daily Housekeeping"],
    type: "Non-AC / AC Available",
  },
  {
    name: "Deluxe Room",
    tagline: "Comfort & Elegance",
    description: "A spacious, air-conditioned room with a city view — ideal for couples and family pilgrimages.",
    image: "/assets/room-image-5.jpeg",
    badge: "Most Popular",
    badgeColor: "#b45309",
    features: ["King Size Bed", "Air Conditioning", "City View Balcony", "Free Wi-Fi", "Work Desk"],
    type: "AC Room",
  },
  {
    name: "Family Suite",
    tagline: "Space for the Whole Family",
    description: "Our largest accommodation, designed to host families with ample space, two sleeping areas, and a cozy sitting area.",
    image: "/assets/room-image-8.jpeg",
    badge: "Family Pick",
    badgeColor: "#7c3aed",
    features: ["Two Queen Beds", "Sitting Lounge", "Air Conditioning", "Free Wi-Fi", "Luggage Storage"],
    type: "AC Suite",
  },
];

const Rooms = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="rooms" ref={sectionRef} style={{ background: "var(--cream-dark)", padding: "96px 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center reveal" style={{ marginBottom: "60px" }}>
          <div className="ornament">
            <div className="ornament-line" />
            <div className="ornament-diamond" />
            <div className="ornament-line" />
          </div>
          <span className="section-label">Accommodations</span>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--saffron-deep)", marginTop: "0.5rem" }}
          >
            Our <span style={{ color: "var(--saffron-light)", fontStyle: "italic" }}>Rooms & Suites</span>
          </h2>
          <p style={{ color: "var(--text-light)", marginTop: "1rem", maxWidth: "480px", margin: "1rem auto 0", lineHeight: 1.7 }}>
            Each room is thoughtfully designed to provide a peaceful sanctuary after your spiritual journey
          </p>
        </div>

        {/* Room cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px" }}>
          {rooms.map((room, i) => (
            <article
              key={room.name}
              className="reveal card-hover"
              style={{
                background: "var(--white)",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Image */}
              <div className="img-zoom" style={{ height: "240px", position: "relative" }}>
                <img src={room.image} alt={room.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {/* Badge */}
                <div
                  style={{
                    position: "absolute", top: "16px", left: "16px",
                    background: room.badgeColor, color: "#fff",
                    fontSize: "0.65rem", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "4px 10px", borderRadius: "100px",
                  }}
                >
                  {room.badge}
                </div>
                {/* Type tag */}
                <div
                  style={{
                    position: "absolute", bottom: "16px", right: "16px",
                    background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.9)",
                    fontSize: "0.65rem", fontWeight: 500,
                    letterSpacing: "0.08em",
                    padding: "3px 10px", borderRadius: "100px",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {room.type}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "28px" }}>
                <p style={{ color: "var(--saffron-light)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
                  {room.tagline}
                </p>
                <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "10px" }}>
                  {room.name}
                </h3>
                <p style={{ color: "var(--text-light)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "20px" }}>
                  {room.description}
                </p>

                {/* Features */}
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "7px", marginBottom: "24px" }}>
                  {room.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-mid)" }}>
                      <span style={{ background: "var(--cream-dark)", borderRadius: "50%", padding: "2px", display: "flex" }}>
                        <Check size={12} color="var(--saffron-mid)" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div style={{ height: "1px", background: "var(--cream-dark)", marginBottom: "20px" }} />

                <div style={{ display: "flex", gap: "10px" }}>
                  <a href="#contact" className="btn-gold" style={{ flex: 1, textAlign: "center", padding: "12px 16px", fontSize: "0.78rem" }}>
                    Book Now
                  </a>
                  <a href="#contact" className="btn-outline-gold" style={{ padding: "12px 16px", fontSize: "0.78rem" }}>
                    Enquire
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Note */}
        <p className="reveal text-center" style={{ color: "var(--text-light)", marginTop: "36px", fontSize: "0.85rem" }}>
          All rates are inclusive of GST. For group bookings or special requirements, please{" "}
          <a href="#contact" style={{ color: "var(--saffron-mid)", fontWeight: 500 }}>contact us directly</a>.
        </p>
      </div>
    </section>
  );
};

export default Rooms;