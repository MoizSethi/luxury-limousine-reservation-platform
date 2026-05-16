const API_BASE = (
  import.meta?.env?.VITE_API_BASE_URL || "https://localhost:3000"
).replace(/\/+$/, "");

async function parseResponse(res) {
  const text = await res.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  return data;
}

function throwApiError(res, data, fallbackMessage, payload = null) {
  console.error(fallbackMessage, {
    status: res.status,
    data,
    payload,
  });

  const err = new Error(
    data?.message || data?.error || `${fallbackMessage}. Status: ${res.status}`
  );

  err.status = res.status;
  err.errors = data?.errors || null;
  throw err;
}

export async function submitReservation(payload) {
  const res = await fetch(`${API_BASE}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throwApiError(res, data, "Reservation submit failed", payload);
  }

  return data;
}

export async function sendStep0ReservationMail(payload) {
  const res = await fetch(`${API_BASE}/api/reservations/step0-mail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throwApiError(res, data, "Step 0 reservation email failed", payload);
  }

  return data;
}