import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripStatusBadgeComponent } from './trip-status-badge.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { formatCompactDateTime, formatDuration, isNextDay } from '@common/utils/time';
import type { Trip } from '@common/models/trip';

@Component({
  selector: 'app-trip-table',
  standalone: true,
  imports: [CommonModule, RouterLink, TripStatusBadgeComponent, TranslatePipe],
  template: `
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>{{ 'table.origin' | t }}</th>
            <th>{{ 'table.destination' | t }}</th>
            <th>{{ 'table.departure' | t }}</th>
            <th>{{ 'table.arrival' | t }}</th>
            <th>{{ 'table.status' | t }}</th>
            <th>{{ 'table.duration' | t }}</th>
            <th>{{ 'table.driver' | t }}</th>
            <th>{{ 'table.actions' | t }}</th>
          </tr>
        </thead>
        <tbody>
          @for (trip of trips; track trip.id) {
            <tr class="table-row-clickable" [routerLink]="['/trips', trip.id]">
              <td>{{ trip.origin }}</td>
              <td>{{ trip.destination }}</td>
              <td class="time-cell">{{ formatCompactDateTime(trip.departureTime, trip.departureTimezone) }}</td>
              <td class="time-cell">
                @if (trip.arrivalTime && trip.arrivalTimezone) {
                  {{ formatCompactDateTime(trip.arrivalTime, trip.arrivalTimezone) }}
                  @if (isNextDay(trip.departureTime, trip.departureTimezone, trip.arrivalTime, trip.arrivalTimezone)) {
                    <span class="next-day">+1</span>
                  }
                } @else {
                  <span class="text-secondary">—</span>
                }
              </td>
              <td><app-trip-status-badge [status]="trip.status" /></td>
              <td class="text-secondary">
                {{ trip.arrivalTime ? formatDuration(trip.departureTime, trip.arrivalTime) : '—' }}
              </td>
              <td>{{ trip.driver }}</td>
              <td>
                <div class="actions">
                  <button
                    class="btn btn-sm"
                    [routerLink]="['/trips', trip.id]"
                    (click)="$event.stopPropagation()"
                  >
                    {{ 'action.view' | t }}
                  </button>
                  <button
                    class="btn btn-sm"
                    [routerLink]="['/trips', trip.id, 'edit']"
                    (click)="$event.stopPropagation()"
                  >
                    {{ 'action.edit' | t }}
                  </button>
                  @if (trip.status !== 'cancelled' && trip.status !== 'arrived') {
                    <button
                      class="btn btn-sm btn-danger"
                      (click)="onCancel(trip.id, $event)"
                    >
                      {{ 'action.cancel' | t }}
                    </button>
                  }
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class TripTableComponent {
  @Input() trips: Trip[] = [];
  @Output() cancel = new EventEmitter<number>();

  formatCompactDateTime = formatCompactDateTime;
  formatDuration = formatDuration;
  isNextDay = isNextDay;

  onCancel(id: number, event: Event) {
    event.stopPropagation();
    this.cancel.emit(id);
  }
}
