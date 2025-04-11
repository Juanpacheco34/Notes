import { Component, inject, OnInit } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { NoteCardComponent } from '../../components/note-card/note-card.component';
import { CreateNoteComponent } from '../../components/create-note/create-note.component';

@Component({
  selector: 'app-notes',
  imports: [NoteCardComponent, CreateNoteComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
})
export class NotesComponent implements OnInit {
  noteService = inject(NoteService);
  hasError: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.noteService.getNotes().subscribe({
      next: (response) => {
        this.noteService.notes = response || [];
        this.hasError = false;
      },
      error: (error) => {
        console.log(error);
        this.hasError = true;
        this.errorMessage = error.message;
      },
    });
  }
}
