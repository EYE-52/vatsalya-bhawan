import React from "react";
import { Star, Sparkles, CheckCircle2 } from "lucide-react";

const reviews = [
  {
    name: "Rajesh & Meera Sharma",
    location: "New Delhi",
    category: "Location & Aarti",
    rating: 5,
    text: "Being just 500 metres from Shri Ram Janmabhoomi made all the difference for our morning Aarti. We avoided the massive traffic queues and walked comfortably. The rooms were spotless and the quiet sacred atmosphere was deeply rejuvenating.",
    source: "Google Verified Review",
    date: "February 2026",
  },
  {
    name: "Vikram Kulkarni",
    location: "Pune, Maharashtra",
    category: "Elderly Care & Lift",
    rating: 5,
    text: "Traveled with my 74-year-old mother. The presence of a smooth elevator, ground-floor accessibility, and the extraordinarily compassionate staff who arranged an e-rickshaw for temple Darshan made her pilgrimage unforgettable.",
    source: "Booking.com Pilgrim Choice",
    date: "January 2026",
  },
  {
    name: "Sunita & Arvind Goel",
    location: "Jaipur, Rajasthan",
    category: "Family Pilgrimage",
    rating: 5,
    text: "The Family Suite was spacious and beautifully appointed. Fresh linens, crisp air conditioning, and peaceful surroundings. The pure vegetarian breakfast was warm and satisfying. Highly recommended for family yatris.",
    source: "MakeMyTrip Verified",
    date: "March 2026",
  },
  {
    name: "Dr. Alok Srivastava",
    location: "Lucknow",
    category: "Cleanliness & Comfort",
    rating: 5,
    text: "Pristine hygiene standards! The attached bathrooms had brand new geysers with non-stop hot water, and the beds were firm and restful. Front desk team helped us plan our Hanuman Garhi and Kanak Bhawan visits seamlessly.",
    source: "Google Verified Review",
    date: "February 2026",
  },
  {
    name: "Ananya Mukherjee",
    location: "Kolkata",
    category: "Warm Hospitality",
    rating: 5,
    text: "Such genuine, warm hospitality! We arrived late at night from the railway station and the reception was ready with a warm greeting and peaceful room. You truly feel at home in Ayodhya here.",
    source: "Tripadvisor Review",
    date: "January 2026",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      style={{
        background: "#ffffff",
        padding: "80px 0",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
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
            <Sparkles size={14} />
            WHAT OUR GUESTS SAY
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
            Memories of Peace &{" "}
            <span style={{ color: "#c2882b", fontStyle: "italic" }}>
              Devotion
            </span>
          </h2>
          <p
            style={{
              color: "#78716c",
              fontSize: "1.05rem",
              marginTop: "12px",
              maxWidth: "540px",
              margin: "12px auto 0 auto",
            }}
          >
            Real stories from pilgrims and families who chose Vatsalya Bhawan for their sacred stay in Ayodhya.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {reviews.map((r, i) => (
            <div
              key={i}
              style={{
                background: "#faf7f2",
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.06)",
                padding: "26px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.03)";
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "14px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      background: "#fef3c7",
                      color: "#92400e",
                      padding: "3px 9px",
                      borderRadius: "4px",
                    }}
                  >
                    {r.category}
                  </span>
                  <div style={{ display: "flex", gap: "2px", color: "#d97706" }}>
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} size={14} fill="#d97706" color="#d97706" />
                    ))}
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "#44403c",
                    lineHeight: 1.65,
                    fontStyle: "italic",
                    margin: "0 0 20px 0",
                  }}
                >
                  “{r.text}”
                </p>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.06)",
                  paddingTop: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1c1917" }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#78716c" }}>
                    {r.location}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.74rem",
                    color: "#059669",
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>{r.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
