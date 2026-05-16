import axios from "axios";

const API_BASE_URL = "https://localhost:3000/api";

/* =========================
   AUTH HEADER HELPERS
========================= */

// JSON requests (POST, PUT)
const authJsonHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Multipart requests (Images)
const authMultipartHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set Content-Type manually for FormData
    },
  };
};

/* =========================
   VEHICLE CRUD
========================= */

export const vehicleService = {
  getAllVehicles: async () => {
    const res = await axios.get(`${API_BASE_URL}/vehicles`);
    return res.data;
  },

  getVehicleById: async (id) => {
    const res = await axios.get(`${API_BASE_URL}/vehicles/${id}`);
    return res.data;
  },

  createVehicle: async (vehicleData) => {
    const res = await axios.post(
      `${API_BASE_URL}/vehicles`,
      vehicleData,
      authJsonHeaders()
    );
    return res.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const res = await axios.put(
      `${API_BASE_URL}/vehicles/${id}`,
      vehicleData,
      authJsonHeaders()
    );
    return res.data;
  },

  deleteVehicle: async (id) => {
    const res = await axios.delete(
      `${API_BASE_URL}/vehicles/${id}`,
      authJsonHeaders()
    );
    return res.data;
  },
};

/* =========================
   VEHICLE IMAGES
========================= */

export const vehicleImageService = {
  // ✅ Correct route
  getVehicleImages: async (vehicleId) => {
    const res = await axios.get(
      `${API_BASE_URL}/vehicle-images/${vehicleId}/images`
    );
    return res.data;
  },

  // ✅ Correct route + headers
  uploadImages: async (vehicleId, formData) => {
    const res = await axios.post(
      `${API_BASE_URL}/vehicle-images/${vehicleId}/images`,
      formData,
      authMultipartHeaders()
    );
    return res.data;
  },

  setDefaultImage: async (vehicleId, imageId) => {
    const res = await axios.patch(
      `${API_BASE_URL}/vehicle-images/${vehicleId}/images/${imageId}/default`,
      {},
      authJsonHeaders()
    );
    return res.data;
  },

  deleteImage: async (vehicleId, imageId) => {
    const res = await axios.delete(
      `${API_BASE_URL}/vehicle-images/${vehicleId}/images/${imageId}`,
      authJsonHeaders()
    );
    return res.data;
  },
};

/* =========================
   ERROR HANDLER
========================= */

export const handleApiError = (error, fallback = "Something went wrong") => {
  if (error.response?.status === 401) {
    return {
      message: "Authentication failed. Please login again.",
      type: "error",
      redirect: true,
    };
  }

  if (error.response?.status === 403) {
    return {
      message: "Access denied. Admin privileges required.",
      type: "error",
    };
  }

  return {
    message: error.response?.data?.message || fallback,
    type: "error",
  };
};
