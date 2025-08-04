import { randomUUID } from "crypto";

// Simple placeholder interface for gallery storage
// Currently using static data from gallery-data.ts
export interface IStorage {
  // Gallery-related storage methods would go here
  // For now, we're using static data from gallery-data.ts
}

export class MemStorage implements IStorage {
  constructor() {
    // Using static gallery data for now
  }
}

export const storage = new MemStorage();
