import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Images from "./utils/images";

const slides = [
  {
    image: Images.frontView,
    title: "Welcome to",
    highlight: "Vatsalya Bhawan, Ayodhya",
    subtitle: "Your sacred home away from home — just 500 metres from Shri Ram Janmabhoomi",
  },
  {
    image: Images.roomDeluxe,
    title: "Thoughtfully Crafted",
    highlight: "Rooms & Suites",
    subtitle: "Comfortable, serene spaces designed for pilgrims and travellers seeking peace",
  },
  {
    image: Images.commonRoom1,
    title: "A Sacred Retreat in the",
    highlight: "Heart of Ayodhya",
    subtitle: "Experience warm hospitality, divine peace, and pure vegetarian living",
  },
  {
    image: Images.mainGate,
    title: "Gateway to the",
    highlight: "Holy City",
    subtitle: "Begin your spiritual journey with our warm and caring service",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    setCurrent(idx);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = slides[current];

  return (
    <section id="home" className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover"
            style={{ animation: i === current ? "kenburns 14s ease infinite" : "none" }}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.70) 100%)",
        }}
      />

      {/* Decorative top band */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-20"
        style={{ background: "linear-gradient(90deg, #92400e, #d97706, #fbbf24, #d97706, #92400e)" }}
      />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 border border-amber-400/60 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm"
          style={{ background: "rgba(180,83,9,0.2)", animation: "fadeIn 0.8s ease 0.2s both" }}
        >
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#fbbf24", fontWeight: 600 }}>
            ✦ Premium Stay in Ayodhya ✦
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display mb-3"
          style={{
            fontSize: "clamp(2rem, 6vw, 4.5rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            animation: "fadeInUp 0.8s ease 0.35s both",
          }}
        >
          {slide.title}
          <br />
          <span style={{ color: "#fbbf24" }}>{slide.highlight}</span>
        </h1>

        {/* Sub */}
        <p
          className="font-serif max-w-lg mx-auto mb-10"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            color: "rgba(255,255,255,0.85)",
            fontStyle: "italic",
            animation: "fadeInUp 0.8s ease 0.5s both",
          }}
        >
          {slide.subtitle}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-4"
          style={{ animation: "fadeInUp 0.8s ease 0.65s both" }}
        >
          <a href="#contact" className="btn-gold px-8 py-4 text-sm">
            Book Your Stay
          </a>
          <a href="#rooms" className="btn-outline-gold px-8 py-4 text-sm" style={{ borderColor: "rgba(255,255,255,0.5)", color: "white" }}>
            Explore Rooms
          </a>
        </div>

        {/* Stars */}
        <div className="mt-6 flex items-center gap-1" style={{ animation: "fadeIn 0.8s ease 0.8s both" }}>
          <span className="stars">★★★★★</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", marginLeft: "6px" }}>
            Highly Rated on Booking.com
          </span>
        </div>
      </div>

      {/* Slide Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === current ? "#d97706" : "rgba(255,255,255,0.5)",
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        style={{ animation: "float 2.5s ease-in-out infinite", color: "rgba(255,255,255,0.6)" }}
      >
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
        <ChevronDown size={18} />
      </div>

      {/* Quick stats bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 hidden md:flex"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
      >
        {[
          { label: "Distance to Ram Mandir", value: "500 m" },
          { label: "Check-in / Check-out", value: "12:00 PM" },
          { label: "Room Types", value: "AC & Non-AC" },
          { label: "24/7 Support", value: "Always Available" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex-1 flex flex-col items-center justify-center py-4 border-r border-white/10 last:border-r-0 gap-0.5"
          >
            <span style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
              {stat.value}
            </span>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;