import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusSelectComponent } from './status-select.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { tripStatusFilterOptions } from '@common/models/tripStatusOptions';
import type { TripStatus } from '@common/models/trip';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [FormsModule, StatusSelectComponent, TranslatePipe],
  template: `
    <div class="filters-bar">
      <div class="filter-group filter-search">
        <label class="filter-label">{{ 'trips.search' | t }}</label>
        <input
          type="text"
          class="filter-input"
          [placeholder]="'trips.search' | t"
          [value]="search"
          (input)="onSearchInput($event)"
        />
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ 'trips.dateFrom' | t }}</label>
        <input
          type="date"
          class="filter-input"
          [value]="dateFrom"
          (input)="onDateFromInput($event)"
        />
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ 'trips.dateTo' | t }}</label>
        <input
          type="date"
          class="filter-input"
          [value]="dateTo"
          (input)="onDateToInput($event)"
        />
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ 'table.status' | t }}</label>
        <app-status-select
          [options]="statusOptions"
          [value]="status"
          (valueChange)="statusChange.emit($event)"
        />
      </div>
    </div>
  `
})
export class SearchFilterComponent {
  @Input() search = '';
  @Input() status: TripStatus | '' = '';
  @Input() dateFrom = '';
  @Input() dateTo = '';
  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<TripStatus | ''>();
  @Output() dateFromChange = new EventEmitter<string>();
  @Output() dateToChange = new EventEmitter<string>();

  statusOptions = tripStatusFilterOptions;

  onSearchInput(event: Event) {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }

  onDateFromInput(event: Event) {
    this.dateFromChange.emit((event.target as HTMLInputElement).value);
  }

  onDateToInput(event: Event) {
    this.dateToChange.emit((event.target as HTMLInputElement).value);
  }
}
