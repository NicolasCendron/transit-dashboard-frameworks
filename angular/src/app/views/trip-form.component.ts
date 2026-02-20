import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../services/trip.service';
import { I18nService } from '../services/i18n.service';
import { StatusSelectComponent } from '../components/status-select.component';
import { TripFormSkeletonComponent } from '../components/trip-form-skeleton.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { EUROPEAN_CITIES, timezoneForCity, timezoneAbbr } from '@common/models/cities';
import { tripStatusOptions } from '@common/models/tripStatusOptions';
import { formatDuration } from '@common/utils/time';
import { validateTripForm } from '@common/utils/validation';
import type { TripStatus } from '@common/models/trip';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatusSelectComponent,
    TripFormSkeletonComponent,
    TranslatePipe
  ],
  template: `
    <div>
      <h2 class="page-title">
        {{ isEdit() ? ('form.editTitle' | t) : ('form.createTitle' | t) }}
      </h2>

      @if (isEdit() && tripService.loading()) {
        <app-trip-form-skeleton />
      } @else {
        <form class="card" (ngSubmit)="handleSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ 'form.origin' | t }}</label>
              <select
                class="form-select"
                [class.is-invalid]="errors()['origin']"
                [(ngModel)]="form.origin"
                name="origin"
              >
                <option value="" disabled>—</option>
                @for (city of cities; track city.name) {
                  <option [value]="city.name">
                    {{ city.name }} ({{ timezoneAbbr(city.timezone) }})
                  </option>
                }
              </select>
              @if (errors()['origin']) {
                <p class="form-error">{{ errors()['origin'] }}</p>
              }
            </div>
            <div class="form-group">
              <label class="form-label">{{ 'form.destination' | t }}</label>
              <select
                class="form-select"
                [class.is-invalid]="errors()['destination']"
                [(ngModel)]="form.destination"
                name="destination"
              >
                <option value="" disabled>—</option>
                @for (city of cities; track city.name) {
                  <option [value]="city.name">
                    {{ city.name }} ({{ timezoneAbbr(city.timezone) }})
                  </option>
                }
              </select>
              @if (errors()['destination']) {
                <p class="form-error">{{ errors()['destination'] }}</p>
              }
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                {{ 'form.departureTime' | t }}
                @if (departureTimezone(); as tz) {
                  <span class="form-tz-hint">
                    {{ timezoneAbbr(tz) }}
                  </span>
                }
              </label>
              <input
                type="datetime-local"
                class="form-input"
                [class.is-invalid]="errors()['departureTime']"
                [(ngModel)]="form.departureTime"
                name="departureTime"
              />
              @if (errors()['departureTime']) {
                <p class="form-error">{{ errors()['departureTime'] }}</p>
              }
            </div>
            <div class="form-group">
              <label class="form-label">{{ 'form.status' | t }}</label>
              <app-status-select
                [options]="statusOptions"
                [value]="form.status"
                (valueChange)="updateStatus($event)"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                {{ 'form.arrivalTime' | t }}
                @if (arrivalTimezone(); as tz) {
                  <span class="form-tz-hint">
                    {{ timezoneAbbr(tz) }}
                  </span>
                }
              </label>
              <input
                type="datetime-local"
                class="form-input form-input-disableable"
                [class.is-invalid]="errors()['arrivalTime']"
                [(ngModel)]="form.arrivalTime"
                [disabled]="form.status !== 'arrived'"
                [title]="form.status !== 'arrived' ? ('form.arrivalRequiredWhenArrived' | t) : ''"
                name="arrivalTime"
              />
              @if (errors()['arrivalTime']) {
                <p class="form-error">{{ errors()['arrivalTime'] }}</p>
              }
            </div>
            <div class="form-group">
              <label class="form-label">{{ 'table.duration' | t }}</label>
              <input
                type="text"
                class="form-input"
                [value]="duration()"
                disabled
                readonly
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ 'form.driver' | t }}</label>
            <input
              type="text"
              class="form-input"
              [class.is-invalid]="errors()['driver']"
              [(ngModel)]="form.driver"
              name="driver"
            />
            @if (errors()['driver']) {
              <p class="form-error">{{ errors()['driver'] }}</p>
            }
          </div>

          <div class="flex gap-1 mt-3">
            <button type="submit" class="btn btn-primary" [disabled]="submitting()">
              {{ submitting()
                ? (isEdit() ? ('action.saving' | t) : ('action.creating' | t))
                : ('action.save' | t) }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="handleCancel()">
              {{ 'action.back' | t }}
            </button>
          </div>
        </form>
      }
    </div>
  `
})
export class TripFormComponent implements OnInit {
  cities = EUROPEAN_CITIES;
  statusOptions = tripStatusOptions;
  timezoneAbbr = timezoneAbbr;

  form = {
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    status: 'scheduled' as TripStatus,
    driver: ''
  };

  isEdit = signal(false);
  tripId = signal(0);
  errors = signal<Record<string, string>>({});
  submitting = signal(false);

  departureTimezone = computed(() => timezoneForCity(this.form.origin));
  arrivalTimezone = computed(() => timezoneForCity(this.form.destination));

  duration = computed(() => {
    if (!this.form.departureTime || !this.form.arrivalTime) return '—';
    try {
      return formatDuration(
        new Date(this.form.departureTime).toISOString(),
        new Date(this.form.arrivalTime).toISOString()
      );
    } catch {
      return '—';
    }
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public tripService: TripService,
    private i18n: I18nService
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id) && id > 0) {
      this.isEdit.set(true);
      this.tripId.set(id);
      try {
        await this.tripService.fetchTrip(id);
        const trip = this.tripService.currentTrip();
        if (trip) {
          this.form = {
            origin: trip.origin,
            destination: trip.destination,
            departureTime: trip.departureTime.slice(0, 16),
            arrivalTime: trip.arrivalTime ? trip.arrivalTime.slice(0, 16) : '',
            status: trip.status,
            driver: trip.driver
          };
        }
      } catch (error) {
        console.error('Failed to fetch trip:', error);
        this.router.navigate(['/trips']);
      }
    }
  }

  updateStatus(status: TripStatus | '') {
    if (!status) return;
    if (this.form.status === 'arrived' && status !== 'arrived') {
      this.form.arrivalTime = '';
    }
    this.form.status = status;
  }

  async handleSubmit() {
    const errs = validateTripForm(this.form, this.i18n.t.bind(this.i18n));
    this.errors.set(errs);
    if (Object.keys(errs).length > 0) return;

    this.submitting.set(true);
    try {
      const payload = {
        origin: this.form.origin,
        destination: this.form.destination,
        departureTime: new Date(this.form.departureTime).toISOString(),
        departureTimezone: this.departureTimezone(),
        arrivalTime: this.form.arrivalTime ? new Date(this.form.arrivalTime).toISOString() : undefined,
        arrivalTimezone: this.arrivalTimezone(),
        status: this.form.status,
        driver: this.form.driver
      };

      if (this.isEdit()) {
        await this.tripService.updateTrip(this.tripId(), payload);
        this.router.navigate(['/trips', this.tripId()]);
      } else {
        await this.tripService.createTrip(payload);
        this.router.navigate(['/trips']);
      }
    } catch (error) {
      console.error('Failed to save trip:', error);
    } finally {
      this.submitting.set(false);
    }
  }

  handleCancel() {
    if (this.isEdit()) {
      this.router.navigate(['/trips', this.tripId()]);
    } else {
      this.router.navigate(['/trips']);
    }
  }
}
