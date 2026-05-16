// src/pages/website/Rates/components/DailyRates.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  Check,
  People,
  Luggage,
  Star,
  ZoomIn,
  ArrowBackIos,
  ArrowForwardIos,
  Event,
  Business,
  Celebration,
  Tour,
} from "@mui/icons-material";

const BASE_URL = (import.meta.env.VITE_API_URL || "https://localhost:3000/").replace(/\/$/, "");

const normalizeUrl = (url) => {
  if (!url) return "/no-image.jpg";
  if (url.startsWith("http")) return url;
  // backend returns "/uploads/..."
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url}`;
};

export default function DailyRates({ vehicles, prices }) {
  const [vehicleImages, setVehicleImages] = useState({}); // vehicle_id -> [{fullUrl,...}]
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const theme = useTheme();
  const isDownMd = useMediaQuery(theme.breakpoints.down("md"));

  // ✅ fetch images (same as your working code), but optimized
  useEffect(() => {
    if (!vehicles?.length) return;

    let alive = true;

    const loadAll = async () => {
      try {
        const results = await Promise.all(
          vehicles.map(async (v) => {
            try {
              const res = await fetch(`${BASE_URL}/api/vehicle-images/${v.vehicle_id}/images`);
              if (!res.ok) throw new Error("Failed to fetch images");
              const data = await res.json();

              const imgs = (data?.images || []).map((img) => ({
                ...img,
                fullUrl: normalizeUrl(img.image_url),
              }));

              return [v.vehicle_id, imgs.length ? imgs : [{ fullUrl: "/no-image.jpg" }]];
            } catch (err) {
              console.error(`Error fetching images for vehicle ${v.vehicle_id}:`, err);
              return [v.vehicle_id, [{ fullUrl: "/no-image.jpg" }]];
            }
          })
        );

        if (!alive) return;

        const map = {};
        results.forEach(([id, imgs]) => {
          map[id] = imgs;
        });
        setVehicleImages(map);
      } catch (e) {
        console.error(e);
      }
    };

    loadAll();
    return () => {
      alive = false;
    };
  }, [vehicles]);

  const dailyData = useMemo(() => {
    return (vehicles || [])
      .map((vehicle) => {
        const dailyPrice = (prices || []).find(
          (p) => p.vehicle_id === vehicle.vehicle_id && p.serviceType === "daily" && p.isActive
        );
        if (!dailyPrice) return null;

        const images = vehicleImages[vehicle.vehicle_id] || [{ fullUrl: "/no-image.jpg" }];
        const defaultImage = images.find((img) => img.is_default) || images[0];

        return {
          ...vehicle,
          dailyPrice,
          images,
          imageUrl: defaultImage.fullUrl,
        };
      })
      .filter(Boolean);
  }, [vehicles, prices, vehicleImages]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const getFeatures = (v) =>
    [
      v.usbPowerOutlets && "USB Power",
      v.coloredAccentLights && "Ambient Lighting",
      v.deluxeAudioSystem && "Premium Audio",
      v.rearHeatACControls && "Dual Climate Control",
      v.eleganceStylish && "Luxury Interior",
      v.extraLegroomComfortable && "Extra Legroom",
    ]
      .filter(Boolean)
      .slice(0, 4);

  const calculateSavings = (dailyPrice) => {
    const hourlyEquivalent = (dailyPrice.baseRate / 10) * 8;
    return Math.max(0, hourlyEquivalent - dailyPrice.totalPrice);
  };

  const handleImageClick = (vehicle_id) => {
    setCurrentVehicleId(vehicle_id);
    setCurrentImageIndex(0);
    setImageDialogOpen(true);
  };

  const handlePrevImage = () => {
    if (!currentVehicleId) return;
    const images = vehicleImages[currentVehicleId] || [];
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!currentVehicleId) return;
    const images = vehicleImages[currentVehicleId] || [];
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (e) => {
    e.currentTarget.src = "/no-image.jpg";
  };

  if (!dailyData.length) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No daily rates available at the moment.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please check back later or contact us for custom pricing.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* ✅ Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 0, position: "relative", textAlign: "center" }}>
          {currentVehicleId &&
            vehicleImages[currentVehicleId] &&
            vehicleImages[currentVehicleId].length > 0 && (
              <>
                <img
                  src={vehicleImages[currentVehicleId][currentImageIndex].fullUrl}
                  alt="Vehicle"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "80vh",
                    objectFit: "contain",
                    background: "#000",
                  }}
                  onError={handleImageError}
                />

                {vehicleImages[currentVehicleId].length > 1 && (
                  <>
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 10,
                        bgcolor: "background.paper",
                      }}
                      onClick={handlePrevImage}
                    >
                      <ArrowBackIos />
                    </IconButton>
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 10,
                        bgcolor: "background.paper",
                      }}
                      onClick={handleNextImage}
                    >
                      <ArrowForwardIos />
                    </IconButton>
                  </>
                )}
              </>
            )}
        </DialogContent>
      </Dialog>

      {/* ✅ Banner */}
      <Card
        sx={{
          background:
            theme.palette.mode === "light"
              ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
          mb: 6,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 800, fontSize: isDownMd ? "2rem" : "2.6rem" }}
          >
            📅 Daily Service
          </Typography>
          <Typography
            sx={{
              opacity: 0.92,
              fontWeight: 500,
              fontSize: isDownMd ? "0.95rem" : "1.05rem",
              maxWidth: 820,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Perfect for full-day events, corporate travel, and weddings. Minimum 10 hours with business discount included.
          </Typography>
        </CardContent>
      </Card>

      {/* ✅ Professional Grid: 1/2/3 columns */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {dailyData.map((vehicle) => {
          const savings = calculateSavings(vehicle.dailyPrice);
          const feats = getFeatures(vehicle);

          return (
            <Grid item xs={12} sm={6} md={4} key={vehicle.vehicle_id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "transform .25s ease, box-shadow .25s ease",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 18px 40px rgba(0,0,0,0.12)" },
                }}
              >
                {/* ✅ FIX ALIGNMENT: centered image stage */}
                <Box
                  sx={{
                    position: "relative",
                    height: 220,
                    bgcolor: "#f7f7f8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    component="img"
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    onError={handleImageError}
                    loading="lazy"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain", // ✅ key change
                      objectPosition: "center",
                      filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.10))",
                    }}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: "rgba(255,255,255,0.92)",
                      "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    }}
                    onClick={() => handleImageClick(vehicle.vehicle_id)}
                  >
                    <ZoomIn />
                  </IconButton>

                  {savings > 0 && (
                    <Chip
                      icon={<Star />}
                      label={`Save ${formatCurrency(savings)}`}
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        fontWeight: 800,
                        bgcolor: "rgba(17,17,17,0.90)",
                        color: "#fff",
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, textAlign: "center" }}>
                    {vehicle.name}
                  </Typography>

                  <Box textAlign="center" sx={{ mt: 1.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "secondary.main", lineHeight: 1 }}>
                      {formatCurrency(vehicle.dailyPrice.totalPrice)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.7, fontWeight: 700 }}>
                      per day • 10+ hours
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 3,
                      py: 1.2,
                      bgcolor: "background.default",
                      borderRadius: 2,
                      mb: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <People sx={{ color: "primary.main" }} />
                      <Typography variant="body2" fontWeight={800}>
                        {vehicle.seats} seats
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Luggage sx={{ color: "primary.main" }} />
                      <Typography variant="body2" fontWeight={800}>
                        {vehicle.luggageCapacity} bags
                      </Typography>
                    </Box>
                  </Box>

                  {feats.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>
                        Premium Features
                      </Typography>
                      <Grid container spacing={0.5}>
                        {feats.map((f, i) => (
                          <Grid item xs={6} key={i}>
                            <Box display="flex" alignItems="center" gap={0.6}>
                              <Check sx={{ fontSize: 16, color: "secondary.main" }} />
                              <Typography variant="body2" sx={{ fontSize: 13 }}>
                                {f}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  <Box sx={{ mt: "auto" }}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      component="a"
                      href={`/reservation?vehicle=${vehicle.vehicle_id}&type=daily`}
                      sx={{
                        py: 1.35,
                        fontWeight: 900,
                        borderRadius: 2,
                        textTransform: "none",
                        bgcolor: "secondary.main",
                        "&:hover": { bgcolor: "secondary.dark" },
                      }}
                    >
                      Book Daily Service
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Benefits */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" textAlign="center" sx={{ fontWeight: 900, mb: 4 }}>
          Why Choose Daily Service?
        </Typography>

        <Grid container spacing={3}>
          {[
            {
              icon: <Event sx={{ fontSize: 40 }} />,
              title: "10+ Hours Coverage",
              description: "Full-day flexibility for events, tours, and meetings.",
              color: "primary",
            },
            {
              icon: <Business sx={{ fontSize: 40 }} />,
              title: "Business Discount",
              description: "Best value for long bookings and corporate travel.",
              color: "secondary",
            },
            {
              icon: <Celebration sx={{ fontSize: 40 }} />,
              title: "Event Ready",
              description: "Perfect for weddings, parties, and special occasions.",
              color: "primary",
            },
            {
              icon: <Tour sx={{ fontSize: 40 }} />,
              title: "City Tours",
              description: "Explore NYC at your own pace with a premium ride.",
              color: "secondary",
            },
          ].map((b, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Card sx={{ height: "100%", p: 3, textAlign: "center", borderRadius: 3 }}>
                <Box sx={{ color: `${b.color}.main`, mb: 2 }}>{b.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
                  {b.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {b.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
