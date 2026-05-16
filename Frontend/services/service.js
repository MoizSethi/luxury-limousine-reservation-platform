import axios from "axios";

const API_URL = "https://localhost:3000/api/services";

// ---------------------------
// GET ALL SERVICES
// ---------------------------
const getAllServices = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching services:", err);
    return [];
  }
};

// ---------------------------
// CREATE SERVICE
// ---------------------------
const createService = async (data) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("description", data.description);

    if (data.image) {
      formData.append("image", data.image);
    }

    const res = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    console.error("Error creating service:", err);
    throw err;
  }
};

// ---------------------------
// UPDATE SERVICE
// ---------------------------
const updateService = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("description", data.description);

    if (data.image instanceof File) {
      formData.append("image", data.image); // only upload if new file selected
    }

    const res = await axios.put(`${API_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    console.error("Error updating service:", err);
    throw err;
  }
};

// ---------------------------
// DELETE SERVICE
// ---------------------------
const deleteService = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting service:", err);
    throw err;
  }
};

const servicesService = {
  getAllServices,
  createService,
  updateService,
  deleteService,
};

export default servicesService;
