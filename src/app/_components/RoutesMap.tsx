"use client";
import React, { useEffect, useState } from "react";

import {
  useMapsLibrary,
  useMap,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";

interface RoutesMapProps {
  destinations: (google.maps.LatLngLiteral & { sortIndex: number })[];
}

export default function RoutesMap({
  destinations,
}: RoutesMapProps) {
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
        !directionsRenderer
      )
        return;

      const sortedDestinations = destinations.sort((a, b) => a.sortIndex - b.sortIndex);
      const MAX_WAYPOINTS = 25;
      const numChunks = Math.ceil(sortedDestinations.length / MAX_WAYPOINTS);
      const chunkResponses = Array.from(Array(numChunks), (_, index) => {
        const start = index * MAX_WAYPOINTS;
        const end = Math.min((index + 1) * MAX_WAYPOINTS, sortedDestinations.length);
        const chunk = sortedDestinations.slice(start, end);

        const origin = chunk[0];
        const destination = chunk[chunk.length - 1];
        const waypoints = chunk.slice(1, -1).map(location => ({ location, stopover: true }));

        const safeRequest = {
          origin: origin as google.maps.LatLngLiteral,
          destination: destination as google.maps.LatLngLiteral,
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false,
        };

        return directionsService.route(safeRequest);
      });
      const routeResponses = await Promise.all(chunkResponses.filter(response => response !== null));

      const mergedRoutes = {
        request: {
          travelMode: 'DRIVING'
        },
        routes: [{
          legs: routeResponses.map((response) => response.routes[0]?.legs).flat(),
        }]
      }

      directionsRenderer.setDirections(mergedRoutes as google.maps.DirectionsResult);
    }

    void renderRoute();
  }, [
    directionsService,
    directionsRenderer,
    destinations,
  ]);

  // Recenter and adjust zoom to fit origin and destination
  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    destinations.forEach(destination => {
      bounds.extend({ lat: destination.lat, lng: destination.lng });
    });
    map.fitBounds(bounds);
  }, [map, destinations]);

  return (
    <GoogleMap
      defaultCenter={destinations[0]}
      defaultZoom={16}
      gestureHandling={"greedy"}
      fullscreenControl={false}
      className="h-full w-full"
      maxZoom={16}
    />
  );
}
