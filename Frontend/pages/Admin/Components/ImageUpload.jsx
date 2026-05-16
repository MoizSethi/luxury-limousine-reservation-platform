import { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { vehicleImageService } from "../../../services/vehicleService";

const ImageUpload = ({ vehicleId, onImagesUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleImageSelect = async (event) => {
    // 🚫 BLOCK if vehicle not saved
    if (!vehicleId) {
      alert("Please save the vehicle first before uploading images.");
      event.target.value = "";
      return;
    }

    const files = Array.from(event.target.files);
    if (!files.length) return;

    // Validate images
    const validFiles = files.filter(file =>
      file.type.startsWith("image/")
    );

    if (!validFiles.length) {
      alert("Only image files are allowed.");
      return;
    }

    // Preview before upload
    const previews = validFiles.map(file =>
      URL.createObjectURL(file)
    );
    setPreviewImages(previews);

    await handleImageUpload(validFiles);

    // Reset input to allow same file re-upload
    event.target.value = "";
  };

  const handleImageUpload = async (files) => {
    // 🚫 EXTRA SAFETY
    if (!vehicleId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("images", file); // MUST match multer
      });

      const res = await vehicleImageService.uploadImages(
        vehicleId,
        formData
      );

      if (res?.images) {
        onImagesUpdate(res.images);
        setPreviewImages([]);
      }
    } catch (err) {
      console.error("❌ Image upload failed:", err);
      alert(
        err.response?.data?.message ||
        "Failed to upload images"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <input
        accept="image/*"
        id={`vehicle-image-upload-${vehicleId || "new"}`}
        type="file"
        multiple
        hidden
        disabled={uploading || !vehicleId}
        onChange={handleImageSelect}
      />

      <label htmlFor={`vehicle-image-upload-${vehicleId || "new"}`}>
        <Button
          variant="outlined"
          component="span"
          startIcon={<PhotoCamera />}
          disabled={uploading || !vehicleId}
          fullWidth
        >
          {uploading ? (
            <>
              Uploading
              <CircularProgress size={16} sx={{ ml: 1 }} />
            </>
          ) : !vehicleId ? (
            "Save Vehicle First"
          ) : (
            "Upload Vehicle Images"
          )}
        </Button>
      </label>

      {/* Preview */}
      {previewImages.length > 0 && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {previewImages.map((src, idx) => (
            <Box key={idx}>
              <img
                src={src}
                alt="preview"
                width={80}
                height={80}
                style={{
                  borderRadius: 8,
                  objectFit: "cover",
                  border: "1px solid #ddd",
                }}
              />
              <Typography
                variant="caption"
                display="block"
                align="center"
              >
                Preview
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
