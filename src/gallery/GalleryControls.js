import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GalleryControls = ({ activeIndex, galleryImages, containerRef }) => {
  const scrollToPhoto = (targetIndex) => {
    if (!containerRef.current) return;
    const step = (containerRef.current.clientHeight - window.innerHeight) / (galleryImages.length - 1);
    window.scrollTo({ top: containerRef.current.offsetTop + targetIndex * step, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .gallery-nav-controls {
            display: none !important;
          }
        }
      `}</style>
      <div
        className="gallery-nav-controls"
        style={{
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => scrollToPhoto(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            aria-label="Previous Photo"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: activeIndex === 0 ? "rgba(255,255,255,0.3)" : "#fff",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              cursor: activeIndex === 0 ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(6px)",
              transition: "all 0.2s ease",
            }}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => scrollToPhoto(Math.min(galleryImages.length - 1, activeIndex + 1))}
            disabled={activeIndex === galleryImages.length - 1}
            aria-label="Next Photo"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: activeIndex === galleryImages.length - 1 ? "rgba(255,255,255,0.3)" : "#fff",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              cursor: activeIndex === galleryImages.length - 1 ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(6px)",
              transition: "all 0.2s ease",
            }}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </>
  );
};

export default GalleryControls;
