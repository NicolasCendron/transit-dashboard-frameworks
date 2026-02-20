import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../pipes/translate.pipe';
import type { TripStatus } from '@common/models/trip';

@Component({
  selector: 'app-trip-status-badge',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <span
      class="badge badge-{{ status }}"
      role="status"
      [attr.aria-label]="'status.' + status | t"
    >
      {{ 'status.' + status | t }}
    </span>
  `
})
export class TripStatusBadgeComponent {
  @Input({ required: true }) status!: TripStatus;
}
