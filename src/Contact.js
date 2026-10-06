import React, { useState } from "react";
import { Phone, MessageCircle, Send, CheckCircle, Calendar, Users, BedDouble, Navigation } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    room: "Deluxe King Room",
    checkIn: "",
    checkOut: "",
    guests: "2 Adults",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const sendWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Vatsalya Bhawan! I want to plan my stay.\n` +
      `• Name: ${form.name || "Guest"}\n` +
      `• Phone: ${form.phone || "Not provided"}\n` +
      `• Room: ${form.room}\n` +
      `• Dates: ${form.checkIn || "TBD"} to ${form.checkOut || "TBD"}\n` +
      `• Guests: ${form.guests}\n` +
      `• Message: ${form.message || "Please share rate and availability."}`
    );
    window.open(`https://wa.me/919451338729?text=${text}`, "_blank");
  };

  return (
    <section id="contact" style={{ background: "#fdfbf7", padding: "80px 0" }}>
      <div className="container-section">
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
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
            RESERVATIONS & ENQUIRIES
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
            Plan Your Stay at{" "}
            <span style={{ color: "#c2882b", fontStyle: "italic" }}>
              Vatsalya Bhawan
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
            Zero-commission booking. Reach us directly for guaranteed best tariffs, tailored pilgrimage advice, and room priority.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <a
            href="https://wa.me/919451338729?text=Hello%20Vatsalya%20Bhawan%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%20room."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(135deg, #25d366, #128c7e)",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "18px 20px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 4px 16px rgba(37, 211, 102, 0.25)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <MessageCircle size={24} />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>WHATSAPP US</div>
              <div style={{ fontSize: "0.78rem", opacity: 0.9 }}>Instant replies in 5 mins</div>
            </div>
          </a>

          <a
            href="tel:+919451338729"
            style={{
              background: "#ffffff",
              color: "#1c1917",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "10px",
              padding: "18px 20px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Phone size={24} color="#c2882b" />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>CALL DIRECT</div>
              <div style={{ fontSize: "0.78rem", color: "#78716c" }}>+91 94513 38729</div>
            </div>
          </a>

          <a
            href="tel:+919455172867"
            style={{
              background: "#ffffff",
              color: "#1c1917",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "10px",
              padding: "18px 20px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Phone size={24} color="#c2882b" />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>RESERVATIONS</div>
              <div style={{ fontSize: "0.78rem", color: "#78716c" }}>+91 94551 72867</div>
            </div>
          </a>

          <a
            href="https://maps.google.com/?q=Ram+Janmabhoomi+Ayodhya"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#ffffff",
              color: "#1c1917",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "10px",
              padding: "18px 20px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Navigation size={24} color="#c2882b" />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>GET DIRECTIONS</div>
              <div style={{ fontSize: "0.78rem", color: "#78716c" }}>Google Maps Navigation</div>
            </div>
          </a>
        </div>

        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: "14px",
            padding: "36px 32px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            border: "1px solid rgba(194,136,43,0.18)",
          }}
        >
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 10px" }}>
              <CheckCircle size={56} color="#059669" style={{ margin: "0 auto 16px" }} />
              <h3 className="font-display" style={{ fontSize: "1.6rem", color: "#1c1917", marginBottom: "8px" }}>
                Enquiry Received!
              </h3>
              <p style={{ color: "#78716c", maxWidth: "460px", margin: "0 auto 24px auto", lineHeight: 1.6 }}>
                Thank you, {form.name || "Guest"}. Our Ayodhya front desk team will contact you shortly to confirm your room details.
              </p>
              <button
                onClick={sendWhatsAppDirect}
                style={{
                  background: "linear-gradient(135deg, #25d366, #128c7e)",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <MessageCircle size={18} />
                Send Copy to WhatsApp for Faster Confirmation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "12px" }}>
                <h3 className="font-display" style={{ fontSize: "1.35rem", fontWeight: 700, color: "#1c1917", margin: "0 0 4px 0" }}>
                  Direct Reservation Enquiry
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#78716c" }}>
                  Fill in your details below and we will confirm room availability
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#44403c", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <Calendar size={14} color="#c2882b" />
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    required
                    value={form.checkIn}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d6d3d1",
                      fontSize: "0.88rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#44403c", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <Calendar size={14} color="#c2882b" />
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    required
                    value={form.checkOut}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d6d3d1",
                      fontSize: "0.88rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#44403c", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <Users size={14} color="#c2882b" />
                    Number of Guests
                  </label>
                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d6d3d1",
                      fontSize: "0.88rem",
                      background: "#ffffff",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  >
                    <option value="1 Adult">1 Adult</option>
                    <option value="2 Adults">2 Adults</option>
                    <option value="3 Adults / Family">3 Adults / Family</option>
                    <option value="4+ Adults / Group">4+ Adults / Group</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#44403c", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <BedDouble size={14} color="#c2882b" />
                    Room Preference
                  </label>
                  <select
                    name="room"
                    value={form.room}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d6d3d1",
                      fontSize: "0.88rem",
                      background: "#ffffff",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  >
                    <option value="Deluxe King Room">Deluxe King Room (AC / Balcony)</option>
                    <option value="Spacious Family Suite">Spacious Family Suite (4 Guests)</option>
                    <option value="Standard Cozy Room">Standard Cozy Room (Budget Value)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#44403c", display: "block", marginBottom: "6px" }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={form.name}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d6d3d1",
                      fontSize: "0.88rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#44403c", display: "block", marginBottom: "6px" }}>
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d6d3d1",
                      fontSize: "0.88rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#44403c", display: "block", marginBottom: "6px" }}>
                  Special Requests / Pilgrimage Inquiries (Optional)
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Need wheelchair access, early check-in, or airport pickup assistance..."
                  value={form.message}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #d6d3d1",
                    fontSize: "0.88rem",
                    boxSizing: "border-box",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    background: "linear-gradient(135deg, #c2882b, #b45309)",
                    color: "#ffffff",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 16px rgba(180,83,9,0.3)",
                  }}
                >
                  <Send size={16} />
                  Submit Enquiry
                </button>

                <button
                  type="button"
                  onClick={sendWhatsAppDirect}
                  style={{
                    padding: "14px 20px",
                    background: "#f0fdf4",
                    color: "#166534",
                    border: "1px solid #86efac",
                    borderRadius: "6px",
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <MessageCircle size={18} color="#25d366" />
                  Quick WhatsApp
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;