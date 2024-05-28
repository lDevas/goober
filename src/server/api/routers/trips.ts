import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { riders, trips } from "~/server/db/schema";

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

  getCurrentTrip: publicProcedure
    .input(z.object({ riderId: z.number() }))
    .query(({ ctx, input }) => (
      ctx.db.query.trips.findFirst({
        where: and(
          eq(trips.riderId, input.riderId),
          eq(trips.status, 'pending')
        )
      })
    )),

  requestTrip: publicProcedure
    .input(requestTripInput)
    .mutation(async ({ ctx, input }) => {
      const rider = await ctx.db.query.riders.findFirst({
        where: eq(riders.id, input.riderId),
      });

      if (!rider) {
        throw new Error("Rider not found");
      }

      await ctx.db.insert(trips).values(input);
    }),
});
