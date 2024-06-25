import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { mapColors } from "./constants";

const MAX_WAYPOINTS = 25;

interface useRoutePropTypes {
  map: google.maps.Map | null;
  destinations: { lat: number; lng: number, assignedDriverId: string; }[];
  driverIds: string[];
}

export const useRoute = ({ map, destinations, driverIds }: useRoutePropTypes) => {
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderers, setDirectionsRenderers] = useState<google.maps.DirectionsRenderer[]>();

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
  }, [routesLibrary, map]);

  // remove previously renrered routes
  useEffect(() => {
    return () => directionsRenderers?.forEach((directionsRenderer) => directionsRenderer.setMap(null));
  }, [directionsRenderers]);

  // Use directions service
  useEffect(() => {
    async function renderRoute() {
      if (!routesLibrary || !directionsService)
        return;

      const routesByDriverPromises = driverIds.map(async (driverId) => {
        const driverDestinations = destinations.filter((destination) => destination.assignedDriverId === driverId);
        const numChunks = Math.ceil(driverDestinations.length / MAX_WAYPOINTS);
        const chunkResponses = Array.from(Array(numChunks), (_, index) => {
          const start = index === 0 ? 0 : index * MAX_WAYPOINTS - 1;
          const end = Math.min((index + 1) * MAX_WAYPOINTS, driverDestinations.length);
          const chunk = driverDestinations.slice(start, end);

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
        const routeResponses = await Promise.all(chunkResponses);

        const mergedRoutes = {
          request: {
            travelMode: 'DRIVING'
          },
          routes: [{
            legs: routeResponses.map((response) => response.routes[0]?.legs).flat(),
          }]
        }

        return { driverId, mergedRoutes };
      });
      const routesByDriver = await Promise.all(routesByDriverPromises)

      const directionsRenderers = routesByDriver.map((driverRoute, index) => {
        const directionsRenderer = new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true, polylineOptions: { strokeColor: mapColors[index] } });
        directionsRenderer.setDirections(driverRoute.mergedRoutes as google.maps.DirectionsResult);
        return directionsRenderer;
      });

      setDirectionsRenderers(directionsRenderers)
    }

    void renderRoute();
  }, [
    directionsService,
    driverIds,
    map,
    routesLibrary,
    destinations,
  ]);
};