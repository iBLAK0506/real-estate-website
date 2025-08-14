export const serverUrl =
  import.meta.env.MODE === "production"
    ? "https://real-estate-website-tebr.onrender.com"
    : "http://localhost:3000";
