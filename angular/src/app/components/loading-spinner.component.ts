import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container">
      <div class="spinner"></div>
      @if (message) {
        <p>{{ message }}</p>
      }
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() message = '';
}
