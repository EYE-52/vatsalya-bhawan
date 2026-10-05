import React from "react";
import { Users, Bed, Check, MessageCircle } from "lucide-react";

const RoomCard = ({ room, onSelect, onEnquire }) => {
  return (
    <div
      onClick={() => onSelect(room)}
      style={{
        borderRadius: "14px",
        border: "1px solid rgba(0,0,0,0.08)",
        overflow: "hidden",
        background: "#faf7f2",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.09)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
      }}
    >
      <div
        style={{ position: "relative", height: "230px", overflow: "hidden" }}
      >
        <img
          src={room.image}
          alt={room.name}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <span
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            background: room.badgeColor,
            color: "#ffffff",
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "4px 10px",
            borderRadius: "6px",
          }}
        >
          {room.badge}
        </span>

        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            background: "rgba(12, 10, 9, 0.85)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            color: "#ffffff",
            padding: "6px 12px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "baseline",
            gap: "2px",
          }}
        >
          <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fbbf24" }}>
            {room.price}
          </span>
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
            {room.period}
          </span>
        </div>
      </div>

      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3
          className="font-display"
          style={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "#1c1917",
            margin: "0 0 6px 0",
          }}
        >
          {room.name}
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#78716c",
            margin: "0 0 16px 0",
          }}
        >
          {room.tagline}
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            paddingBottom: "16px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.82rem",
              color: "#44403c",
              fontWeight: 600,
            }}
          >
            <Users size={16} color="#c2882b" />
            <span>{room.capacity}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.82rem",
              color: "#44403c",
              fontWeight: 600,
            }}
          >
            <Bed size={16} color="#c2882b" />
            <span>{room.bed}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, marginBottom: "20px" }}>
          {room.specs.slice(0, 4).map((spec) => (
            <div
              key={spec}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.84rem",
                color: "#57534e",
              }}
            >
              <Check size={14} color="#059669" strokeWidth={2.5} />
              <span>{spec}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(room);
            }}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "6px",
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.18)",
              color: "#1c1917",
              fontSize: "0.86rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c2882b")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.18)")}
          >
            View Details
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnquire(room.name);
            }}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #c2882b, #b45309)",
              border: "none",
              color: "#ffffff",
              fontSize: "0.86rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(180,83,9,0.25)",
            }}
          >
            <MessageCircle size={15} />
            Enquire
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
