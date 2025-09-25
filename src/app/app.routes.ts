import { Routes } from '@angular/router';
import { JournalService } from './components/journal-service/journal-service';
import { JournalNotes } from './components/journal-notes/journal-notes';
import { JournalDetailComponent } from './components/journal-detail-component/journal-detail-component';

export const routes: Routes = [
  { path: '', component: JournalNotes },
  { path: 'journal/:id', component: JournalDetailComponent },
];
