'use client'

import { TRPCClientError } from "@trpc/client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GooberMap from "~/app/_components/maps/GooberMap";
import PlacesAutocomplete from "~/app/_components/PlacesAutocomplete";
import SubmitButton from "~/app/_components/SubmitButton";
import { api } from "~/trpc/react";
import type { api as serverApi } from "~/trpc/server";

interface RequestTripProps {
  rider: Exclude<Awaited<ReturnType<typeof serverApi.rider.get>>, undefined>;
}

export default function RequestTrip({ rider }: RequestTripProps) {
  const router = useRouter();
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | undefined>(undefined);
  const [destination, setDestination] = useState<google.maps.LatLngLiteral | undefined>(undefined);
  const [distance, setDistance] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const getTripCost = api.trip.getTripCost.useQuery({ distance }, { enabled: !!distance });
  useEffect(() => {
    async function refetch() {
      if (distance) {
        await getTripCost.refetch();
      }
    }
    void refetch();
  }, [getTripCost, distance]);

  const requestTrip = api.trip.requestTrip.useMutation();
  const handleSubmit = async () => {
    if (!origin || !destination || !getTripCost.data) return;
    try {
      await requestTrip.mutateAsync(
        {
          riderId: rider.id,
          originLat: origin?.lat,
          originLng: origin?.lng,
          destinationLat: destination?.lat,
          destinationLng: destination?.lng,
          cost: getTripCost.data
        }
      );
    } catch (error) {
      if (error instanceof TRPCClientError) {
        setError(error.message)
      }
    }
    router.refresh();
  }
  console.log(error);

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
        {error && <span className="mt-2 align-center text-red-500">{error}</span>}
      </form>
    </APIProvider>
  );
}

