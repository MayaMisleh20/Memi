import { Injectable } from '@angular/core';

export interface LeaderboardEntry {
  player: string;
  algorithm: string;
  avgWait: number;
  avgTurnaround: number;
  cpuUtilization: number;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private storageKey = 'leaderboard_entries';
  private entries: LeaderboardEntry[] = [];

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Add a new leaderboard entry and persist it
   */
  addEntry(entry: LeaderboardEntry): void {
    this.entries.unshift(entry); // Add to top
    this.saveToStorage();
  }

  /**
   * Get all leaderboard entries
   */
  getEntries(): LeaderboardEntry[] {
    return this.entries;
  }

  /**
   * Clear all entries (useful for reset or testing)
   */
  clearEntries(): void {
    this.entries = [];
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Save entries to localStorage
   */
  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
  }

  /**
   * Load entries from localStorage (if any)
   */
  private loadFromStorage(): void {
    const saved = localStorage.getItem(this.storageKey);
    this.entries = saved ? JSON.parse(saved) : [];
  }
}
