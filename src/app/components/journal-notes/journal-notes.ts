import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JournalEntry } from '../models/JournalEntry';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JournalService } from '../journal-service/journal-service';

@Component({
  selector: 'app-journal-notes',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './journal-notes.html',
  styleUrl: './journal-notes.css',
})
export class JournalNotes {
  emotionalState = '';
  journalEntry = '';

  tempJournalList: JournalEntry[] = [];

  submitForm(): void {
    this.journalService.createEntry({
      title: `Inlägg nr: ${this.tempJournalList.length + 1}`,
      content: this.journalEntry,
      emotionalState: this.emotionalState,
    });
    this.tempJournalList = this.journalService.getEntries();
    this.journalEntry = '';
    this.emotionalState = '';
  }

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.tempJournalList = this.journalService.getEntries();
  }
}
