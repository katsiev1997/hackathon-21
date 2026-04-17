import ky from "ky";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("x-user-id");
  } catch {
    return null;
  }
}

export const api = ky.create({
  // По умолчанию /api — тот же origin что и Vite, см. proxy в vite.config.ts (обход CORS в dev).
  prefix: import.meta.env.VITE_API_URL || "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = getToken();
        const userId = getUserId();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
        if (userId) {
          request.headers.set("X-User-ID", userId);
        }
      },
    ],
  },
  credentials: "include",
});
