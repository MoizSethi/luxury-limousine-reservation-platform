import React, { useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Stack,
  Typography,
  Divider,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import VehiclePicker from "./VehiclePicker";
import GoogleRouteBox from "./GoogleRouteBox";

function money(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(n));
}

function Section({ children }) {
  return <Box sx={{ mb: 0.45 }}>{children}</Box>;
}

export default function ReservationForm({
  step,
  form,
  errors,
  loading,
  onChange,
  onBack,
  onNext,
  onAutoNext,
  onSubmit,
  compactVehiclePicker = false,
}) {
  const SERVICE_TYPES = useMemo(() => ["Transfer", "By the Hour"], []);

  const currentService = form.serviceType || "Transfer";
  const isHourly = currentService === "By the Hour";

  useEffect(() => {
    if (!form.serviceType) {
      onChange("serviceType", "Transfer");
    }
  }, [form.serviceType, onChange]);

  useEffect(() => {
    if (isHourly && !form.durationHours) {
      onChange("durationHours", 1);
    }
  }, [isHourly, form.durationHours, onChange]);

  const hasVehicle = !!form.vehicleId && !!form.vehicleType;
  const hasPrice =
    form.selectedPrice != null && !Number.isNaN(Number(form.selectedPrice));

  const handleServiceChange = (service) => {
    onChange("serviceType", service);

    if (service === "By the Hour") {
      onChange("dropoffLocation", "");
      if (!form.durationHours) onChange("durationHours", 1);
    }
  };

  const handleDurationChange = (val) => {
  window.__reservationHours = Number(val) || 1;
  onChange("durationHours", val);

  const hours = Number(val);
  const hourly = Number(form.hourlyPrice);

  if (
    isHourly &&
    !Number.isNaN(hours) &&
    hours > 0 &&
    !Number.isNaN(hourly) &&
    hourly > 0
  ) {
    onChange("selectedPrice", Number((hourly * hours).toFixed(2)));
  }
};

  const handleStep0Next = () => {
    if (!form.serviceType) onChange("serviceType", currentService);
    if (isHourly && !form.durationHours) onChange("durationHours", 1);

    setTimeout(() => {
      onNext?.();
    }, 0);
  };

  const fieldSx = {
    bgcolor: "#fff",
    borderRadius: "10px",
    "& .MuiOutlinedInput-root": {
      height: 42,
      borderRadius: "10px",
      bgcolor: "#fff",
      fontSize: 14,
      color: "#1a202c",
      "& fieldset": { borderColor: "rgba(26,54,93,0.18)" },
      "&:hover fieldset": { borderColor: "#d4af37" },
      "&.Mui-focused fieldset": {
        borderColor: "#1a365d",
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: 13,
      color: "#4a5568",
      "&.Mui-focused": { color: "#1a365d" },
    },
    "& .MuiInputBase-input": {
      py: 0.7,
      px: 1.25,
    },
    "& .MuiFormHelperText-root": {
      display: "none",
      m: 0,
    },
  };

  const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
    const totalMinutes = i * 15;
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;

    return {
      label: `${hours12}:${String(minutes).padStart(2, "0")} ${period}`,
      value: `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`,
    };
  });

  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: "100%",
        mx: 0,
        p: { xs: 1.2, md: 1.5 },
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(212,175,55,0.35)",
        boxShadow: "0 24px 70px rgba(15,32,69,0.28)",
        backdropFilter: "blur(16px)",
        maxHeight: step === 1 ? "none" : { xs: "78vh", md: "76vh" },

overflowY: step === 1 ? "visible" : step > 0 ? "auto" : "hidden",
        overflowX: "hidden",
