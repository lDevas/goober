'use client'

import { APIProvider } from "@vis.gl/react-google-maps";
import GooberMap from "~/app/_components/GooberMap";
import SubmitButton from "~/app/_components/SubmitButton";
import type { api } from "~/trpc/server";

interface DriverCurrentTripProps {
  trip: Exclude<Awaited<ReturnType<typeof api.trip.getDriverCurrentTrip>>, undefined>;
}

export default function DriverCurrentTrip(props: DriverCurrentTripProps) {
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
      {status === 'pending' && <>
        <span className='text-yellow-500'>Will you accept this ride?</span>
        <SubmitButton
          className="mx-auto mt-2 py-2 px-3 border border-white rounded"
          text="Accept ride"
        />
      </>}
      {status === 'in progress' && <span className='text-green-500'>Ride accepted, pick up the rider</span>}

      <SubmitButton
        className="mx-auto mt-2 py-2 px-3 border border-white rounded"
        text="Cencel ride"
      />
    </APIProvider>
  )
}

