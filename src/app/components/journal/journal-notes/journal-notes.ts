import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JournalEntry } from '../../models/JournalEntry';
import { AuthService } from '../../auth/auth-service';
import { JournalService } from '../journal-service/journal-service';

@Component({
  selector: 'app-journal-notes',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './journal-notes.html',
  styleUrl: './journal-notes.css',
})
export class JournalNotes {
  loading = false;
  error = '';
  emotionalState = '';
  journalEntry = '';
  JournalsList: JournalEntry[] = [];

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
    } catch (err) {
      this.error = 'Kunde inte spara journalinlägget.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
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
      this.cdr.markForCheck();
    }
  }

  async logout() {
    this.auth.logout();
    this.journalService.clearEntries();
    this.JournalsList = [];
    await this.router.navigate(['/login']);
  }
}
