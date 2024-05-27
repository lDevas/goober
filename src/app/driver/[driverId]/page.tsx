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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Hello {driver.name}</h1>
    </main>
  );
}

