import { Box, Typography, IconButton } from "@mui/material";
import { Upload, Cancel } from "@mui/icons-material";

export default function ImageUploader({ preview, onUpload, onRemove }) {
  return (
    <Box>
      {preview ? (
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{
              width: "100%",
              maxWidth: 400,
              height: 200,
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
          <IconButton
            onClick={onRemove}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { background: "rgba(0,0,0,0.7)" },
            }}
          >
            <Cancel />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            border: "2px dashed",
            borderColor: "grey.300",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
          onClick={() => document.getElementById("upload-image").click()}
        >
          <Upload sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
          <Typography>Click to upload service image</Typography>
        </Box>
      )}

      <input
        id="upload-image"
        type="file"
        accept="image/*"
        onChange={onUpload}
        style={{ display: "none" }}
      />
    </Box>
  );
}
