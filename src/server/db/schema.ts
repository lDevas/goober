// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `goober_${name}`);

export const riders = createTable(
  "rider",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  }
);
export const ridersRelations = relations(riders, ({ many }) => ({
  trips: many(trips),
}));

export const drivers = createTable(
  "driver",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    available: boolean("available").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  }
);
export const driversRelations = relations(drivers, ({ many }) => ({
  trips: many(trips),
}));


export const tripStatus = pgEnum('trip_status', ['pending', 'in progress', 'canceled-by-rider', 'canceled-by-driver', 'completed']);

export const trips = createTable(
  "trip",
  {
    id: serial("id").primaryKey(),
    status: tripStatus('trip_status'),
    riderId: integer('rider_id').notNull(),
    driverId: integer('driver_id'),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  }
);
export const tripsRelations = relations(trips, ({ one }) => ({
  rider: one(riders, {
    fields: [trips.riderId],
    references: [riders.id],
  }),
  driver: one(drivers, {
    fields: [trips.driverId],
    references: [drivers.id],
  }),
}));
