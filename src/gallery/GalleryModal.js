import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from "lucide-react";

const GalleryModal = ({ lightbox, galleryImages, onClose, setLightbox }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setIsZoomed(false);
    if (lightbox !== null) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handler = (e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % galleryImages.length);
        if (e.key === "ArrowLeft") setLightbox((i) => (i - 1 + galleryImages.length) % galleryImages.length);
      };
      window.addEventListener("keydown", handler);
      return () => {
        document.body.style.overflow = origOverflow;
        window.removeEventListener("keydown", handler);
      };
    }
  }, [lightbox, galleryImages.length, onClose, setLightbox]);

  if (lightbox === null) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        style={{
          position: "fixed", top: "20px", right: "24px",
          display: "flex", alignItems: "center", gap: "12px", zIndex: 1010,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsZoomed((z) => !z)}
          style={{
            background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
            width: "44px", height: "44px", cursor: "pointer", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
          title={isZoomed ? "Zoom out" : "Zoom in"}
        >
          {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
        </button>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
            width: "44px", height: "44px", cursor: "pointer", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
          title="Close (Esc)"
        >
          <X size={22} />
        </button>
      </div>

      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: "85vh", maxWidth: "90vw", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", overflow: isZoomed ? "auto" : "visible",
        }}
      >
        <img
          src={galleryImages[lightbox].src}
          alt={galleryImages[lightbox].label}
          decoding="async"
          onClick={() => setIsZoomed((z) => !z)}
          style={{
            maxWidth: isZoomed ? "none" : "100%",
            maxHeight: isZoomed ? "none" : "80vh",
            transform: isZoomed ? "scale(1.5)" : "scale(1)",
            transformOrigin: "center center",
            transition: "transform 0.3s ease",
            cursor: isZoomed ? "zoom-out" : "zoom-in",
            objectFit: "contain", borderRadius: "8px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
          }}
        />
        <div
          style={{
            textAlign: "center", color: "rgba(255,255,255,0.85)", fontSize: "0.88rem",
            marginTop: "16px", background: "rgba(0,0,0,0.5)", padding: "6px 16px",
            borderRadius: "20px", backdropFilter: "blur(4px)",
          }}
        >
          <strong>{galleryImages[lightbox].label}</strong> &nbsp;·&nbsp; {lightbox + 1} of {galleryImages.length}
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + galleryImages.length) % galleryImages.length); }}
        style={{
          position: "fixed", left: "20px", top: "50%", transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
          width: "48px", height: "48px", cursor: "pointer", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % galleryImages.length); }}
        style={{
          position: "fixed", right: "20px", top: "50%", transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
          width: "48px", height: "48px", cursor: "pointer", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default GalleryModal;
