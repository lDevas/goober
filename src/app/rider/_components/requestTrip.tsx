'use client'

import { APIProvider } from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GooberMap from "~/app/_components/GooberMap";
import PlacesAutocomplete from "~/app/_components/PlacesAutocomplete";
import SubmitButton from "~/app/_components/SubmitButton";
import { api } from "~/trpc/react";

interface RequestTripProps { 
  riderId: number;
}

export default function RequestTrip({ riderId }: RequestTripProps) {
  const router = useRouter();
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | undefined>(undefined);
  const [destination, setDestination] = useState<google.maps.LatLngLiteral | undefined>(undefined);
  const [distance, setDistance] = useState<number>(0);
  const getTripCost = api.trip.getTripCost.useQuery({ distance }, { enabled: !!distance });
  useEffect(() => {
    async function refetch() {
      if (distance) {
        await getTripCost.refetch();
      }
    }
    void refetch();
  }, [getTripCost, distance]);
  
  const toggleAvailable = api.trip.requestTrip.useMutation();
  const handleSubmit = async () => {
    if (!origin || !destination || !getTripCost.data) return;
    await toggleAvailable.mutateAsync(
      {
        riderId,
        originLat: origin?.lat,
        originLng: origin?.lng,
        destinationLat: destination?.lat,
        destinationLng: destination?.lng,
        cost: getTripCost.data
      }
    );
    router.refresh();
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}>
      <form action={handleSubmit} className="flex flex-col">
        Origin:
        <PlacesAutocomplete onPlaceSelect={setOrigin} />
        Destination:
        <PlacesAutocomplete onPlaceSelect={setDestination} />
        <div className='mt-2 w-80 h-80'>
          <GooberMap
            origin={origin}
            destination={destination}
            setDistance={setDistance}
          />
        </div>
        {getTripCost.data && <div className="mt-2">The cost of the fare will be: ${getTripCost.data.toFixed(2)} USD</div>}
        <SubmitButton
          className="mx-auto mt-2 py-2 px-3 border border-white rounded"
          text="Request trip"
          disabled={!origin || !destination || !getTripCost.data}
        />
      </form>
    </APIProvider>
  );
}

