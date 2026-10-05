import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Images from "./utils/images";
import vatsalyaTitleLogo from "./assets/vatsalya-title-logo.png";

const Header = ({ roomModalOpen = false }) => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredNav, setHoveredNav] = useState(null);
  const [titleImgFailed, setTitleImgFailed] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }, 120);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isMobile = dimensions.width < 1024;
  const { scrollY } = useScroll();

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [open]);

  // Scroll morph animation distances
  const morphDistance = Math.max(460, Math.min(760, dimensions.height * 0.85));
  const scrollProg = useTransform(scrollY, [0, morphDistance], [0, 1]);
  const smoothProgress = useSpring(scrollProg, {
    stiffness: 60,
    damping: 26,
    restDelta: 0.001,
  });

  // Geometry calculations
  const containerPadding = isMobile ? 16 : 24;
  const containerLeft = isMobile
    ? containerPadding
    : Math.max(containerPadding, (dimensions.width - 1280) / 2 + containerPadding);

  const logoSize = isMobile ? 44 : 48;
  const startScale = isMobile ? 2.5 : 3.0;

  const viewportCenterX = dimensions.width / 2;
  const heroCenterY = Math.max(135, Math.round(dimensions.height * (isMobile ? 0.19 : 0.18)));
  const heroTextY = Math.max(250, Math.round(dimensions.height * (isMobile ? 0.36 : 0.35)));

  const headerCenterY = isMobile ? 38 : 40;
  const dockedLogoCenterX = containerLeft + logoSize / 2;
  const dockedTextCenterX = isMobile
    ? viewportCenterX
    : containerLeft + logoSize + 16 + 85;

  // Logo emblem transforms
  const emblemX = useTransform(smoothProgress, [0, 1], [viewportCenterX, dockedLogoCenterX]);
  const emblemY = useTransform(smoothProgress, [0, 1], [heroCenterY, headerCenterY]);
  const emblemScale = useTransform(smoothProgress, [0, 1], [startScale, 1]);

  // Brand title transforms: size in Hero section matches the welcome message without overflowing
  const heroTargetWidth = isMobile
    ? Math.min(Math.max(dimensions.width * 0.86, 280), dimensions.width - 32)
    : Math.min(dimensions.width * 0.48, 620);
  const heroBaseWidth = isMobile ? 174 : 192;
  const heroStartScale = Number((heroTargetWidth / heroBaseWidth).toFixed(2));

  const textX = useTransform(smoothProgress, [0, 1], [viewportCenterX, dockedTextCenterX]);
  const textY = useTransform(smoothProgress, [0, 1], [heroTextY, headerCenterY]);
  const textScale = useTransform(smoothProgress, [0, 1], [heroStartScale, 1]);

  // Navbar background & controls
  const bgOpacity = useTransform(smoothProgress, [0.42, 0.88], [0, 0.98]);
  const bgShadow = useTransform(
    smoothProgress,
    [0.5, 1],
    ["0 0 0 rgba(0,0,0,0)", "0 6px 28px rgba(0,0,0,0.6)"]
  );
  const navItemsOpacity = useTransform(smoothProgress, [0.55, 0.92], [0, 1]);
  const navPointerEvents = useTransform(smoothProgress, (val) => (val > 0.7 ? "auto" : "none"));
  const navVisibility = useTransform(smoothProgress, (val) => (val > 0.55 ? "visible" : "hidden"));
  const mobileHamPointerEvents = useTransform(smoothProgress, (val) => (val > 0.65 ? "auto" : "none"));

  const hindiColor = "#ffffff";
  const englishColor = "#fbbf24";
  const brandTextShadow = "0 2px 14px rgba(0,0,0,0.95)";

  // Active section observer
  useEffect(() => {
    const sections = [
      "home", "room-showcase", "trust", "amenities", "rooms",
      "location", "testimonials", "why-us", "contact",
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Auto-close mobile drawer when user scrolls back to top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 80 && open) {
        setOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  const navLinks = [
    { name: "Home", targetId: "home" },
    { name: "Showcase", targetId: "room-showcase" },
    { name: "Ratings", targetId: "trust" },
    { name: "Amenities", targetId: "amenities" },
    { name: "Rooms", targetId: "rooms" },
    { name: "Location", targetId: "location" },
    { name: "Why Us", targetId: "why-us" },
  ];

  // Smooth scroll handler without hash in URL
  const handleNavClick = (targetId, e) => {
    if (e) e.preventDefault();
    setOpen(false);
    if (targetId === "home" || !targetId) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleBrandClick = (e) => {
    handleNavClick("home", e);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: open ? 1000 : 50,
        background: "transparent",
        pointerEvents: roomModalOpen ? "none" : "none",
        opacity: roomModalOpen ? 0 : 1,
        visibility: roomModalOpen ? "hidden" : "visible",
        transition: "opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.25s",
      }}
    >
      {/* Background glass overlay */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 13, 11, 0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(251, 191, 36, 0.22)",
          opacity: open ? 0.98 : bgOpacity,
          boxShadow: bgShadow,
          zIndex: 995,
        }}
      />

      {/* Hotel emblem */}
      <motion.button
        onClick={handleBrandClick}
        aria-label="Vatsalya Bhawan Home"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          x: emblemX,
          y: emblemY,
          scale: emblemScale,
          translateX: "-50%",
          translateY: "-50%",
          transformOrigin: "center center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          pointerEvents: "auto",
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
        }}
      >
        <img
          src={Images.logo}
          alt="Vatsalya Bhawan Logo"
          style={{
            height: `${logoSize}px`,
            width: `${logoSize}px`,
            objectFit: "contain",
            borderRadius: "50%",
            display: "block",
            filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.75))",
          }}
        />
      </motion.button>

      {/* Hotel title */}
      <motion.button
        onClick={handleBrandClick}
        aria-label="Vatsalya Bhawan Ayodhya"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          x: textX,
          y: textY,
          translateX: "-50%",
          translateY: "-50%",
          scale: textScale,
          transformOrigin: "center center",
          zIndex: 1000,
          pointerEvents: "auto",
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 className="sr-only">
          वात्सल्य भवन - VATSALYA BHAWAN AYODHYA | Luxury Hotel near Shri Ram Janmabhoomi Temple Ayodhya
        </h1>

        {!titleImgFailed ? (
          <img
            src={vatsalyaTitleLogo}
            alt="वात्सल्य भवन - VATSALYA BHAWAN AYODHYA"
            onError={() => setTitleImgFailed(true)}
            style={{
              height: isMobile ? "58px" : "64px",
              width: "auto",
              maxWidth: isMobile ? "275px" : "320px",
              objectFit: "contain",
              display: "block",
              filter:
                "drop-shadow(0 4px 18px rgba(0,0,0,0.92)) drop-shadow(0 0 16px rgba(251, 191, 36, 0.24)) brightness(0.92) contrast(1.02) saturate(1.08)",
            }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span
              className="font-devnagri"
              style={{
                color: hindiColor,
                fontSize: isMobile ? "1.38rem" : "1.62rem",
                fontWeight: 400,
                fontFamily: "'Rozha One', 'Yatra One', serif",
                lineHeight: 1.15,
                margin: 0,
                textShadow: brandTextShadow,
                textAlign: "center",
                letterSpacing: "0.04em",
              }}
            >
              वात्सल्य भवन
            </span>
            <span
              className="font-display"
              style={{
                color: englishColor,
                fontSize: isMobile ? "0.72rem" : "0.80rem",
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.26em",
                fontWeight: 700,
                margin: "3px 0 0 0",
                lineHeight: 1.1,
                textTransform: "uppercase",
                textShadow: brandTextShadow,
                textAlign: "center",
              }}
            >
              VATSALYA BHAWAN AYODHYA
            </span>
          </div>
        )}
      </motion.button>

      {/* Navbar row */}
      <div
        style={{
          position: "relative",
          zIndex: 1000,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "8px 16px" : "10px 24px",
          minHeight: isMobile ? "76px" : "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: isMobile ? "120px" : "380px", height: "40px", flexShrink: 0 }} />

        {/* Desktop navigation */}
        {!isMobile && (
          <motion.nav
            style={{
              opacity: navItemsOpacity,
              pointerEvents: navPointerEvents,
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.targetId;
              return (
                <button
                  key={link.name}
                  type="button"
                  onClick={(e) => handleNavClick(link.targetId, e)}
                  style={{
                    position: "relative",
                    fontSize: "0.86rem",
                    fontWeight: 600,
                    color: isActive ? "#fbbf24" : "rgba(255, 255, 255, 0.85)",
                    background: "none",
                    border: "none",
                    padding: "4px 0",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isActive ? "#fbbf24" : "rgba(255, 255, 255, 0.85)")
                  }
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        left: 0,
                        right: 0,
                        height: "2px",
                        backgroundColor: "#fbbf24",
                        borderRadius: "1px",
                        boxShadow: "0 0 8px rgba(251, 191, 36, 0.7)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </motion.nav>
        )}

        {/* Desktop quick actions */}
        {!isMobile && (
          <motion.div
            style={{
              opacity: navItemsOpacity,
              pointerEvents: navPointerEvents,
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <a
              href="tel:+919451338729"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#ffffff",
                fontSize: "0.82rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Phone size={14} color="#fbbf24" />
              <span>+91 94513 38729</span>
            </a>
            <button
              type="button"
              onClick={(e) => handleNavClick("contact", e)}
              className="btn-gold"
              style={{
                padding: "9px 20px",
                fontSize: "0.82rem",
                fontWeight: 700,
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 14px rgba(251, 191, 36, 0.35)",
              }}
            >
              Book Now
            </button>
          </motion.div>
        )}

        {/* Mobile menu trigger */}
        {isMobile && (
          <motion.button
            style={{
              opacity: open ? 1 : navItemsOpacity,
              pointerEvents: open ? "auto" : mobileHamPointerEvents,
              visibility: open ? "visible" : navVisibility,
              background: "transparent",
              border: "none",
              outline: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
              zIndex: 1020,
              filter:
                "drop-shadow(0 2px 8px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.35))",
            }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              const isScrolled =
                (typeof smoothProgress.get === "function" && smoothProgress.get() > 0.5) ||
                window.scrollY > 150;
              if (open || isScrolled) {
                setOpen((p) => !p);
              }
            }}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <X size={28} color="#fbbf24" strokeWidth={2.2} />
            ) : (
              <Menu size={28} color="#fbbf24" strokeWidth={2.2} />
            )}
          </motion.button>
        )}
      </div>

      {/* Mobile drawer */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: isMobile ? "74px" : "78px",
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: isMobile ? "calc(100dvh - 74px)" : "calc(100dvh - 78px)",
            zIndex: 990,
            pointerEvents: open ? "auto" : "none",
            visibility: open ? "visible" : "hidden",
            transform: open ? "translate3d(0, 0%, 0)" : "translate3d(0, -100%, 0)",
            transition:
              "transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.42s cubic-bezier(0.16, 1, 0.3, 1)",
            overflowY: "auto",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            background: "#0c0a09",
            borderTop: "1px solid rgba(251, 191, 36, 0.22)",
            willChange: "transform",
            boxShadow: open ? "0 25px 60px rgba(0, 0, 0, 0.95)" : "none",
          }}
        >
          {/* Background image */}
          <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
            <img
              src={Images.frontView}
              alt="Vatsalya Bhawan Ayodhya"
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scale(1.04)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(12, 10, 9, 0.88) 0%, rgba(12, 10, 9, 0.94) 50%, rgba(12, 10, 9, 0.98) 100%)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
            />
          </div>

          {/* Navigation links */}
          <nav
            style={{
              position: "relative",
              zIndex: 10,
              padding: "18px 18px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              flex: 1,
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.targetId;
              const isHighlighted = isActive || hoveredNav === link.name;
              return (
                <button
                  key={link.name}
                  type="button"
                  onClick={(e) => handleNavClick(link.targetId, e)}
                  onMouseEnter={() => setHoveredNav(link.name)}
                  onMouseLeave={() => setHoveredNav(null)}
                  onTouchStart={() => setHoveredNav(link.name)}
                  onTouchEnd={() => setHoveredNav(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 16px",
                    borderRadius: "10px",
                    color: isHighlighted ? "#fbbf24" : "rgba(255, 255, 255, 0.88)",
                    background: isHighlighted
                      ? "linear-gradient(135deg, rgba(251, 191, 36, 0.22) 0%, rgba(217, 119, 6, 0.16) 100%)"
                      : "transparent",
                    border: isHighlighted
                      ? "1.5px solid rgba(251, 191, 36, 0.55)"
                      : "1px solid transparent",
                    borderBottom: isHighlighted
                      ? "1.5px solid rgba(251, 191, 36, 0.55)"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: isHighlighted ? "blur(14px)" : "none",
                    WebkitBackdropFilter: isHighlighted ? "blur(14px)" : "none",
                    fontSize: "1.06rem",
                    fontWeight: isHighlighted ? 800 : 600,
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    boxShadow: isHighlighted
                      ? "0 4px 20px rgba(217, 119, 6, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)"
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span className="font-display" style={{ letterSpacing: "0.03em" }}>{link.name}</span>
                  {isHighlighted ? (
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#fbbf24",
                        boxShadow: "0 0 10px #fbbf24",
                      }}
                    />
                  ) : (
                    <span style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "0.9rem" }}>→</span>
                  )}
                </button>
              );
            })}

            {/* Direct reservations card */}
            <div
              style={{
                marginTop: "12px",
                padding: "16px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(180, 83, 9, 0.08) 100%)",
                border: "1px solid rgba(251, 191, 36, 0.32)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  fontWeight: 800,
                  color: "#fbbf24",
                  letterSpacing: "0.14em",
                }}
              >
                Direct Reservations & Enquiries
              </span>
              <a
                href="tel:+919451338729"
                style={{
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.96rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Phone size={16} color="#fbbf24" /> +91 94513 38729
              </a>
              <a
                href="tel:+919455172867"
                style={{
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.96rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Phone size={16} color="#fbbf24" /> +91 94551 72867
              </a>
            </div>

            {/* Book Now button */}
            <button
              type="button"
              onClick={(e) => handleNavClick("contact", e)}
              style={{
                marginTop: "12px",
                marginBottom: "16px",
                textAlign: "center",
                padding: "14px",
                fontSize: "0.95rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #fbbf24 0%, #d97706 50%, #b45309 100%)",
                color: "#0c0a09",
                boxShadow: "0 6px 24px rgba(217, 119, 6, 0.45)",
                display: "block",
                width: "100%",
              }}
            >
              Book Your Stay
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
