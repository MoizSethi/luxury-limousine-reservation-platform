import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import ServiceCard from "./components/ServiceCard";
import ServiceFormModal from "./components/ServiceFormModal";
import servicesService from "../../../services/service";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    featured: false,
    image: null,
    imagePreview: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    const data = await servicesService.getAllServices();
    setServices(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      featured: false,
      image: null,
      imagePreview: "",
    });
    setFormOpen(true);
  };

  const handleEdit = (service) => {
    setFormData({ ...service, imagePreview: service.image });
    setFormOpen(true);
  };

  const submitForm = async () => {
    if (!formData.title || !formData.description) {
      showToast("Please fill required fields", "error");
      return;
    }

    if (formData.id) {
      await servicesService.updateService(formData.id, formData);
      showToast("Service updated successfully!");
    } else {
      await servicesService.createService(formData);
      showToast("Service added successfully!");
    }

    setFormOpen(false);
    loadServices();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    await servicesService.deleteService(id);
    showToast("Service deleted");
    loadServices();
  };

  const showToast = (message, type = "success") =>
    setToast({ open: true, message, type });

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Manage Services
          </Typography>
          <Typography color="text.secondary">
            Add, edit & manage limousine services
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add New Service
        </Button>
      </Box>

      {/* Loader */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item xs={12} md={6} lg={4} key={service.id}>
              <ServiceCard
                service={service}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal */}
      <ServiceFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        data={formData}
        setData={setFormData}
        onSubmit={submitForm}
      />

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.type} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
