import { storage } from "../server/storage";

const initialWords = [
  { word: "QUALITY", clue: "Standard of excellence", direction: "left-right" as const },
  { word: "TEAMWORK", clue: "Collaborative effort", direction: "left-right" as const },
  { word: "EXCELLENCE", clue: "Outstanding quality", direction: "left-right" as const },
  { word: "PROCESS", clue: "Series of actions", direction: "top-bottom" as const },
  { word: "IMPROVEMENT", clue: "Making something better", direction: "top-bottom" as const },
  { word: "SAFETY", clue: "Protection from harm", direction: "left-right" as const },
  { word: "STANDARD", clue: "Established norm", direction: "top-bottom" as const },
  { word: "FEEDBACK", clue: "Constructive response", direction: "left-right" as const },
  { word: "AUDIT", clue: "Official inspection", direction: "top-bottom" as const },
  { word: "CUSTOMER", clue: "Person who buys", direction: "left-right" as const },
];

async function seedWords() {
  try {
    console.log("Seeding words...");
    
    const existingWords = await storage.getAllWords();
    if (existingWords.length > 0) {
      console.log(`Database already has ${existingWords.length} words. Skipping seed.`);
      return;
    }

    for (const wordData of initialWords) {
      await storage.createWord(wordData);
      console.log(`Added word: ${wordData.word}`);
    }

    console.log("Words seeded successfully!");
  } catch (error) {
    console.error("Error seeding words:", error);
    process.exit(1);
  }
}

seedWords();
