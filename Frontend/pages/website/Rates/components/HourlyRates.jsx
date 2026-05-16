// src/pages/website/Rates/components/HourlyRates.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogContent,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
} from "@mui/material";
import {
  Check,
  People,
  Luggage,
  AccessTime,
  ZoomIn,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";

const BASE_URL = (import.meta.env.VITE_API_URL || "https://localhost:3000/").replace(/\/$/, "");

const normalizeUrl = (url) => {
  if (!url) return "/no-image.jpg";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url}`;
};

export default function HourlyRates({ vehicles, prices }) {
  const [selectedHours, setSelectedHours] = useState(2);
  const [vehicleImages, setVehicleImages] = useState({}); // vehicle_id -> images
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const theme = useTheme();
  const isDownMd = useMediaQuery(theme.breakpoints.down("md"));

  const hourOptions = [2, 3, 4, 5, 6, 8, 10, 12, 24];

  // ✅ fetch images (same endpoint as your working code), optimized
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
        results.forEach(([id, imgs]) => (map[id] = imgs));
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

  const hourlyData = useMemo(() => {
    return (vehicles || [])
      .map((v) => {
        const hourlyPrice = (prices || []).find(
          (p) => p.vehicle_id === v.vehicle_id && p.serviceType === "hourly" && p.isActive
        );
        if (!hourlyPrice) return null;

        const images = vehicleImages[v.vehicle_id] || [{ fullUrl: "/no-image.jpg" }];
        const defaultImage = images.find((img) => img.is_default) || images[0];

        return { ...v, hourlyPrice, images, imageUrl: defaultImage.fullUrl };
      })
      .filter(Boolean);
  }, [vehicles, prices, vehicleImages]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const calculateTotal = (hourlyPrice) => (hourlyPrice ? hourlyPrice.totalPrice * selectedHours : 0);

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

  if (!hourlyData.length) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No hourly rates available right now.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please check back later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 0, position: "relative", textAlign: "center" }}>
          {currentVehicleId && vehicleImages[currentVehicleId]?.length > 0 && (
            <>
              <img
                src={vehicleImages[currentVehicleId][currentImageIndex].fullUrl}
                alt="Vehicle"
                style={{ width: "100%", height: "auto", maxHeight: "80vh", objectFit: "contain", background: "#000" }}
                onError={handleImageError}
              />
              {vehicleImages[currentVehicleId].length > 1 && (
                <>
                  <IconButton sx={{ position: "absolute", top: "50%", left: 10, bgcolor: "background.paper" }} onClick={handlePrevImage}>
                    <ArrowBackIos />
                  </IconButton>
                  <IconButton sx={{ position: "absolute", top: "50%", right: 10, bgcolor: "background.paper" }} onClick={handleNextImage}>
                    <ArrowForwardIos />
                  </IconButton>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Banner */}
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
          <Typography variant="h4" sx={{ fontWeight: 900, fontSize: isDownMd ? "2rem" : "2.6rem" }}>
            🕒 Hourly Service
          </Typography>
          <Typography sx={{ opacity: 0.92, mt: 1, maxWidth: 720, mx: "auto", lineHeight: 1.7 }}>
            Minimum booking: 2 hours — All inclusive pricing with no hidden fees.
          </Typography>
        </CardContent>
      </Card>

      {/* Hours selector */}
      <Card sx={{ mb: 6, borderRadius: 3 }}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 4,
            flexDirection: isDownMd ? "column" : "row",
            gap: isDownMd ? 3 : 0,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <AccessTime sx={{ color: "primary.main", fontSize: 32 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                Select Hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose your preferred duration
              </Typography>
            </Box>
          </Box>

          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Hours</InputLabel>
            <Select value={selectedHours} label="Hours" onChange={(e) => setSelectedHours(e.target.value)}>
              {hourOptions.map((h) => (
                <MenuItem key={h} value={h}>
                  {h} {h === 1 ? "hour" : "hours"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* ✅ Grid 1/2/3 */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {hourlyData.map((v) => {
          const feat = getFeatures(v);
          const totalPrice = calculateTotal(v.hourlyPrice);

          return (
            <Grid item xs={12} sm={6} md={4} key={v.vehicle_id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform .25s ease, box-shadow .25s ease",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 18px 40px rgba(0,0,0,0.12)" },
                }}
              >
                {/* ✅ Centered image stage */}
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
                    src={v.imageUrl}
                    alt={v.name}
                    loading="lazy"
                    onError={handleImageError}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
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
                    onClick={() => handleImageClick(v.vehicle_id)}
                  >
                    <ZoomIn />
                  </IconButton>

                  <Chip
                    label="ALL INCLUSIVE"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      fontWeight: 800,
                      bgcolor: "rgba(17,17,17,0.90)",
                      color: "#fff",
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, textAlign: "center" }}>
                    {v.name}
                  </Typography>

                  <Box textAlign="center" sx={{ mt: 1.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "secondary.main", lineHeight: 1 }}>
                      {formatCurrency(totalPrice)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.7, fontWeight: 700 }}>
                      {selectedHours} hours — all inclusive
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(v.hourlyPrice.totalPrice)} / hour
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
                        {v.seats} seats
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Luggage sx={{ color: "primary.main" }} />
                      <Typography variant="body2" fontWeight={800}>
                        {v.luggageCapacity} bags
                      </Typography>
                    </Box>
                  </Box>

                  {feat.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>
                        Premium Features
                      </Typography>
                      <Grid container spacing={0.5}>
                        {feat.map((f, i) => (
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
                      href={`/reservation?vehicle=${v.vehicle_id}&hours=${selectedHours}&type=hourly`}
                      sx={{
                        py: 1.35,
                        fontWeight: 900,
                        borderRadius: 2,
                        textTransform: "none",
                        bgcolor: "secondary.main",
                        "&:hover": { bgcolor: "secondary.dark" },
                      }}
                    >
                      Book {selectedHours} Hours
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
