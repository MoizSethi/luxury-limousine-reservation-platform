// reservation/reservation.controller.js
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const Reservation = require("./reservation.model");
const { sendReservationEmails } = require("../utils/mailer");
const Price = require("../price/price.model");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function digitsOnly(phone) {
  return String(phone || "").replace(/[^\d]/g, "");
}

// ✅ MUST be global, not inside createReservation()
function isHourlyService(serviceType) {
  return ["Hourly / As Directed", "By the Hour", "hourly"].includes(
    String(serviceType || "").trim()
  );
}

function validateCreate(body) {
  const errors = {};

  if (!body.serviceType) errors.serviceType = "serviceType is required";
  if (!body.pickupDate) errors.pickupDate = "pickupDate is required";
  if (!body.pickupTime) errors.pickupTime = "pickupTime is required";
  if (!body.pickupLocation) errors.pickupLocation = "pickupLocation is required";
  if (!body.vehicleType) errors.vehicleType = "vehicleType is required";

  if (body.vehicleId && Number.isNaN(Number(body.vehicleId))) {
    errors.vehicleId = "vehicleId must be a number";
  }

  if (body.selectedPrice != null && Number.isNaN(Number(body.selectedPrice))) {
    errors.selectedPrice = "selectedPrice must be a number";
  }

  const isHourly = isHourlyService(body.serviceType);

  if (isHourly) {
    const h = Number(body.durationHours);

    if (!body.durationHours || Number.isNaN(h) || h <= 0) {
      errors.durationHours =
        "durationHours must be a positive number for hourly service";
    }

    if (!body.vehicleId) {
      errors.vehicleId = "vehicleId is required for hourly pricing";
    }
  } else {
    if (!body.dropoffLocation) {
      errors.dropoffLocation = "dropoffLocation is required";
    }
  }

  if (body.returnTrip) {
    if (!body.returnDate) {
      errors.returnDate = "returnDate is required when returnTrip is true";
    }
    if (!body.returnTime) {
      errors.returnTime = "returnTime is required when returnTrip is true";
    }
  }

  if (body.isAirport) {
    if (!body.airline) errors.airline = "airline is required when isAirport is true";
    if (!body.flightNumber) {
      errors.flightNumber = "flightNumber is required when isAirport is true";
    }
    if (!body.arrivalTime) {
      errors.arrivalTime = "arrivalTime is required when isAirport is true";
    }
  }

  if (!body.firstName) errors.firstName = "firstName is required";
  if (!body.lastName) errors.lastName = "lastName is required";

  if (!body.email) errors.email = "email is required";
  else if (!isValidEmail(body.email)) errors.email = "email is invalid";

  if (!body.phone) errors.phone = "phone is required";
  else if (digitsOnly(body.phone).length < 10) errors.phone = "phone is invalid";

  const pax = Number(body.passengers);
  if (!pax || Number.isNaN(pax) || pax < 1) {
    errors.passengers = "passengers must be >= 1";
  }

  const luggage = Number(body.luggage ?? 0);
  if (Number.isNaN(luggage) || luggage < 0) {
    errors.luggage = "luggage must be >= 0";
  }

  return errors;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildStep0LeadHtml(body) {
  const row = (label, value) => `
    <tr>
      <td style="padding:10px 12px;border:1px solid #eee;background:#fafafa;width:210px">
        <b>${escapeHtml(label)}</b>
      </td>
      <td style="padding:10px 12px;border:1px solid #eee">
        ${escapeHtml(value || "—")}
      </td>
    </tr>
  `;

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#222">
      <h2 style="margin:0 0 8px">New Reservation Lead Started</h2>
      <p style="margin:0 0 16px;color:#555">
        A visitor completed Step 0 of the reservation form.
      </p>

      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:760px">
        ${row("Email", body.email)}
        ${row("Service Type", body.serviceType)}
        ${row("Pickup Date", body.pickupDate)}
        ${row("Pickup Time", body.pickupTime)}
        ${row("Pickup Location", body.pickupLocation)}
        ${row("Drop-off Location", body.dropoffLocation)}
        ${row("Duration Hours", body.durationHours)}
        ${row("Passengers", body.passengers)}
        ${row("Luggage", body.luggage)}
      </table>

      <p style="margin:16px 0 0;color:#777;font-size:12px">
        This is an early lead notification. The customer may not have completed the full reservation yet.
      </p>
    </div>
  `;
}

// ✅ POST /api/reservations/step0-mail
exports.sendStep0ReservationMail = async (req, res) => {
  try {
    const body = req.body || {};
    const requiredErrors = {};

    if (!body.email) requiredErrors.email = "email is required";
    else if (!isValidEmail(body.email)) requiredErrors.email = "email is invalid";

    if (!body.serviceType) requiredErrors.serviceType = "serviceType is required";
    if (!body.pickupDate) requiredErrors.pickupDate = "pickupDate is required";
    if (!body.pickupTime) requiredErrors.pickupTime = "pickupTime is required";
    if (!body.pickupLocation) {
      requiredErrors.pickupLocation = "pickupLocation is required";
    }

    const isHourly = isHourlyService(body.serviceType);

    if (isHourly) {
      const h = Number(body.durationHours);
      if (!body.durationHours || Number.isNaN(h) || h <= 0) {
        requiredErrors.durationHours = "durationHours is required";
      }
    } else if (!body.dropoffLocation) {
      requiredErrors.dropoffLocation = "dropoffLocation is required";
    }

    const pax = Number(body.passengers);
    if (!pax || Number.isNaN(pax) || pax < 1) {
      requiredErrors.passengers = "passengers must be >= 1";
    }

    if (Object.keys(requiredErrors).length) {
      return res.status(400).json({
        ok: false,
        message: "Validation failed",
        errors: requiredErrors,
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.NOTIFY_EMAIL || "info@newyorklimoz.com",
      subject: "New Reservation Lead Started",
      html: buildStep0LeadHtml(body),
    });

    return res.json({
      ok: true,
      message: "Step 0 email sent successfully",
    });
  } catch (err) {
    console.error("sendStep0ReservationMail error:", err);

    return res.status(500).json({
      ok: false,
      message: "Failed to send Step 0 email",
      error: err.message,
    });
  }
};

// ✅ POST /api/reservations
exports.createReservation = async (req, res) => {
  try {
    const body = req.body || {};
    const errors = validateCreate(body);

    if (Object.keys(errors).length) {
      return res.status(400).json({
        ok: false,
        message: "Validation failed",
        errors,
      });
    }

    const isHourly = isHourlyService(body.serviceType);

    let computedSelectedPrice =
      body.selectedPrice != null ? Number(body.selectedPrice) : null;

    if (isHourly && body.vehicleId && body.durationHours) {
      const vid = Number(body.vehicleId);
      const hours = Number(body.durationHours);
      
      const priceRow = await Price.findOne({
  where: {
    vehicle_id: vid,
    [Op.or]: [
      { serviceType: "hourly" },
      { serviceType: "Hourly" },
      { serviceType: "By the Hour" },
      { serviceType: "Hourly / As Directed" },
    ],
  },
});

if (priceRow) {
  const hourlyTotal = Number(
    priceRow.totalPrice ||
      priceRow.total_price ||
      priceRow.price ||
      priceRow.amount ||
      0
  );

  computedSelectedPrice = Number((hourlyTotal * hours).toFixed(2));
} else if (body.selectedPrice != null) {
  computedSelectedPrice = Number(body.selectedPrice);
} else {
  return res.status(400).json({
    ok: false,
    message: "Hourly pricing not found for selected vehicle.",
  });
}
    }

    const record = await Reservation.create({
      service_type: isHourly ? "Hourly / As Directed" : body.serviceType,
      pickup_date: body.pickupDate,
      pickup_time: body.pickupTime,
      pickup_location: body.pickupLocation,
      dropoff_location: isHourly ? null : body.dropoffLocation || null,
      duration_hours: isHourly ? Number(body.durationHours) : null,

      return_trip: !!body.returnTrip,
      return_date: body.returnTrip ? body.returnDate : null,
      return_time: body.returnTrip ? body.returnTime : null,

      passengers: Number(body.passengers),
      luggage: Number(body.luggage || 0),

      vehicle_type: body.vehicleType,
      vehicle_id: body.vehicleId ? Number(body.vehicleId) : null,
      selected_price: computedSelectedPrice,
      vehicle_image: body.vehicleImage || null,

      meet_greet: !!body.meetGreet,
      child_seat: !!body.childSeat,
      booster_seat: !!body.boosterSeat,

      is_airport: !!body.isAirport,
      airline: body.isAirport ? body.airline : null,
      flight_number: body.isAirport ? body.flightNumber : null,
      arrival_time: body.isAirport ? body.arrivalTime : null,

      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,

      notes: body.notes || null,
      status: "new",
    });

    try {
      await sendReservationEmails(record.toJSON ? record.toJSON() : record);
    } catch (mailErr) {
      console.error("Reservation created but email failed:", mailErr.message);
    }

    return res.status(201).json({
      ok: true,
      message: "Reservation created",
      reservation: record,
      pricing: isHourly
        ? {
            mode: "hourly",
            durationHours: Number(body.durationHours),
            total: computedSelectedPrice,
          }
        : {
            mode: "manual_or_other",
            total: computedSelectedPrice,
          },
    });
  } catch (err) {
    console.error("createReservation error:", err);

    return res.status(500).json({
      ok: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ GET /api/reservations?status=new&search=moiz&page=1&limit=20
exports.listReservations = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const offset = (page - 1) * limit;

    const where = {};

    if (req.query.status) where.status = req.query.status;

    if (req.query.search) {
      const q = String(req.query.search).trim();

      where[Op.or] = [
        { first_name: { [Op.like]: `%${q}%` } },
        { last_name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { phone: { [Op.like]: `%${q}%` } },
        { pickup_location: { [Op.like]: `%${q}%` } },
        { dropoff_location: { [Op.like]: `%${q}%` } },
      ];
    }

    if (req.query.from || req.query.to) {
      where.pickup_date = {};

      if (req.query.from) where.pickup_date[Op.gte] = req.query.from;
      if (req.query.to) where.pickup_date[Op.lte] = req.query.to;
    }

    const { rows, count } = await Reservation.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      ok: true,
      page,
      limit,
      total: count,
      reservations: rows,
    });
  } catch (err) {
    console.error("listReservations error:", err);

    return res.status(500).json({
      ok: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ GET /api/reservations/:id
exports.getReservationById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "Invalid id",
      });
    }

    const record = await Reservation.findByPk(id);

    if (!record) {
      return res.status(404).json({
        ok: false,
        message: "Reservation not found",
      });
    }

    return res.json({
      ok: true,
      reservation: record,
    });
  } catch (err) {
    console.error("getReservationById error:", err);

    return res.status(500).json({
      ok: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ PATCH /api/reservations/:id/status
exports.updateReservationStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "Invalid id",
      });
    }

    const allowed = new Set(["new", "confirmed", "completed", "cancelled"]);

    if (!allowed.has(status)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid status",
        allowed: Array.from(allowed),
      });
    }

    const record = await Reservation.findByPk(id);

    if (!record) {
      return res.status(404).json({
        ok: false,
        message: "Reservation not found",
      });
    }

    record.status = status;
    await record.save();

    return res.json({
      ok: true,
      message: "Status updated",
      reservation: record,
    });
  } catch (err) {
    console.error("updateReservationStatus error:", err);

    return res.status(500).json({
      ok: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ DELETE /api/reservations/:id
exports.deleteReservation = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "Invalid id",
      });
    }

    const record = await Reservation.findByPk(id);

    if (!record) {
      return res.status(404).json({
        ok: false,
        message: "Reservation not found",
      });
    }

    await record.destroy();

    return res.json({
      ok: true,
      message: "Reservation deleted",
    });
  } catch (err) {
    console.error("deleteReservation error:", err);

    return res.status(500).json({
      ok: false,
      message: "Server error",
      error: err.message,
    });
  }
};