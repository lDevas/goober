"use client";
import React, { useEffect, useState } from "react";

import {
  useMapsLibrary,
  useMap,
  Map as GoogleMap,
  Marker,
} from "@vis.gl/react-google-maps";

interface GooberMapProps {
  origin: google.maps.LatLngLiteral | undefined;
  destination: google.maps.LatLngLiteral | undefined;
  setDistance?: (distance: number) => void;
}

export default function GooberMap({
  origin,
  destination,
  setDistance,
}: GooberMapProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  // Use directions service
  useEffect(() => {
    async function renderRoute() {
      if (
        !directionsService ||
        !directionsRenderer ||
        !(origin?.lat && origin.lng) ||
        !(destination?.lat && destination.lng)
      )
        return;

      const response = await directionsService.route({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      });
      directionsRenderer.setDirections(response);
      if (!response.routes[0]?.legs[0]?.distance || !setDistance) return;
      setDistance(response.routes[0].legs[0].distance.value);
    }

    void renderRoute();
  }, [
    directionsService,
    directionsRenderer,
    origin?.lat,
    origin?.lng,
    destination?.lat,
    destination?.lng,
    setDistance,
  ]);

  // Recenter and adjust zoom to fit origin and destination
  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    if (origin?.lat && origin?.lng) {
      bounds.extend({ lat: origin.lat, lng: origin.lng });
    }
    if (destination?.lat && destination?.lng) {
      bounds.extend({ lat: destination.lat, lng: destination.lng });
    }
    if (
      (origin?.lat && origin?.lng) ??
      (destination?.lat && destination?.lng)
    ) {
      map.fitBounds(bounds);
    }
  }, [map, origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

  return (
    <GoogleMap
      defaultCenter={{ lat: 37.546738028270155, lng: -122.30795378796942 }}
      defaultZoom={12}
      gestureHandling={"greedy"}
      fullscreenControl={false}
      className="h-full w-full"
      disableDefaultUI
      maxZoom={16}
    >
      {origin && <Marker position={origin} />}
      {destination && <Marker position={destination} />}
    </GoogleMap>
  );
}
