import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JournalEntry } from '../models/JournalEntry';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-journal-notes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './journal-notes.html',
  styleUrl: './journal-notes.css',
})
export class JournalNotes {
  emotionalState = '';
  journalEntry = '';
  timeEntry = '';

  postJournal = '';

  tempJournalList: JournalEntry[] = [];

  submitForm() {
    const newJournal: JournalEntry = {
      id: this.tempJournalList.length + 1,
      title: 'Inlägg nr: ' + this.tempJournalList.length + 1,
      content: this.journalEntry,
      emotionalState: this.emotionalState,
      createdAt: new Date(),
    };

    this.tempJournalList.push(newJournal);
  }
}
