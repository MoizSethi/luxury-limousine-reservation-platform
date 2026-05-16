// Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Box, TextField, Button, Typography, Paper, Snackbar, Alert,
  FormControl, InputLabel, Select, MenuItem, Grid
} from "@mui/material";

export default function Auth({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "", role: "passenger"
  });
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setForm({
      firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "", role: "passenger"
    });
  };

  const showToast = (msg, type = "success") => setToast({ open: true, message: msg, type });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isRegister) {
        // Registration with role
        const { firstName, lastName, phone, email, password, confirmPassword, role } = form;
        
        // Validate passwords match
        if (password !== confirmPassword) {
          showToast("Passwords do not match!", "error");
          setLoading(false);
          return;
        }

        // Validate password strength
        if (password.length < 6) {
          showToast("Password must be at least 6 characters long!", "error");
          setLoading(false);
          return;
        }

        await api.post("/register", {
          firstName, lastName, phone, email, password, confirmPassword, role
        });


        showToast("Registration successful! Please login.");
        setIsRegister(false);
        setForm({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "", role: "passenger" });
      } else {
      // LOGIN
      const { email, password } = form;

      try {
        const res = await api.post("/login", { email, password });
      
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      
        showToast("Login successful!");
      
        if (res.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      
        if (onLoginSuccess) onLoginSuccess(res.data.user);
      
      } catch (error) {
        showToast(error.response?.data?.message || "Invalid email or password", "error");
      }

}


      setForm({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "", role: "passenger" });
    } catch (error) {
      showToast(error.response?.data?.message || "Error", "error");
    }
    setLoading(false);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, width: 400, mx: 2 }}>
        <Typography variant="h5" mb={3} textAlign="center" fontWeight="bold">
          {isRegister ? "Create Account" : "Welcome Back"}
        </Typography>

        {isRegister && (
          <>
            
            <TextField 
              label="First Name" 
              name="firstName" 
              fullWidth 
              sx={{ mb: 2 }} 
              value={form.firstName} 
              onChange={handleChange}
              required
              size="small"
            />
            <TextField 
              label="Last Name" 
              name="lastName" 
              fullWidth 
              sx={{ mb: 2 }} 
              value={form.lastName} 
              onChange={handleChange}
              required
              size="small"
            />

            {/* Phone Field */}
            <TextField 
              label="Phone Number" 
              name="phone" 
              fullWidth 
              sx={{ mb: 2 }} 
              value={form.phone} 
              onChange={handleChange}
              required
              size="small"
            />

            {/* Role Selection */}
            <FormControl fullWidth sx={{ mb: 2 }} size="small">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={form.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value="passenger">Passenger</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        {/* Email Field */}
        <TextField 
          label="Email" 
          name="email" 
          type="email" 
          fullWidth 
          sx={{ mb: 2 }} 
          value={form.email} 
          onChange={handleChange}
          required
          size="small"
        />
        
        {/* Password Field */}
        <TextField 
          label="Password" 
          name="password" 
          type="password" 
          fullWidth 
          sx={{ mb: 2 }} 
          value={form.password} 
          onChange={handleChange}
          required
          helperText={isRegister ? "Password must be at least 6 characters" : ""}
          size="small"
        />

        {/* Confirm Password (only for registration) */}
        {isRegister && (
          <TextField 
            label="Confirm Password" 
            name="confirmPassword" 
            type="password" 
            fullWidth 
            sx={{ mb: 2 }} 
            value={form.confirmPassword} 
            onChange={handleChange}
            required
            size="small"
          />
        )}

        {/* Submit Button */}
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleSubmit} 
          disabled={loading}
          sx={{ mt: 2, py: 1 }}
          size="large"
        >
          {loading ? "Please Wait..." : (isRegister ? "Create Account" : "Login")}
        </Button>

        {/* Toggle between Login and Register */}
        <Typography mt={2} textAlign="center" variant="body2">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Typography 
            component="span" 
            sx={{ 
              cursor: "pointer", 
              color: "primary.main", 
              fontWeight: "bold",
              '&:hover': { textDecoration: 'underline' }
            }} 
            onClick={toggleForm}
          >
            {isRegister ? "Login" : "Register"}
          </Typography>
        </Typography>

        {/* Toast Notification */}
        <Snackbar 
          open={toast.open} 
          autoHideDuration={4000} 
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={toast.type} variant="filled">
            {toast.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}