pb: step === 1 ? 1.5 : step > 0 ? 0 : 1.5,
      }}
    >
      {step === 0 ? (
        <Box>
          <Grid container spacing={0.5} sx={{ mb: 0.75 }}>
            {SERVICE_TYPES.map((service) => {
              const active = currentService === service;

              return (
                <Grid item xs={6} key={service}>
                  <Button
                    fullWidth
                    onClick={() => handleServiceChange(service)}
                    sx={{
                      height: 44,
                      borderRadius: 2,
                      mx: 0.25,
                      color: active ? "#fff" : "#1a365d",
                      fontSize: 15,
                      fontWeight: 800,
                      textTransform: "none",
                      bgcolor: active ? "#1a365d" : "rgba(26,54,93,0.06)",
                      border: active
                        ? "1px solid #1a365d"
                        : "1px solid rgba(26,54,93,0.12)",
                      boxShadow: active
                        ? "0 10px 24px rgba(26,54,93,0.22)"
                        : "none",
                      "&:hover": {
                        bgcolor: active
                          ? "#0f2045"
                          : "rgba(212,175,55,0.14)",
                      },
                    }}
                  >
                    {service}
                  </Button>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ p: 0.6 }}>
            <Section>
              {isHourly ? (
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <GoogleRouteBox
                      pickupLocation={form.pickupLocation}
                      dropoffLocation={form.dropoffLocation}
                      errors={errors}
                      onChange={onChange}
                      isHourly={true}
                      showMap={false}
                      showFields={true}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Hours"
                      value={form.durationHours || 1}
                      onChange={(e) => handleDurationChange(e.target.value)}
                      error={!!errors.durationHours}
                      helperText={errors.durationHours || ""}
                      sx={fieldSx}
                      SelectProps={{ native: true }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                        <option key={h} value={h}>
                          {h} Hour(s)
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              ) : (
                <GoogleRouteBox
                  pickupLocation={form.pickupLocation}
                  dropoffLocation={form.dropoffLocation}
                  errors={errors}
                  onChange={onChange}
                  isHourly={false}
                  showMap={false}
                  showFields={true}
                />
              )}
            </Section>

            <Section>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    fullWidth
                    size="small"
                    label="Pick Up Date"
                    value={form.pickupDate}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => onChange("pickupDate", e.target.value)}
                    error={!!errors.pickupDate}
                    helperText={errors.pickupDate || ""}
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Pick Up Time"
                    value={form.pickupTime}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => onChange("pickupTime", e.target.value)}
                    error={!!errors.pickupTime}
                    helperText={errors.pickupTime || ""}
                    sx={fieldSx}
                    SelectProps={{ native: true }}
                  >
                    <option value="">Select Time</option>
                    {TIME_OPTIONS.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    label="Passengers"
                    placeholder="Num. Pass"
                    value={form.passengers}
                    onChange={(e) => onChange("passengers", e.target.value)}
                    error={!!errors.passengers}
                    helperText={errors.passengers || ""}
                    inputProps={{ min: 1 }}
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    type="email"
                    fullWidth
                    size="small"
                    label="E-Mail"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email || ""}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </Section>

            {!isHourly ? (
              <Box sx={{ mt: 0.45, p: 0.75, bgcolor: "#fff", color: "#000" }}>
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Checkbox
                      size="small"
                      checked={form.returnTrip}
                      onChange={(e) => onChange("returnTrip", e.target.checked)}
                    />
                  }
                  label="Book a Return"
                />
              </Box>
            ) : null}

            {form.returnTrip && !isHourly ? (
              <Section>
                <Grid container spacing={1} sx={{ mt: 0.45 }}>
                  <Grid item xs={6}>
                    <TextField
                      type="date"
                      fullWidth
                      size="small"
                      label="Return Date"
                      value={form.returnDate}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => onChange("returnDate", e.target.value)}
                      error={!!errors.returnDate}
                      helperText={errors.returnDate || ""}
                      sx={fieldSx}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Return Time"
                      value={form.returnTime}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => onChange("returnTime", e.target.value)}
                      error={!!errors.returnTime}
                      helperText={errors.returnTime || ""}
                      sx={fieldSx}
                      SelectProps={{ native: true }}
                    >
                      <option value="">Select Time</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time.value} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Section>
            ) : null}

            <Button
              fullWidth
              variant="contained"
              onClick={handleStep0Next}
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.15,
                borderRadius: 2,
                bgcolor: "#d4af37",
                color: "#0f2045",
                fontSize: 20,
                fontWeight: 950,
                textTransform: "none",
                boxShadow: "0 14px 30px rgba(212,175,55,0.35)",
                "&:hover": {
                  bgcolor: "#b8941f",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Select Vehicle ›
            </Button>

            <Typography
              sx={{
                mt: 0.7,
                color: "#4a5568",
                fontSize: 13,
                lineHeight: 1.4,
                fontWeight: 600,
              }}
            >
              All International Arrival 60 min and Domestic 30 min. FREE
              Waiting Time.
            </Typography>
          </Box>
        </Box>
      ) : null}

      {step === 1 ? (
        <Box sx={{ p: 0, bgcolor: "#fff", color: "text.primary" }}>
          {errors.vehicleType ? (
            <Alert severity="error" sx={{ mb: 0.75, py: 0.35 }}>
              {errors.vehicleType}
            </Alert>
          ) : null}

          <VehiclePicker
            serviceType={currentService}
            selectedVehicleId={form.vehicleId || null}
            compact={compactVehiclePicker}
            onSelectVehicle={({
              vehicleId,
              vehicleName,
              price,
              hourlyPrice,
              dailyPrice,
              imageUrl,
            }) => {
              onChange("vehicleId", vehicleId);
              onChange("vehicleType", vehicleName);
              onChange("vehicleImage", imageUrl || "");
              onChange("hourlyPrice", hourlyPrice ?? null);
              onChange("dailyPrice", dailyPrice ?? null);
              onChange("selectedPrice", price ?? null);

              if (currentService === "By the Hour") {
  const h = Number(form.durationHours || 1);
  const hr = Number(hourlyPrice);

  if (
    !Number.isNaN(h) &&
    h > 0 &&
    !Number.isNaN(hr) &&
    hr > 0
  ) {
    onChange("selectedPrice", Number((hr * h).toFixed(2)));
  }
}
            }}
            onSelected={() => {
              if (!loading) onAutoNext?.();
            }}
          />

          {hasVehicle ? (
            <Alert
              severity={hasPrice ? "success" : "warning"}
              sx={{ mt: 0.75, py: 0.35 }}
            >
              Selected: <b>{form.vehicleType}</b> — Price:{" "}
              <b>{money(form.selectedPrice)}</b>
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mt: 0.75, py: 0.35 }}>
              Please select a vehicle to continue.
            </Alert>
          )}
        </Box>
      ) : null}

      {step === 2 ? (
        <Box sx={{ p: 1.25, bgcolor: "#fff", color: "text.primary" }}>
          <Stack sx={{ mb: 0.75 }} spacing={0.15}>
            <Typography variant="h6" fontWeight={950}>
              Passenger Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contact details for confirmation.
            </Typography>
          </Stack>

          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="First Name"
                value={form.firstName}
                onChange={(e) => onChange("firstName", e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName || ""}
                sx={fieldSx}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Last Name"
                value={form.lastName}
                onChange={(e) => onChange("lastName", e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName || ""}
                sx={fieldSx}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                type="email"
                fullWidth
                size="small"
                label="Email"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email || ""}
                sx={fieldSx}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Phone"
                value={form.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone || ""}
                sx={fieldSx}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Notes (Optional)"
                value={form.notes}
                onChange={(e) => onChange("notes", e.target.value)}
                sx={fieldSx}
              />
            </Grid>
          </Grid>
        </Box>
      ) : null}

      {step === 3 ? (
        <Box sx={{ p: 1.25, bgcolor: "#fff", color: "text.primary" }}>
          <Typography variant="h6" fontWeight={950} sx={{ mb: 0.25 }}>
            Confirm & Submit
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.65 }}>
            Review your reservation details before submitting.
          </Typography>

          <Box
            sx={{
              p: 0.85,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "rgba(0,0,0,0.02)",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography fontWeight={950}>Trip Details</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Service
                </Typography>
                <Typography fontWeight={800}>{currentService}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Pickup
                </Typography>
                <Typography fontWeight={800}>
                  {form.pickupDate || "—"} {form.pickupTime || ""}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Pickup Location
                </Typography>
                <Typography fontWeight={800}>
                  {form.pickupLocation || "—"}
                </Typography>
              </Grid>

              {!isHourly ? (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Drop-off Location
                  </Typography>
                  <Typography fontWeight={800}>
                    {form.dropoffLocation || "—"}
                  </Typography>
                </Grid>
              ) : (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography fontWeight={800}>
                    {form.durationHours || 1} Hours
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 0.25 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight={950}>Vehicle Details</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Vehicle
                </Typography>
                <Typography fontWeight={800}>
                  {form.vehicleType || "—"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Price
                </Typography>
                <Typography fontWeight={900}>
                  {money(form.selectedPrice)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 0.25 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight={950}>Passenger Details</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Passenger
                </Typography>
                <Typography fontWeight={800}>
                  {`${form.firstName || ""} ${form.lastName || ""}`.trim() ||
                    "—"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Contact
                </Typography>
                <Typography fontWeight={800}>{form.email || "—"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {form.phone || "—"}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Alert severity="info" sx={{ mt: 0.75, py: 0.35 }}>
            Once submitted, your request is sent to our team for confirmation.
          </Alert>
        </Box>
      ) : null}

      {step > 0 ? (
        <>
          <Divider sx={{ my: 0 }} />

          <Stack
            direction="row"
            spacing={0.75}
            justifyContent="space-between"
            sx={{
              p: 1,
              bgcolor: "#fff",
              position: "sticky",
              bottom: 0,
              zIndex: 20,
              borderTop: "1px solid rgba(26,54,93,0.12)",
              boxShadow: "0 -10px 25px rgba(15,32,69,0.08)",
            }}
          >
            <Button
              variant="outlined"
              onClick={onBack}
              disabled={step === 0 || loading}
              sx={{
                borderRadius: 2,
                px: 2.25,
                borderColor: "#1a365d",
                color: "#1a365d",
                fontWeight: 800,
              }}
            >
              Back
            </Button>

            {step < 3 ? (
              <Button
                variant="contained"
                onClick={onNext}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 2.75,
                  bgcolor: "#1a365d",
                  fontWeight: 900,
                  "&:hover": { bgcolor: "#0f2045" },
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  bgcolor: "#d4af37",
                  color: "#0f2045",
                  fontWeight: 950,
                  "&:hover": { bgcolor: "#b8941f" },
                }}
              >
                {loading ? "Submitting..." : "Submit Reservation"}
              </Button>
            )}
          </Stack>
        </>
      ) : null}
    </Paper>
  );
}