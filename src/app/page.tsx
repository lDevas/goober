import Link from "next/link";
import { api } from "~/trpc/server";

export default async function Home() {
  const drivers = await api.driver.getAll();
  const riders = await api.rider.getAll();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Goober Users</h1>
      <div>
        <h2>Drivers</h2>
        {drivers.map((driver) => (
          <Link href={`/driver/${driver.id}`} key={driver.id}>
            {driver.name}
          </Link>
        ))}
      </div>
      <div>
        <h2>Riders</h2>
        {riders.map((rider) => (
          <Link href={`/driver/${rider.id}`} key={rider.id}>
            {rider.name}
          </Link>
        ))}
      </div>
    </main>
  );
}

