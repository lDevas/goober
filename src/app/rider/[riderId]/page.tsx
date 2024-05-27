import { getRider } from "~/server/queries";
import RequestTrip from "../_components/requestTrip";

interface RiderRouteProps {
  params: {
    riderId: string;
  }
}

export default function Rider({ params: { riderId } }: RiderRouteProps) {
  const rider = getRider(riderId);

  if (!rider) {
    return "Loading";
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <h1>Hello {rider.name}</h1>
    </main>
  );
}

