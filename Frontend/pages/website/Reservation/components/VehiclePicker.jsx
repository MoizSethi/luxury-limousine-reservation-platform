import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Skeleton,
  Alert,
  Divider,
} from "@mui/material";

import {
  fetchVehicles,
  fetchPrices,
  fetchVehicleImagesById,
  toPublicUrl,
  mapWithConcurrency,
} from "../services/vehiclePricing.api";

function money(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));
}

function mapServiceTypeToApi(serviceType) {
  if (!serviceType) return "hourly";
  const s = serviceType.toLowerCase();
  if (s.includes("hour")) return "hourly";
  if (s.includes("daily")) return "daily";
  return "hourly";
}

function pickFirstImageUrl(imagesArr) {
  if (!Array.isArray(imagesArr) || imagesArr.length === 0) return "";
  const first = imagesArr[0];

  if (typeof first === "string") return first;

  return (
    first?.image_url ||
    first?.url ||
    first?.path ||
    first?.image ||
    first?.filename ||
    ""
  );
}

export default function VehiclePicker({
  serviceType,
  selectedVehicleId,
  onSelectVehicle,
  onSelected,
}) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [prices, setPrices] = useState([]);
  const [imageMap, setImageMap] = useState({});

  useEffect(() => {
    let mounted = true;

    const loadVehicles = async () => {
      try {
        setLoading(true);
        setErr("");

        const [v, p] = await Promise.all([fetchVehicles(), fetchPrices()]);

        if (!mounted) return;

        setVehicles(Array.isArray(v) ? v : []);
        setPrices(Array.isArray(p) ? p : []);

        const pairs = await mapWithConcurrency(
          Array.isArray(v) ? v : [],
          4,
          async (veh) => {
            try {
              const imgs = await fetchVehicleImagesById(veh.vehicle_id);
              return [veh.vehicle_id, toPublicUrl(pickFirstImageUrl(imgs))];
            } catch {
              return [veh.vehicle_id, ""];
            }
          }
        );

        if (!mounted) return;

        const nextMap = {};
        for (const [vid, url] of pairs) nextMap[vid] = url;

        setImageMap(nextMap);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load vehicles/prices/images");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadVehicles();

    return () => {
      mounted = false;
    };
  }, []);

  const apiServiceType = useMemo(
    () => mapServiceTypeToApi(serviceType),
    [serviceType]
  );

  const pricesByVehicle = useMemo(() => {
    const map = new Map();

    for (const pr of prices) {
      if (!pr?.vehicle_id || !pr?.serviceType) continue;
      const st = String(pr.serviceType).toLowerCase();

      if (!map.has(pr.vehicle_id)) map.set(pr.vehicle_id, {});
      map.get(pr.vehicle_id)[st] = pr;
    }

    return map;
  }, [prices]);

  const merged = useMemo(() => {
    return vehicles.map((v) => {
      const priceObj = pricesByVehicle.get(v.vehicle_id) || {};

      return {
        ...v,
        imageUrl: imageMap[v.vehicle_id] || "",
        priceHourly: priceObj.hourly?.totalPrice ?? null,
        priceDaily: priceObj.daily?.totalPrice ?? null,
        priceForSelectedService:
          apiServiceType === "daily" ? priceObj.daily : priceObj.hourly,
      };
    });
  }, [vehicles, pricesByVehicle, apiServiceType, imageMap]);

  const selectVehicle = (v) => {
    const hours = Number(window.__reservationHours || 1);
    const p = v.priceForSelectedService;

    const selectedVehicle = {
      vehicleId: v.vehicle_id,
      vehicleName: v.name,
      price:
        apiServiceType === "hourly" && v.priceHourly
          ? Number((Number(v.priceHourly) * hours).toFixed(2))
          : p?.totalPrice ?? null,
      serviceType: p?.serviceType ?? apiServiceType,
      hourlyPrice: v.priceHourly ?? null,
      dailyPrice: v.priceDaily ?? null,
      imageUrl: v.imageUrl,
    };

    onSelectVehicle(selectedVehicle);
    setTimeout(() => onSelected?.(selectedVehicle), 0);
  };

  if (err) return <Alert severity="error">{err}</Alert>;

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={0.75}
        sx={{ mb: 1.5 }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 24, md: 32 },
              fontWeight: 950,
              color: "#1a365d",
              lineHeight: 1.1,
            }}
          >
            Choose Your Vehicle
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: { xs: 13, md: 15 } }}>
            Select the ride that best fits your trip.
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {!loading && merged.length === 0 ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No vehicles found. Check VITE_PUBLIC_API_BASE_URL.
        </Alert>
      ) : null}

      <Grid container spacing={{ xs: 1.7, md: 2.5 }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} key={i}>
                <Card sx={{ borderRadius: 4, p: 2 }}>
                  <Skeleton variant="rectangular" height={180} />
                  <Skeleton variant="text" height={34} sx={{ mt: 1 }} />
                  <Skeleton variant="text" height={22} width="70%" />
                  <Skeleton variant="rectangular" height={48} sx={{ mt: 2 }} />
                </Card>
              </Grid>
            ))
          : merged.map((v) => {
              const selected = v.vehicle_id === selectedVehicleId;
              const p = v.priceForSelectedService;
              const price =
                apiServiceType === "hourly" && v.priceHourly
                  ? Number(v.priceHourly) * Number(window.__reservationHours || 1)
                  : p?.totalPrice ?? null;

              return (
                <Grid item xs={12} key={v.vehicle_id}>
                  <Card
                    sx={{
                      borderRadius: { xs: 4, md: 5 },
                      overflow: "hidden",
                      bgcolor: "#fff",
                      border: selected
                        ? "2px solid #d4af37"
                        : "1px solid rgba(15,32,69,0.1)",
                      boxShadow: selected
                        ? "0 18px 45px rgba(212,175,55,0.22)"
                        : "0 14px 38px rgba(15,32,69,0.10)",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                      <Grid container spacing={{ xs: 1.5, md: 3 }}>
                        <Grid item xs={12} md={3.2}>
                          <Box
                            sx={{
                              height: { xs: 170, sm: 210, md: 190 },
                              borderRadius: { xs: 3, md: 4 },
                              bgcolor: "#f8fafc",
                              border: "1px solid rgba(15,32,69,0.08)",
                              backgroundImage: v.imageUrl
                                ? `url(${v.imageUrl})`
                                : "linear-gradient(135deg,#f8fafc,#e2e8f0)",
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={5.8}>
                          <Stack spacing={{ xs: 0.9, md: 1.2 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              flexWrap="wrap"
                            >
                              <Typography
                                sx={{
                                  fontSize: { xs: 22, sm: 26, md: 31 },
                                  fontWeight: 950,
                                  color: "#0f2045",
                                  lineHeight: 1.05,
                                  letterSpacing: "-0.03em",
                                }}
                              >
                                {v.name}
                              </Typography>

                              {selected ? (
                                <Chip
                                  size="small"
                                  label="Selected"
                                  sx={{
                                    bgcolor: "#d4af37",
                                    color: "#0f2045",
                                    fontWeight: 900,
                                  }}
                                />
                              ) : null}
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip
                                label={`${v.seats || 0} Passengers`}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(26,54,93,0.08)",
                                  fontWeight: 800,
                                }}
                              />
                              <Chip
                                label={`${v.luggageCapacity || 0} Luggage`}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(26,54,93,0.08)",
                                  fontWeight: 800,
                                }}
                              />
                            </Stack>

                            <Typography
                              sx={{
                                color: "#334155",
                                fontSize: { xs: 14, md: 16 },
                                lineHeight: 1.55,
                              }}
                            >
                              {v.description ||
                                `${v.name}, premium chauffeur service with comfort, space, and luxury.`}
                            </Typography>

                            <Box
                              sx={{
                                p: { xs: 1.2, md: 1.5 },
                                borderRadius: 3,
                                bgcolor: "rgba(212,175,55,0.08)",
                                border: "1px solid rgba(212,175,55,0.18)",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 950,
                                  color: "#0f2045",
                                  fontSize: 14,
                                  mb: 0.4,
                                }}
                              >
                                Features
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: { xs: 13, md: 14 },
                                  color: "#475569",
                                  lineHeight: 1.55,
                                }}
                              >
                                {v.features ||
                                  "WiFi, Bluetooth Audio, Apple CarPlay, Android Auto, Window Shades, Seat Belts"}
                              </Typography>
                            </Box>

                            <Typography
                              sx={{
                                fontSize: { xs: 12.5, md: 13.5 },
                                color: "#64748b",
                                lineHeight: 1.5,
                              }}
                            >
                              Trip price includes base fare and gratuity.
                              Tolls are not included.
                            </Typography>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <Box
                            sx={{
                              height: "100%",
                              minHeight: { xs: "auto", md: 230 },
                              borderRadius: { xs: 3, md: 4 },
                              bgcolor:
                                "linear-gradient(180deg,#f8fafc 0%,#eef2f7 100%)",
                              border: "1px solid rgba(15,32,69,0.08)",
                              p: { xs: 1.4, md: 2 },
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              gap: 1.2,
                            }}
                          >
                            <Box sx={{ textAlign: { xs: "left", md: "center" } }}>
                              <Typography
                                sx={{
                                  color: "#64748b",
                                  fontSize: 12,
                                  fontWeight: 800,
                                  textTransform: "uppercase",
                                  letterSpacing: ".08em",
                                }}
                              >
                                Estimated Price
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: { xs: 32, md: 40 },
                                  fontWeight: 950,
                                  color: "#0f2045",
                                  lineHeight: 1,
                                }}
                              >
                                {money(price)}
                              </Typography>
                            </Box>

                            <Stack
                              direction={{ xs: "row", sm: "row", md: "column" }}
                              spacing={1}
                            >
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={() => selectVehicle(v)}
                                sx={{
                                  py: { xs: 1.05, md: 1.15 },
                                  borderRadius: 999,
                                  bgcolor: "#1a365d",
                                  color: "#fff",
                                  fontWeight: 950,
                                  textTransform: "none",
                                  fontSize: { xs: 13, sm: 15, md: 16 },
                                  boxShadow:
                                    "0 12px 24px rgba(26,54,93,0.25)",
                                  "&:hover": { bgcolor: "#0f2045" },
                                }}
                              >
                                Reserve Now
                              </Button>

                              <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => selectVehicle(v)}
                                sx={{
                                  py: { xs: 1.05, md: 1.15 },
                                  borderRadius: 999,
                                  borderColor: "#d4af37",
                                  color: "#0f2045",
                                  fontWeight: 950,
                                  textTransform: "none",
                                  fontSize: { xs: 13, sm: 15, md: 16 },
                                  bgcolor: "rgba(212,175,55,0.06)",
                                  "&:hover": {
                                    borderColor: "#b8941f",
                                    bgcolor: "rgba(212,175,55,0.14)",
                                  },
                                }}
                              >
                                Get Quote
                              </Button>
                            </Stack>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
      </Grid>
    </Box>
  );
}