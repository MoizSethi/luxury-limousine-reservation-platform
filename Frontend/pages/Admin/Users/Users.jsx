// src/pages/Admin/Users/Users.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";

const API_URL = "https://localhost:3000/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "passenger",
    notifications: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [roleFilter, setRoleFilter] = useState("admins"); // Default view: admins

  const token = localStorage.getItem("token");

  // Fetch users
  const fetchUsers = async (role) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/${role}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("❌ Fetch users error:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch users",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(roleFilter);
  }, [roleFilter]);

  // Handle delete
  const handleDelete = async (user_id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/${roleFilter.slice(0, -1)}/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: "User deleted successfully", severity: "success" });
      fetchUsers(roleFilter);
    } catch (err) {
      console.error("❌ Delete error:", err);
      setSnackbar({ open: true, message: "Failed to delete user", severity: "error" });
    }
  };

  // Open Edit Dialog
  const openEditDialog = (user) => {
    setSelectedUser({ ...user });
    setEditOpen(true);
  };

  // Update User
  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_URL}/${roleFilter.slice(0, -1)}/${selectedUser.user_id}`,
        selectedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: "User updated successfully", severity: "success" });
      setEditOpen(false);
      fetchUsers(roleFilter);
    } catch (err) {
      console.error("❌ Update error:", err);
      setSnackbar({ open: true, message: "Failed to update user", severity: "error" });
    }
  };

  // Add new user
  const handleAddUser = async () => {
    try {
      if (newUser.password !== newUser.confirmPassword) {
        setSnackbar({ open: true, message: "Passwords do not match", severity: "error" });
        return;
      }

      await axios.post(`${API_URL}/register`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: "User added successfully", severity: "success" });
      setAddOpen(false);
      setNewUser({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "passenger",
        notifications: false,
      });
      fetchUsers(roleFilter);
    } catch (err) {
      console.error("❌ Add user error:", err);
      setSnackbar({ open: true, message: "Failed to add user", severity: "error" });
    }
  };

  // Handle role toggle
  const handleRoleToggle = (event, newRole) => {
    if (newRole) setRoleFilter(newRole);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Users Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
          Add New User
        </Button>
      </Box>

      <ToggleButtonGroup value={roleFilter} exclusive onChange={handleRoleToggle} sx={{ mb: 3 }}>
        <ToggleButton value="admins">Admins</ToggleButton>
        <ToggleButton value="passengers">Passengers</ToggleButton>
      </ToggleButtonGroup>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#ID</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Notifications</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>{user.user_id}</TableCell>
                      <TableCell>{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.notifications ? "Enabled" : "Disabled"}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => openEditDialog(user)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(user.user_id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>No users found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField label="First Name" value={selectedUser.firstName} onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })} />
              <TextField label="Last Name" value={selectedUser.lastName} onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })} />
              <TextField label="Phone" value={selectedUser.phone} onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography>Notifications:</Typography>
                <Switch checked={selectedUser.notifications} onChange={(e) => setSelectedUser({ ...selectedUser, notifications: e.target.checked })} />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Add New User Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="First Name" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} />
            <TextField label="Last Name" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} />
            <TextField label="Phone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
            <TextField label="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <TextField label="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            <TextField label="Confirm Password" type="password" value={newUser.confirmPassword} onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Notifications:</Typography>
              <Switch checked={newUser.notifications} onChange={(e) => setNewUser({ ...newUser, notifications: e.target.checked })} />
            </Box>
            <TextField select label="Role" value={newUser.role} SelectProps={{ native: true }} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="passenger">Passenger</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUser}>Add User</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
