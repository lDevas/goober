import { TRPCError } from "@trpc/server";
import { and, eq, isNull, or } from "drizzle-orm";
import type { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { canceledPendingTrips, drivers, riders, trips } from "~/server/db/schema";
import type * as schema from "~/server/db/schema";

const TRIP_FIXED_COST = 10;
const TRIP_METER_COST = 0.0015

const getDriverForTrip = async (db: VercelPgDatabase<typeof schema>, tripId: number | null) => {
  let availableDrivers = await db.select({ id: drivers.id })
    .from(drivers)
    .leftJoin(trips, and(eq(drivers.id, trips.driverId), or(eq(trips.status, 'pending'), eq(trips.status, 'in progress'))))
    .where(
      and(
        eq(drivers.available, true),
        isNull(trips.id)
      )
    );

  if (tripId) {
    const driversThatCanceled = await db.select()
      .from(canceledPendingTrips)
      .where(eq(canceledPendingTrips.tripId, tripId));

    availableDrivers = availableDrivers.filter(
      (driver) => !driversThatCanceled.find((canceled) => canceled.driverId === driver.id));
  }

  if (availableDrivers.length === 0) {
    return null;
  }

  const driver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)]!.id;
  return driver;
}

const requestTripInput = z.object({
  riderId: z.number(),
  originLat: z.number(),
  originLng: z.number(),
  destinationLat: z.number(),
  destinationLng: z.number(),
  cost: z.number(),
});

export const tripRouter = createTRPCRouter({
  getTripCost: publicProcedure
    .input(z.object({ distance: z.number() }))
    .output(z.number())
    .query(({ input }) => (
      input.distance * TRIP_METER_COST + TRIP_FIXED_COST
    )),

  getRiderCurrentTrip: publicProcedure
    .input(z.object({ riderId: z.number() }))
    .query(({ ctx, input }) => (
      ctx.db.query.trips.findFirst({
        where: and(
          eq(trips.riderId, input.riderId),
          or(eq(trips.status, 'pending'), eq(trips.status, 'in progress'))
        )
      })
    )),

  getDriverCurrentTrip: publicProcedure
    .input(z.object({ driverId: z.number() }))
    .query(({ ctx, input }) => (
      ctx.db.query.trips.findFirst({
        where: and(
          eq(trips.driverId, input.driverId),
          or(eq(trips.status, 'pending'), eq(trips.status, 'in progress'))
        )
      })
    )),
  
  driverAcceptRide: publicProcedure
    .input(z.object({ tripId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(trips).set({ status: 'in progress' }).where(eq(trips.id, input.tripId));
    }),

  driverCancelRide: publicProcedure
    .input(z.object({ tripId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const trip = await ctx.db.query.trips.findFirst({ where: eq(trips.id, input.tripId )});
      await ctx.db.insert(canceledPendingTrips).values({ tripId: input.tripId, driverId: trip?.driverId })

      const newDriverID = await getDriverForTrip(ctx.db, input.tripId);

      if (newDriverID) {
        await ctx.db.update(trips).set({ driverId: newDriverID }).where(eq(trips.id, input.tripId));
      } else {
        await ctx.db.update(trips).set({ driverId: null, status: 'no driver available' }).where(eq(trips.id, input.tripId));
      }
    }),

  driverCompleteRide: publicProcedure
    .input(z.object({ tripId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(trips).set({ status: 'complete' }).where(eq(trips.id, input.tripId));
    }),

  riderCancelRide: publicProcedure
    .input(z.object({ tripId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(trips).set({ status: 'canceled by rider' }).where(eq(trips.id, input.tripId));
    }),

  requestTrip: publicProcedure
    .input(requestTripInput)
    .mutation(async ({ ctx, input }) => {
      const rider = await ctx.db.query.riders.findFirst({
        where: eq(riders.id, input.riderId),
      })

      if (!rider) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: "Rider not found" });
      }

      const newDriverID = await getDriverForTrip(ctx.db, null);
      if (newDriverID) {
        await ctx.db.insert(trips).values({ ...input, driverId: newDriverID });
      } else {
        await ctx.db.insert(trips).values({ ...input, status: 'no driver available', driverId: null });
      }
    }),
});
