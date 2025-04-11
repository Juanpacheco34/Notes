import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'notes',
    loadComponent: () =>
      import('./pages/notes/notes.component').then((m) => m.NotesComponent),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
