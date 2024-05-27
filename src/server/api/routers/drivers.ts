import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { drivers } from "~/server/db/schema";

export const driverRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => (
      ctx.db.query.drivers.findMany({
        orderBy: (drivers, { asc }) => [asc(drivers.name)]
      })
    )),
    
  get: publicProcedure
    .input(z.object({ driverId: z.number() }))
    .query(({ ctx, input }) => (
      ctx.db.query.drivers.findFirst({
        where: eq(drivers.id, input.driverId),
        with: {
          trips: true
        }
      })
    ))
});