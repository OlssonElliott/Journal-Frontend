import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { JournalEntry } from '../../models/JournalEntry';
import { AuthService } from '../../auth/auth-service';
import { JournalService } from '../journal-service/journal-service';

type EmotionStat = {
  emotionalState: string;
  count: number;
  percentage: number;
};

@Component({
  selector: 'app-journal-notes',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './journal-notes.html',
  styleUrl: './journal-notes.css',
})
export class JournalNotes {
  loading = false;
  error = '';
  emotionalState = '';
  journalEntry = '';
  JournalsList: JournalEntry[] = [];
  filteredEntries: JournalEntry[] = [];
  filterStart = '';
  filterEnd = '';
  stats: EmotionStat[] = [];

  constructor(
    private journalService: JournalService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async submitForm() {
    if (!this.emotionalState || !this.journalEntry) {
      this.error = 'Fyll i alla fält innan du sparar!';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      const now = new Date();
      const entry = await this.journalService.createEntry({
        title: `Journal - ${now.toLocaleDateString('sv-SE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`,
        content: this.journalEntry.trim(),
        emotionalState: this.emotionalState,
      });
      this.JournalsList = [...this.JournalsList, entry];
      this.journalEntry = '';
      this.emotionalState = '';
    } catch (err) {
      this.error = 'Kunde inte spara journalinlägget.';
    } finally {
      this.loading = false;
      this.updateFilteredEntries();
    }
  }

  async ngOnInit() {
    this.loading = true;
    try {
      this.JournalsList = await this.journalService.loadJournalEntries();
    } catch (err) {
      this.error = 'Kunde inte hämta journaler.';
    } finally {
      this.loading = false;
      this.updateFilteredEntries();
    }
  }

  applyDateFilter() {
    this.updateFilteredEntries();
  }

  clearFilter() {
    this.filterStart = '';
    this.filterEnd = '';
    this.updateFilteredEntries();
  }

  async logout() {
    this.auth.logout();
    this.journalService.clearEntries();
    this.JournalsList = [];
    this.updateFilteredEntries();
    await this.router.navigate(['/login']);
  }

  // Håller den filtrerade listan och statistiken i synk när data eller filter ändras.
  private updateFilteredEntries() {
    const start = this.filterStart ? new Date(this.filterStart) : undefined;
    const end = this.filterEnd ? new Date(this.filterEnd) : undefined;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    this.filteredEntries = this.JournalsList.filter((entry) => {
      const created = entry.createdAt;
      if (start && created < start) return false;
      if (end && created > end) return false;
      return true;
    });

    this.stats = this.calculateStats(this.filteredEntries);
    this.cdr.markForCheck();
  }

  // Räknar hur stor andel varje känslotagg står för i den filtrerade listan.
  // Denna uträkning tog jag hjälp av ChatGPT för att få till. Jag förstod inte hur jag skulle få ihop procentomvandlingen osv själv.
  private calculateStats(entries: JournalEntry[]): EmotionStat[] {
    if (!entries.length) return [];

    const counts = new Map<string, number>();
    for (const entry of entries) {
      const key = entry.emotionalState ?? 'Okänd';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const total = entries.length;
    return Array.from(counts.entries())
      .map(([emotionalState, count]) => ({
        emotionalState,
        count,
        percentage: Math.round((count / total) * 10000) / 100,
      }))
      .sort((a, b) => b.count - a.count);
  }

  refreshEntry(updated: JournalEntry) {
    this.journalService.updateEntry(updated);
    this.JournalsList = this.journalService.getEntries();
    this.updateFilteredEntries();
  }
}
