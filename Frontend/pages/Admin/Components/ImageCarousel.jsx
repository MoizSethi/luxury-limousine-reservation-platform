// src/components/ImageCarousel.jsx
import { useState } from "react";
import { Box, IconButton, Badge, Typography } from "@mui/material";
import { Star, DeleteForever } from "@mui/icons-material";

const ImageCarousel = ({ images, defaultImage, onSetDefault, onDeleteImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          height: 200, 
          bgcolor: 'grey.100', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: 1
        }}
      >
        <Typography color="text.secondary">No images available</Typography>
      </Box>
    );
  }

  const getImageUrl = (image) => {
    if (!image) return '/api/placeholder/300/200';
    // Use the correct field name from your backend
    return `https://localhost:3000//${image.image_url || image.url}`;
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Main Image */}
      <Box
        component="img"
        src={getImageUrl(images[currentIndex])}
        alt={`Vehicle image ${currentIndex + 1}`}
        sx={{
          width: '100%',
          height: 200,
          objectFit: 'cover',
          borderRadius: 1,
          cursor: 'pointer'
        }}
      />
      
      {/* Image Indicators */}
      {images.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 0.5 }}>
          {images.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: index === currentIndex ? 'primary.main' : 'grey.400',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </Box>
      )}
      
      {/* Image Actions */}
      <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
        {images[currentIndex]?.image_id !== defaultImage && (
          <IconButton
            size="small"
            sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
            onClick={() => onSetDefault(images[currentIndex]?.image_id)}
            title="Set as default"
          >
            <Star fontSize="small" />
          </IconButton>
        )}
        {images[currentIndex]?.image_id === defaultImage && (
          <Badge badgeContent="Default" color="primary">
            <Star color="primary" />
          </Badge>
        )}
        <IconButton
          size="small"
          sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
          onClick={() => onDeleteImage(images[currentIndex]?.image_id)}
          title="Delete image"
        >
          <DeleteForever fontSize="small" color="error" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ImageCarousel;