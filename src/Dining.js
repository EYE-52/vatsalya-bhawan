import React, { useEffect, useRef } from "react";

const menuItems = [
  { category: "Breakfast (7 AM – 10 AM)", items: ["Poori Sabzi", "Aloo Paratha with Curd", "Idli Sambar", "Fresh Fruit Platter", "Chai & Coffee"] },
  { category: "Lunch & Dinner", items: ["Dal Makhani", "Paneer Butter Masala", "Jeera Rice", "Mixed Veg Curry", "Roti & Naan", "Kheer & Halwa"] },
];

const Dining = () => {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="dining" ref={sectionRef} style={{ background: "var(--cream)", padding: "96px 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "64px", alignItems: "center" }}>

          {/* Image */}
          <div className="reveal" style={{ position: "relative" }}>
            <div className="img-zoom" style={{ borderRadius: "8px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
              <img
                src="/assets/god-image.jpeg"
                alt="Satvik pure vegetarian dining at Vatsalya Bhawan"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            </div>
            {/* Floating tag */}
            <div
              style={{
                position: "absolute", bottom: "-20px", right: "24px",
                background: "linear-gradient(135deg, #b45309, #d97706)",
                color: "#fff", borderRadius: "8px", padding: "16px 20px",
                boxShadow: "0 8px 24px rgba(180,83,9,0.35)",
              }}
            >
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: "2px" }}>Serving</p>
              <p className="font-display" style={{ fontSize: "1.1rem", fontWeight: 700 }}>100% Pure Satvik</p>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>Vegetarian Cuisine</p>
            </div>
            {/* Decorative corner */}
            <div style={{ position: "absolute", top: "-12px", left: "-12px", width: "60px", height: "60px", border: "2px solid var(--gold-light)", borderRadius: "6px" }} />
          </div>

          {/* Text */}
          <div style={{ paddingTop: "20px" }}>
            <div className="ornament reveal">
              <div className="ornament-line" />
              <div className="ornament-diamond" />
              <div className="ornament-line" />
            </div>
            <span className="section-label reveal">Dining</span>
            <h2
              className="font-display reveal"
              style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 700, color: "var(--saffron-deep)", lineHeight: 1.2, margin: "0.5rem 0 1rem" }}
            >
              Nourish Your Body,<br />
              <em style={{ color: "var(--saffron-light)" }}>Uplift Your Spirit</em>
            </h2>
            <p className="reveal" style={{ color: "var(--text-mid)", lineHeight: 1.85, marginBottom: "1.5rem", fontSize: "0.95rem" }}>
              Our in-house dining offers lovingly prepared <strong>pure vegetarian (satvik) meals</strong> made with fresh, wholesome ingredients and traditional Awadhi recipes. Every meal is prepared without onion or garlic — perfect for the devout pilgrim.
            </p>

            {/* Menu highlights */}
            <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "2rem" }}>
              {menuItems.map((section) => (
                <div key={section.category}>
                  <h4 style={{ fontWeight: 600, color: "var(--saffron-mid)", fontSize: "0.85rem", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {section.category}
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {section.items.map((item) => (
                      <span
                        key={item}
                        style={{
                          background: "var(--cream-dark)",
                          color: "var(--text-mid)",
                          fontSize: "0.78rem",
                          padding: "4px 12px",
                          borderRadius: "100px",
                          border: "1px solid var(--parchment)",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href="#contact" className="btn-gold">Enquire About Meals</a>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "12px 16px",
                  background: "var(--cream-dark)",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  color: "var(--text-mid)",
                }}
              >
                <span>🌿</span> Jain options on request
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dining;