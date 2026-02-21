import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TripService } from '../services/trip.service';
import { I18nService } from '../services/i18n.service';
import { TimezoneService } from '../services/timezone.service';
import { TripStatusBadgeComponent } from '../components/trip-status-badge.component';
import { TripDetailsSkeletonComponent } from '../components/trip-details-skeleton.component';
import { ErrorMessageComponent } from '../components/error-message.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { formatLocalDateTime, formatDuration } from '@common/utils/time';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TripStatusBadgeComponent,
    TripDetailsSkeletonComponent,
    ErrorMessageComponent,
    TranslatePipe
  ],
  template: `
    <div>
      <h2 class="page-title">{{ 'detail.title' | t }}</h2>

      @if (tripService.error()) {
        <app-error-message [message]="tripService.error()!" />
      } @else if (tripService.loading()) {
        <app-trip-details-skeleton />
      } @else if (trip) {
        <div class="card">
          <div class="detail-grid">
            <div class="detail-item">
              <label>{{ 'form.origin' | t }}</label>
              <span>{{ trip.origin }}</span>
            </div>
            <div class="detail-item">
              <label>{{ 'form.destination' | t }}</label>
              <span>{{ trip.destination }}</span>
            </div>
            <div class="detail-item">
              <label>{{ 'form.departureTime' | t }}</label>
              <span>{{ formatLocalDateTime(trip.departureTime, timezoneService.timezone()) }}</span>
            </div>
            <div class="detail-item">
              <label>{{ 'form.arrivalTime' | t }}</label>
              <span>
                {{ trip.arrivalTime ? formatLocalDateTime(trip.arrivalTime, timezoneService.timezone()) : '—' }}
              </span>
            </div>
            <div class="detail-item">
              <label>{{ 'form.status' | t }}</label>
              <app-trip-status-badge [status]="trip.status" />
            </div>
            <div class="detail-item">
              <label>{{ 'table.duration' | t }}</label>
              <span>
                {{ trip.arrivalTime ? formatDuration(trip.departureTime, trip.arrivalTime) : '—' }}
              </span>
            </div>
            <div class="detail-item">
              <label>{{ 'form.driver' | t }}</label>
              <span>{{ trip.driver }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-1 mt-2">
          <button class="btn btn-primary" [routerLink]="['/trips', trip.id, 'edit']">
            {{ 'action.edit' | t }}
          </button>
          <button
            class="btn btn-danger"
            [disabled]="trip.status === 'cancelled'"
            (click)="handleCancel(trip.id)"
          >
            {{ 'action.cancel' | t }}
          </button>
          <button class="btn btn-secondary" routerLink="/trips">
            {{ 'action.back' | t }}
          </button>
        </div>
      }
    </div>
  `
})
export class TripDetailsComponent implements OnInit {
  formatLocalDateTime = formatLocalDateTime;
  formatDuration = formatDuration;

  get trip() {
    return this.tripService.currentTrip();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public tripService: TripService,
    private i18n: I18nService,
    public timezoneService: TimezoneService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.tripService.fetchTrip(id);
    }
  }

  async handleCancel(id: number) {
    if (confirm(this.i18n.t('trips.cancelConfirm'))) {
      try {
        await this.tripService.cancelTrip(id);
        this.router.navigate(['/trips']);
      } catch (error) {
        console.error('Failed to cancel trip:', error);
      }
    }
  }
}
