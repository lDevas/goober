import { api } from "~/trpc/server";

interface RiderRouteProps {
  params: {
    riderId: string;
  }
}

export default async function Rider({ params: { riderId } }: RiderRouteProps) {
  const rider = await api.rider.get({ riderId: parseInt(riderId) });

  if (!rider) {
    return "Loading";
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <h1>Hello {rider.name}</h1>
    </main>
  );
}

