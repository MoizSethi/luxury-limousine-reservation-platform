import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
} from "@mui/material";
import { PeopleAlt, WorkOutline } from "@mui/icons-material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  fetchVehicles,
  fetchPrices,
  fetchVehicleImagesById,
  toPublicUrl,
  mapWithConcurrency,
} from "../Reservation/services/vehiclePricing.api";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function money(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));
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

const ArrowButton = ({ direction, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      [direction === "left" ? "left" : "right"]: { xs: 6, md: -38 },
      width: { xs: 38, md: 48 },
      height: { xs: 38, md: 48 },
      bgcolor: "#ffffff",
      borderRadius: "50%",
      display: { xs: "none", md: "flex" },
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
      cursor: "pointer",
      zIndex: 10,
      "&:hover": { bgcolor: "#f3f4f6" },
    }}
  >
    {direction === "left" ? <ArrowLeft size={22} /> : <ArrowRight size={22} />}
  </Box>
);

const CarCarousel = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const slidesToShow = isMobile ? 1 : isTablet ? 2 : 3;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [prices, setPrices] = useState([]);
  const [imageMap, setImageMap] = useState({});

  useEffect(() => {
    let mounted = true;

    const loadFleet = async () => {
      try {
        setLoading(true);
        setErr("");

        const [vehicleData, priceData] = await Promise.all([
          fetchVehicles(),
          fetchPrices(),
        ]);

        const safeVehicles = Array.isArray(vehicleData) ? vehicleData : [];
        const safePrices = Array.isArray(priceData) ? priceData : [];

        if (!mounted) return;

        setVehicles(safeVehicles);
        setPrices(safePrices);

        const pairs = await mapWithConcurrency(
          safeVehicles,
          4,
          async (veh) => {
            try {
              const imgs = await fetchVehicleImagesById(veh.vehicle_id);
              const raw = pickFirstImageUrl(imgs);
              return [veh.vehicle_id, toPublicUrl(raw)];
            } catch {
              return [veh.vehicle_id, ""];
            }
          }
        );

        if (!mounted) return;

        const nextMap = {};
        for (const [vehicleId, imageUrl] of pairs) {
          nextMap[vehicleId] = imageUrl;
        }

        setImageMap(nextMap);
      } catch (error) {
        if (!mounted) return;
        setErr(error?.message || "Failed to load fleet.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFleet();

    return () => {
      mounted = false;
    };
  }, []);

  const pricesByVehicle = useMemo(() => {
    const map = new Map();

    for (const pr of prices) {
      if (!pr?.vehicle_id || !pr?.serviceType) continue;

      const vid = pr.vehicle_id;
      const type = String(pr.serviceType).toLowerCase();

      if (!map.has(vid)) map.set(vid, {});
      map.get(vid)[type] = pr;
    }

    return map;
  }, [prices]);

  const dynamicVehicles = useMemo(() => {
    return vehicles.map((v) => {
      const priceObj = pricesByVehicle.get(v.vehicle_id) || {};
      const hourlyPrice = priceObj.hourly?.totalPrice ?? null;
      const dailyPrice = priceObj.daily?.totalPrice ?? null;

      return {
        id: v.vehicle_id,
        name: v.name || "Luxury Vehicle",
        img: imageMap[v.vehicle_id] || "",
        passengers: v.seats || 0,
        luggage: v.luggageCapacity || 0,
        hourlyPrice,
        dailyPrice,
        rate:
          hourlyPrice != null
            ? `${money(hourlyPrice)} Flat Hourly Rate`
            : dailyPrice != null
            ? `${money(dailyPrice)} Daily Rate`
            : "Contact us for pricing",
      };
    });
  }, [vehicles, pricesByVehicle, imageMap]);

  const settings = useMemo(
    () => ({
      dots: true,
      infinite: dynamicVehicles.length > slidesToShow,
      speed: 650,
      cssEase: "ease-in-out",
      autoplay: dynamicVehicles.length > slidesToShow,
      autoplaySpeed: 2800,
      slidesToShow,
      slidesToScroll: 1,
      swipeToSlide: true,
      adaptiveHeight: false,
      centerMode: false,
      variableWidth: false,
      nextArrow: <ArrowButton direction="right" />,
      prevArrow: <ArrowButton direction="left" />,
      responsive: [
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true,
          },
        },
      ],
    }),
    [slidesToShow, dynamicVehicles.length]
  );

  const renderSkeletons = () =>
    Array.from({ length: slidesToShow }).map((_, index) => (
      <Box key={index} sx={{ px: { xs: 0, md: 1.5 } }}>
        <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
          <Skeleton variant="rectangular" height={240} />
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="text" height={34} />
            <Skeleton variant="text" height={24} width="70%" />
            <Skeleton variant="rectangular" height={44} sx={{ mt: 3 }} />
          </CardContent>
        </Card>
      </Box>
    ));

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 12 },
        maxWidth: "1280px",
        mx: "auto",
        px: { xs: 2, sm: 3 },
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h6"
        component="p"
        sx={{
          textAlign: "center",
          color: theme.palette.secondary.main,
          letterSpacing: { xs: 1, md: 2 },
          fontSize: { xs: 12, md: 16 },
          fontWeight: 800,
        }}
      >
        PREMIUM VEHICLES FOR NYC TRANSPORTATION
      </Typography>

      <Typography
        variant="h3"
        component="h2"
        sx={{
          textAlign: "center",
          fontWeight: 900,
          mb: 2,
          fontSize: { xs: 30, sm: 40, md: 48 },
        }}
      >
        Luxury Limo Fleet in NYC
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          maxWidth: 850,
          mx: "auto",
          mb: { xs: 4, md: 7 },
          color: theme.palette.text.secondary,
          lineHeight: 1.7,
          fontSize: { xs: 14, md: 16 },
        }}
      >
        Choose from luxury sedans, SUVs, limousines, sprinter vans, and group
        transportation options for airport transfers, corporate travel, weddings,
        events, and hourly chauffeur service in New York.
      </Typography>

      {err ? (
        <Alert severity="error">{err}</Alert>
      ) : loading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {renderSkeletons()}
        </Box>
      ) : dynamicVehicles.length === 0 ? (
        <Alert severity="warning">
          No vehicles found. Please check your vehicle API.
        </Alert>
      ) : (
        <Box
          key={`${slidesToShow}-${dynamicVehicles.length}`}
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",

            ".slick-slider": { width: "100%" },
            ".slick-list": {
              overflow: "hidden",
              mx: { xs: 0, md: "-12px" },
            },
            ".slick-track": {
              display: "flex !important",
              alignItems: "stretch",
            },
            ".slick-slide": {
              height: "auto",
              px: { xs: 0, md: "12px" },
              boxSizing: "border-box",
            },
            ".slick-slide > div": { height: "100%" },
            ".slick-dots": {
              bottom: { xs: -34, md: -40 },
            },
            ".slick-dots li button:before": {
              fontSize: 10,
            },
          }}
        >
          <Slider {...settings}>
            {dynamicVehicles.map((car) => (
              <Box key={car.id} sx={{ height: "100%" }}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: { xs: 3, md: 4 },
                    overflow: "hidden",
                    backdropFilter: "blur(10px)",
background:
  "linear-gradient(180deg, #ffffff 0%, #fbfbfc 100%)",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 28px rgba(15,32,69,0.10)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0px 15px 35px rgba(0,0,0,0.18)",
                      transform: { xs: "none", md: "translateY(-6px)" },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
height: { xs: 170, sm: 200, md: 220 },                      bgcolor: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: { xs: 2, md: 3 },
                    }}
                  >
                    {car.img ? (
                      <Box
                        component="img"
                        src={car.img}
                        alt={`${car.name} for NYC limo service`}
                        sx={{
                          width: "100%",
                          maxWidth: { xs: 260, md: 330 },
                          height: "100%",
                          objectFit: "contain",
                          filter:
                            "drop-shadow(0px 4px 10px rgba(0,0,0,0.25))",
                        }}
                      />
                    ) : (
                      <Typography color="text.secondary">
                        No Image Available
                      </Typography>
                    )}
                  </Box>

                  <CardContent
  sx={{
    p: { xs: 2, md: 2.5 },
    display: "flex",
    flexDirection: "column",
    minHeight: { xs: 240, md: 265 },
  }}
>
                    <Typography
                      component="h3"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: 20, md: 24 },
                        lineHeight: 1.2,
                      }}
                    >
                      {car.name}
                    </Typography>

                    <Typography
  sx={{
    mt: 1,
    fontSize: { xs: 18, sm: 20, md: 22 },
    fontWeight: 900,
    color: "#c89b2f",
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  }}
>
  {car.rate}
</Typography>

<Box sx={{ height: 1, bgcolor: "#e5e7eb", my: { xs: 2.2, md: 2.5 } }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                        color: "#6b7280",
                        fontSize: { xs: 13, md: 15 },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                        <PeopleAlt color="primary" fontSize="small" />
                        {car.passengers} Passengers
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                        <WorkOutline color="primary" fontSize="small" />
                        {car.luggage} Luggage
                      </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                       mt: 2.2,
    py: { xs: 1.15, md: 1.3 },
                        borderRadius: 2,
                        fontWeight: 900,
                        bgcolor: theme.palette.primary.main,
                        "&:hover": { bgcolor: theme.palette.primary.dark },
                      }}
                      onClick={() => navigate("/reservation")}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      )}
    </Box>
  );
};

export default CarCarousel;