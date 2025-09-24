import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-journal-notes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './journal-notes.html',
  styleUrl: './journal-notes.css',
})
export class JournalNotes {
  emotionalState = '';
  journalEntry = '';

  postJournal = '';

  submitForm() {
    this.postJournal = `emotionalState:=${this.emotionalState}, journalEntry:=${this.journalEntry}`;
  }
}
