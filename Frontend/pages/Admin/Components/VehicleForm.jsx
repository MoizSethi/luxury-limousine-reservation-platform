import {
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  Alert
} from "@mui/material";

import ImageUpload from "./ImageUpload";

const VehicleForm = ({ vehicle, onChange, onImagesUpdate }) => {
  const features = [
    { key: "usbPowerOutlets", label: "USB Power Outlets" },
    { key: "coloredAccentLights", label: "Colored Accent Lights" },
    { key: "deluxeAudioSystem", label: "Deluxe Audio System" },
    { key: "forwardSeatingWithSeatBelts", label: "Forward Seating with Seat Belts" },
    { key: "rearHeatACControls", label: "Rear Heat / AC Controls" },
    { key: "eleganceStylish", label: "Elegance & Stylish" },
    { key: "extraLegroomComfortable", label: "Extra Legroom & Comfortable" }
  ];

  const handleChange = (field, value) => {
    onChange({
      ...vehicle,
      [field]: value
    });
  };

  const vehicleId = vehicle?.vehicle_id;

  return (
    <Grid container spacing={2}>

      {/* Vehicle Name */}
      <Grid item xs={12}>
        <TextField
          label="Vehicle Name"
          fullWidth
          required
          value={vehicle?.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </Grid>

      {/* Seats */}
      <Grid item xs={6}>
        <TextField
          label="Seats"
          type="number"
          fullWidth
          required
          value={vehicle?.seats ?? ""}
          onChange={(e) =>
            handleChange("seats", Number(e.target.value))
          }
        />
      </Grid>

      {/* Luggage */}
      <Grid item xs={6}>
        <TextField
          label="Luggage Capacity"
          type="number"
          fullWidth
          required
          value={vehicle?.luggageCapacity ?? ""}
          onChange={(e) =>
            handleChange("luggageCapacity", Number(e.target.value))
          }
        />
      </Grid>

      {/* Features */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Features
        </Typography>
      </Grid>

      {features.map(feature => (
        <Grid item xs={12} key={feature.key}>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(vehicle?.[feature.key])}
                onChange={(e) =>
                  handleChange(feature.key, e.target.checked)
                }
              />
            }
            label={feature.label}
          />
        </Grid>
      ))}

      {/* Image Upload Section */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Vehicle Images
        </Typography>

        {/* UX Hint */}
        {!vehicleId && (
          <Box sx={{ mt: 1 }}>
            <Alert severity="info">
              Please save the vehicle first to enable image uploads.
            </Alert>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <ImageUpload
            vehicleId={vehicleId}
            onImagesUpdate={onImagesUpdate}
          />
        </Box>
      </Grid>

    </Grid>
  );
};

export default VehicleForm;
