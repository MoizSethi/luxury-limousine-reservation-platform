// src/hooks/useVehicleImages.js
import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:3000//";

const normalizeUrl = (url) => {
  if (!url) return '/no-image.jpg';
  if (url.startsWith('http')) return url;
  return url.startsWith('/uploads') ? `${BASE_URL}${url}` : `${BASE_URL}/uploads/${url}`;
};

export const useVehicleImages = (vehicles) => {
  const [vehicleImages, setVehicleImages] = useState({}); // vehicle_id -> images array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vehicles || vehicles.length === 0) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchImages = async () => {
      const imagesMap = {};
      await Promise.all(
        vehicles.map(async (vehicle) => {
          try {
            const res = await fetch(`${BASE_URL}/api/vehicle-images/${vehicle.vehicle_id}/images`);
            if (!res.ok) throw new Error('Failed to fetch images');
            const data = await res.json();
            imagesMap[vehicle.vehicle_id] = data.images.map(img => ({ ...img, fullUrl: normalizeUrl(img.image_url) }));
          } catch (err) {
            console.error(`Error fetching images for vehicle ${vehicle.vehicle_id}:`, err);
            imagesMap[vehicle.vehicle_id] = [{ fullUrl: '/no-image.jpg' }];
          }
        })
      );
      if (isMounted) {
        setVehicleImages(imagesMap);
        setLoading(false);
      }
    };

    fetchImages();

    return () => { isMounted = false; };
  }, [vehicles]);

  return { vehicleImages, loading };
};
