"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import GooberMap from "~/app/_components/GooberMap";
import SubmitButton from "~/app/_components/SubmitButton";
import { useStopwatch } from "~/app/_hooks/useStopwatch";
import { api } from "~/trpc/react";
import type { api as serverApi } from "~/trpc/server";

interface DriverCurrentTripProps {
  trip: Exclude<
    Awaited<ReturnType<typeof serverApi.trip.getDriverCurrentTrip>>,
    undefined
  >;
}

const TIME_TO_CANCEL = 10;

export default function DriverCurrentTrip(props: DriverCurrentTripProps) {
  const router = useRouter();
  const { trip } = props;
  const { originLat, originLng, destinationLat, destinationLng, cost, status } =
    trip;
  const acceptRide = api.trip.driverAcceptRide.useMutation();
  const handleAcceptRide = async () => {
    await acceptRide.mutateAsync({ tripId: trip.id });
    router.refresh();
  };
  const cancelRide = api.trip.driverCancelRide.useMutation();
  const handleCancelRide = async () => {
    await cancelRide.mutateAsync({ tripId: trip.id });
    router.refresh();
  };
  const completeRide = api.trip.driverCompleteRide.useMutation();
  const handleCompleteRide = async () => {
    await completeRide.mutateAsync({ tripId: trip.id });
    router.refresh();
  };

  useEffect(() => {
    const polling = () => {
      router.refresh();
    };
    const interval = setInterval(polling, 3000);

    return () => clearInterval(interval);
  }, [router]);

  const [cancelSeconds, setCancelSeconds] = useState(TIME_TO_CANCEL);
  const stopWatchCallback = useCallback(
    (elapsedTime: number, stopTimer: () => void) => {
      const remainingTime = TIME_TO_CANCEL - Math.round(elapsedTime / 1000);
      if (remainingTime > 0) {
        setCancelSeconds(remainingTime);
      } else {
        stopTimer();
        void handleCancelRide();
      }
    },
    [],
  );
  const [startTimer, stopTimer] = useStopwatch(stopWatchCallback, 1000);
  useEffect(() => {
    if (status === "pending") {
      startTimer();
    }

    return stopTimer;
  }, [startTimer, stopTimer, status]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
      <div className="mt-2 h-80 w-80">
        <GooberMap
          origin={{ lat: originLat ?? 0, lng: originLng ?? 0 }}
          destination={{ lat: destinationLat ?? 0, lng: destinationLng ?? 0 }}
        />
      </div>
      <div className="mt-2">
        The cost of the fare will be: ${cost?.toFixed(2)} USD
      </div>
      {status === "pending" && (
        <>
          <span className="text-yellow-500">Will you accept this ride?</span>
          <form action={handleAcceptRide}>
            <SubmitButton
              className="mx-auto mt-2 rounded border border-white px-3 py-2"
              text="Accept ride"
            />
          </form>
          <form action={handleCancelRide}>
            <SubmitButton
              className="mx-auto mt-2 rounded border border-white px-3 py-2"
              text={`Cancel ride (Canceling automatically in ${cancelSeconds} seconds)`}
            />
          </form>
        </>
      )}
      {status === "in progress" && (
        <>
          <span className="text-white">Ride accepted, pick up the rider</span>
          <span className="text-green-500">Rider dropped at destination?</span>
          <form action={handleCompleteRide}>
            <SubmitButton
              className="mx-auto mt-2 rounded border border-white px-3 py-2"
              text="Complete ride"
            />
          </form>
          <form action={handleCancelRide}>
            <SubmitButton
              className="mx-auto mt-2 rounded border border-white px-3 py-2"
              text="Cancel ride"
            />
          </form>
        </>
      )}
    </APIProvider>
  );
}
