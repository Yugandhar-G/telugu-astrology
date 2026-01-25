'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from './shared/Button';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, place: string) => void;
  defaultLat?: number;
  defaultLng?: number;
  defaultPlace?: string;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function LocationPicker({
  onLocationSelect,
  defaultLat,
  defaultLng,
  defaultPlace,
}: LocationPickerProps) {
  const { userLocation } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const [lat, setLat] = useState(defaultLat?.toString() || userLocation.latitude.toString());
  const [lng, setLng] = useState(defaultLng?.toString() || userLocation.longitude.toString());
  const [selectedPlace, setSelectedPlace] = useState(defaultPlace || userLocation.place);

  // Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      setSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Location search failed:", error);
      } finally {
        setSearching(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  function handleSelectResult(result: SearchResult) {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);

    // Extract a simpler name from the long display_name (usually first part)
    const simpleName = result.display_name.split(',')[0];

    setSelectedPlace(simpleName);
    setLat(result.lat);
    setLng(result.lon);
    setQuery(''); // Clear search to hide results
    setResults([]);

    onLocationSelect(newLat, newLng, simpleName);
  }

  function handleUseCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        setLat(newLat.toString());
        setLng(newLng.toString());
        setSelectedPlace('Current Location');
        onLocationSelect(newLat, newLng, 'Current Location');
      },
      () => {
        alert('Unable to get current location');
      }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      alert('Invalid coordinates');
      return;
    }

    onLocationSelect(latNum, lngNum, selectedPlace);
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Location (Global)
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type city name (e.g. New York, London)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        {/* Search Results Dropdown */}
        {(results.length > 0 || searching) && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
            {searching && <div className="p-3 text-sm text-gray-500">Searching...</div>}
            {results.map((result) => (
              <button
                key={result.place_id}
                onClick={() => handleSelectResult(result)}
                className="w-full text-left px-3 py-2 hover:bg-orange-50 text-sm border-b border-gray-100 last:border-0"
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-600">Selected Coordinates</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary-700">
            {selectedPlace || "No location selected"}
          </span>

          <div className="flex space-x-2">
            <Button type="button" variant="secondary" onClick={handleUseCurrentLocation} size="sm">
              Current Loc
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
