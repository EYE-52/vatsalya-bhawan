import React, { useEffect, useRef } from "react";
import { Star, ShieldCheck, Award } from "lucide-react";

const platforms = [
  {
    name: "Booking.com",
    badge: "9.0+ / 10 Superb",
    color: "#003580",
    textColor: "#ffffff",
    tag: "Verified Reviews",
    desc: "Preferred Pilgrim Stay in Ayodhya",
    link: "https://www.booking.com/searchresults.html?ss=Vatsalya+Bhawan+Ayodhya",
  },
  {
    name: "Google Reviews",
    badge: "4.8 ★★★★★",
    color: "#4285F4",
    textColor: "#ffffff",
    tag: "High Customer Trust",
    desc: "Top Rated Homestay & Hotel by Visitors",
    link: "https://www.google.com/search?q=vatsalya+bhawan+hotel+ayodhya",
  },
  {
    name: "MakeMyTrip",
    badge: "Top Recommended",
    color: "#e41d25",
    textColor: "#ffffff",
    tag: "Instant Confirmation",
    desc: "Popular choice for Ram Mandir Darshan",
    link: "https://www.makemytrip.com/hotels/hotel-listing/?city=Ayodhya&searchText=Vatsalya%20Bhawan",
  },
  {
    name: "Agoda",
    badge: "Great Choice",
    color: "#589442",
    textColor: "#ffffff",
    tag: "Best Price Guarantee",
    desc: "Fast & hassle-free online booking",
    link: "https://www.agoda.com/search?city=28826&text=Vatsalya%20Bhawan",
  },
  {
    name: "Goibibo",
    badge: "Certified Clean",
    color: "#ec5b24",
    textColor: "#ffffff",
    tag: "Fast Check-in",
    desc: "Trusted by thousands of family travelers",
    link: "https://www.goibibo.com/hotels/hotels-in-ayodhya/?q=Vatsalya%20Bhawan",
  },
  {
    name: "Airbnb",
    badge: "Superhost Quality",
    color: "#FF5A5F",
    textColor: "#ffffff",
    tag: "Authentic Stay",
    desc: "Homely comfort in the spiritual capital",
    link: "https://www.airbnb.com/s/Ayodhya--India/homes?query=Vatsalya%20Bhawan",
  },
  {
    name: "Expedia",
    badge: "VIP Access",
    color: "#002244",
    textColor: "#ffffff",
    tag: "Global Support",
    desc: "Worldwide booking convenience",
    link: "https://www.expedia.co.in/Hotel-Search?destination=Ayodhya%2C%20Uttar%20Pradesh&q=Vatsalya%20Bhawan",
  },
];

const BookingPlatforms = () => {
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
      id="platforms"
      ref={sectionRef}
      style={{
        background: "linear-gradient(180deg, var(--cream-dark) 0%, var(--cream) 100%)",
        padding: "80px 0 96px",
        position: "relative",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center reveal" style={{ marginBottom: "50px" }}>
          <div className="ornament">
            <div className="ornament-line" />
            <div className="ornament-diamond" />
            <div className="ornament-line" />
          </div>
          <span className="section-label">Trusted & Certified Hospitality</span>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 700, color: "var(--saffron-deep)", marginTop: "0.5rem" }}
          >
            Top Rated Across <span style={{ color: "var(--saffron-light)", fontStyle: "italic" }}>Leading Platforms</span>
          </h2>
          <p style={{ color: "var(--text-light)", marginTop: "0.75rem", maxWidth: "560px", margin: "0.75rem auto 0", lineHeight: 1.7, fontSize: "0.95rem" }}>
            Book with complete confidence. Vatsalya Bhawan is verified, highly rated on Google and Booking.com, and proudly listed across all major travel networks.
          </p>
        </div>

        {/* Featured Trust Score Highlight Cards */}
        <div
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {/* Google Card */}
          <div
            className="card-hover"
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "24px 28px",
              boxShadow: "var(--shadow-card)",
              border: "1.5px solid rgba(66, 133, 244, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #4285F4, #34A853)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Star size={28} fill="#ffffff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", fontFamily: "'Playfair Display', serif" }}>
                  4.8 / 5.0
                </span>
                <span className="stars" style={{ fontSize: "0.9rem" }}>★★★★★</span>
              </div>
              <p style={{ fontWeight: 600, color: "#4285F4", fontSize: "0.9rem", margin: "2px 0" }}>
                Google Verified Rating
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>
                Praised for cleanliness, warmth, and 500m temple proximity
              </p>
            </div>
          </div>

          {/* Booking.com Card */}
          <div
            className="card-hover"
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "24px 28px",
              boxShadow: "var(--shadow-card)",
              border: "1.5px solid rgba(0, 53, 128, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "#003580",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Award size={28} color="#feba02" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    background: "#003580",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "1rem",
                    padding: "3px 8px",
                    borderRadius: "6px 6px 6px 0",
                  }}
                >
                  9.0+
                </span>
                <span style={{ fontWeight: 700, color: "#003580", fontSize: "1.1rem" }}>Superb</span>
              </div>
              <p style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.85rem", marginTop: "4px" }}>
                Booking.com Pilgrim Choice
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>
                Consistently loved by pilgrim families and solo devotees
              </p>
            </div>
          </div>

          {/* Direct Booking Guarantee Card */}
          <div
            className="card-hover"
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "24px 28px",
              boxShadow: "var(--shadow-card)",
              border: "1.5px solid rgba(217, 119, 6, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #b45309, #d97706)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <div>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--saffron-deep)", fontFamily: "'Playfair Display', serif" }}>
                Best Rate Direct
              </span>
              <p style={{ fontWeight: 600, color: "var(--saffron-mid)", fontSize: "0.85rem", margin: "2px 0" }}>
                Call or WhatsApp Directly
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>
                Zero commission, personalized room selection & priority check-in
              </p>
            </div>
          </div>
        </div>

        {/* Platform Grid */}
        <div className="reveal">
          <p
            className="text-center font-semibold"
            style={{ fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "20px" }}
          >
            Available for Booking On Your Favorite Travel Portals
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "14px",
            }}
          >
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover"
                style={{
                  background: "#ffffff",
                  borderRadius: "10px",
                  padding: "18px 14px",
                  textAlign: "center",
                  textDecoration: "none",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  border: "1px solid rgba(217,119,6,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
              >
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "3px 8px",
                    borderRadius: "100px",
                    background: p.color,
                    color: p.textColor,
                    marginBottom: "8px",
                  }}
                >
                  {p.badge}
                </span>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b", marginBottom: "4px" }}>
                  {p.name}
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-light)", lineHeight: 1.3 }}>
                  {p.tag}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingPlatforms;
