import { api } from "~/trpc/server";
import Availablility from "../_components/availability";

interface DriverRouteProps {
  params: {
    driverId: string;
  }
}

export default async function Driver({ params: { driverId } }: DriverRouteProps) {
  const driver = await api.driver.get({ driverId: parseInt(driverId) });

  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="font-bold">Hello {driver?.name}</h1>
      <Availablility driver={driver} />
    </main>
  );
}

