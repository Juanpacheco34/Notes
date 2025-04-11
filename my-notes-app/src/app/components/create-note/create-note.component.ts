import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-create-note',
  imports: [FormsModule],
  templateUrl: './create-note.component.html',
  styleUrl: './create-note.component.css',
})
export class CreateNoteComponent {
  title = '';
  disable = input<boolean>(false);
  noteService = inject(NoteService);

  createId(): string {
    return '' + (parseInt(this.noteService.notes.at(-1)?.id || '0') + 1);
  }

  submit(): void {
    if (!this.title) return;
    const newNote: Note = {
      id: this.createId(),
      title: this.title,
      marked: false,
    };

    this.noteService.createNote(newNote).subscribe({
      next: (reponse) => {
        console.log(reponse);
        this.title = '';
        this.noteService.getNotes().subscribe({
          next: (response) => {
            this.noteService.notes = response || [];
          },
          error: (error) => console.log(error), 
        });
      },
      error: (error) => console.log(error),
    });
  }
}
