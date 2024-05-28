import { api } from "~/trpc/server";
import RequestTrip from "../_components/requestTrip";
import RiderCurrentTrip from "../_components/riderCurrentTrip";

interface RiderRouteProps {
  params: {
    riderId: string;
  }
}

export default async function Rider({ params }: RiderRouteProps) {
  const riderId: number = parseInt(params.riderId);
  const riderPromise = api.rider.get({ riderId });
  const currentTripPromise = api.trip.getRiderCurrentTrip({ riderId });
  const [rider, currentTrip] = await Promise.all([riderPromise, currentTripPromise]);

  if (!rider) return null;

  return (
    <main className="flex flex-col items-center justify-center">
      <h1>Hello {rider?.name}</h1>
      {currentTrip
        ? <RiderCurrentTrip trip={currentTrip}/>
        : <RequestTrip rider={rider}/>
      }
    </main>
  );
}
