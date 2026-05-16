import { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const exactAddress = "240 Round Hill Dr, Yonkers, NY 10710, USA";
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  exactAddress
)}&output=embed`;

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("https://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="section">
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography
          variant="overline"
          sx={{ color: "secondary.dark", fontWeight: 900, letterSpacing: 2 }}
        >
          GET IN TOUCH
        </Typography>

        <Typography
          component="h2"
          variant="h3"
          sx={{ fontWeight: 900, color: "primary.main", mt: 1, mb: 1.5 }}
        >
          Contact Our NYC Limo Team
        </Typography>

        <Typography
          sx={{
            maxWidth: 760,
            mx: "auto",
            color: "text.secondary",
            lineHeight: 1.8,
          }}
        >
          Send us your trip details, airport transfer request, corporate ride
          inquiry, or custom transportation question. We’ll help you plan a
          smooth luxury ride.
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              p: { xs: 2.5, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 18px 45px rgba(15,32,69,0.08)",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 900, color: "primary.main", mb: 1 }}>
              Send a Message
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Fill out the form and our team will get back to you.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    multiline
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2.5 }} />

              <Stack spacing={1.5}>
                {success ? <Alert severity="success">{success}</Alert> : null}
                {error ? <Alert severity="error">{error}</Alert> : null}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 900,
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Send Message"}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 18px 45px rgba(15,32,69,0.08)",
            }}
          >

            <Box sx={{ width: "100%", height: { xs: 320, md: 470 } }}>
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="New York Limoz location at 240 Round Hill Dr, Yonkers, NY 10710"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}