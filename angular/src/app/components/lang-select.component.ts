import { Component, computed } from '@angular/core';
import { CustomSelectComponent } from './custom-select.component';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-lang-select',
  standalone: true,
  imports: [CustomSelectComponent],
  template: `
    <app-custom-select
      className="lang-select"
      [options]="i18n.localeOptions()"
      [value]="i18n.locale()"
      (valueChange)="onLocaleChange($event)"
    >
      <span trigger>{{ currentLabel() }}</span>
    </app-custom-select>
  `
})
export class LangSelectComponent {
  constructor(public i18n: I18nService) {}

  currentLabel = computed(() => 
    this.i18n.localeOptions().find(o => o.value === this.i18n.locale())?.label ?? 'English'
  );

  onLocaleChange(value: string) {
    this.i18n.setLocale(value as 'en' | 'es' | 'pt');
  }
}
