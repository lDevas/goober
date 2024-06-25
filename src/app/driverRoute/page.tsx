"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import RoutesMap from "../_components/maps/RoutesMap";
import data from "./data";

const DRIVER_ID = '817495c1-460d-4d62-9286-9f1066fbec32';

export default function DriverRoute() {
  const driverRoute = data.filter((driverRoute) => driverRoute.assignedDriverId === DRIVER_ID);

  const sortedDestinations = driverRoute.sort((a, b) => a.driverRouteIndex - b.driverRouteIndex);
  const destinations = sortedDestinations.map(destination => ({
    lat: parseFloat(destination.customerSite.latitude),
    lng: parseFloat(destination.customerSite.longitude),
    title: destination.customerSite.name,
  }));

  return (
    <main className="flex flex-col items-center justify-center p-4 text-black" style={{ height: '800px' }}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
        <RoutesMap destinations={destinations} />
      </APIProvider>
    </main>
  );
};
