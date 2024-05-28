import { api } from "~/trpc/server";
import Availablility from "../_components/availability";
import DriverCurrentTrip from "../_components/driverCurrentTrip";

interface DriverRouteProps {
  params: {
    driverId: string;
  }
};

export default async function Driver({ params }: DriverRouteProps) {
  const driverId: number = parseInt(params.driverId);
  const driverPromise = api.driver.get({ driverId });
  const currentTripPromise = api.trip.getDriverCurrentTrip({ driverId });
  const [driver, currentTrip] = await Promise.all([driverPromise, currentTripPromise]);

  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="font-bold">Hello {driver?.name}</h1>
      { currentTrip
        ? <DriverCurrentTrip trip={currentTrip} />
        : <Availablility driver={driver} />
      }
    </main>
  );
};
