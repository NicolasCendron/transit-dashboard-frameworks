import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-details-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="detail-grid">
        @for (i of items; track i) {
          <div class="detail-item">
            <div class="skeleton skeleton-text" [style]="{width: '80px', height: '14px', marginBottom: '8px'}"></div>
            <div class="skeleton skeleton-text" [style]="{width: '180px', height: '16px'}"></div>
          </div>
        }
      </div>
    </div>
  `
})
export class TripDetailsSkeletonComponent {
  readonly items = [0, 1, 2, 3, 4, 5, 6];
}
