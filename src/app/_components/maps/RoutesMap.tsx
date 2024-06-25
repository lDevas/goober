"use client";
import React from "react";

import {
  useMap,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";
import { useFitDestinations } from "./useFitDestinations";
import { useRoute } from "./useRoute";
import { useClusterer } from "./useClusterer";

interface RoutesMapProps {
  destinations: (google.maps.LatLngLiteral & { assignedDriverId: string; title: string })[];
  driverIds: string[];
}

const MAP_ID = "de8b18fc9e13625";

export default function RoutesMap({
  destinations,
  driverIds,
}: RoutesMapProps) {
  const map = useMap(MAP_ID);

  // Show the route
  useRoute({ map, destinations, driverIds });

  // Recenter and adjust zoom to fit origin and destination
  useFitDestinations(map, destinations);

  // CLuster 
  useClusterer(map, destinations, driverIds);

  return (
    <GoogleMap
      id={MAP_ID}
      mapId={MAP_ID}
      defaultCenter={destinations[0]}
      defaultZoom={8}
      gestureHandling={"greedy"}
      fullscreenControl={false}
      className="h-full w-full"
      maxZoom={16}
    />
  );
}
