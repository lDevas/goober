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
          <div key={driver.id}>
            {driver.name}
          </div>
        ))}
      </div>
      <div>
        <h2>Riders</h2>
        {riders.map((rider) => (
          <div key={rider.id}>
            {rider.name}
          </div>
        ))}
      </div>
    </main>
  );
}

