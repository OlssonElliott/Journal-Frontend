import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { JournalEntry } from '../../models/JournalEntry';
import { AuthService } from '../../auth/auth-service';
import { JournalService } from '../journal-service/journal-service';

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

  constructor(
    private journalService: JournalService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async submitForm() {
    // validerar inputfält, sedan anropar journalService.
    if (!this.emotionalState || !this.journalEntry) {
      this.error = 'Fyll i alla fält innan du sparar!';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      const entry = await this.journalService.createEntry({
        title: `Journal - ${new Date().toLocaleDateString()}`,
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

    this.cdr.markForCheck();
  }
}
