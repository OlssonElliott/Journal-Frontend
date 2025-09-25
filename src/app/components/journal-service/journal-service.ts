import { Component, Injectable } from '@angular/core';
import { JournalEntry } from '../models/JournalEntry';

@Injectable({ providedIn: 'root' })
export class JournalService {
  private journalEntries: JournalEntry[] = [];

  createEntry(data: Pick<JournalEntry, 'title' | 'content' | 'emotionalState'>): JournalEntry {
    const newEntry: JournalEntry = {
      ...data,
      id: this.journalEntries.length ? Math.max(...this.journalEntries.map((e) => e.id)) + 1 : 1,
      createdAt: new Date(),
    };
    this.journalEntries.push(newEntry);
    return newEntry;
  }

  getEntries(): JournalEntry[] {
    return [...this.journalEntries];
  }

  getEntryById(id: number): JournalEntry | undefined {
    return this.journalEntries.find((entry) => entry.id === id);
  }
}
