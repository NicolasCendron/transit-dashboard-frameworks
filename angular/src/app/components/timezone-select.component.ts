import { Component, computed } from '@angular/core';
import { CustomSelectComponent } from './custom-select.component';
import { TimezoneService } from '../services/timezone.service';

@Component({
  selector: 'app-timezone-select',
  standalone: true,
  imports: [CustomSelectComponent],
  template: `
    <app-custom-select
      className="timezone-select"
      [options]="timezoneService.timezoneOptions"
      [value]="timezoneService.timezone()"
      (valueChange)="onTimezoneChange($event)"
    >
      <span trigger>🌍 {{ currentLabel() }}</span>
    </app-custom-select>
  `
})
export class TimezoneSelectComponent {
  constructor(public timezoneService: TimezoneService) {}

  currentLabel = computed(() => 
    this.timezoneService.timezoneOptions.find(o => o.value === this.timezoneService.timezone())?.label ?? 'CET'
  );

  onTimezoneChange(value: string) {
    this.timezoneService.setTimezone(value);
  }
}
