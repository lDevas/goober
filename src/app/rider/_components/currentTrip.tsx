'use client'

import type { api } from "~/trpc/server";

interface CurrentTripProps {
  trip: Awaited<ReturnType<typeof api.trip.getRiderCurrentTrip>>;
}

export default function CurrentTrip(props: CurrentTripProps) {
  console.log(props.trip);

  return (
    <div>
      ASD
    </div>
  )
}

