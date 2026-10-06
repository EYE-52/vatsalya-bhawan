import React, { Suspense, lazy } from "react";
import Header from "./Header";
import Hero from "./Hero";

// Below-the-fold: lazy-loaded for faster initial paint
const Gallery = lazy(() => import("./Gallery"));
const TrustRatings = lazy(() => import("./TrustRatings"));
const Amenities = lazy(() => import("./Amenities"));
const Rooms = lazy(() => import("./Rooms"));
const LocationSection = lazy(() => import("./LocationSection"));
const Testimonials = lazy(() => import("./Testimonials"));
const WhyUs = lazy(() => import("./WhyUs"));
const Contact = lazy(() => import("./Contact"));
const SocialMoments = lazy(() => import("./SocialMoments"));
const Footer = lazy(() => import("./Footer"));


// Sticky WhatsApp Floating Action Button
const WhatsAppButton = ({ roomModalOpen }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <a
      href="https://wa.me/919451338729?text=Hello%2C%20I%20would%20like%20to%20book%20a%20room%20at%20Vatsalya%20Bhawan%2C%20Ayodhya."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Direct Booking on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: "18px",
        right: "18px",
        zIndex: 40,
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #25d366, #128c7e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: hovered
          ? "0 8px 26px rgba(37, 211, 102, 0.65)"
          : "0 6px 20px rgba(37, 211, 102, 0.45)",
        transform: hovered ? "scale(1.08) translateY(-2px)" : "scale(1)",
        transition:
          "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, visibility 0.25s, box-shadow 0.25s ease",
        textDecoration: "none",
        opacity: roomModalOpen ? 0 : 1,
        visibility: roomModalOpen ? "hidden" : "visible",
        pointerEvents: roomModalOpen ? "none" : "auto",
      }}
    >
      <svg viewBox="0 0 24 24" fill="white" width="25" height="25">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  );
};

// Premium Scroll-To-Top Button with Smooth Vector Arrow and Obsidian-Gold Glass
const ScrollTopButton = ({ roomModalOpen }) => {
  const [visible, setVisible] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 450);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (roomModalOpen) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Scroll to top"
      title="Back to top"
      style={{
        position: "fixed",
        bottom: "76px",
        right: "20px",
        zIndex: 40,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: hovered
          ? "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)"
          : "linear-gradient(135deg, rgba(28, 25, 23, 0.94) 0%, rgba(12, 10, 9, 0.98) 100%)",
        border: hovered
          ? "1.5px solid #fbbf24"
          : "1.5px solid rgba(251, 191, 36, 0.55)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? "#0c0a09" : "#fbbf24",
        boxShadow: hovered
          ? "0 8px 24px rgba(217, 119, 6, 0.5), 0 0 16px rgba(251, 191, 36, 0.35)"
          : "0 6px 20px rgba(0, 0, 0, 0.55), 0 0 10px rgba(251, 191, 36, 0.2)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transform: visible
          ? hovered
            ? "translateY(-3px) scale(1.08)"
            : "translateY(0) scale(1)"
          : "translateY(16px) scale(0.65)",
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "auto" : "none",
        transition:
          "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease, visibility 0.28s, background 0.22s ease, border-color 0.22s ease, color 0.22s ease, box-shadow 0.22s ease",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: hovered ? "translateY(-1.5px)" : "translateY(0)",
          transition: "transform 0.2s ease",
        }}
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};

const VatsalyaBhawan = () => {
  const [roomModalOpen, setRoomModalOpen] = React.useState(false);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Header roomModalOpen={roomModalOpen} />
      <main>
        <Hero />
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: "200px" }} />}>
          <TrustRatings />
          <Amenities />
          <Rooms onModalToggle={setRoomModalOpen} />
          <LocationSection />
          <Testimonials />
          <WhyUs />
          <SocialMoments />
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <WhatsAppButton roomModalOpen={roomModalOpen} />
      <ScrollTopButton roomModalOpen={roomModalOpen} />
    </div>
  );
};

export default VatsalyaBhawan;