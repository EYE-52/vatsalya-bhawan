import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Images from "./utils/images";

const galleryImages = [
  { src: Images.frontView,      label: "Vatsalya Bhawan Front View" },
  { src: Images.galary1,        label: "Hotel Premises" },
  { src: Images.galary2,        label: "Property View" },
  { src: Images.roomDeluxe,     label: "Deluxe Room (AC)" },
  { src: Images.roomFamily,     label: "Family Suite" },
  { src: Images.roomStandard,   label: "Standard Room" },
  { src: Images.commonRoom1,    label: "Common Lounge" },
  { src: Images.commonRoom2,    label: "Reception Area" },
  { src: Images.roomImage1,     label: "Cozy Guest Room" },
  { src: Images.roomImage2,     label: "Spacious Bed Setup" },
  { src: Images.roomImage3,     label: "Room View" },
  { src: Images.roomImage4,     label: "Room Interior" },
  { src: Images.roomImage5,     label: "Family Accommodation" },
  { src: Images.roomImage6,     label: "Room Decor" },
  { src: Images.roomImage7,     label: "Clean Bedroom" },
  { src: Images.roomImage8,     label: "Suite Living" },
  { src: Images.roomImage9,     label: "Well-Lit Room" },
  { src: Images.godImage,        label: "Spiritual Corner" },
  { src: Images.mainGate,         label: "Main Entrance" },
  { src: Images.washroom1,      label: "Modern Bathroom" },
  { src: Images.washroom2,      label: "Clean Washroom" },
  { src: Images.amenitiesImg,    label: "Hotel Amenities" },
  { src: Images.roomView1,       label: "Ayodhya City View" },
];

const Gallery = () => {
  const [lightbox, setLightbox] = useState(null); // index
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 60);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % galleryImages.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  return (
    <section id="gallery" ref={sectionRef} style={{ background: "var(--cream)", padding: "96px 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center" style={{ marginBottom: "56px" }}>
          <div className="ornament reveal">
            <div className="ornament-line" />
            <div className="ornament-diamond" />
            <div className="ornament-line" />
          </div>
          <span className="section-label reveal">Photo Gallery</span>
          <h2
            className="font-display reveal"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--saffron-deep)", marginTop: "0.5rem" }}
          >
            Glimpses of <span style={{ color: "var(--saffron-light)", fontStyle: "italic" }}>Vatsalya Bhawan</span>
          </h2>
          <p className="reveal" style={{ color: "var(--text-light)", marginTop: "1rem", maxWidth: "480px", margin: "1rem auto 0", lineHeight: 1.7 }}>
            A visual journey through our property and the sacred city of Ayodhya
          </p>
        </div>

        {/* Masonry-style grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "12px",
          }}
        >
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="reveal img-zoom"
              onClick={() => setLightbox(i)}
              style={{
                borderRadius: "6px",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                aspectRatio: i % 5 === 0 ? "4/3" : "3/4",
                background: "var(--cream-dark)",
              }}
            >
              <img
                src={img.src}
                alt={img.label}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Overlay */}
              <div
                style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
                  opacity: 0, transition: "opacity 0.3s",
                  display: "flex", alignItems: "flex-end", padding: "14px",
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
              >
                <span style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 500 }}>{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="modal-overlay" onClick={() => setLightbox(null)}>
          <button className="modal-close" onClick={() => setLightbox(null)} aria-label="Close">×</button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[lightbox].src}
              alt={galleryImages[lightbox].label}
            />
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginTop: "10px" }}>
              {galleryImages[lightbox].label} &nbsp;·&nbsp; {lightbox + 1} / {galleryImages.length}
            </div>
          </div>
          {/* Prev/Next */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + galleryImages.length) % galleryImages.length); }}
            style={{
              position: "fixed", left: "20px", top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
              width: "44px", height: "44px", cursor: "pointer", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % galleryImages.length); }}
            style={{
              position: "fixed", right: "20px", top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
              width: "44px", height: "44px", cursor: "pointer", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;