'use client'

import { APIProvider } from "@vis.gl/react-google-maps";
import GooberMap from "~/app/_components/GooberMap";
import SubmitButton from "~/app/_components/SubmitButton";
import type { api } from "~/trpc/server";

interface CurrentTripProps {
  trip: Exclude<Awaited<ReturnType<typeof api.trip.getRiderCurrentTrip>>, undefined>;
}

export default function CurrentTrip(props: CurrentTripProps) {
  const { trip } = props;
  const { originLat, originLng, destinationLat, destinationLng, cost, status } = trip;
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}>
      <div className='mt-2 w-80 h-80'>
        <GooberMap
          origin={{ lat: originLat ?? 0, lng: originLng ?? 0 }}
          destination={{ lat: destinationLat ?? 0, lng: destinationLng ?? 0 }}
        />
      </div>
      <div className="mt-2">The cost of the fare will be: ${cost?.toFixed(2)} USD</div>
      {status === 'pending' && <span className='text-yellow-500'>Waiting for driver to accept the trip</span>}
      {status === 'in progress' && <span className='text-green-500'>Driver is picking you up soon</span>}
      <SubmitButton
        className="mx-auto mt-2 py-2 px-3 border border-white rounded"
        text="Cancel ride"
      />
    </APIProvider>
  )
}

