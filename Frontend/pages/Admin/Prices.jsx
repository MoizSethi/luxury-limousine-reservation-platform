// src/pages/Admin/Components/Prices.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableHead, TableRow,
  TableCell, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Snackbar, Alert, IconButton, CircularProgress, FormControl, InputLabel,
  Select, MenuItem, Grid, Chip, Switch, FormControlLabel, Card, CardContent,
  Tabs, Tab, Divider
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Prices() {
  const [prices, setPrices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const [activeTab, setActiveTab] = useState(0);
  
  const [newPrice, setNewPrice] = useState({
    vehicle_id: "",
    serviceType: "hourly", // Default to hourly
    baseRate: "",
    perKmRate: "",
    minHours: 1,
    description: "",
    isActive: true
  });
  
  const [editPrice, setEditPrice] = useState(null);

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  useEffect(() => {
    fetchPrices();
    fetchVehicles();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://localhost:3000/api/prices");
      setPrices(res.data.prices || []);
    } catch (error) {
      console.error("Error fetching prices:", error);
      showToast(error.response?.data?.message || "Error loading prices", "error");
    }
    setLoading(false);
  };

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("https://localhost:3000/api/vehicles");
      setVehicles(res.data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Set service type based on tab
    const serviceTypes = ['hourly', 'point-to-point', 'daily'];
    setNewPrice(prev => ({ ...prev, serviceType: serviceTypes[newValue] }));
  };

  const handleAddPrice = async () => {
    try {
      // Validate required fields
      if (!newPrice.vehicle_id || !newPrice.baseRate) {
        showToast("Please fill all required fields", "error");
        return;
      }

      if (newPrice.serviceType === 'point-to-point' && !newPrice.perKmRate) {
        showToast("Per KM rate is required for point-to-point service", "error");
        return;
      }

      if (newPrice.serviceType === 'daily' && newPrice.minHours < 10) {
        showToast("Daily rate requires minimum 10 hours", "error");
        return;
      }

      await axios.post("https://localhost:3000/api/prices", newPrice, getAuthHeaders());
      setOpen(false);
      resetForm();
      showToast("Price added successfully!");
      fetchPrices();
    } catch (error) {
      console.error("Error adding price:", error);
      handleAuthError(error, "Error adding price");
    }
  };

  const handleUpdatePrice = async () => {
    try {
      if (!editPrice?.vehicle_id || !editPrice?.baseRate) {
        showToast("Please fill all required fields", "error");
        return;
      }

      if (editPrice.serviceType === 'daily' && editPrice.minHours < 10) {
        showToast("Daily rate requires minimum 10 hours", "error");
        return;
      }

      await axios.put(`https://localhost:3000/api/prices/${editPrice.price_id}`, editPrice, getAuthHeaders());
      setEditOpen(false);
      setEditPrice(null);
      showToast("Price updated successfully!");
      fetchPrices();
    } catch (error) {
      console.error("Error updating price:", error);
      handleAuthError(error, "Error updating price");
    }
  };

  const handleDeletePrice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this price?")) return;
    try {
      await axios.delete(`https://localhost:3000/api/prices/${id}`, getAuthHeaders());
      showToast("Price deleted successfully!");
      fetchPrices();
    } catch (error) {
      console.error("Error deleting price:", error);
      handleAuthError(error, "Error deleting price");
    }
  };

  const handleToggleStatus = async (price) => {
    try {
      await axios.patch(`https://localhost:3000/api/prices/${price.price_id}/toggle`, {}, getAuthHeaders());
      showToast(`Price ${!price.isActive ? 'activated' : 'deactivated'} successfully!`);
      fetchPrices();
    } catch (error) {
      console.error("Error toggling price status:", error);
      handleAuthError(error, "Error updating price status");
    }
  };

  const handleAuthError = (error, defaultMessage) => {
    if (error.response?.status === 401) {
      showToast("Authentication failed. Please login again.", "error");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth";
      }, 2000);
    } else if (error.response?.status === 403) {
      showToast("Access denied. Admin privileges required.", "error");
    } else {
      showToast(error.response?.data?.message || defaultMessage, "error");
    }
  };

  const showToast = (message, type = "success") => setToast({ open: true, message, type });

  const resetForm = () => {
    setNewPrice({
      vehicle_id: "",
      serviceType: "hourly",
      baseRate: "",
      perKmRate: "",
      minHours: 1,
      description: "",
      isActive: true
    });
    setActiveTab(0);
  };

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case 'hourly': return 'primary';
      case 'daily': return 'secondary';
      case 'point-to-point': return 'success';
      default: return 'default';
    }
  };

  const getServiceTypeIcon = (serviceType) => {
    switch (serviceType) {
      case 'hourly': return <ScheduleIcon />;
      case 'daily': return <CalendarTodayIcon />;
      case 'point-to-point': return <LocalTaxiIcon />;
      default: return <LocalTaxiIcon />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotalPrice = (baseRate, serviceType) => {
    const base = parseFloat(baseRate) || 0;
    const operatingCost = base * 0.20;
    const creditCardProcessing = base * 0.03;
    const stateSalesTax = base * 0.089;
    const congestionSurcharge = 2.75;
    const discount = serviceType === 'daily' ? base * 0.30 : 0;
    
    return base + operatingCost + creditCardProcessing + stateSalesTax + congestionSurcharge - discount;
  };

  // Filter prices by service type for tabs
  const hourlyPrices = prices.filter(p => p.serviceType === 'hourly');
  const pointToPointPrices = prices.filter(p => p.serviceType === 'point-to-point');
  const dailyPrices = prices.filter(p => p.serviceType === 'daily');

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
            Pricing Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Set hourly, point-to-point, and daily rates for each vehicle
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Add Price
        </Button>
      </Box>

      {/* Tabs for different service types */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab 
            icon={<ScheduleIcon />} 
            label={`Hourly Rates (${hourlyPrices.length})`} 
          />
          <Tab 
            icon={<LocalTaxiIcon />} 
            label={`Point-to-Point (${pointToPointPrices.length})`} 
          />
          <Tab 
            icon={<CalendarTodayIcon />} 
            label={`Daily Rates (${dailyPrices.length})`} 
          />
        </Tabs>
      </Paper>

      {/* Prices Table */}
      {prices.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No prices found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add your first price to get started
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Add First Price
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#f5f5f5" }}>
                <TableCell><strong>Vehicle</strong></TableCell>
                <TableCell><strong>Service Type</strong></TableCell>
                <TableCell><strong>Base Rate</strong></TableCell>
                <TableCell><strong>Per KM Rate</strong></TableCell>
                <TableCell><strong>Min Hours</strong></TableCell>
                <TableCell><strong>Total Price</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(activeTab === 0 ? hourlyPrices : 
                activeTab === 1 ? pointToPointPrices : dailyPrices).map((price) => (
                <TableRow key={price.price_id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {price.Vehicle?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {price.Vehicle?.seats} seats • {price.Vehicle?.luggageCapacity} bags
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getServiceTypeIcon(price.serviceType)}
                      <Chip 
                        label={price.serviceType} 
                        color={getServiceTypeColor(price.serviceType)}
                        size="small"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">
                      {formatCurrency(price.baseRate)}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {price.serviceType === 'hourly' && '/hour'}
                      {price.serviceType === 'daily' && '/day'}
                      {price.serviceType === 'point-to-point' && 'base fare'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {price.perKmRate ? (
                      <Typography variant="body2">
                        {formatCurrency(price.perKmRate)}/km
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {price.serviceType === 'daily' ? (
                      <Chip 
                        label={`${price.minHours || 10}h min`} 
                        color="warning" 
                        size="small" 
                      />
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" color="primary">
                      {formatCurrency(price.totalPrice)}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Includes taxes & fees
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {price.isActive ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : (
                        <CancelIcon color="error" fontSize="small" />
                      )}
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={price.isActive}
                            onChange={() => handleToggleStatus(price)}
                          />
                        }
                        label=""
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {price.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => { setEditPrice(price); setEditOpen(true); }}
                      title="Edit price"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeletePrice(price.price_id)}
                      title="Delete price"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ADD PRICE MODAL */}
      <Dialog open={open} onClose={() => { setOpen(false); resetForm(); }} maxWidth="md" fullWidth>
        <DialogTitle>
          Add New Price - 
          {activeTab === 0 && " Hourly Rate"}
          {activeTab === 1 && " Point-to-Point Rate"} 
          {activeTab === 2 && " Daily Rate"}
        </DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Hourly Rate" />
            <Tab label="Point-to-Point" />
            <Tab label="Daily Rate" />
          </Tabs>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle</InputLabel>
                <Select
                  value={newPrice.vehicle_id}
                  label="Vehicle"
                  onChange={(e) => setNewPrice({ ...newPrice, vehicle_id: e.target.value })}
                >
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                      {vehicle.name} ({vehicle.seats} seats, {vehicle.luggageCapacity} bags)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Hourly Rate Fields */}
            {activeTab === 0 && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Hourly Rate"
                    type="number"
                    fullWidth
                    required
                    value={newPrice.baseRate}
                    onChange={(e) => setNewPrice({ ...newPrice, baseRate: e.target.value })}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                    helperText="Rate per hour"
                  />
                </Grid>
              </>
            )}

            {/* Point-to-Point Fields */}
            {activeTab === 1 && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Base Fare"
                    type="number"
                    fullWidth
                    required
                    value={newPrice.baseRate}
                    onChange={(e) => setNewPrice({ ...newPrice, baseRate: e.target.value })}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                    helperText="Initial pickup charge"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Per Kilometer Rate"
                    type="number"
                    fullWidth
                    required
                    value={newPrice.perKmRate}
                    onChange={(e) => setNewPrice({ ...newPrice, perKmRate: e.target.value })}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                    helperText="Additional charge per kilometer"
                  />
                </Grid>
              </>
            )}

            {/* Daily Rate Fields */}
            {activeTab === 2 && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Daily Rate"
                    type="number"
                    fullWidth
                    required
                    value={newPrice.baseRate}
                    onChange={(e) => setNewPrice({ ...newPrice, baseRate: e.target.value })}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                    helperText="Rate per day (10+ hours)"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Minimum Hours"
                    type="number"
                    fullWidth
                    required
                    value={newPrice.minHours}
                    onChange={(e) => setNewPrice({ ...newPrice, minHours: parseInt(e.target.value) || 10 })}
                    InputProps={{
                      endAdornment: <Typography sx={{ ml: 1 }}>hours</Typography>,
                    }}
                    helperText="Minimum 10 hours required"
                    defaultValue={10}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={newPrice.description}
                onChange={(e) => setNewPrice({ ...newPrice, description: e.target.value })}
                placeholder={
                  activeTab === 0 ? "e.g., Luxury sedan hourly rate" :
                  activeTab === 1 ? "e.g., JFK Airport to Manhattan" :
                  "e.g., Full day luxury service"
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={newPrice.isActive}
                    onChange={(e) => setNewPrice({ ...newPrice, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>

            {/* Preview Section */}
            {newPrice.baseRate && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Price Preview:
                  </Typography>
                  <Box sx={{ fontSize: '0.875rem' }}>
                    <Box display="flex" justifyContent="space-between">
                      <span>Base Rate:</span>
                      <span>{formatCurrency(parseFloat(newPrice.baseRate) || 0)}</span>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <span>Operating Cost (20%):</span>
                      <span>{formatCurrency((parseFloat(newPrice.baseRate) || 0) * 0.20)}</span>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <span>Credit Card Fee (3%):</span>
                      <span>{formatCurrency((parseFloat(newPrice.baseRate) || 0) * 0.03)}</span>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <span>Sales Tax (8.9%):</span>
                      <span>{formatCurrency((parseFloat(newPrice.baseRate) || 0) * 0.089)}</span>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <span>Congestion Surcharge:</span>
                      <span>{formatCurrency(2.75)}</span>
                    </Box>
                    {activeTab === 2 && (
                      <Box display="flex" justifyContent="space-between" color="success.main">
                        <span>Business Discount (30%):</span>
                        <span>-{formatCurrency((parseFloat(newPrice.baseRate) || 0) * 0.30)}</span>
                      </Box>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between" fontWeight="600">
                      <span>Total Price:</span>
                      <span>{formatCurrency(calculateTotalPrice(newPrice.baseRate, newPrice.serviceType))}</span>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddPrice}>
            Save {activeTab === 0 ? 'Hourly' : activeTab === 1 ? 'Point-to-Point' : 'Daily'} Rate
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT PRICE MODAL */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Price</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Vehicle</InputLabel>
                <Select
                  value={editPrice?.vehicle_id || ""}
                  label="Vehicle"
                  onChange={(e) => setEditPrice({ ...editPrice, vehicle_id: e.target.value })}
                >
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                      {vehicle.name} ({vehicle.seats} seats)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={editPrice?.serviceType || ""}
                  label="Service Type"
                  onChange={(e) => setEditPrice({ ...editPrice, serviceType: e.target.value })}
                >
                  <MenuItem value="hourly">Hourly Rate</MenuItem>
                  <MenuItem value="point-to-point">Point-to-Point Rate</MenuItem>
                  <MenuItem value="daily">Daily Rate</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Base Rate"
                type="number"
                fullWidth
                value={editPrice?.baseRate || ""}
                onChange={(e) => setEditPrice({ ...editPrice, baseRate: e.target.value })}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Grid>

            {editPrice?.serviceType === 'point-to-point' && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Per KM Rate"
                  type="number"
                  fullWidth
                  value={editPrice?.perKmRate || ""}
                  onChange={(e) => setEditPrice({ ...editPrice, perKmRate: e.target.value })}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                />
              </Grid>
            )}

            {editPrice?.serviceType === 'daily' && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Minimum Hours"
                  type="number"
                  fullWidth
                  value={editPrice?.minHours || 10}
                  onChange={(e) => setEditPrice({ ...editPrice, minHours: parseInt(e.target.value) || 10 })}
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>hours</Typography>,
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={editPrice?.description || ""}
                onChange={(e) => setEditPrice({ ...editPrice, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={editPrice?.isActive || false}
                    onChange={(e) => setEditPrice({ ...editPrice, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdatePrice}>Update Price</Button>
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