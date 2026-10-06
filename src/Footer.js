import React from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import Images from "./utils/images";

const scrollToSection = (id) => {
  if (id === "home" || !id) {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  } else {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

const Footer = () => {
  const quickLinks = [
    { name: "Home", targetId: "home" },
    { name: "Room Showcase", targetId: "room-showcase" },
    { name: "Ratings & Trust", targetId: "trust" },
    { name: "Amenities", targetId: "amenities" },
    { name: "Our Rooms & Tariffs", targetId: "rooms" },
    { name: "Location & Routes", targetId: "location" },
    { name: "Guest Reviews", targetId: "testimonials" },
    { name: "Why Stay With Us", targetId: "why-us" },
    { name: "Plan Your Stay", targetId: "contact" },
  ];

  const exploreAyodhya = [
    { name: "Shri Ram Janmabhoomi Darshan", targetId: "location" },
    { name: "Hanuman Garhi Temple Guide", targetId: "location" },
    { name: "Kanak Bhawan History", targetId: "location" },
    { name: "Ghats of Saryu & Evening Aarti", targetId: "location" },
    { name: "Ayodhya Yatra Itinerary", targetId: "location" },
    { name: "Satvik Dining & Local Food", targetId: "amenities" },
  ];

  return (
    <footer style={{ background: "#0c0a09", color: "rgba(255,255,255,0.75)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="container-section" style={{ padding: "64px 16px 40px 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          <div>
            <h4
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "18px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "8px",
              }}
            >
              Community & Social
            </h4>
            <p style={{ fontSize: "0.82rem", lineHeight: 1.5, color: "rgba(255,255,255,0.65)", marginBottom: "16px" }}>
              Follow our daily spiritual updates, festival aarti schedules, and pilgrim stories.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginBottom: "20px", padding: "8px 0" }}>
              <a
                href="https://www.instagram.com/vatsalyabhawan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.15)";
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <img
                  src={Images.instaIcon}
                  alt="Instagram"
                  loading="lazy"
                  decoding="async"
                  style={{ width: "44px", height: "44px", objectFit: "contain", display: "block" }}
                />
              </a>
              <a
                href="https://www.facebook.com/vatsalyabhawan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.15)";
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <img
                  src={Images.facebookIcon}
                  alt="Facebook"
                  loading="lazy"
                  decoding="async"
                  style={{ width: "44px", height: "44px", objectFit: "contain", display: "block" }}
                />
              </a>
              <a
                href="https://www.google.com/travel/hotels/s/VRKk9iQtHDwYtmhh9"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Maps"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.15)";
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <img
                  src={Images.googleMapIcon}
                  alt="Google Maps"
                  loading="lazy"
                  decoding="async"
                  style={{ width: "44px", height: "44px", objectFit: "contain", display: "block" }}
                />
              </a>
            </div>

            <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
              Check-in: 12:00 PM · Check-out: 11:00 AM<br />
              100% Pure Vegetarian & Sanctified Environment
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <button
              onClick={() => scrollToSection("home")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <img
                src={Images.logo}
                alt="Vatsalya Bhawan Logo"
                loading="lazy"
                decoding="async"
                style={{ width: "42px", height: "42px", objectFit: "contain", borderRadius: "50%", background: "#fff", padding: "2px" }}
              />
              <div>
                <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.2 }}>
                  VATSALYA BHAWAN
                </h3>
                <span style={{ fontSize: "0.78rem", color: "#fbbf24", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                  AYODHYA DHAM
                </span>
              </div>
            </button>

            <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "rgba(255,255,255,0.65)", margin: 0 }}>
              Your peaceful sacred home away from home. Located just 500 metres from Shri Ram Janmabhoomi temple for a blessed pilgrimage.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.84rem" }}>
                <MapPin size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Near Shri Ram Janmabhoomi, Kaniganj, Ayodhya, Uttar Pradesh 224123</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.84rem" }}>
                <Phone size={15} color="#fbbf24" />
                <a href="tel:+919451338729" style={{ color: "#ffffff", textDecoration: "none", fontWeight: 600 }}>
                  +91 94513 38729
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.84rem" }}>
                <MessageCircle size={15} color="#25d366" />
                <a href="https://wa.me/919451338729" target="_blank" rel="noopener noreferrer" style={{ color: "#25d366", textDecoration: "none", fontWeight: 600 }}>
                  Chat on WhatsApp
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.84rem" }}>
                <Mail size={15} color="#fbbf24" />
                <a href="mailto:vatsalya.bhawan.april@gmail.com" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none" }}>
                  vatsalya.bhawan.april@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "18px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "8px",
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => scrollToSection(item.targetId)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.85rem",
                      textAlign: "left",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#fbbf24")}
                    onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.7)")}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "18px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "8px",
              }}
            >
              Explore Ayodhya
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
              {exploreAyodhya.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => scrollToSection(item.targetId)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.85rem",
                      textAlign: "left",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#fbbf24")}
                    onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.7)")}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <div>
            © {new Date().getFullYear()} Vatsalya Bhawan, Ayodhya. All rights reserved.
          </div>
          <div>
            Near Shri Ram Janmabhoomi · Ayodhya Dham, UP
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;