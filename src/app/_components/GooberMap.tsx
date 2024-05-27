'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  APIProvider,
  useMapsLibrary,
  useMap,
  Map as GoogleMap,
  Marker
} from '@vis.gl/react-google-maps';

interface GooberMapProps {
  origin: google.maps.LatLngLiteral | undefined;
  destination: google.maps.LatLngLiteral | undefined;
}

export default function GooberMap({ origin, destination }: GooberMapProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
    
  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]);

  // Use directions service 
  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination) return;

    directionsService
      .route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false
      })
      .then(response => {
        directionsRenderer.setDirections(response);
      });

    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer, origin, destination]);
  
  return (
    <GoogleMap
      defaultCenter={{ lat: 37.546738028270155, lng: -122.30795378796942 }}
      defaultZoom={12}
      gestureHandling={'greedy'}
      fullscreenControl={false}
      className='h-full w-full'
      disableDefaultUI
    >
      {origin && <Marker position={origin} />}
      {destination && <Marker position={destination} />}
    </GoogleMap>
  );
}
