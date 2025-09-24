import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalNotes } from './journal-notes';

describe('JournalNotes', () => {
  let component: JournalNotes;
  let fixture: ComponentFixture<JournalNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalNotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalNotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
