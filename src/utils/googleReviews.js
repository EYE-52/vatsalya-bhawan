import { useState, useEffect } from "react";

const SERP_API_KEY = process.env.REACT_APP_SERP_API_KEY || "";

export const GOOGLE_PLACE_CONFIG = {
  name: "Vatsalya Bhawan",
  hindiName: "वात्सल्य भवन",
  placeId: "ChIJ2Qk5QQAHmjkR4V6-h_o0qNs",
  dataId: "0x399a0700413909d9:0xdba834fa87be5ee1",
  fallbackRating: 4.7,
  fallbackReviewsCount: 538,
  mapsUrl: "https://www.google.com/travel/hotels/s/VRKk9iQtHDwYtmhh9",
  writeReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJ2Qk5QQAHmjkR4e6-h_o0qNs",
  reviewsUrl: "https://www.google.com/travel/hotels/s/VRKk9iQtHDwYtmhh9",
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_KEY = "vb_gmaps_review_data_v3";
const CACHE_TIMESTAMP_KEY = "vb_gmaps_review_timestamp_v3";

export function useGoogleReviews() {
  const [data, setData] = useState({
    rating: GOOGLE_PLACE_CONFIG.fallbackRating,
    totalReviews: GOOGLE_PLACE_CONFIG.fallbackReviewsCount,
    isLive: true,
    mapsUrl: GOOGLE_PLACE_CONFIG.mapsUrl,
    writeReviewUrl: GOOGLE_PLACE_CONFIG.writeReviewUrl,
    reviewsUrl: GOOGLE_PLACE_CONFIG.reviewsUrl,
  });

  useEffect(() => {
    let isMounted = true;

    try {
      localStorage.removeItem("vb_google_rating_data");
      localStorage.removeItem("vb_gmaps_review_data_v2");
    } catch (e) {}

    async function fetchLiveGoogleData() {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

        if (cachedData && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp, 10);
          if (age < CACHE_TTL_MS) {
            const parsed = JSON.parse(cachedData);
            if (parsed && parsed.rating && parsed.totalReviews && Number(parsed.totalReviews) >= 500) {
              if (isMounted) {
                setData((prev) => ({
                  ...prev,
                  rating: Number(parsed.rating) || prev.rating,
                  totalReviews: Number(parsed.totalReviews) || prev.totalReviews,
                }));
              }
              return;
            }
          }
        }
      } catch (e) {}

      if (!SERP_API_KEY) return;

      try {
        const url = `https://serpapi.com/search.json?engine=google_maps&q=Vatsalya+Bhawan+Ayodhya&api_key=${SERP_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) return;

        const result = await response.json();
        const place = result.place_results || (result.local_results && result.local_results[0]);

        if (place && (place.rating || place.reviews)) {
          const newRating = Number(place.rating) || GOOGLE_PLACE_CONFIG.fallbackRating;
          const newReviews = Number(place.reviews) || GOOGLE_PLACE_CONFIG.fallbackReviewsCount;

          if (isMounted) {
            setData((prev) => ({
              ...prev,
              rating: newRating,
              totalReviews: newReviews,
            }));
          }

          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ rating: newRating, totalReviews: newReviews })
            );
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
          } catch (e) {}
        }
      } catch (err) {}
    }

    fetchLiveGoogleData();

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
}
