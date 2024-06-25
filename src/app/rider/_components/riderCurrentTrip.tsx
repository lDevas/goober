'use client'

import { APIProvider } from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GooberMap from "~/app/_components/maps/GooberMap";
import SubmitButton from "~/app/_components/SubmitButton";
import { api } from "~/trpc/react";
import type { api as serverApi } from "~/trpc/server";

interface RiderCurrentTripProps {
  trip: Exclude<Awaited<ReturnType<typeof serverApi.trip.getRiderCurrentTrip>>, undefined>;
}

export default function RiderCurrentTrip(props: RiderCurrentTripProps) {
  const router = useRouter();
  const { trip } = props;
  const { originLat, originLng, destinationLat, destinationLng, cost, status } = trip;
  const cancelRide = api.trip.riderCancelRide.useMutation();
  const handleSubmit = async () => {
    await cancelRide.mutateAsync({ tripId: trip.id });
    router.refresh();
  }
  useEffect(() => {
    const polling = () => {
      router.refresh();
    }
    const interval = setInterval(polling, 3000);

    return () => clearInterval(interval);
  }, [router]);

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
      <form action={handleSubmit}>
        <SubmitButton
          className="mx-auto mt-2 py-2 px-3 border border-white rounded"
          text="Cancel ride"
        />
      </form>
    </APIProvider>
  )
}

