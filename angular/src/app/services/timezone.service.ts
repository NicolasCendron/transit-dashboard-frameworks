import { Injectable, signal } from '@angular/core';
import { TIMEZONE_OPTIONS, getDefaultTimezone, setStoredTimezone } from '@common/utils/timezone';

@Injectable({ providedIn: 'root' })
export class TimezoneService {
  private timezoneSignal = signal<string>(getDefaultTimezone());

  timezone = this.timezoneSignal.asReadonly();
  timezoneOptions = TIMEZONE_OPTIONS;

  setTimezone(timezone: string) {
    this.timezoneSignal.set(timezone);
    setStoredTimezone(timezone);
  }
}
