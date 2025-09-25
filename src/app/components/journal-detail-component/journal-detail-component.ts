import { Component } from '@angular/core';
import { JournalEntry } from '../models/JournalEntry';
import { ActivatedRoute } from '@angular/router';
import { JournalService } from '../journal-service/journal-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-journal-detail-component',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './journal-detail-component.html',
  styleUrl: './journal-detail-component.css',
})
export class JournalDetailComponent {
  journalEntry?: JournalEntry;
  notFound = false;

  //visar endast detaljsida om id finns
  constructor(route: ActivatedRoute, journalService: JournalService) {
    const id = Number(route.snapshot.paramMap.get('id'));
    if (Number.isNaN(id)) {
      this.notFound = true;
      return;
    }

    this.journalEntry = journalService.getEntryById(id);
    this.notFound = !this.journalEntry;
  }
}
