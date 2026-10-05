import React, { useState, useEffect, useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import { galleryImages } from "./gallery/galleryData";
import GalleryItem from "./gallery/GalleryItem";
import GalleryModal from "./gallery/GalleryModal";
import GalleryControls from "./gallery/GalleryControls";

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressSmooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  useEffect(() => {
    return progressSmooth.on("change", (latest) => {
      const idx = Math.min(
        galleryImages.length - 1,
        Math.max(0, Math.round(latest * (galleryImages.length - 1)))
      );
      setActiveIndex(idx);
    });
  }, [progressSmooth]);

  return (
    <section id="gallery" style={{ background: "#0f0d0c", color: "#fef3c7" }}>
      <div
        ref={containerRef}
        style={{
          height: `${galleryImages.length * 60}vh`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "10px 6px 12px 6px",
            boxSizing: "border-box",
            overflow: "hidden",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 30,
              maxWidth: "1400px",
              width: "100%",
              margin: "0 auto",
              padding: "0 6px",
              textAlign: "center",
            }}
          >
            <div>
              <h2
                className="font-display"
                style={{ fontSize: "clamp(1.3rem, 2.8vw, 2.0rem)", fontWeight: 700, color: "#fff", margin: 0 }}
              >
                Glimpses of <span style={{ color: "var(--gold-light)", fontStyle: "italic" }}>Vatsalya Bhawan</span>
              </h2>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              flex: 1,
              width: "100%",
              maxWidth: "1400px",
              margin: "2px auto",
              perspective: "1200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {galleryImages.map((img, i) => (
              <GalleryItem
                key={i}
                img={img}
                index={i}
                progressSmooth={progressSmooth}
                total={galleryImages.length}
                onSelect={(selectedIdx) => setLightbox(selectedIdx)}
              />
            ))}
          </div>

          <GalleryControls
            activeIndex={activeIndex}
            galleryImages={galleryImages}
            containerRef={containerRef}
          />
        </div>
      </div>

      <GalleryModal
        lightbox={lightbox}
        galleryImages={galleryImages}
        onClose={() => setLightbox(null)}
        setLightbox={setLightbox}
      />
    </section>
  );
};

export default Gallery;