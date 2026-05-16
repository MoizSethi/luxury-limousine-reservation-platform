// src/pages/Admin/Components/Cars.jsx
import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Grid, Card, CardContent, CardActions, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  IconButton, CircularProgress, Badge
} from "@mui/material";
import { Edit, Delete, Add, PhotoCamera } from "@mui/icons-material";

// Import components and services
import ImageCarousel from "./Components/ImageCarousel";
import ImageUpload from "./Components/ImageUpload";
import VehicleForm from "./Components/VehicleForm";
import { vehicleService, vehicleImageService, handleApiError } from "../../services/vehicleService";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [imageManagerOpen, setImageManagerOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  
  const [newCar, setNewCar] = useState({ 
    name: "", 
    seats: "", 
    luggageCapacity: "",
    usbPowerOutlets: false,
    coloredAccentLights: false,
    deluxeAudioSystem: false,
    forwardSeatingWithSeatBelts: false,
    rearHeatACControls: false,
    eleganceStylish: false,
    extraLegroomComfortable: false
  });
  
  const [editCar, setEditCar] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const vehicles = await vehicleService.getAllVehicles();
      
      // Fetch images for each car
      const carsWithImages = await Promise.all(
        vehicles.map(async (car) => {
          try {
            const imagesData = await vehicleImageService.getVehicleImages(car.vehicle_id);
            return { ...car, images: imagesData.images || [] };
          } catch (error) {
            return { ...car, images: [] };
          }
        })
      );
      
      setCars(carsWithImages);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      showToast("Error loading vehicles", "error");
    }
    setLoading(false);
  };

  const handleAddCar = async () => {
    try {
      if (!newCar.name || !newCar.seats || !newCar.luggageCapacity) {
        showToast("Please fill all required fields", "error");
        return;
      }

      const carData = {
        ...newCar,
        seats: parseInt(newCar.seats),
        luggageCapacity: parseInt(newCar.luggageCapacity)
      };

      await vehicleService.createVehicle(carData);
      setOpen(false);
      resetForm();
      showToast("Vehicle added successfully!");
      fetchCars();
    } catch (error) {
      const errorInfo = handleApiError(error, "Error adding vehicle");
      showToast(errorInfo.message, errorInfo.type);
      if (errorInfo.redirect) {
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/auth";
        }, 2000);
      }
    }
  };

  const handleUpdateCar = async () => {
    try {
      if (!editCar?.name || !editCar?.seats || !editCar?.luggageCapacity) {
        showToast("Please fill all required fields", "error");
        return;
      }

      const carData = {
        ...editCar,
        seats: parseInt(editCar.seats),
        luggageCapacity: parseInt(editCar.luggageCapacity)
      };

      await vehicleService.updateVehicle(editCar.vehicle_id, carData);
      setEditOpen(false);
      setEditCar(null);
      showToast("Vehicle updated successfully!");
      fetchCars();
    } catch (error) {
      const errorInfo = handleApiError(error, "Error updating vehicle");
      showToast(errorInfo.message, errorInfo.type);
    }
  };

  const handleDeleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await vehicleService.deleteVehicle(id);
      showToast("Vehicle deleted successfully!");
      fetchCars();
    } catch (error) {
      const errorInfo = handleApiError(error, "Error deleting vehicle");
      showToast(errorInfo.message, errorInfo.type);
    }
  };

  const handleSetDefaultImage = async (vehicleId, imageId) => {
    try {
      await vehicleImageService.setDefaultImage(vehicleId, imageId);
      showToast("Default image updated successfully!");
      fetchCars();
    } catch (error) {
      const errorInfo = handleApiError(error, "Error setting default image");
      showToast(errorInfo.message, errorInfo.type);
    }
  };

  const handleDeleteImage = async (vehicleId, imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await vehicleImageService.deleteImage(vehicleId, imageId);
      showToast("Image deleted successfully!");
      fetchCars();
    } catch (error) {
      const errorInfo = handleApiError(error, "Error deleting image");
      showToast(errorInfo.message, errorInfo.type);
    }
  };

  const handleImagesUpdate = (vehicleId, newImages) => {
    setCars(prevCars => 
      prevCars.map(car => 
        car.vehicle_id === vehicleId 
          ? { ...car, images: newImages }
          : car
      )
    );
  };

  const openImageManager = (car) => {
    setSelectedCar(car);
    setImageManagerOpen(true);
  };

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
  };

  const resetForm = () => {
    setNewCar({
      name: "", seats: "", luggageCapacity: "",
      usbPowerOutlets: false, coloredAccentLights: false, deluxeAudioSystem: false,
      forwardSeatingWithSeatBelts: false, rearHeatACControls: false,
      eleganceStylish: false, extraLegroomComfortable: false
    });
  };

  const getFeatureChips = (car) => {
    const features = [];
    if (car.usbPowerOutlets) features.push("USB");
    if (car.coloredAccentLights) features.push("Lights");
    if (car.deluxeAudioSystem) features.push("Audio");
    if (car.rearHeatACControls) features.push("Climate");
    if (car.eleganceStylish) features.push("Luxury");
    if (car.extraLegroomComfortable) features.push("Legroom");
    return features;
  };

  const getDefaultImage = (car) => {
    return car.images.find(img => img.is_default) || car.images[0];
  };

  const getImageUrl = (image) => {
  if (!image || !image.image_url) {
    return "/api/placeholder/300/200";
  }

  // Always return absolute URL
  return `https://localhost:3000//${image.image_url}`;
};


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Manage Vehicles
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add New Vehicle
        </Button>
      </Box>

      {/* Vehicles Grid */}
      <Grid container spacing={3}>
        {cars.map((car) => {
          const defaultImage = getDefaultImage(car);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={car.vehicle_id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Car Image */}
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={getImageUrl(defaultImage)}
                    alt={car.name}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover'
                    }}
                  />
                  <Badge 
                    badgeContent={car.images.length} 
                    color="primary"
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8 
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {car.name}
                  </Typography>
                  
                  <Box display="flex" gap={1} mb={2}>
                    <Chip label={`${car.seats} seats`} size="small" />
                    <Chip label={`${car.luggageCapacity} bags`} size="small" variant="outlined" />
                  </Box>

                  {/* Features */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Features:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {getFeatureChips(car).map((feature, index) => (
                        <Chip 
                          key={index} 
                          label={feature} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<PhotoCamera />}
                    onClick={() => openImageManager(car)}
                  >
                    Manage Images ({car.images.length})
                  </Button>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => { setEditCar(car); setEditOpen(true); }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteCar(car.vehicle_id)}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ADD VEHICLE MODAL */}
      <Dialog open={open} onClose={() => { setOpen(false); resetForm(); }} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogContent>
          <VehicleForm vehicle={newCar} onChange={setNewCar} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCar}>Save Vehicle</Button>
        </DialogActions>
      </Dialog>

      {/* EDIT VEHICLE MODAL */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Vehicle</DialogTitle>
        <DialogContent>
          <VehicleForm vehicle={editCar} onChange={setEditCar} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateCar}>Update Vehicle</Button>
        </DialogActions>
      </Dialog>

      {/* IMAGE MANAGER MODAL */}
      <Dialog 
        open={imageManagerOpen} 
        onClose={() => setImageManagerOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Manage Images - {selectedCar?.name}
        </DialogTitle>
        <DialogContent>
          {selectedCar && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ImageCarousel
                  images={selectedCar.images}
                  defaultImage={selectedCar.images.find(img => img.is_default)?.image_id}
                  onSetDefault={(imageId) => handleSetDefaultImage(selectedCar.vehicle_id, imageId)}
                  onDeleteImage={(imageId) => handleDeleteImage(selectedCar.vehicle_id, imageId)}
                />
              </Grid>
              <Grid item xs={12}>
                <ImageUpload
                  vehicleId={selectedCar.vehicle_id}
                  onImagesUpdate={(newImages) => handleImagesUpdate(selectedCar.vehicle_id, newImages)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Tips: Upload multiple images at once. Set one image as default. 
                  The default image will be shown as the main vehicle image.
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageManagerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* TOAST */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.type} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}