import React from "react";
import { Paper, Stack, Typography, Divider } from "@mui/material";
import GoogleRouteBox from "./GoogleRouteBox";

function Row({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="body2" fontWeight={800} textAlign="right">
        {value || "—"}
      </Typography>
    </Stack>
  );
}

function money(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(n));
}

export default function ReservationSummary({ form, errors = {}, onChange }) {
  const isHourly = form.serviceType === "Hourly / As Directed";

  return (
    <Stack spacing={2}>
      {/* Route / Map Preview */}
      <Paper
        sx={{
          p: { xs: 1.5, md: 2 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight={950} sx={{ mb: 1 }}>
          Route Preview
        </Typography>

        <GoogleRouteBox
  pickupLocation={form.pickupLocation}
  dropoffLocation={form.dropoffLocation}
  errors={errors}
  onChange={onChange}
  isHourly={isHourly}
  showMap={true}
  showFields={false}
/>
      </Paper>

      {/* Summary */}
      <Paper
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          position: { lg: "sticky" },
          top: { lg: 96 },
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={950} sx={{ mb: 0.5 }}>
          Summary
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Review your booking details.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.1}>
          <Row label="Service" value={form.serviceType} />
          <Row label="Pickup Date" value={form.pickupDate} />
          <Row label="Pickup Time" value={form.pickupTime} />
          <Row label="Pickup" value={form.pickupLocation} />

          <Row
            label="Drop-off"
            value={isHourly ? "Hourly Service" : form.dropoffLocation}
          />

          <Divider sx={{ my: 1 }} />

          <Row label="Distance" value={form.distanceText} />
          <Row label="Estimated Time" value={form.durationText} />
          <Row label="Vehicle" value={form.vehicleType} />
          <Row label="Estimated Price" value={money(form.selectedPrice)} />

          <Divider sx={{ my: 1 }} />

          <Row label="Passengers" value={String(form.passengers || "")} />
          <Row label="Luggage" value={String(form.luggage || "")} />

          {form.returnTrip ? (
            <>
              <Divider sx={{ my: 1 }} />
              <Row label="Return Date" value={form.returnDate} />
              <Row label="Return Time" value={form.returnTime} />
            </>
          ) : null}

          {form.isAirport ? (
            <>
              <Divider sx={{ my: 1 }} />
              <Row label="Airline" value={form.airline} />
              <Row label="Flight" value={form.flightNumber} />
              <Row label="Arrival" value={form.arrivalTime} />
            </>
          ) : null}

          <Divider sx={{ my: 1 }} />

          <Row
            label="Name"
            value={`${form.firstName || ""} ${form.lastName || ""}`.trim()}
          />
          <Row label="Email" value={form.email} />
          <Row label="Phone" value={form.phone} />
        </Stack>
      </Paper>
    </Stack>
  );
}