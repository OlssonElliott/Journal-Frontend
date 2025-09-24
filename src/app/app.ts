import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { JournalNotes } from './components/journal-notes/journal-notes';

@Component({
  selector: 'app-root',
  imports: [Header, JournalNotes],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

}
