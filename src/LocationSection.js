import React, { useState, useEffect, useRef } from "react";
import { Navigation, Train, Plane, Car, Compass, ExternalLink } from "lucide-react";

const distances = [
  { place: "Shri Ram Janmabhoomi Temple", dist: "500 m", time: "5 min walk", highlight: true },
  { place: "Hanuman Garhi Temple", dist: "1.2 km", time: "6 min drive" },
  { place: "Kanak Bhawan", dist: "1.4 km", time: "7 min drive" },
  { place: "Ayodhya Dham Railway Station", dist: "2.5 km", time: "10 min drive" },
  { place: "Ayodhya Cantt (Faizabad) Station", dist: "9.0 km", time: "22 min drive" },
  { place: "Maharishi Valmiki Airport (AYJ)", dist: "8.5 km", time: "18 min drive" },
];

const routes = {
  train: {
    title: "From Railway Stations",
    icon: Train,
    points: [
      "From Ayodhya Dham Junction (2.5 km): Take an authorized electric rickshaw or prepaid auto directly to Vatsalya Bhawan (approx. 10 mins).",
      "From Ayodhya Cantt / Faizabad Junction (9 km): Taxis, Ola/Uber, and direct autos are readily available outside the main gate (approx. 20–25 mins).",
    ],
  },
  flight: {
    title: "From Ayodhya Airport (AYJ)",
    icon: Plane,
    points: [
      "Located just 8.5 km from the hotel via the main Airport-Dharampath link road.",
      "Airport prepaid taxi counter and app cabs (Ola/Uber) reach the hotel in under 20 minutes.",
      "We can also arrange pre-booked private airport pickup upon prior request via WhatsApp.",
    ],
  },
  road: {
    title: "By Private Car / Bus",
    icon: Car,
    points: [
      "Accessible via Lucknow-Gorakhpur National Highway (NH 27) connecting smoothly into Ayodhya.",
      "Dedicated on-site secure parking is available on property for guest vehicles.",
      "Enter via the designated pilgrim approach corridor with direct road connectivity.",
    ],
  },
};

const LocationSection = () => {
  const [activeTab, setActiveTab] = useState("train");
  const [showMap, setShowMap] = useState(false);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const ActiveIcon = routes[activeTab].icon;


  return (
    <section id="location" style={{ background: "#fbf8ee", padding: "80px 0" }}>
      <div className="container-section">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
            <Compass size={14} />
            WHERE WE ARE
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 700,
              color: "#1c1917",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Prime Sacred Location in{" "}
            <span style={{ color: "#c2882b", fontStyle: "italic" }}>
              Ayodhya Dham
            </span>
          </h2>
          <p
            style={{
              color: "#78716c",
              fontSize: "1.05rem",
              marginTop: "12px",
              maxWidth: "580px",
              margin: "12px auto 0 auto",
            }}
          >
            Stay within peaceful walking distance of Shri Ram Janmabhoomi — no traffic delays or transportation hurdles for early morning Aarti.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          {distances.map((d) => (
            <div
              key={d.place}
              style={{
                background: d.highlight ? "#fef3c7" : "#ffffff",
                border: d.highlight ? "1px solid #fbbf24" : "1px solid rgba(0,0,0,0.06)",
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    color: d.highlight ? "#92400e" : "#c2882b",
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {d.dist}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: d.highlight ? "#78350f" : "#78716c",
                    textTransform: "uppercase",
                  }}
                >
                  {d.time}
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "#1c1917",
                  marginTop: "6px",
                }}
              >
                {d.place}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "36px",
            alignItems: "stretch",
          }}
        >
          <div
            ref={mapContainerRef}
            style={{
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              minHeight: "360px",
              position: "relative",
              background: "#f1f5f9",
            }}
          >
            {showMap ? (
              <iframe
                title="Vatsalya Bhawan Ayodhya Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.2415848731336!2d82.1932644!3d26.7972744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a078d103f6fdb%3A0xe55655519fbb1c37!2sShri%20Ram%20Janmabhoomi%20Mandir!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "360px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div
                style={{
                  minHeight: "360px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  gap: "10px",
                }}
              >
                <Compass size={28} style={{ opacity: 0.6 }} />
                <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>Loading Ayodhya Map...</span>
              </div>
            )}
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                right: "16px",
                background: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(6px)",
                padding: "12px 18px",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#1c1917" }}>
                  Vatsalya Bhawan, Ayodhya
                </div>
                <div style={{ fontSize: "0.78rem", color: "#78716c" }}>
                  Near Shri Ram Janmabhoomi, Ayodhya, UP 224123
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Ram+Janmabhoomi+Ayodhya"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#c2882b",
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Navigation size={13} />
                Get Directions
              </a>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid rgba(0,0,0,0.06)",
              padding: "32px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              className="font-display"
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#1c1917",
                marginBottom: "16px",
              }}
            >
              How to Reach Us
            </h3>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "20px",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                paddingBottom: "12px",
              }}
            >
              {Object.keys(routes).map((key) => {
                const TabIcon = routes[key].icon;
                const isSelected = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "6px",
                      background: isSelected ? "#fef3c7" : "transparent",
                      border: "none",
                      color: isSelected ? "#92400e" : "#78716c",
                      fontSize: "0.86rem",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <TabIcon size={16} />
                    <span style={{ textTransform: "capitalize" }}>{key}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <ActiveIcon size={18} color="#c2882b" />
                <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#1c1917" }}>
                  {routes[activeTab].title}
                </h4>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {routes[activeTab].points.map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span
                      style={{
                        background: "#fef3c7",
                        color: "#92400e",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {i + 1}
                    </span>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#57534e", lineHeight: 1.55 }}>
                      {pt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: "24px",
                padding: "14px 18px",
                background: "#faf7f2",
                borderRadius: "8px",
                border: "1px dashed rgba(194,136,43,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "0.82rem", color: "#78716c" }}>
                Need route assistance or cab booking?
              </span>
              <a
                href="https://wa.me/919451338729?text=Hello%20Vatsalya%20Bhawan%2C%20I%20need%20help%20with%20directions%20to%20the%20hotel."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#25d366",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                WhatsApp Us <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
