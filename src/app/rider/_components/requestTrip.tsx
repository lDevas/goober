'use client'

import { APIProvider } from "@vis.gl/react-google-maps";
import { useState } from "react";
import GooberMap from "~/app/_components/GooberMap";
import PlacesAutocomplete from "~/app/_components/PlacesAutocomplete";

export default function RequestTrip() {
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | undefined>(undefined);
  const [destination, setDestination] = useState<google.maps.LatLngLiteral | undefined>(undefined);

  return (
    <APIProvider apiKey='AIzaSyDsN3D-OXfGdyBXi5Ih5V68dHtbsGFuPsA'>
      <div>
        Origin:
        <PlacesAutocomplete onPlaceSelect={setOrigin} />
        Destination:
        <PlacesAutocomplete onPlaceSelect={setDestination} />
        <div className='w-80 h-80'>
          <GooberMap
            origin={origin}
            destination={destination}
          />
          </div>
      </div>
    </APIProvider>
  );
}

