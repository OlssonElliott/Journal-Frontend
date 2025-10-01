import { Injectable } from '@angular/core';
import { JournalEntry } from '../../models/JournalEntry';
import { AuthService } from '../../auth/auth-service';

@Injectable({ providedIn: 'root' })
export class JournalService {
  private baseUrl = import.meta.env[`VITE_API_BASE_URL`] ?? 'http://localhost:8080';
  private journalEntries: JournalEntry[] = [];

  constructor(private auth: AuthService) {}

  async loadJournalEntries(): Promise<JournalEntry[]> {
    const userId = this.auth.getUserId();
    if (!userId) throw new Error('Ingen användare inloggad.');
    const res = await fetch(`${this.baseUrl}/api/v1/journals/getByUserId?userId=${userId}`, {
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Kunde inte hämta journaler');
    }

    this.journalEntries = ((await res.json()) as any[]).map((raw) => this.normalize(raw));
    return this.journalEntries;
  }

  async createEntry(data: Pick<JournalEntry, 'title' | 'content' | 'emotionalState'>) {
    const userId = this.auth.getUserId();
    if (!userId) throw new Error('Ingen användare inloggad.');

    const payload = { ...data, userId };
    const res = await fetch(`${this.baseUrl}/api/v1/journals/create`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Kunde inte spara journal');
    const entry = this.normalize(await res.json());
    this.journalEntries = [...this.journalEntries, entry];
    return entry;
  }

  getEntries(): JournalEntry[] {
    return [...this.journalEntries];
  }

  getEntryById(id: string): JournalEntry | undefined {
    return this.journalEntries.find((entry) => entry.id === id);
  }

  clearEntries() {
    this.journalEntries = [];
  }

  private normalize(raw: any): JournalEntry {
    return {
      id: String(raw.id ?? raw._id),
      userId: String(raw.userId),
      title: raw.title ?? '',
      content: raw.content ?? '',
      emotionalState: raw.emotionalState ?? '',
      createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    };
  }
}
