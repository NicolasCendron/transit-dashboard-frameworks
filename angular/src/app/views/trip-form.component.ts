import { Component, OnInit, computed, signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../services/trip.service';
import { I18nService } from '../services/i18n.service';
import { TimezoneService } from '../services/timezone.service';
import { StatusSelectComponent } from '../components/status-select.component';
import { TripFormSkeletonComponent } from '../components/trip-form-skeleton.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { EUROPEAN_CITIES, timezoneForCity } from '@common/models/cities';
import { tripStatusOptions } from '@common/models/tripStatusOptions';
import { formatDuration, utcToLocalInput, localInputToUtc } from '@common/utils/time';
import { validateTripForm } from '@common/utils/validation';
import type { TripStatus } from '@common/models/trip';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
                  <option [value]="city.name">{{ city.name }}</option>
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
                  <option [value]="city.name">{{ city.name }}</option>
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
                <span class="form-tz-hint">
                  {{ currentTimezoneLabel() }}
                </span>
              </label>
              <input
                type="datetime-local"
                class="form-input"
                [class.is-invalid]="errors()['departureTime']"
                [formControl]="departureCtrl"
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
                <span class="form-tz-hint">
                  {{ currentTimezoneLabel() }}
                </span>
              </label>
              <input
                type="datetime-local"
                class="form-input form-input-disableable"
                [class.is-invalid]="errors()['arrivalTime']"
                [formControl]="arrivalCtrl"
                [title]="arrivalCtrl.disabled ? ('form.arrivalRequiredWhenArrived' | t) : ''"
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
  form = {
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    status: 'scheduled' as TripStatus,
    driver: ''
  };

  departureCtrl = new FormControl('');
  arrivalCtrl = new FormControl({ value: '', disabled: true });

  isEdit = signal(false);
  tripId = signal(0);
  errors = signal<Record<string, string>>({});
  submitting = signal(false);
  private storedUtcDeparture = signal('');
  private storedUtcArrival = signal('');

  get departureTimezone() { return timezoneForCity(this.form.origin); }
  get arrivalTimezone() { return timezoneForCity(this.form.destination); }
  
  currentTimezoneLabel = computed(() => 
    this.timezoneService.timezoneOptions.find(o => o.value === this.timezoneService.timezone())?.label || ''
  );

  duration = computed(() => {
    if (!this.storedUtcDeparture() || !this.storedUtcArrival()) return '—';
    try {
      return formatDuration(this.storedUtcDeparture(), this.storedUtcArrival());
    } catch {
      return '—';
    }
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public tripService: TripService,
    private i18n: I18nService,
    public timezoneService: TimezoneService
  ) {
    effect(() => {
      const tz = this.timezoneService.timezone();
      const dep = untracked(() => this.storedUtcDeparture());
      const arr = untracked(() => this.storedUtcArrival());
      if (dep) this.departureCtrl.setValue(utcToLocalInput(dep, tz), { emitEvent: false });
      if (arr) this.arrivalCtrl.setValue(utcToLocalInput(arr, tz), { emitEvent: false });
    });

    this.departureCtrl.valueChanges.subscribe(value => {
      if (value) this.storedUtcDeparture.set(localInputToUtc(value, this.timezoneService.timezone()));
    });
    this.arrivalCtrl.valueChanges.subscribe(value => {
      if (value) this.storedUtcArrival.set(localInputToUtc(value, this.timezoneService.timezone()));
      else this.storedUtcArrival.set('');
    });
  }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id) && id > 0) {
      this.isEdit.set(true);
      this.tripId.set(id);
      try {
        await this.tripService.fetchTrip(id);
        const trip = this.tripService.currentTrip();
        if (trip) {
          this.storedUtcDeparture.set(trip.departureTime);
          this.storedUtcArrival.set(trip.arrivalTime || '');
          this.departureCtrl.setValue(utcToLocalInput(trip.departureTime, this.timezoneService.timezone()), { emitEvent: false });
          if (trip.status === 'arrived') {
            this.arrivalCtrl.enable({ emitEvent: false });
            this.arrivalCtrl.setValue(trip.arrivalTime ? utcToLocalInput(trip.arrivalTime, this.timezoneService.timezone()) : '', { emitEvent: false });
          }

          this.form = {
            origin: trip.origin,
            destination: trip.destination,
            departureTime: utcToLocalInput(trip.departureTime, this.timezoneService.timezone()),
            arrivalTime: trip.arrivalTime ? utcToLocalInput(trip.arrivalTime, this.timezoneService.timezone()) : '',
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
      this.arrivalCtrl.setValue('', { emitEvent: false });
      this.storedUtcArrival.set('');
    }
    this.form.status = status;
    if (status === 'arrived') {
      this.arrivalCtrl.enable({ emitEvent: false });
    } else {
      this.arrivalCtrl.disable({ emitEvent: false });
    }
  }

  async handleSubmit() {
    const errs = validateTripForm({
      ...this.form,
      departureTime: this.departureCtrl.value || '',
      arrivalTime: this.arrivalCtrl.value || ''
    }, this.i18n.t.bind(this.i18n));
    this.errors.set(errs);
    if (Object.keys(errs).length > 0) return;

    this.submitting.set(true);
    try {
      const payload = {
        origin: this.form.origin,
        destination: this.form.destination,
        departureTime: this.storedUtcDeparture(),
        departureTimezone: this.departureTimezone,
        arrivalTime: this.storedUtcArrival() || undefined,
        arrivalTimezone: this.arrivalTimezone,
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
