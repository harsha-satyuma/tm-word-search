import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { admins, gameSettings } from "../shared/schema";
import * as crypto from "crypto";

const sqlite = new Database("./database.db");
const db = drizzle(sqlite);

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function seedAdmins() {
  console.log("Seeding admin users...");

  const adminUsers = [
    { username: "admin", password: "admin123" },
    { username: "superadmin", password: "super123" },
  ];

  try {
    for (const admin of adminUsers) {
      const hashedPassword = hashPassword(admin.password);

      await db
        .insert(admins)
        .values({
          username: admin.username,
          password: hashedPassword,
        })
        .onConflictDoNothing();

      console.log(`✓ Added admin user: ${admin.username}`);
    }

    console.log("\n✅ Admin users seeded successfully!");
    console.log("\nDefault admin credentials:");
    console.log("1. Username: admin, Password: admin123");
    console.log("2. Username: superadmin, Password: super123");
    console.log("\n⚠️  Please change these passwords in production!");

    // Seed default game settings
    console.log("\nSeeding game settings...");

    await db
      .insert(gameSettings)
      .values({
        settingKey: "timerDuration",
        settingValue: "10",
      })
      .onConflictDoNothing();

    console.log("✓ Added default timer duration: 10 seconds");
    console.log("\n✅ Game settings seeded successfully!");
    console.log(
      "Note: Timer is set to 10 seconds for testing. Change in Admin Panel.",
    );
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

seedAdmins();
