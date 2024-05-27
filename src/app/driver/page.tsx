import { api } from "~/trpc/server";

export default async function Driver() {
  const driver = await api.driver.get({ driverId: 2 });

  if (!driver) {
    return "Loading";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Hello {driver.name}</h1>
    </main>
  );
}

