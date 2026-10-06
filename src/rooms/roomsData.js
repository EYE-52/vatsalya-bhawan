import deluxe1 from "../assets/room1-deluxe/photo-1.webp";
import deluxe2 from "../assets/room1-deluxe/photo-2.webp";
import deluxe3 from "../assets/room1-deluxe/photo-3.webp";
import deluxe4 from "../assets/room1-deluxe/photo-4.webp";
import deluxe5 from "../assets/room1-deluxe/photo-5.webp";
import deluxe6 from "../assets/room1-deluxe/photo-6.webp";

import family1 from "../assets/room2-family/photo-1.webp";
import family2 from "../assets/room2-family/photo-2.webp";
import family3 from "../assets/room2-family/photo-3.webp";
import family4 from "../assets/room2-family/photo-4.webp";
import family5 from "../assets/room2-family/photo-5.webp";
import family6 from "../assets/room2-family/photo-6.webp";

import standard1 from "../assets/room3-standard/photo-1.webp";
import standard2 from "../assets/room3-standard/photo-2.webp";
import standard3 from "../assets/room3-standard/photo-3.webp";
import standard4 from "../assets/room3-standard/photo-4.webp";
import standard5 from "../assets/room3-standard/photo-5.webp";


export const roomsData = [
  {
    id: "deluxe",
    name: "Deluxe King Room",
    tagline: "Spacious Comfort & City Balcony",
    price: "₹2,499",
    period: "/ night",
    capacity: "2 Guests",
    bed: "1 King Bed",
    image: deluxe1,
    gallery: [deluxe1, deluxe2, deluxe3, deluxe4, deluxe5, deluxe6],
    badge: "Most Popular",
    badgeColor: "#b45309",
    specs: [
      "Air Conditioned",
      "Private Balcony",
      "Attached Modern Bath",
      "Geyser Hot Water",
      "Free High-Speed Wi-Fi",
      "Daily Housekeeping",
      "LED Television",
      "Work / Tea Table",
    ],
    description:
      "Designed for couples and pilgrims seeking refined serenity. Features a plush king bed, private balcony opening to Ayodhya's morning breeze, modern climate control, and a sparkling attached bathroom with 24/7 hot water.",
  },
  {
    id: "family",
    name: "Spacious Family Suite",
    tagline: "Ideal for Pilgrim Families & Groups",
    price: "₹3,499",
    period: "/ night",
    capacity: "4 Guests",
    bed: "2 Queen Beds",
    image: family1,
    gallery: [family1, family2, family3, family4, family5, family6],
    badge: "Family Pick",
    badgeColor: "#7c3aed",
    specs: [
      "Two Large Queen Beds",
      "Spacious Sitting Lounge",
      "Air Conditioned",
      "Attached Modern Bath",
      "Puja & Prayer Space",
      "Free Wi-Fi",
      "Luggage Wardrobe",
      "Electric Kettle & Tea",
    ],
    description:
      "Our premier family sanctuary comfortably accommodates up to four family members. Includes two premium queen-sized beds, a dedicated sitting area, ample wardrobe storage, and a serene atmosphere suited for prayer and family togetherness.",
  },
  {
    id: "standard",
    name: "Standard Cozy Room",
    tagline: "Serene & Budget-Friendly",
    price: "₹1,699",
    period: "/ night",
    capacity: "2 Guests",
    bed: "1 Double Bed",
    image: standard1,
    gallery: [standard1, standard2, standard3, standard4, standard5],
    badge: "Best Value",
    badgeColor: "#059669",
    specs: [
      "Comfortable Double Bed",
      "Private Attached Bath",
      "Geyser Hot Water",
      "Free Wi-Fi",
      "Daily Cleaning",
      "Ceiling Fan & Ventilation",
      "Filtered Drinking Water",
    ],
    description:
      "Ideal for solo pilgrims and budget-conscious travelers desiring a spotless, comfortable place to sleep after hours of temple Darshan. Fully furnished with fresh linen, clean attached bath, and quiet surroundings.",
  },
];

export default roomsData;
