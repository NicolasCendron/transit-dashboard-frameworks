import { Component, Input, Output, EventEmitter, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../services/i18n.service';
import type { TripStatus } from '@common/models/trip';
import type { StatusOption } from '@common/models/tripStatusOptions';

@Component({
  selector: 'app-status-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-select">
      <button type="button" class="custom-select-trigger" (click)="toggle()">
        <span class="badge status-select-trigger-badge {{ badgeClass(value) }}">
          {{ getLabel(value) }}
          <span>▾</span>
        </span>
      </button>
      @if (isOpen()) {
        <div class="custom-select-dropdown">
          @for (option of translatedOptions(); track option.value) {
            <button
              type="button"
              class="custom-select-option"
              [class.is-selected]="option.value === value"
              (click)="select(option.value)"
            >
              <span class="badge status-select-option {{ badgeClass(option.value) }}">
                {{ option.label }}
              </span>
            </button>
          }
        </div>
      }
    </div>
  `
})
export class StatusSelectComponent {
  @Input() options: StatusOption[] = [];
  @Input() value!: TripStatus | '';
  @Output() valueChange = new EventEmitter<TripStatus | ''>();

  isOpen = signal(false);
  private optionsSignal = signal<StatusOption[]>([]);
  
  translatedOptions = computed(() => 
    this.optionsSignal().map(o => ({ value: o.value, label: this.i18n.t(o.label) }))
  );

  constructor(public i18n: I18nService) {
    effect(() => {
      this.optionsSignal.set(this.options);
    });
  }

  badgeClass(value: string): string {
    return value ? `badge-${value}` : 'badge-select-all';
  }

  getLabel(value: string): string {
    return this.translatedOptions().find(o => o.value === value)?.label ?? this.i18n.t('trips.allStatuses');
  }

  toggle() {
    this.isOpen.update(v => !v);
  }

  select(value: string) {
    this.valueChange.emit(value as TripStatus | '');
    this.isOpen.set(false);
  }
}
