import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { riders } from "~/server/db/schema";

export const riderRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => (
      ctx.db.query.riders.findMany({
        orderBy: (riders, { asc }) => [asc(riders.name)]
      })
    )),

  get: publicProcedure
    .input(z.object({ riderId: z.number() }))
    .query(({ ctx, input }) => (
      ctx.db.query.riders.findFirst({
        where: eq(riders.id, input.riderId),
        with: {
          trips: true
        }
      })
    ))
});