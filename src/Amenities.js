import React, { useEffect, useRef } from "react";
import { Wifi, Wind, Zap, Shield, Utensils, Car, Clock, MapPin, Droplets, Tv } from "lucide-react";
import Images from "./utils/images";

const amenities = [
  { icon: Wifi,     label: "Free High-Speed Wi-Fi",     desc: "Stay connected throughout your spiritual journey" },
  { icon: Wind,     label: "Air Conditioning",           desc: "Comfortable climate control in all AC rooms" },
  { icon: Zap,      label: "24/7 Power Backup",          desc: "Uninterrupted power supply at all times" },
  { icon: Shield,   label: "24/7 Front Desk",            desc: "Our team is always ready to assist you" },
  { icon: Utensils, label: "Pure Vegetarian Meals",      desc: "Satvik food options for the devout traveller" },
  { icon: Car,      label: "Parking Available",          desc: "Convenient on-site and nearby parking" },
  { icon: Clock,    label: "Daily Housekeeping",         desc: "Fresh linens and meticulous room service" },
  { icon: MapPin,   label: "Prime Location",             desc: "500m from Shri Ram Janmabhoomi Temple" },
  { icon: Droplets, label: "Hot & Cold Water",           desc: "Geysers and modern bathroom amenities" },
  { icon: Tv,       label: "In-Room Television",         desc: "Entertainment for your leisure time" },
];

const Amenities = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 80);
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
    <section
      id="amenities"
      ref={sectionRef}
      style={{
        padding: "96px 0",
        background: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle at 2px 2px, #d97706 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Heading */}
        <div className="text-center" style={{ marginBottom: "60px" }}>
          <div className="ornament reveal">
            <div className="ornament-line" style={{ background: "rgba(251,191,36,0.4)" }} />
            <div className="ornament-diamond" style={{ background: "#d97706" }} />
            <div className="ornament-line" style={{ background: "rgba(251,191,36,0.4)" }} />
          </div>
          <span className="section-label reveal" style={{ color: "#d97706" }}>What We Offer</span>
          <h2
            className="font-display reveal"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#fff", marginTop: "0.5rem" }}
          >
            Hotel <span style={{ color: "#fbbf24" }}>Amenities</span>
          </h2>
          <p className="reveal" style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.75rem", maxWidth: "480px", margin: "0.75rem auto 0", lineHeight: 1.7 }}>
            Everything you need for a comfortable and peaceful stay in the holy city of Ayodhya
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {amenities.map((a, i) => {
            const Icon = a.icon;
            return (
              <div
                key={a.label}
                className="reveal card-hover"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(217,119,6,0.2)",
                  borderRadius: "8px",
                  padding: "28px 24px",
                  cursor: "default",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div
                  style={{
                    width: "48px", height: "48px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, rgba(180,83,9,0.3), rgba(217,119,6,0.2))",
                    border: "1px solid rgba(217,119,6,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Icon size={22} color="#fbbf24" />
                </div>
                <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem", marginBottom: "6px" }}>
                  {a.label}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", lineHeight: 1.6 }}>
                  {a.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom image strip */}
        <div
          className="reveal"
          style={{
            marginTop: "64px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {[Images.amenitiesImg, Images.roomView1, Images.washroom1].map((src, i) => (
            <div key={i} className="img-zoom" style={{ height: "200px" }}>
              <img src={src} alt="Amenity" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
