import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "260px",
  borderRadius: "16px",
};

const defaultCenter = { lat: 40.7128, lng: -74.006 };

const compactFieldSx = {
  bgcolor: "#fff",
  borderRadius: "6px",
  "& .MuiOutlinedInput-root": {
    height: 38,
    borderRadius: "6px",
    bgcolor: "#fff",
    fontSize: 14,
  },
  "& .MuiInputBase-input": {
    py: 0.6,
    px: 1.2,
  },
  "& .MuiInputLabel-root": {
    fontSize: 13,
  },
  "& .MuiFormHelperText-root": {
    display: "none",
    m: 0,
  },
};

export default function GoogleRouteBox({
  pickupLocation,
  dropoffLocation,
  errors = {},
  onChange,
  isHourly,
  showMap = true,
  showFields = true,
}) {
  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const mapRef = useRef(null);

  const [directions, setDirections] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [routeError, setRouteError] = useState("");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const calculateRoute = (origin, destination) => {
    if (!origin || !destination || isHourly || !window.google) {
      setDirections(null);
      setRouteInfo(null);
      return;
    }

    setCalculating(true);
    setRouteError("");

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setCalculating(false);

        if (status !== "OK" || !result) {
          setDirections(null);
          setRouteInfo(null);
          setRouteError("Could not calculate route. Please check both addresses.");
          return;
        }

        const leg = result.routes?.[0]?.legs?.[0];
        const meters = leg?.distance?.value || 0;

        const info = {
          distanceText: leg?.distance?.text || "",
          durationText: leg?.duration?.text || "",
          distanceMiles: Number((meters / 1609.344).toFixed(2)),
          distanceKm: Number((meters / 1000).toFixed(2)),
        };

        setDirections(result);
        setRouteInfo(info);

        onChange("distanceText", info.distanceText);
        onChange("durationText", info.durationText);
        onChange("distanceMiles", info.distanceMiles);
        onChange("distanceKm", info.distanceKm);
      }
    );
  };

  const handlePickupChanged = () => {
    const place = pickupRef.current?.getPlace();
    const address = place?.formatted_address || place?.name || "";

    if (!address) return;

    onChange("pickupLocation", address);
    calculateRoute(address, dropoffLocation);
  };

  const handleDropoffChanged = () => {
    const place = dropoffRef.current?.getPlace();
    const address = place?.formatted_address || place?.name || "";

    if (!address) return;

    onChange("dropoffLocation", address);
    calculateRoute(pickupLocation, address);
  };

  useEffect(() => {
    if (!isLoaded || isHourly) return;

    const origin = pickupLocation?.trim();
    const destination = dropoffLocation?.trim();

    if (!origin || !destination) {
      setDirections(null);
      setRouteInfo(null);
      setRouteError("");
      return;
    }

    const timer = setTimeout(() => {
      calculateRoute(origin, destination);
    }, 600);

    return () => clearTimeout(timer);
  }, [pickupLocation, dropoffLocation, isLoaded, isHourly]);

  if (loadError) {
    return <Alert severity="error">Google Maps failed to load. Check your API key.</Alert>;
  }

  if (!isLoaded) {
    return (
      <Box sx={{ py: 0.8, display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={18} />
        <Typography variant="body2">Loading Google Maps...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ m: 0, py: 1 }}>
      {showFields && (
        <Grid container spacing={1}>
          <Grid item xs={12} md={isHourly ? 12 : 6}>
            <Autocomplete
              onLoad={(ref) => (pickupRef.current = ref)}
              onPlaceChanged={handlePickupChanged}
            >
              <TextField
                fullWidth
                size="small"
                label="Pickup Location"
                placeholder="Address, hotel, airport..."
                value={pickupLocation || ""}
                onChange={(e) => onChange("pickupLocation", e.target.value)}
                error={!!errors.pickupLocation}
                helperText={errors.pickupLocation || ""}
                sx={compactFieldSx}
              />
            </Autocomplete>
          </Grid>

          {!isHourly && (
            <Grid item xs={12} md={6}>
              <Autocomplete
                onLoad={(ref) => (dropoffRef.current = ref)}
                onPlaceChanged={handleDropoffChanged}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Drop-off Location"
                  placeholder="Address, hotel, airport..."
                  value={dropoffLocation || ""}
                  onChange={(e) => onChange("dropoffLocation", e.target.value)}
                  error={!!errors.dropoffLocation}
                  helperText={errors.dropoffLocation || ""}
                  sx={compactFieldSx}
                />
              </Autocomplete>
            </Grid>
          )}
        </Grid>
      )}

      {showMap && !isHourly && (
        <Box sx={{ mt: showFields ? 0.7 : 0 }}>
          {routeError && (
            <Alert severity="warning" sx={{ mb: 0.7, py: 0.35 }}>
              {routeError}
            </Alert>
          )}

          {routeInfo && (
            <Alert severity="success" sx={{ mb: 0.7, py: 0.35 }}>
              Distance: <b>{routeInfo.distanceText}</b> • Estimated Time:{" "}
              <b>{routeInfo.durationText}</b>
            </Alert>
          )}

          {calculating && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Calculating route...
            </Typography>
          )}

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={10}
            onLoad={(map) => (mapRef.current = map)}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {directions ? (
              <DirectionsRenderer directions={directions} />
            ) : (
              <Marker position={defaultCenter} />
            )}
          </GoogleMap>
        </Box>
      )}
    </Box>
  );
}