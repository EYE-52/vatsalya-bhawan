import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

const RoomModal = ({ room, onClose, onEnquire }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const atBottomRef = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const handleSmoothClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 220);
  }, [onClose]);

  const handleNextImage = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!room || !room.gallery || room.gallery.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % room.gallery.length);
  }, [room]);

  const handlePrevImage = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!room || !room.gallery || room.gallery.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + room.gallery.length) % room.gallery.length);
  }, [room]);

  useEffect(() => {
    if (room) {
      setCurrentImageIndex(0);
      setIsClosing(false);
      atBottomRef.current = false;

      const handleKeyDown = (e) => {
        if (e.key === "Escape") handleSmoothClose();
        if (e.key === "ArrowRight") handleNextImage();
        if (e.key === "ArrowLeft") handlePrevImage();
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [room, handleSmoothClose, handleNextImage, handlePrevImage]);

  const handleModalScroll = (e) => {
    const el = e.currentTarget;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 10;
    atBottomRef.current = isAtBottom;
  };

  const handleModalWheel = (e) => {
    if (atBottomRef.current && e.deltaY > 32 && !isClosing) {
      handleSmoothClose();
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;
    if (atBottomRef.current && deltaY > 55 && !isClosing) {
      handleSmoothClose();
    }
  };

  const handleImageTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
  };

  if (!room) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="room-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,0.80)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
        onClick={handleSmoothClose}
      >
        <motion.div
          key="room-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: isClosing ? 0 : 1, scale: isClosing ? 0.94 : 1, y: isClosing ? 24 : 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="no-scrollbar"
          onScroll={handleModalScroll}
          onWheel={handleModalWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            maxWidth: "680px",
            width: "100%",
            maxHeight: "88vh",
            overflowY: "auto",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleSmoothClose}
            aria-label="Close"
            style={{
              position: "sticky",
              top: "14px",
              float: "right",
              marginRight: "14px",
              marginTop: "14px",
              marginBottom: "-40px",
              zIndex: 30,
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "rgba(18, 15, 13, 0.85)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              color: "#fbbf24",
              border: "1px solid rgba(251, 191, 36, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#d97706";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(18, 15, 13, 0.85)";
              e.currentTarget.style.color = "#fbbf24";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleImageTouchEnd}
            style={{
              height: "clamp(260px, 42vh, 340px)",
              position: "relative",
              clear: "both",
              overflow: "hidden",
              background: "#1c1917",
              userSelect: "none",
            }}
          >
            <img
              key={currentImageIndex}
              src={
                room.gallery && room.gallery.length > 0
                  ? room.gallery[currentImageIndex]
                  : room.image
              }
              alt={`${room.name} ${currentImageIndex + 1}`}
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "opacity 0.25s ease",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.7) 100%)",
                pointerEvents: "none",
              }}
            />

            {room.gallery && room.gallery.length > 1 && (
              <button
                onClick={handlePrevImage}
                aria-label="Previous photo"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 25,
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "rgba(18, 15, 13, 0.78)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(251, 191, 36, 0.4)",
                  color: "#fbbf24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d97706";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(18, 15, 13, 0.78)";
                  e.currentTarget.style.color = "#fbbf24";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                <ChevronLeft size={22} strokeWidth={2.5} />
              </button>
            )}

            {room.gallery && room.gallery.length > 1 && (
              <button
                onClick={handleNextImage}
                aria-label="Next photo"
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 25,
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "rgba(18, 15, 13, 0.78)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(251, 191, 36, 0.4)",
                  color: "#fbbf24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d97706";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(18, 15, 13, 0.78)";
                  e.currentTarget.style.color = "#fbbf24";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                <ChevronRight size={22} strokeWidth={2.5} />
              </button>
            )}

            <div
              style={{
                position: "absolute",
                bottom: "14px",
                left: "16px",
                zIndex: 20,
                background: "rgba(12, 10, 9, 0.85)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                color: "#ffffff",
                padding: "5px 12px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "baseline",
                gap: "4px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
                border: "1px solid rgba(251, 191, 36, 0.2)",
              }}
            >
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fbbf24" }}>
                {room.price}
              </span>
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>
                {room.period}
              </span>
            </div>
          </div>

          <div style={{ padding: "26px 24px" }}>
            <h3
              className="font-display"
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#1c1917",
                margin: "0 0 6px 0",
              }}
            >
              {room.name}
            </h3>
            <p style={{ color: "#78716c", fontSize: "0.95rem", lineHeight: 1.5, margin: "0 0 18px 0" }}>
              {room.description}
            </p>

            <h4
              style={{
                fontSize: "0.86rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#c2882b",
                marginBottom: "12px",
              }}
            >
              Included Features & Amenities
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              {room.specs.map((spec) => (
                <div
                  key={spec}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.85rem",
                    color: "#44403c",
                  }}
                >
                  <Check size={15} color="#059669" strokeWidth={2.5} />
                  <span>{spec}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
              <button
                onClick={() => onEnquire(room.name)}
                style={{
                  flex: 1,
                  minWidth: "180px",
                  padding: "13px 20px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #25d366, #128c7e)",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.94rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
                }}
              >
                <MessageCircle size={18} />
                Book on WhatsApp
              </button>
              <button
                onClick={() => {
                  handleSmoothClose();
                  setTimeout(() => {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }, 260);
                }}
                style={{
                  padding: "13px 18px",
                  borderRadius: "8px",
                  background: "#f5f5f4",
                  color: "#1c1917",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Fill Form Instead
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RoomModal;
