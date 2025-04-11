import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { NoteService } from './note.service';
import { Note } from '../models/note';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';

describe('NoteService', () => {
  let service: NoteService; // aqui guardamos una instancia del servicio
  let httpMock: HttpTestingController; // aqui guardamos el controlador para simular http

  //Creamos algunas notas de ejemplo para usar en los tests
  const mockNotes: Note[] = [
    { id: '1', title: 'Nota 1', marked: false },
    { id: '2', title: 'Nota 2', marked: false },
  ];

  // Creamos una clase para simular el servicio
  // Se extiende de la clase real
  // Se sobreescribe el metodo getNotes
  // Se sobreescribe el metodo createNote
  // Se sobreescribe el metodo updateTitle
  // Se sobreescribe el metodo updateMarked
  @Injectable()
  class MockNoteService extends NoteService {
    override notes: Note[] = [...mockNotes];
  }

  // Esto se ejecuta antes de cada prueba
  beforeEach(() => {
    // Configuramos un modulo de pruebas que tenga lo necesario para testear servicios http
    TestBed.configureTestingModule({
      providers: [
        { provide: NoteService, useClass: MockNoteService }, // Usamos nuestro mock personalizado
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ], // agrega el servicio a testear
    });

    // Obtenemos una instancia del servicio y del controlador http
    service = TestBed.inject(NoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Se ejecuta depues de cada prueba
  afterEach(() => {
    // Verifica que no queden peticiones sin responder
    httpMock.verify();
  });

  //
  //
  // Prueba de GET
  //
  //
  it('Deberia hacer GET al obtener notas', () => {
    // LLamamos al metodo getNotes() y esperamos que nos devuelva una respuesta simulada
    service.getNotes().subscribe(async (notes) => {
      expect(mockNotes).toEqual(await notes);
    });

    //  Simulamos una peticion http tipo GET
    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('GET'); // Verificamos que el metodo se GET

    req.flush(mockNotes);
  });
  //
  //
  // Prueba de POST
  //
  //
  it('Deberia hacer POST al crear una nota', async () => {
    // Creamos una nota
    const newNote: Note = { id: '3', title: 'Nota 3', marked: false };

    // Simulamos una peticon http POST
    const notePromise = firstValueFrom(service.createNote(newNote));

    // Simulamos una peticion http tipo POST
    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('POST'); // Verificamos que el metodo se POST
    expect(req.request.body).toEqual(newNote); // Verificamos el body
    req.flush(newNote);

    expect(await notePromise).toEqual(newNote);
  });
  //
  //
  // Prueba de PUT
  //
  //
  it('Deberia hacer PUT al actualizar un title de note', async () => {
    const noteUpdate: Note = { ...mockNotes[0], title: 'Nota 1 actualizada' };

    const notePromise = firstValueFrom(
      service.updateTitle(noteUpdate.id, noteUpdate.title)
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/${noteUpdate.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ title: noteUpdate.title });
    req.flush(noteUpdate);

    expect((await notePromise).title).toEqual(noteUpdate.title);
  });
  //
  //
  // Prueba de PUT
  //
  //
  it('Deberia hacer PUT al actualizar un marked de note', async () => {
    const note = {...mockNotes[0], marked: true};
    const notePromise = firstValueFrom(service.updateMarked(note.id));

    const req = httpMock.expectOne(`${environment.apiUrl}/${note.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ marked: true });
    req.flush(note);

    expect((await notePromise).marked).toBe(note.marked)
  });
});
