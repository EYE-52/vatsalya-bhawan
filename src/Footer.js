import React from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const navLinks = [
    { name: "Home",      href: "#home" },
    { name: "About",     href: "#about" },
    { name: "Rooms",     href: "#rooms" },
    { name: "Amenities", href: "#amenities" },
    { name: "Gallery",   href: "#gallery" },
    { name: "Contact",   href: "#contact" },
  ];

  const nearbyAttractions = [
    "Shri Ram Janmabhoomi Mandir",
    "Hanuman Garhi Temple",
    "Kanak Bhavan",
    "Saryu River Ghats",
    "Raja Dashrath Mahal",
    "Naya Ghat",
  ];

  return (
    <footer>
      {/* CTA Band */}
      <div
        style={{
          background: "linear-gradient(135deg, #92400e 0%, #b45309 40%, #d97706 100%)",
          padding: "56px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-40px", left: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "-30px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px", fontWeight: 600 }}>
          ✦ Ready to Visit the Holy City? ✦
        </p>
        <h2
          className="font-display"
          style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}
        >
          Book Your Stay at Vatsalya Bhawan
        </h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", marginBottom: "28px" }}>
          Experience divinity and comfort — 500m from Shri Ram Janmabhoomi
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#contact"
            style={{
              background: "#fff",
              color: "#b45309",
              fontWeight: 700,
              padding: "14px 36px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "all 0.2s",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            Book Now
          </a>
          <a
            href="tel:+919451338729"
            style={{
              background: "transparent",
              color: "#fff",
              fontWeight: 600,
              padding: "13px 36px",
              borderRadius: "4px",
              border: "1.5px solid rgba(255,255,255,0.6)",
              textDecoration: "none",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
          >
            Call Us
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div style={{ background: "#1c1917", color: "rgba(255,255,255,0.7)", padding: "64px 24px 32px" }}>
        <div
          className="max-w-7xl mx-auto"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "48px" }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <img src="/logo-vatsalya.jpg" alt="Logo" style={{ height: "52px", width: "52px", objectFit: "contain", borderRadius: "50%", border: "2px solid rgba(217,119,6,0.4)" }} />
              <div>
                <p className="font-devnagri" style={{ color: "#fbbf24", fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.2 }}>वात्सल्य भवन</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Ayodhya</p>
              </div>
            </div>
            <p style={{ lineHeight: 1.8, fontSize: "0.85rem", marginBottom: "20px" }}>
              Your sacred home away from home in the divine city of Ayodhya. Hospitality with love, comfort with devotion.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "36px", height: "36px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.6)", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--saffron-mid)"; e.currentTarget.style.borderColor = "var(--saffron-mid)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: "#fbbf24", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {navLinks.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fbbf24"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nearby Attractions */}
          <div>
            <h3 style={{ color: "#fbbf24", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
              Nearby Attractions
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {nearbyAttractions.map((a) => (
                <li key={a} style={{ display: "flex", gap: "8px", alignItems: "flex-start", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
                  <span style={{ color: "#d97706", marginTop: "1px", flexShrink: 0 }}>✦</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: "#fbbf24", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
              Contact Us
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { Icon: MapPin, text: "Tarun Pura Road, Kaniganj, Ayodhya, UP 224001", href: null },
                { Icon: Phone, text: "+91 94513 38729", href: "tel:+919451338729" },
                { Icon: Mail, text: "vatsalya.bhawan.aprill@gmail.com", href: "mailto:vatsalya.bhawan.aprill@gmail.com" },
              ].map(({ Icon, text, href }) => (
                <div key={text} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <Icon size={16} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                  {href ? (
                    <a href={href} style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", lineHeight: 1.5, textDecoration: "none" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#fbbf24"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                    >{text}</a>
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", lineHeight: 1.5 }}>{text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="max-w-7xl mx-auto"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
            © {new Date().getFullYear()} Vatsalya Bhawan, Ayodhya. All rights reserved.
          </p>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
            Designed with <span style={{ color: "#d97706" }}>♥</span> for the holy city of Ayodhya
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;