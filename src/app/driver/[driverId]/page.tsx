import { api } from "~/trpc/server";

interface DriverRouteProps {
  params: {
    driverId: string;
  }
}

export default async function Driver({ params: { driverId } }: DriverRouteProps) {
  const driver = await api.driver.get({ driverId: parseInt(driverId) });

  if (!driver) {
    return "Loading";
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <h1>Hello {driver.name}</h1>
    </main>
  );
}

