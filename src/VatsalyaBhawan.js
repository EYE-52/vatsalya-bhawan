import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Rooms from "./Rooms";
import Dining from "./Dining";
import Amenities from "./Amenities";
import Gallery from "./Gallery";
import Testimonials from "./Testimonials";
import BookingPlatforms from "./BookingPlatforms";
import Contact from "./Contact";
import Footer from "./Footer";

// Sticky WhatsApp floating button
const WhatsAppButton = () => (
  <a
    href="https://wa.me/919451338729?text=Hello%2C%20I%20would%20like%20to%20book%20a%20room%20at%20Vatsalya%20Bhawan%2C%20Ayodhya."
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    style={{
      position: "fixed",
      bottom: "28px",
      right: "24px",
      zIndex: 999,
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #25d366, #128c7e)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 6px 24px rgba(37, 211, 102, 0.45)",
      animation: "pulse-gold 2.5s infinite",
      transition: "transform 0.2s",
      textDecoration: "none",
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
  >
    {/* WhatsApp SVG */}
    <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  </a>
);

// Scroll-to-top button
const ScrollTopButton = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "96px",
        right: "24px",
        zIndex: 999,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #b45309, #d97706)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "1.2rem",
        boxShadow: "0 4px 16px rgba(180,83,9,0.35)",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      ↑
    </button>
  ) : null;
};

const VatsalyaBhawan = () => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header />
      <main>
        <Hero />
        <About />
        <Rooms />
        <Dining />
        <Amenities />
        <Gallery />
        <Testimonials />
        <BookingPlatforms />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollTopButton />
    </div>
  );
};

export default VatsalyaBhawan;