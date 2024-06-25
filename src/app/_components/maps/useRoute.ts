import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export const useRoute = (map: google.maps.Map | null, destinations: { lat: number; lng: number }[]) => {
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    useState<google.maps.DirectionsRenderer>();

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true }));
  }, [routesLibrary, map]);

  // Use directions service
  useEffect(() => {
    async function renderRoute() {
      if (
        !directionsService ||
        !directionsRenderer
      )
        return;

      const MAX_WAYPOINTS = 25;
      const numChunks = Math.ceil(destinations.length / MAX_WAYPOINTS);
      const chunkResponses = Array.from(Array(numChunks), (_, index) => {
        const start = index * MAX_WAYPOINTS;
        const end = Math.min((index + 1) * MAX_WAYPOINTS, destinations.length);
        const chunk = destinations.slice(start, end);

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
};