import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
} from "@mui/material";

import ReservationForm from "./components/ReservationForm";
import ReservationSummary from "./components/ReservationSummary";

import { buildReservationPayload } from "./services/reservation.utils";
import { submitReservation } from "./services/reservation.api";

export default function ReservationPage() {
  const location = useLocation();

  const steps = useMemo(() => ["Trip", "Vehicle", "Passenger", "Confirm"], []);
  const [activeStep, setActiveStep] = useState(0);

  const [form, setForm] = useState({
    vehicleId: null,
    selectedPrice: null,
    vehicleImage: "",
    hourlyPrice: null,
    dailyPrice: null,

    serviceType: "",
    pickupDate: "",
    pickupTime: "",
    pickupLocation: "",
    dropoffLocation: "",
    durationHours: "",
    returnTrip: false,
    returnDate: "",
    returnTime: "",
    passengers: 1,
    luggage: 0,
    vehicleType: "",

    meetGreet: false,
    childSeat: false,
    boosterSeat: false,

    isAirport: false,
    airline: "",
    flightNumber: "",
    arrivalTime: "",

    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    loading: false,
    ok: false,
    message: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("reservationDraft");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error("Failed to load reservation draft:", err);
      }
    }

    if (location.state?.activeStep !== undefined) {
      setActiveStep(location.state.activeStep);
    }
  }, [location.state]);

  const onChange = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("reservationDraft", JSON.stringify(next));
      return next;
    });

    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateCurrentStep = () => {
    const nextErrors = {};
    const serviceType = form.serviceType || "Transfer";
    const isHourly =
      serviceType === "By the Hour" ||
      serviceType === "Hourly / As Directed" ||
      serviceType === "hourly";

    if (activeStep === 0) {
      if (!form.pickupLocation) {
        nextErrors.pickupLocation = "Pickup location is required";
      }

      if (!isHourly && !form.dropoffLocation) {
        nextErrors.dropoffLocation = "Drop-off location is required";
      }

      if (isHourly && !form.durationHours) {
        nextErrors.durationHours = "Duration is required";
      }

      if (!form.pickupDate) nextErrors.pickupDate = "Pickup date is required";
      if (!form.pickupTime) nextErrors.pickupTime = "Pickup time is required";
      if (!form.email) nextErrors.email = "Email is required";
      if (!form.passengers) nextErrors.passengers = "Passengers required";
    }

    if (activeStep === 1) {
      if (!form.vehicleId || !form.vehicleType) {
        nextErrors.vehicleType = "Please select a vehicle";
      }
    }

    if (activeStep === 2) {
      if (!form.firstName) nextErrors.firstName = "First name is required";
      if (!form.lastName) nextErrors.lastName = "Last name is required";

      if (!form.phone) {
        nextErrors.phone = "Phone is required";
      } else if ((form.phone || "").replace(/[^\d]/g, "").length < 10) {
        nextErrors.phone = "Enter valid phone";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateCurrentStep()) return;
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goNextNoValidate = () => {
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => {
    setActiveStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    const isHourly =
      form.serviceType === "By the Hour" ||
      form.serviceType === "Hourly / As Directed" ||
      form.serviceType === "hourly";

    const normalizedForm = {
      ...form,
      serviceType: isHourly
        ? "Hourly / As Directed"
        : form.serviceType || "Transfer",

      dropoffLocation: isHourly ? "" : form.dropoffLocation,
      durationHours: isHourly ? form.durationHours || 1 : "",
    };

    const payload = buildReservationPayload(normalizedForm);

    try {
      setStatus({ loading: true, ok: false, message: "" });

      const result = await submitReservation(payload);

      setStatus({
        loading: false,
        ok: true,
        message: result?.message || "Reservation submitted successfully!",
      });

      localStorage.removeItem("reservationDraft");
      setActiveStep(3);
    } catch (err) {
      if (err?.errors) {
        setErrors((prev) => ({ ...prev, ...err.errors }));
      }

      setStatus({
        loading: false,
        ok: false,
        message: err?.message || "Failed to submit reservation.",
      });
    }
  };
  useEffect(() => {
  const stateDraft = location.state?.draft;
  const savedDraft = localStorage.getItem("reservationDraft");

  if (stateDraft) {
    setForm((prev) => ({ ...prev, ...stateDraft }));
  } else if (savedDraft) {
    try {
      setForm((prev) => ({ ...prev, ...JSON.parse(savedDraft) }));
    } catch (err) {
      console.error("Invalid reservationDraft:", err);
    }
  }

  if (location.state?.activeStep !== undefined) {
    setActiveStep(location.state.activeStep);
  }
}, [location.state]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={900}>
          Reservation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Book your ride in a few steps.
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ "& .MuiStepLabel-label": { fontWeight: 700 } }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {status.message ? (
        <Alert severity={status.ok ? "success" : "error"} sx={{ mb: 2 }}>
          {status.message}
        </Alert>
      ) : null}

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={activeStep === 1 ? 12 : 8}>
          <ReservationForm
            step={activeStep}
            form={form}
            errors={errors}
            loading={status.loading}
            onChange={onChange}
            onBack={goBack}
            onNext={goNext}
            onSubmit={handleSubmit}
            onAutoNext={goNextNoValidate}
            compactVehiclePicker={activeStep !== 1}
          />
        </Grid>

        {activeStep !== 1 ? (
          <Grid item xs={12} lg={4}>
            <ReservationSummary form={form} />
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}