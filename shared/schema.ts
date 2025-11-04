import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users table
export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// Players table
export const players = sqliteTable("players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: text("employee_id").notNull().unique(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const insertPlayerSchema = createInsertSchema(players, {
  employeeId: z.string().min(1, "Employee ID is required"),
  name: z.string().min(1, "Name is required"),
}).pick({
  employeeId: true,
  name: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

// Game results table
export const gameResults = sqliteTable("game_results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id),
  timeTaken: integer("time_taken").notNull(), // in seconds
  wordsFound: integer("words_found").notNull(),
  totalWords: integer("total_words").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  completedAt: integer("completed_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const insertGameResultSchema = createInsertSchema(gameResults, {
  playerId: z.number(),
  timeTaken: z.number().min(0),
  wordsFound: z.number().min(0),
  totalWords: z.number().min(1),
  completed: z.boolean(),
}).pick({
  playerId: true,
  timeTaken: true,
  wordsFound: true,
  totalWords: true,
  completed: true,
});

export type InsertGameResult = z.infer<typeof insertGameResultSchema>;
export type GameResult = typeof gameResults.$inferSelect;

// Leaderboard view type
export type LeaderboardEntry = {
  id: number;
  employeeId: string;
  name: string;
  timeTaken: number;
  wordsFound: number;
  totalWords: number;
  completed: boolean;
  completedAt: Date;
  rank: number;
};
