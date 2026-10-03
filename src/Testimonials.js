import React, { useEffect, useRef } from "react";

const reviews = [
  {
    name: "Rajesh Sharma",
    location: "New Delhi",
    rating: 5,
    text: "A truly divine experience! The room was clean, staff extremely helpful, and the proximity to Ram Mandir made our pilgrimage complete. Highly recommend Vatsalya Bhawan!",
    initials: "RS",
  },
  {
    name: "Priya & Family",
    location: "Mumbai",
    rating: 5,
    text: "We stayed for 4 nights with our family. The family suite was spacious, food was delicious and pure vegetarian. Location is perfect — we could walk to Hanuman Garhi in minutes.",
    initials: "PF",
  },
  {
    name: "Anand Verma",
    location: "Lucknow",
    rating: 4,
    text: "Great value for money. AC room was comfortable, Wi-Fi worked well, and the front desk was always available. Will definitely return on our next Ayodhya visit.",
    initials: "AV",
  },
  {
    name: "Sunita Devi",
    location: "Varanasi",
    rating: 5,
    text: "Warm hospitality and beautiful spiritual ambiance. The staff went out of their way to help us. Location is just perfect for temple visits. Jai Shri Ram!",
    initials: "SD",
  },
];

const Testimonials = () => {
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
    <section
      id="testimonials"
      ref={sectionRef}
      style={{
        background: "linear-gradient(135deg, #fef3c7 0%, #fffbf0 100%)",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Om */}
      <div
        style={{
          position: "absolute", right: "-40px", top: "50%", transform: "translateY(-50%)",
          fontSize: "300px", color: "rgba(217,119,6,0.05)", fontFamily: "serif",
          lineHeight: 1, userSelect: "none",
        }}
      >
        ॐ
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Heading */}
        <div className="text-center" style={{ marginBottom: "60px" }}>
          <div className="ornament reveal">
            <div className="ornament-line" />
            <div className="ornament-diamond" />
            <div className="ornament-line" />
          </div>
          <span className="section-label reveal">Guest Reviews</span>
          <h2
            className="font-display reveal"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--saffron-deep)", marginTop: "0.5rem" }}
          >
            Words of Our <span style={{ color: "var(--saffron-light)", fontStyle: "italic" }}>Beloved Guests</span>
          </h2>
        </div>

        {/* Review grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {reviews.map((r, i) => (
            <div
              key={r.name}
              className="reveal card-hover"
              style={{
                background: "var(--white)",
                borderRadius: "12px",
                padding: "28px",
                boxShadow: "var(--shadow-card)",
                border: "1px solid rgba(217,119,6,0.1)",
                position: "relative",
              }}
            >
              {/* Quote mark */}
              <div
                style={{
                  position: "absolute", top: "20px", right: "24px",
                  fontSize: "4rem", lineHeight: 1, color: "var(--cream-dark)",
                  fontFamily: "Georgia, serif", userSelect: "none",
                }}
              >
                "
              </div>

              {/* Stars */}
              <div className="stars" style={{ marginBottom: "12px", fontSize: "0.85rem" }}>
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </div>

              {/* Text */}
              <p style={{ color: "var(--text-mid)", fontSize: "0.875rem", lineHeight: 1.75, marginBottom: "20px", fontStyle: "italic" }}>
                "{r.text}"
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--saffron-mid), var(--gold))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: "0.8rem",
                    flexShrink: 0,
                  }}
                >
                  {r.initials}
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--text-dark)", fontSize: "0.875rem" }}>{r.name}</p>
                  <p style={{ color: "var(--text-light)", fontSize: "0.75rem" }}>{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking platforms */}
        <div
          className="reveal text-center"
          style={{ marginTop: "48px", color: "var(--text-light)", fontSize: "0.85rem" }}
        >
          Also rated on: &nbsp;
          {["Booking.com", "MakeMyTrip", "Hotels.com", "Expedia"].map((p, i) => (
            <span key={p}>
              <span style={{ color: "var(--saffron-mid)", fontWeight: 500 }}>{p}</span>
              {i < 3 && " · "}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
