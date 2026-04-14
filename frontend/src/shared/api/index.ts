import ky from "ky";

export const api = ky.create({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
});
