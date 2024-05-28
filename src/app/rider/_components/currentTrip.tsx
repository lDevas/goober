'use client'

import { api } from "~/trpc/server";

interface CurrentTripProps {
  trip: Awaited<ReturnType<typeof api.trip.getCurrentTrip>>;
}

export default function CurrentTrip(props: CurrentTripProps) {
  console.log(props.trip);

  return (
    <div>
      ASD
    </div>
  )
}

