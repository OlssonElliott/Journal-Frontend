import { Routes } from '@angular/router';
import { JournalDetailComponent } from './components/journal/journal-detail-component/journal-detail-component';
import { Login } from './components/login/login';
import { loginGuardGuard } from './components/guard/login-guard-guard';
import { JournalNotes } from './components/journal/journal-notes/journal-notes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'journal', canActivate: [loginGuardGuard], component: JournalNotes },
  { path: 'journal/:id', canActivate: [loginGuardGuard], component: JournalDetailComponent },
];
