"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import RoutesMap from "../_components/maps/RoutesMap";
import data from "./data";

export default function DriverRoute() {
  const sortedDestinations = data.sort((a, b) => a.driverRouteIndex - b.driverRouteIndex);
  const destinations = sortedDestinations.map(destination => ({
    assignedDriverId: destination.assignedDriverId,
    lat: parseFloat(destination.customerSite.latitude),
    lng: parseFloat(destination.customerSite.longitude),
    title: destination.customerSite.name,
  }));
  const driverIds = ['817495c1-460d-4d62-9286-9f1066fbec32', '1cfa2ca3-b1aa-4384-af64-cbbe39daf3b8']

  return (
    <main className="flex flex-col items-center justify-center p-4 text-black" style={{ height: '800px' }}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
        <RoutesMap destinations={destinations} driverIds={driverIds} />
      </APIProvider>
    </main>
  );
};
