/**
 * PRISM API Service
 * Centralised fetch wrapper for all backend calls.
 * Uses Vite's proxy to forward /api/* to http://localhost:8000
 */

const BASE_URL = "";

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Cannot connect to PRISM backend. Is it running on port 8000?");
    }
    throw err;
  }
}

// ─── Registry ────────────────────────────────────────────────────────────────
export const registryApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/api/registry/${q ? `?${q}` : ""}`);
  },
  getById: (id) => request(`/api/registry/${id}`),
  getSubjects: () => request("/api/registry/subjects"),
};

// ─── Solid State ─────────────────────────────────────────────────────────────
export const solidStateApi = {
  compute: (params) =>
    request("/api/simulations/solid-state/", {
      method: "POST",
      body: JSON.stringify(params),
    }),
  getStructures: () => request("/api/simulations/solid-state/structures"),
};

// ─── Projectile Motion ───────────────────────────────────────────────────────
export const projectileApi = {
  compute: (params) =>
    request("/api/simulations/projectile-motion/", {
      method: "POST",
      body: JSON.stringify(params),
    }),
};

// ─── Function Explorer ───────────────────────────────────────────────────────
export const functionApi = {
  compute: (params) =>
    request("/api/simulations/function-explorer/", {
      method: "POST",
      body: JSON.stringify(params),
    }),
  getExamples: () => request("/api/simulations/function-explorer/examples"),
};

export const healthApi = {
  check: () => request("/api/health"),
};
