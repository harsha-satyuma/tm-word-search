import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, desc, and } from "drizzle-orm";
import {
  admins,
  players,
  gameResults,
  gameSettings,
  type Admin,
  type Player,
  type GameResult,
  type InsertAdmin,
  type InsertPlayer,
  type InsertGameResult,
  type LeaderboardEntry,
  type GameSetting,
  type InsertGameSetting,
} from "@shared/schema";
import * as crypto from "crypto";

const sqlite = new Database("./database.db");
const db = drizzle(sqlite);

export interface IStorage {
  // Admin methods
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  verifyAdminPassword(username: string, password: string): Promise<boolean>;

  // Player methods
  getPlayerByEmployeeId(employeeId: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  hasPlayerCompletedGame(employeeId: string): Promise<boolean>;

  // Game result methods
  createGameResult(result: InsertGameResult): Promise<GameResult>;
  getLeaderboard(): Promise<LeaderboardEntry[]>;
  getPlayerGameResult(playerId: number): Promise<GameResult | undefined>;

  // Game settings methods
  getGameSetting(key: string): Promise<GameSetting | undefined>;
  upsertGameSetting(key: string, value: string): Promise<GameSetting>;
  getAllGameSettings(): Promise<GameSetting[]>;
}

export class SqliteStorage implements IStorage {
  // Admin methods
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const result = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);
    return result[0];
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    // Hash password before storing
    const hashedPassword = this.hashPassword(admin.password);
    const result = await db
      .insert(admins)
      .values({
        username: admin.username,
        password: hashedPassword,
      })
      .returning();
    return result[0];
  }

  async verifyAdminPassword(
    username: string,
    password: string,
  ): Promise<boolean> {
    const admin = await this.getAdminByUsername(username);
    if (!admin) return false;

    const hashedPassword = this.hashPassword(password);
    return admin.password === hashedPassword;
  }

  // Player methods
  async getPlayerByEmployeeId(employeeId: string): Promise<Player | undefined> {
    const result = await db
      .select()
      .from(players)
      .where(eq(players.employeeId, employeeId))
      .limit(1);
    return result[0];
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const result = await db
      .insert(players)
      .values({
        employeeId: player.employeeId,
        name: player.name,
      })
      .returning();
    return result[0];
  }

  async hasPlayerCompletedGame(employeeId: string): Promise<boolean> {
    const player = await this.getPlayerByEmployeeId(employeeId);
    if (!player) return false;

    const result = await db
      .select()
      .from(gameResults)
      .where(eq(gameResults.playerId, player.id))
      .limit(1);

    return result.length > 0;
  }

  // Game result methods
  async createGameResult(result: InsertGameResult): Promise<GameResult> {
    const inserted = await db
      .insert(gameResults)
      .values({
        playerId: result.playerId,
        timeTaken: result.timeTaken,
        wordsFound: result.wordsFound,
        totalWords: result.totalWords,
        completed: result.completed,
      })
      .returning();
    return inserted[0];
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const results = await db
      .select({
        id: gameResults.id,
        playerId: gameResults.playerId,
        timeTaken: gameResults.timeTaken,
        wordsFound: gameResults.wordsFound,
        totalWords: gameResults.totalWords,
        completed: gameResults.completed,
        completedAt: gameResults.completedAt,
        employeeId: players.employeeId,
        name: players.name,
      })
      .from(gameResults)
      .innerJoin(players, eq(gameResults.playerId, players.id))
      .orderBy(
        desc(gameResults.completed),
        desc(gameResults.wordsFound),
        gameResults.timeTaken,
      )
      .all();

    return results.map((result, index) => ({
      id: result.id,
      employeeId: result.employeeId,
      name: result.name,
      timeTaken: result.timeTaken,
      wordsFound: result.wordsFound,
      totalWords: result.totalWords,
      completed: result.completed,
      completedAt: new Date(result.completedAt as any),
      rank: index + 1,
    }));
  }

  async getPlayerGameResult(playerId: number): Promise<GameResult | undefined> {
    const result = await db
      .select()
      .from(gameResults)
      .where(eq(gameResults.playerId, playerId))
      .limit(1);
    return result[0];
  }

  // Game settings methods
  async getGameSetting(key: string): Promise<GameSetting | undefined> {
    const result = await db
      .select()
      .from(gameSettings)
      .where(eq(gameSettings.settingKey, key))
      .limit(1);
    return result[0];
  }

  async upsertGameSetting(key: string, value: string): Promise<GameSetting> {
    // Try to update first
    const existing = await this.getGameSetting(key);

    if (existing) {
      const updated = await db
        .update(gameSettings)
        .set({
          settingValue: value,
          updatedAt: new Date(),
        })
        .where(eq(gameSettings.settingKey, key))
        .returning();
      return updated[0];
    } else {
      // Insert new setting
      const inserted = await db
        .insert(gameSettings)
        .values({
          settingKey: key,
          settingValue: value,
        })
        .returning();
      return inserted[0];
    }
  }

  async getAllGameSettings(): Promise<GameSetting[]> {
    return await db.select().from(gameSettings).all();
  }

  // Utility method for password hashing
  private hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
  }
}

export const storage = new SqliteStorage();
