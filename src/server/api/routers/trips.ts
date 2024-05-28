import { TRPCError } from "@trpc/server";
import { and, eq, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { drivers, riders, trips } from "~/server/db/schema";

const TRIP_FIXED_COST = 10;
const TRIP_METER_COST = 0.0015

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

  requestTrip: publicProcedure
    .input(requestTripInput)
    .mutation(async ({ ctx, input }) => {
      const rider = await ctx.db.query.riders.findFirst({
        where: eq(riders.id, input.riderId),
      })

      if (!rider) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: "Rider not found" });
      }

      const availableDrivers = await ctx.db.select()
        .from(drivers)
        .leftJoin(trips, and(eq(drivers.id, trips.driverId), or(eq(trips.status, 'pending'), eq(trips.status, 'in progress'))))
        .where(
          and(
            eq(drivers.available, true),
            isNull(trips.id)
          )
        );

      if (availableDrivers.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: "No Driver is available, try again later..." });
      }

      const driver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)]?.driver;
      
      await ctx.db.insert(trips).values({ driverId: driver?.id, ...input });
    }),
});
