import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());

  // Player routes
  app.post("/api/players/register", async (req, res) => {
    try {
      const { employeeId, name } = req.body;

      if (!employeeId || !name) {
        return res
          .status(400)
          .json({ error: "Employee ID and name are required" });
      }

      // Check if player already completed the game
      const hasCompleted = await storage.hasPlayerCompletedGame(employeeId);
      if (hasCompleted) {
        return res.status(409).json({
          error:
            "You have already completed this game. Only one attempt per employee ID is allowed.",
          alreadyCompleted: true,
        });
      }

      // Check if player exists
      let player = await storage.getPlayerByEmployeeId(employeeId);

      if (!player) {
        // Create new player
        player = await storage.createPlayer({ employeeId, name });
      }

      res.json({ player });
    } catch (error) {
      console.error("Error registering player:", error);
      res.status(500).json({ error: "Failed to register player" });
    }
  });

  app.get("/api/players/check/:employeeId", async (req, res) => {
    try {
      const { employeeId } = req.params;
      const hasCompleted = await storage.hasPlayerCompletedGame(employeeId);
      res.json({ hasCompleted });
    } catch (error) {
      console.error("Error checking player:", error);
      res.status(500).json({ error: "Failed to check player status" });
    }
  });

  // Game result routes
  app.post("/api/game-results", async (req, res) => {
    try {
      const { playerId, timeTaken, wordsFound, totalWords, completed } =
        req.body;

      if (
        !playerId ||
        timeTaken === undefined ||
        wordsFound === undefined ||
        totalWords === undefined
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if player already has a result
      const existingResult = await storage.getPlayerGameResult(playerId);
      if (existingResult) {
        return res
          .status(409)
          .json({ error: "Game result already exists for this player" });
      }

      const result = await storage.createGameResult({
        playerId,
        timeTaken,
        wordsFound,
        totalWords,
        completed: completed || false,
      });

      res.json({ result });
    } catch (error) {
      console.error("Error saving game result:", error);
      res.status(500).json({ error: "Failed to save game result" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json({ leaderboard });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Admin routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const isValid = await storage.verifyAdminPassword(username, password);

      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const admin = await storage.getAdminByUsername(username);

      // In production, you'd use proper session management
      res.json({
        success: true,
        admin: {
          id: admin!.id,
          username: admin!.username,
        },
      });
    } catch (error) {
      console.error("Error logging in admin:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
