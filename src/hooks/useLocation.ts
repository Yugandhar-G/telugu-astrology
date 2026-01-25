// Hook for getting user location

import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  place: string;
  error?: string;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            place: 'Current Location',
          });
          setLoading(false);
        },
        (error) => {
          setLocation({
            latitude: 17.3850, // Default to Hyderabad
            longitude: 78.4867,
            place: 'Hyderabad, India',
            error: error.message,
          });
          setLoading(false);
        }
      );
    } else {
      setLocation({
        latitude: 17.3850,
        longitude: 78.4867,
        place: 'Hyderabad, India',
        error: 'Geolocation not supported',
      });
      setLoading(false);
    }
  }, []);

  return { location, loading };
}
