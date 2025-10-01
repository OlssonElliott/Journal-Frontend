import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JournalEntry } from '../../models/JournalEntry';
import { AuthService } from '../../auth/auth-service';
import { JournalService } from '../journal-service/journal-service';
import { CommonModule } from '@angular/common';

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

  constructor(
    route: ActivatedRoute,
    private journalService: JournalService,
    private auth: AuthService,
    private router: Router,
  ) {
    const id = route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound = true;
      return;
    }

    this.journalEntry = this.journalService.getEntryById(id);
    this.notFound = !this.journalEntry;
  }

  async logout() {
    this.auth.logout();
    this.journalService.clearEntries();
    await this.router.navigate(['/login']);
  }
}
