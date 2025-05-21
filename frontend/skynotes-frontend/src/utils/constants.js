// src/utils/constants.js
console.log("Constants.js loaded.");
console.log(
  "Value of import.meta.env.VITE_API_URL:",
  import.meta.env.VITE_API_URL
);

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

console.log("Value of BASE_URL after assignment:", BASE_URL);
