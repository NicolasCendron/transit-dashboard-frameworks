import { Injectable, signal, computed } from '@angular/core';
import en from '@common/i18n/en';
import es from '@common/i18n/es';
import pt from '@common/i18n/pt';
import { LOCALES, type Locale } from '@common/i18n/locale';
type TranslationKey = string;

const translations = { en, es, pt };

@Injectable({ providedIn: 'root' })
export class I18nService {
  private localeSignal = signal<Locale>('en');
  
  locale = computed(() => this.localeSignal());
  
  localeOptions = computed(() =>
    LOCALES.map(({ code, flag }) => ({
      value: code,
      label: `${flag} ${this.t(`lang.${code}`)}`
    }))
  );

  setLocale(locale: Locale) {
    this.localeSignal.set(locale);
  }

  t(key: TranslationKey): string {
    const keys = key.split('.');
    let value: unknown = translations[this.localeSignal()];
    for (const k of keys) {
      if (typeof value !== 'object' || value === null) return key;
      value = (value as Record<string, unknown>)[k];
      if (value === undefined) return key;
    }
    return typeof value === 'string' ? value : key;
  }
}
