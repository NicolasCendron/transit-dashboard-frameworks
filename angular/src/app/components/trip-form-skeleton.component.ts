import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-form-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      @for (row of rows; track row) {
        <div class="form-row">
          @for (col of cols; track col) {
            <div class="form-group">
              <div class="skeleton skeleton-text" [style]="{width: '90px', height: '13px', marginBottom: '8px'}"></div>
              <div class="skeleton skeleton-text" [style]="{height: '38px', borderRadius: '6px'}"></div>
            </div>
          }
        </div>
      }
      <div class="form-group">
        <div class="skeleton skeleton-text" [style]="{width: '60px', height: '13px', marginBottom: '8px'}"></div>
        <div class="skeleton skeleton-text" [style]="{height: '38px', borderRadius: '6px'}"></div>
      </div>
      <div class="flex gap-1 mt-3">
        <div class="skeleton skeleton-text" [style]="{width: '80px', height: '36px', borderRadius: '6px'}"></div>
        <div class="skeleton skeleton-text" [style]="{width: '80px', height: '36px', borderRadius: '6px'}"></div>
      </div>
    </div>
  `
})
export class TripFormSkeletonComponent {
  readonly rows = [0, 1, 2];
  readonly cols = [0, 1];
}
