import { inject, Injectable } from '@angular/core';
import { Note } from '../models/note';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  notes: Note[];

  constructor() {
    this.notes = [];
  }

  getNotes(): Observable<Note[] | undefined> {
    return this.http.get<Note[]>(this.baseUrl);
  }

  createNote(note: Note): Observable<Note | undefined> {
    return this.http.post<Note>(this.baseUrl, note);
  }

  updateTitle(id: string, title: string): Observable<Note> {
    const note: Note | undefined = this.notes.find((note) => note.id === id);
    if (!note) return throwError( () => new Error('No se encontro la nota con el id ' + id));
   return this.http.put<Note>(`${this.baseUrl}/${id}`,{ title });
  }

  updateMarked(id: string): Observable<Note> {
    const note: Note = this.notes.find((note) => note.id === id)!;
    if (!note) return throwError(
      () => new Error('No se encontro la nota con el id ' + id)
    );
    return this.http.put<Note>(`${this.baseUrl}/${id}`,{ marked: !note.marked });
  }
}
