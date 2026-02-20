import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Option {
  value: string;
  label: string;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-select" [class]="className">
      <button type="button" class="custom-select-trigger" (click)="toggle()">
        <ng-content select="[trigger]"></ng-content>
      </button>
      @if (isOpen()) {
        <div class="custom-select-dropdown">
          @for (option of options; track option.value) {
            <button
              type="button"
              class="custom-select-option"
              [class.is-selected]="option.value === value"
              (click)="select(option.value)"
            >
              {{ option.label }}
            </button>
          }
        </div>
      }
    </div>
  `
})
export class CustomSelectComponent {
  @Input() options: Option[] = [];
  @Input() value = '';
  @Input() className = '';
  @Output() valueChange = new EventEmitter<string>();

  isOpen = signal(false);

  toggle() {
    this.isOpen.update(v => !v);
  }

  select(value: string) {
    this.valueChange.emit(value);
    this.isOpen.set(false);
  }
}
