import React, { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight active section
  useEffect(() => {
    const sections = ["home", "about", "rooms", "amenities", "gallery", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { name: "Home",      href: "#home" },
    { name: "About",     href: "#about" },
    { name: "Rooms",     href: "#rooms" },
    { name: "Amenities", href: "#amenities" },
    { name: "Gallery",   href: "#gallery" },
    { name: "Contact",   href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group" aria-label="Vatsalya Bhawan Home">
          <img
            src="/logo-vatsalya.jpg"
            alt="Vatsalya Bhawan Logo"
            className="h-14 w-14 object-contain rounded-full shadow-md transition-transform duration-300 group-hover:scale-105"
          />
          <div className="hidden sm:block">
            <p
              className="font-devnagri font-bold leading-tight"
              style={{ color: scrolled ? "#92400e" : "#fff", fontSize: "1rem", textShadow: scrolled ? "none" : "0 1px 6px rgba(0,0,0,0.5)" }}
            >
              वात्सल्य भवन
            </p>
            <p
              className="font-display tracking-widest leading-tight"
              style={{ color: scrolled ? "#b45309" : "#fbbf24", fontSize: "0.6rem", letterSpacing: "0.2em" }}
            >
              VATSALYA BHAWAN · AYODHYA
            </p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium transition-colors duration-200 group"
                style={{ color: scrolled ? (isActive ? "#b45309" : "#44403c") : (isActive ? "#fbbf24" : "rgba(255,255,255,0.9)") }}
              >
                {link.name}
                <span
                  className="absolute -bottom-1 left-0 h-0.5 bg-amber-500 transition-all duration-300"
                  style={{ width: isActive ? "100%" : "0%" }}
                />
                <span
                  className="absolute -bottom-1 left-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"
                  style={{ width: isActive ? "0%" : "0%" }}
                />
              </a>
            );
          })}
        </nav>

        {/* CTA + Phone */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:+919451338729"
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: scrolled ? "#b45309" : "rgba(255,255,255,0.9)" }}
          >
            <Phone size={15} />
            <span>+91 94513 38729</span>
          </a>
          <a href="#contact" className="btn-gold text-xs px-5 py-3">
            Book Now
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-md transition-colors"
          style={{ color: scrolled ? "#44403c" : "#fff" }}
          onClick={() => setOpen((p) => !p)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${open ? "max-h-screen" : "max-h-0"}`}
      >
        <nav className="bg-white/98 backdrop-blur-md shadow-xl px-6 pt-4 pb-6 space-y-1 border-t border-amber-100">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center py-3 text-base font-medium text-stone-700 hover:text-amber-700 border-b border-stone-100 last:border-0 transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-3">
            <a href="tel:+919451338729" className="flex items-center gap-2 text-amber-700 font-medium">
              <Phone size={16} /> +91 94513 38729
            </a>
            <a
              href="#contact"
              className="btn-gold text-center text-sm py-3"
              onClick={() => setOpen(false)}
            >
              Book Now
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
