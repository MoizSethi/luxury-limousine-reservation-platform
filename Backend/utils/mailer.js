// utils/mailer.js
const nodemailer = require("nodemailer");

function requiredEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function buildTransporter() {
  const host = requiredEnv("SMTP_HOST");
  const port = Number(requiredEnv("SMTP_PORT"));
  const user = requiredEnv("SMTP_EMAIL");
  const pass = requiredEnv("SMTP_PASSWORD");

  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function asNumber(v) {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function moneyUSD(v) {
  const n = asNumber(v);
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function isUrl(s) {
  return /^https?:\/\//i.test(String(s || ""));
}

function formatReservationHtml(r) {
  const row = (k, v) => `
    <tr>
      <td style="padding:8px 10px;border:1px solid #eee;background:#fafafa;width:220px">
        <b>${escapeHtml(k)}</b>
      </td>
      <td style="padding:8px 10px;border:1px solid #eee">
        ${escapeHtml(v ?? "—")}
      </td>
    </tr>
  `;

  const rowHtml = (k, vHtml) => `
    <tr>
      <td style="padding:8px 10px;border:1px solid #eee;background:#fafafa;width:220px">
        <b>${escapeHtml(k)}</b>
      </td>
      <td style="padding:8px 10px;border:1px solid #eee">
        ${vHtml || "—"}
      </td>
    </tr>
  `;

  const fullName = `${r.first_name || ""} ${r.last_name || ""}`.trim();

  // ✅ robust price handling
  const selectedPriceText = moneyUSD(r.selected_price);

  // ✅ image link (if present)
  const vehicleImage = r.vehicle_image || "";
  const vehicleImageCell = vehicleImage
    ? (isUrl(vehicleImage)
        ? `<a href="${escapeHtml(vehicleImage)}" target="_blank" rel="noreferrer">${escapeHtml(vehicleImage)}</a>`
        : escapeHtml(vehicleImage))
    : "—";

  return `
  <div style="font-family:Arial,sans-serif;line-height:1.5">
    <h2 style="margin:0 0 10px">Reservation Request Received</h2>
    <p style="margin:0 0 14px;color:#444">
      Thanks ${escapeHtml(fullName || "there")} — we’ve received your reservation request. Our team will confirm shortly.
    </p>

    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:760px">
      ${row("Reservation ID", r.id)}
      ${row("Status", r.status)}
      ${row("Service Type", r.service_type)}
      ${row("Pickup Date", r.pickup_date)}
      ${row("Pickup Time", r.pickup_time)}
      ${row("Pickup Location", r.pickup_location)}
      ${row("Drop-off Location", r.dropoff_location || (r.duration_hours ? "Hourly Service" : "—"))}
      ${row("Duration Hours", r.duration_hours ?? "—")}
      ${row("Passengers", r.passengers ?? "—")}
      ${row("Luggage", r.luggage ?? "—")}
      ${row("Vehicle", r.vehicle_type ?? "—")}
      ${row("Vehicle ID", r.vehicle_id ?? "—")}

      <!-- ✅ PRICE -->
      ${row("Selected Price (Estimated)", selectedPriceText)}

      <!-- ✅ IMAGE -->
      ${rowHtml("Vehicle Image", vehicleImageCell)}

      ${row("Return Trip", r.return_trip ? "Yes" : "No")}
      ${r.return_trip ? row("Return Date", r.return_date) : ""}
      ${r.return_trip ? row("Return Time", r.return_time) : ""}

      ${row("Airport Details", r.is_airport ? "Yes" : "No")}
      ${r.is_airport ? row("Airline", r.airline) : ""}
      ${r.is_airport ? row("Flight Number", r.flight_number) : ""}
      ${r.is_airport ? row("Arrival Time", r.arrival_time) : ""}

      ${row("Meet & Greet", r.meet_greet ? "Yes" : "No")}
      ${row("Child Seat", r.child_seat ? "Yes" : "No")}
      ${row("Booster Seat", r.booster_seat ? "Yes" : "No")}

      ${row("Passenger Name", fullName || "—")}
      ${row("Email", r.email)}
      ${row("Phone", r.phone)}
      ${row("Notes", r.notes || "—")}
      ${row("Created At", r.created_at || r.createdAt || "—")}
    </table>

    <p style="margin:14px 0 0;color:#666;font-size:12px">
      If any details are incorrect, reply to this email.
    </p>
  </div>
  `;
}

async function sendReservationEmails(reservation) {
  const transporter = buildTransporter();
  await transporter.verify();

  const from = process.env.SMTP_EMAIL;
  const notify = process.env.NOTIFY_EMAIL || process.env.SMTP_EMAIL;

  const subjectCustomer = `Reservation Received (ID: ${reservation.id})`;
  const subjectAdmin = `New Reservation Request (ID: ${reservation.id})`;

  const html = formatReservationHtml(reservation);

  // Customer
  await transporter.sendMail({
    from,
    to: reservation.email,
    subject: subjectCustomer,
    html,
  });

  // Admin
  await transporter.sendMail({
    from,
    to: notify,
    subject: subjectAdmin,
    html,
  });
}

module.exports = { sendReservationEmails };
