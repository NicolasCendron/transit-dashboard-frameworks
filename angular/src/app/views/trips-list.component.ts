import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripService } from '../services/trip.service';
import { I18nService } from '../services/i18n.service';
import { SearchFilterComponent } from '../components/search-filter.component';
import { TripTableComponent } from '../components/trip-table.component';
import { TripTableSkeletonComponent } from '../components/trip-table-skeleton.component';
import { ErrorMessageComponent } from '../components/error-message.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import type { TripStatus } from '@common/models/trip';

@Component({
  selector: 'app-trips-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SearchFilterComponent,
    TripTableComponent,
    TripTableSkeletonComponent,
    ErrorMessageComponent,
    TranslatePipe
  ],
  template: `
    <div>
      <div class="page-header">
        <h2 class="page-title">{{ 'trips.title' | t }}</h2>
        <button class="btn btn-primary" routerLink="/trips/new">
          {{ 'trips.create' | t }}
        </button>
      </div>

      <app-search-filter
        [search]="search()"
        [status]="status()"
        [dateFrom]="dateFrom()"
        [dateTo]="dateTo()"
        (searchChange)="search.set($event)"
        (statusChange)="status.set($event)"
        (dateFromChange)="dateFrom.set($event)"
        (dateToChange)="dateTo.set($event)"
      />

      @if (tripService.error()) {
        <app-error-message [message]="tripService.error()!" />
      } @else if (tripService.loading()) {
        <app-trip-table-skeleton />
      } @else {
        <app-trip-table [trips]="filteredTrips()" (cancel)="handleCancel($event)" />
      }
    </div>
  `
})
export class TripsListComponent implements OnInit {
  search = signal('');
  status = signal<TripStatus | ''>('');
  dateFrom = signal('');
  dateTo = signal('');

  filteredTrips = computed(() => {
    let result = this.tripService.trips();
    
    const searchLower = this.search().toLowerCase();
    if (searchLower) {
      result = result.filter(t =>
        t.origin.toLowerCase().includes(searchLower) ||
        t.destination.toLowerCase().includes(searchLower) ||
        t.driver.toLowerCase().includes(searchLower)
      );
    }

    if (this.status()) {
      result = result.filter(t => t.status === this.status());
    }

    if (this.dateFrom()) {
      const from = new Date(this.dateFrom());
      if (!isNaN(from.getTime())) {
        result = result.filter(t => new Date(t.departureTime) >= from);
      }
    }

    if (this.dateTo()) {
      const to = new Date(this.dateTo());
      if (!isNaN(to.getTime())) {
        to.setHours(23, 59, 59, 999);
        result = result.filter(t => new Date(t.departureTime) <= to);
      }
    }

    return result;
  });

  constructor(
    public tripService: TripService,
    private i18n: I18nService
  ) {}

  ngOnInit() {
    this.tripService.fetchTrips();
  }

  async handleCancel(id: number) {
    if (confirm(this.i18n.t('trips.cancelConfirm'))) {
      try {
        await this.tripService.cancelTrip(id);
      } catch (error) {
        console.error('Failed to cancel trip:', error);
      }
    }
  }
}
