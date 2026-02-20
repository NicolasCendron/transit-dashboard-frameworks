import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    <div class="error-container">
      <p class="error-message">{{ message }}</p>
    </div>
  `
})
export class ErrorMessageComponent {
  @Input() message = '';
}
