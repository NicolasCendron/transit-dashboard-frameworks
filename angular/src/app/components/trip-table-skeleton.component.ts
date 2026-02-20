import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-trip-table-skeleton',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>{{ 'table.origin' | t }}</th>
            <th>{{ 'table.destination' | t }}</th>
            <th>{{ 'table.departure' | t }}</th>
            <th>{{ 'table.status' | t }}</th>
            <th>{{ 'table.duration' | t }}</th>
            <th>{{ 'table.actions' | t }}</th>
          </tr>
        </thead>
        <tbody>
          @for (i of rows; track i) {
            <tr>
              @for (j of cols; track j) {
                <td>
                  <div class="skeleton skeleton-text" [style.width.px]="j === 5 ? 120 : 100"></div>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class TripTableSkeletonComponent {
  protected readonly rows = [0, 1, 2, 3, 4];
  protected readonly cols = [0, 1, 2, 3, 4, 5];
}
