import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import ImageUploader from "./ImageUploader";

export default function ServiceFormModal({
  open,
  onClose,
  onSubmit,
  data,
  setData,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          {data?.id ? "Edit Service" : "Add New Service"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        <Grid container spacing={3}>
          {/* Image uploader */}
          <Grid item xs={12}>
            <ImageUploader
              preview={data.imagePreview}
              onUpload={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (img) =>
                  setData({
                    ...data,
                    image: file,
                    imagePreview: img.target.result,
                  });
                reader.readAsDataURL(file);
              }}
              onRemove={() =>
                setData({
                  ...data,
                  image: null,
                  imagePreview: "",
                })
              }
            />
          </Grid>

          {/* Title */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Service Title"
              variant="outlined"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Category"
              variant="outlined"
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              variant="outlined"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          size="medium"
          sx={{ px: 3, py: 1, borderRadius: 2 }}
          onClick={onSubmit}
        >
          {data?.id ? "Update Service" : "Save Service"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
