import { Component, inject, input } from '@angular/core';
import { Note } from '../../models/note';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-note-card',
  imports: [],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.css',
})
export class NoteCardComponent {
  note = input<Note>();
  noteService = inject(NoteService);

  updateTitle(id: string | undefined, title: Event): void {
    const newTitle = title.target as HTMLInputElement;
    if (!id) return;
    this.noteService.updateTitle(id, newTitle.value);
  }

  updateMarked(id: string | undefined): void {
    if (!id) return;
    this.noteService.updateMarked(id);
  }
}
