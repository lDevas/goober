import Link from "next/link";
import { api } from "~/trpc/server";

export default async function Home() {
  const drivers = await api.driver.getAll();
  const riders = await api.rider.getAll();

  return (
    <main className="flex flex-col items-center">
      <h1>Goober Users</h1>
      <h2 className="mt-4">Drivers</h2>
      <div className="flex space-between w-72 justify-between">
        {drivers.map((driver) => (
          <Link href={`/driver/${driver.id}`} key={driver.id} className="py2 px-3 border border-white rounded">
            {driver.name}
          </Link>
        ))}
      </div>
      <h2 className="mt-4">Riders</h2>
      <div className="flex space-between w-72 justify-between">
        {riders.map((rider) => (
          <Link href={`/rider/${rider.id}`} key={rider.id} className="py2 px-3 border border-white rounded">
            {rider.name}
          </Link>
        ))}
      </div>
    </main>
  );
}

