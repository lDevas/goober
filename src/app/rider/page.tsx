import { api } from "~/trpc/server";

export default async function Rider() {
  const rider = await api.rider.get({ riderId: 1 });

  if (!rider) {
    return "Loading";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Hello {rider.name}</h1>
    </main>
  );
}

