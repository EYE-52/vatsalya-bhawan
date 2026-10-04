import React, { useState, useRef, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    lines: ["Tarun Pura Road, Kaniganj,", "Ayodhya, Uttar Pradesh — 224001"],
    link: "https://maps.google.com/?q=Vatsalya+Bhawan+Ayodhya",
    linkText: "Get Directions on Google Maps →",
  },
  {
    icon: Phone,
    title: "Phone & WhatsApp",
    phoneList: [
      { num: "+91 94513 38729", link: "tel:+919451338729", note: "Primary / WhatsApp" },
      { num: "+91 94551 72867", link: "tel:+919455172867", note: "Reservations & Support" },
    ],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["vatsalya.bhawan.aprill@gmail.com"],
    link: "mailto:vatsalya.bhawan.aprill@gmail.com",
    linkText: "Send Email →",
  },
  {
    icon: Clock,
    title: "Check-in / Check-out",
    lines: ["Check-in: 12:00 PM", "Check-out: 11:00 AM"],
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", checkIn: "", checkOut: "", guests: "1", message: "" });
  const [submitted, setSubmitted] = useState(false);
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

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: "", email: "", phone: "", checkIn: "", checkOut: "", guests: "1", message: "" });
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    border: "1.5px solid #e7e5e4", borderRadius: "6px",
    fontSize: "0.875rem", color: "var(--text-dark)",
    background: "#fafaf9", outline: "none", transition: "border-color 0.2s",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <section id="contact" ref={sectionRef} style={{ background: "var(--cream-dark)", padding: "96px 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center" style={{ marginBottom: "60px" }}>
          <div className="ornament reveal">
            <div className="ornament-line" />
            <div className="ornament-diamond" />
            <div className="ornament-line" />
          </div>
          <span className="section-label reveal">Get In Touch</span>
          <h2
            className="font-display reveal"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--saffron-deep)", marginTop: "0.5rem" }}
          >
            Book Your <span style={{ color: "var(--saffron-light)", fontStyle: "italic" }}>Sacred Stay</span>
          </h2>
          <p className="reveal" style={{ color: "var(--text-light)", marginTop: "1rem", maxWidth: "480px", margin: "1rem auto 0", lineHeight: 1.7 }}>
            Reach out to us for reservations, special requests, or any queries. We'd love to welcome you to Vatsalya Bhawan.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "48px" }}>
          {/* Contact Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="reveal"
                  style={{
                    display: "flex", gap: "16px",
                    background: "var(--white)",
                    borderRadius: "10px", padding: "20px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(217,119,6,0.1)",
                  }}
                >
                  <div
                    style={{
                      width: "44px", height: "44px", borderRadius: "10px", flexShrink: 0,
                      background: "linear-gradient(135deg, var(--cream-dark), var(--parchment))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Icon size={20} color="var(--saffron-mid)" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, color: "var(--text-dark)", fontSize: "0.9rem", marginBottom: "6px" }}>{item.title}</h3>
                    {item.lines && item.lines.map((l) => (
                      <p key={l} style={{ color: "var(--text-light)", fontSize: "0.85rem", lineHeight: 1.6 }}>{l}</p>
                    ))}
                    {item.phoneList && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {item.phoneList.map((p) => (
                          <div key={p.num} style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <a
                              href={p.link}
                              style={{ color: "var(--saffron-mid)", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}
                            >
                              {p.num}
                            </a>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-light)", background: "var(--cream-dark)", padding: "2px 8px", borderRadius: "100px", fontWeight: 500 }}>
                              {p.note}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target={item.link.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        style={{ color: "var(--saffron-mid)", fontSize: "0.8rem", fontWeight: 500, marginTop: "6px", display: "inline-block" }}
                      >
                        {item.linkText}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Google Maps embed */}
            <div className="reveal" style={{ borderRadius: "10px", overflow: "hidden", boxShadow: "var(--shadow-card)", height: "200px" }}>
              <iframe
                title="Vatsalya Bhawan Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3568.9!2d82.1!3d26.79!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a07b1e3c5b4d5%3A0x0!2sAyodhya%2C+Uttar+Pradesh!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Booking Form */}
          <div
            className="reveal"
            style={{
              background: "var(--white)",
              borderRadius: "12px",
              padding: "36px",
              boxShadow: "var(--shadow-card)",
              border: "1px solid rgba(217,119,6,0.1)",
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <CheckCircle size={56} color="#059669" style={{ margin: "0 auto 16px" }} />
                <h3 className="font-display" style={{ fontSize: "1.5rem", color: "var(--text-dark)", marginBottom: "8px" }}>
                  Thank You!
                </h3>
                <p style={{ color: "var(--text-light)", lineHeight: 1.7 }}>
                  Your enquiry has been received. Our team will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--saffron-deep)", marginBottom: "4px" }}>
                  Booking Enquiry
                </h3>
                <p style={{ color: "var(--text-light)", fontSize: "0.85rem", marginTop: "-8px" }}>
                  Fill in the form and we'll confirm your reservation
                </p>

                {/* Name + Phone */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-mid)", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                      Full Name *
                    </label>
                    <input
                      type="text" name="name" required value={form.name}
                      onChange={handleChange} placeholder="Ramesh Kumar"
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--saffron-light)"}
                      onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-mid)", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                      Phone *
                    </label>
                    <input
                      type="tel" name="phone" required value={form.phone}
                      onChange={handleChange} placeholder="+91 98765 43210"
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--saffron-light)"}
                      onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-mid)", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                    Email Address
                  </label>
                  <input
                    type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "var(--saffron-light)"}
                    onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                  />
                </div>

                {/* Check-in / Check-out */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-mid)", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                      Check-in Date
                    </label>
                    <input
                      type="date" name="checkIn" value={form.checkIn}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--saffron-light)"}
                      onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-mid)", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                      Check-out Date
                    </label>
                    <input
                      type="date" name="checkOut" value={form.checkOut}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--saffron-light)"}
                      onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-mid)", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                    Number of Guests
                  </label>
                  <select
                    name="guests" value={form.guests} onChange={handleChange}
                    style={{ ...inputStyle }}
                  >
                    {[1,2,3,4,5,"6+"].map((n) => (
                      <option key={n} value={n}>{n} Guest{n !== 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-mid)", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                    Special Requests
                  </label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    rows={3} placeholder="Any special requirements, room preferences..."
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                    onFocus={(e) => e.target.style.borderColor = "var(--saffron-light)"}
                    onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
                  />
                </div>

                <button type="submit" className="btn-gold" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px" }}>
                  <Send size={16} />
                  Send Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;