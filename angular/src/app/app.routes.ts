import { Routes } from '@angular/router';
import { TripsListComponent } from './views/trips-list.component';
import { TripDetailsComponent } from './views/trip-details.component';
import { TripFormComponent } from './views/trip-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/trips', pathMatch: 'full' },
  { path: 'trips', component: TripsListComponent },
  { path: 'trips/new', component: TripFormComponent },
  { path: 'trips/:id/edit', component: TripFormComponent },
  { path: 'trips/:id', component: TripDetailsComponent },
  { path: '**', redirectTo: '/trips' }
];
