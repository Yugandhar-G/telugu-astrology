'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE, DEFAULT_TIMEZONE } from '@/lib/constants/config';

interface AppContextType {
  userLocation: {
    latitude: number;
    longitude: number;
    place: string;
  };
  timezone: string;
  setUserLocation: (lat: number, lng: number, place: string) => void;
  setTimezone: (tz: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocationState] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    place: 'Hyderabad, India',
  });
  const [timezone, setTimezoneState] = useState(DEFAULT_TIMEZONE);

  useEffect(() => {
    // Auto-geolocation disabled by user preference for fixed Indian location
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(...)
    // }
  }, []);

  function setUserLocation(lat: number, lng: number, place: string) {
    setUserLocationState({ latitude: lat, longitude: lng, place });
  }

  function setTimezone(tz: string) {
    setTimezoneState(tz);
  }

  return (
    <AppContext.Provider
      value={{
        userLocation,
        timezone,
        setUserLocation,
        setTimezone,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
