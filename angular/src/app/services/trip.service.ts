import { Injectable, signal } from '@angular/core';
import { tripApi } from '@common/api/fake-api';
import type { Trip, TripCreate, TripUpdate } from '@common/models/trip';

@Injectable({ providedIn: 'root' })
export class TripService {
  trips = signal<Trip[]>([]);
  currentTrip = signal<Trip | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  private getErrorMessage(e: unknown): string {
    return (e as { message?: string }).message ?? 'Unknown error';
  }

  async fetchTrips() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const trips = await tripApi.getAll();
      this.trips.set(trips);
    } catch (e: unknown) {
      this.error.set(this.getErrorMessage(e));
    } finally {
      this.loading.set(false);
    }
  }

  async fetchTrip(id: number) {
    this.loading.set(true);
    this.error.set(null);
    this.currentTrip.set(null);
    try {
      const trip = await tripApi.getById(id);
      this.currentTrip.set(trip);
    } catch (e: unknown) {
      this.error.set(this.getErrorMessage(e));
    } finally {
      this.loading.set(false);
    }
  }

  async createTrip(data: TripCreate) {
    this.loading.set(true);
    this.error.set(null);
    try {
      await tripApi.create(data);
    } catch (e: unknown) {
      this.error.set(this.getErrorMessage(e));
      throw e;
    } finally {
      this.loading.set(false);
    }
  }

  async updateTrip(id: number, data: TripUpdate) {
    this.loading.set(true);
    this.error.set(null);
    try {
      await tripApi.update(id, data);
    } catch (e: unknown) {
      this.error.set(this.getErrorMessage(e));
      throw e;
    } finally {
      this.loading.set(false);
    }
  }

  async cancelTrip(id: number) {
    try {
      await tripApi.cancel(id);
      await this.fetchTrips();
    } catch (e: unknown) {
      this.error.set(this.getErrorMessage(e));
      throw e;
    }
  }
}
