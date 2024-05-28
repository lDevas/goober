import { api } from "~/trpc/server";
import RequestTrip from "../_components/requestTrip";
import CurrentTrip from "../_components/currentTrip";

interface RiderRouteProps {
  params: {
    riderId: string;
  }
}

export default async function Rider({ params }: RiderRouteProps) {
  const riderId: number = parseInt(params.riderId);
  const riderPromise = api.rider.get({ riderId });
  const currentTripPromise = api.trip.getCurrentTrip({ riderId });
  const [rider, currentTrip] = await Promise.all([riderPromise, currentTripPromise]);

  return (
    <main className="flex flex-col items-center justify-center">
      <h1>Hello {rider?.name}</h1>
      {currentTrip
        ? <CurrentTrip trip={currentTrip}/>
        : <RequestTrip riderId={riderId}/>
      }
    </main>
  );
}
