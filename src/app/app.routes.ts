import { MicComponent } from './mic/mic.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'mic', component: MicComponent },
  { path: '', redirectTo: '/mic', pathMatch: 'full' }
];
