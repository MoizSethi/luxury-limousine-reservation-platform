import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Paper,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import heroImg from "../../../assets/hero.webp";
import ReservationForm from "../Reservation/components/ReservationForm";

import { sendStep0ReservationMail } from "../Reservation/services/reservation.api";

const initialForm = {
  serviceType: "Transfer",
  pickupDate: "",
  pickupTime: "",
  pickupLocation: "",
  dropoffLocation: "",
  durationHours: "",
  passengers: "",
  luggage: "",
  returnTrip: false,
  isAirport: false,
  meetGreet: false,
  childSeat: false,
  boosterSeat: false,
  returnDate: "",
  returnTime: "",
  airline: "",
  flightNumber: "",
  arrivalTime: "",
  vehicleId: "",
  vehicleType: "",
  vehicleImage: "",
  hourlyPrice: null,
  dailyPrice: null,
  selectedPrice: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
};

const HeroSection = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [step0MailSent, setStep0MailSent] = useState(false);

  const handleChange = (field, value) => {
    if (field === "__goToStep") {
      setStep(value);
      return;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (step === 0) {
      setStep0MailSent(false);
    }
  };

  const validateHeroForm = () => {
    const newErrors = {};
    const serviceType = form.serviceType || "Transfer";
    const isHourly =
      serviceType === "By the Hour" ||
      serviceType === "Hourly / As Directed" ||
      serviceType === "hourly";

    if (!serviceType) newErrors.serviceType = "Service type is required";
    if (!form.pickupDate) newErrors.pickupDate = "Pickup date is required";
    if (!form.pickupTime) newErrors.pickupTime = "Pickup time is required";

    if (!form.pickupLocation) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    if (!isHourly && !form.dropoffLocation) {
      newErrors.dropoffLocation = "Drop-off location is required";
    }

    if (isHourly && !form.durationHours) {
      newErrors.durationHours = "Duration is required";
    }

    if (!form.email) newErrors.email = "Email is required";
    if (!form.passengers) newErrors.passengers = "Passengers required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendStep0MailIfNeeded = async () => {
    if (step0MailSent) return;

    try {
      await sendStep0ReservationMail({
        serviceType: form.serviceType || "Transfer",
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        pickupLocation: form.pickupLocation,
        dropoffLocation: form.dropoffLocation,
        durationHours: form.durationHours,
        passengers: form.passengers,
        luggage: form.luggage,
        email: form.email,
      });

      setStep0MailSent(true);
    } catch (error) {
      console.error("Step 0 email failed:", error);
    }
  };

  const handleNext = async () => {
  if (!validateHeroForm()) return;

  try {
    setSubmitting(true);

    if (step === 0) {
      await sendStep0MailIfNeeded();

      const draft = {
        ...form,
        serviceType: form.serviceType || "Transfer",
        passengers: form.passengers || 1,
        luggage: form.luggage || 0,
      };

      localStorage.setItem("reservationDraft", JSON.stringify(draft));

      navigate("/reservation", {
        state: {
          activeStep: 1,
          draft,
        },
      });

      return;
    }
  } catch (error) {
    setErrors((prev) => ({
      ...prev,
      submit: error.message || "Failed to continue reservation.",
    }));
  } finally {
    setSubmitting(false);
  }
};

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "auto", md: "92vh" },
        display: "flex",
        alignItems: "center",
        backgroundImage: `url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 32%, rgba(210,164,49,0.28), transparent 28%), linear-gradient(90deg, rgba(3,4,7,0.92) 0%, rgba(7,8,12,0.76) 48%, rgba(3,4,7,0.88) 100%)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 5, md: 7 },
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: 650, textAlign: { xs: "center", md: "left" } }}>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 950,
                  color: "#f4c95d",
                  fontSize: {
                    xs: "2.25rem",
                    sm: "3rem",
                    md: "3.4rem",
                    lg: "4rem",
                  },
                  lineHeight: 1.02,
                  letterSpacing: "-0.04em",
                  mb: 2,
                  textShadow: "0 12px 40px rgba(0,0,0,0.65)",
                }}
              >
                Luxury Worldwide Chauffeur Service Powered by New York Limo
              </Typography>

              <Typography
                component="p"
                sx={{
                  color: "rgba(255,255,255,0.86)",
                  fontSize: { xs: "1rem", md: "1.12rem" },
                  lineHeight: 1.8,
                  maxWidth: 630,
                  mb: 3,
                  mx: { xs: "auto", md: 0 },
                  textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                }}
              >
                Premium NYC limo service for airport transfers, weddings,
                corporate events, hourly rides, and private tours across
                Manhattan, Brooklyn, Queens, Long Island, JFK, LGA, and EWR.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                justifyContent={{ xs: "center", md: "flex-start" }}
                sx={{ mb: 3 }}
              >
                <Button
                  onClick={() => navigate("/reservation")}
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: "#d2a431",
                    color: "#111",
                    px: 3.5,
                    py: 1.35,
                    borderRadius: 999,
                    fontWeight: 950,
                    textTransform: "none",
                    boxShadow: "0 14px 35px rgba(210,164,49,0.32)",
                    "&:hover": {
                      bgcolor: "#f0c553",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Book Full Reservation
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setStep(0)}
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.32)",
                    px: 3,
                    py: 1.35,
                    borderRadius: 999,
                    fontWeight: 850,
                    textTransform: "none",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      borderColor: "#d2a431",
                      bgcolor: "rgba(210,164,49,0.12)",
                    },
                  }}
                >
                  Get Quick Quote
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                maxWidth: 590,
                ml: { md: "auto" },
                mx: { xs: "auto", md: 0 },
              }}
            >
              <Paper
                sx={{
                  p: { xs: 1.2, sm: 1.5 },
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  backdropFilter: "blur(18px)",
                  boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
                  maxHeight: { xs: "82vh", md: "760px" },
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                    pr: 0,
                    "& .MuiPaper-root": {
                      bgcolor: "rgba(255,255,255,0.98)",
                      borderRadius: 3,
                      boxShadow: "none",
                    },
                  }}
                >
                  {errors.submit ? (
                    <Box
                      sx={{
                        mb: 1,
                        p: 1.2,
                        borderRadius: 2,
                        bgcolor: "#ffebee",
                        color: "#b71c1c",
                        fontWeight: 800,
                        fontSize: "0.9rem",
                      }}
                    >
                      {errors.submit}
                    </Box>
                  ) : null}

                  <ReservationForm
                    step={step}
                    form={form}
                    errors={errors}
                    loading={submitting}
                    onChange={handleChange}
                    onBack={handleBack}
                    onNext={handleNext}
                    onAutoNext={handleNext}
                    onSubmit={handleNext}
                    compactVehiclePicker={true}
                  />
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HeroSection;