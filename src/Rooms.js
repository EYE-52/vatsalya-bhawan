import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import roomsData from "./rooms/roomsData";
import RoomCard from "./rooms/RoomCard";
import RoomModal from "./rooms/RoomModal";

const Rooms = ({ onModalToggle }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (onModalToggle) {
      onModalToggle(Boolean(selectedRoom));
    }
  }, [selectedRoom, onModalToggle]);

  useEffect(() => {
    if (selectedRoom) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [selectedRoom]);

  const openWhatsApp = (roomName) => {
    const text = encodeURIComponent(
      `Hello Vatsalya Bhawan, I would like to inquire about booking the ${roomName}. Please share availability and current rates.`
    );
    window.open(`https://wa.me/919451338729?text=${text}`, "_blank");
  };

  return (
    <section
      id="rooms"
      style={{
        position: "relative",
        zIndex: 20,
        background: "#ffffff",
        padding: "80px 0",
        boxShadow: "0 -24px 48px rgba(0,0,0,0.06)",
      }}
    >
      <div className="container-section">
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
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
            <Sparkles size={14} />
            ACCOMMODATION CHOICES
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
            Select Your Ideal Room in{" "}
            <span style={{ color: "#c2882b", fontStyle: "italic" }}>
              Ayodhya
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
            Honest rates, spotless hygiene, and peaceful spaces tailored for every pilgrim and family.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
          }}
        >
          {roomsData.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onSelect={setSelectedRoom}
              onEnquire={openWhatsApp}
            />
          ))}
        </div>
      </div>

      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onEnquire={openWhatsApp}
        />
      )}
    </section>
  );
};

export default Rooms;