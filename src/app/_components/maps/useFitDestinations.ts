import { useEffect } from "react";

export const useFitDestinations = (map: google.maps.Map | null, destinations: { lat: number, lng: number }[]) => {
  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    destinations.forEach(destination => {
      bounds.extend({ lat: destination.lat, lng: destination.lng });
    });
    map.fitBounds(bounds);
  }, [map, destinations]);
};