const PUBLIC_API_BASE =
  import.meta.env.VITE_PUBLIC_API_BASE_URL || "https://localhost:3000/";

async function getJson(url, fallback) {
  const res = await fetch(url);
  const data = await res.json().catch(() => fallback);
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

export async function fetchVehicles() {
  const data = await getJson(`${PUBLIC_API_BASE}/api/vehicles`, []);
  return Array.isArray(data) ? data : (data?.vehicles || []);
}

export async function fetchPrices() {
  const data = await getJson(`${PUBLIC_API_BASE}/api/prices`, {});
  return Array.isArray(data) ? data : (data?.prices || []);
}

/**
 * ✅ per-vehicle images endpoint
 * GET /api/vehicle-images/:vehicleId/images
 */
export async function fetchVehicleImagesById(vehicleId) {
  if (!vehicleId) return [];
  const data = await getJson(
    `${PUBLIC_API_BASE}/api/vehicle-images/${vehicleId}/images`,
    []
  );
  return Array.isArray(data) ? data : (data?.images || []);
}

export function toPublicUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${PUBLIC_API_BASE}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/**
 * Small concurrency limiter to avoid 20 parallel requests
 */
export async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const current = idx++;
      results[current] = await mapper(items[current], current);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}
