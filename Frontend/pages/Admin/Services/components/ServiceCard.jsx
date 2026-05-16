import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
export const BASE_URL = "https://localhost:3000/";
export default function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <Card 
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={`${BASE_URL}${service.image}`}
          alt={service.title}
          sx={{ width: "100%", height: 200, objectFit: "cover" }}
        />

        {service.featured && (
          <Chip
            label="Featured"
            color="primary"
            size="small"
            sx={{ position: "absolute", top: 8, right: 8 }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {service.title}
        </Typography>

        <Chip label={service.category} size="small" sx={{ my: 1 }} />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {service.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2 }}>
        <Button size="small" startIcon={<Edit />} onClick={() => onEdit(service)}>
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<Delete />}
          color="error"
          onClick={() => onDelete(service.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
