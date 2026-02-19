import { create } from "zustand";
import { tripApi } from "@common/api/fake-api";
import type { Trip, TripCreate, TripUpdate } from "@common/models/trip";

interface TripStore {
  trips: Trip[];
  currentTrip: Trip | null;
  loading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  fetchTrip: (id: number) => Promise<void>;
  createTrip: (data: TripCreate) => Promise<void>;
  updateTrip: (id: number, data: TripUpdate) => Promise<void>;
  cancelTrip: (id: number) => Promise<void>;
}

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  currentTrip: null,
  loading: false,
  error: null,

  async fetchTrips() {
    set({ loading: true, error: null });
    try {
      const trips = await tripApi.getAll();
      set({ trips });
    } catch (e: unknown) {
      set({ error: (e as { message?: string }).message ?? "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },

  async fetchTrip(id: number) {
    set({ loading: true, error: null, currentTrip: null });
    try {
      const currentTrip = await tripApi.getById(id);
      set({ currentTrip });
    } catch (e: unknown) {
      set({ error: (e as { message?: string }).message ?? "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },

  async createTrip(data: TripCreate) {
    set({ loading: true, error: null });
    try {
      await tripApi.create(data);
    } catch (e: unknown) {
      set({ error: (e as { message?: string }).message ?? "Unknown error" });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  async updateTrip(id: number, data: TripUpdate) {
    set({ loading: true, error: null });
    try {
      await tripApi.update(id, data);
    } catch (e: unknown) {
      set({ error: (e as { message?: string }).message ?? "Unknown error" });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  async cancelTrip(id: number) {
    try {
      await tripApi.cancel(id);
      const trips = await tripApi.getAll();
      set({ trips });
    } catch (e: unknown) {
      set({ error: (e as { message?: string }).message ?? "Unknown error" });
      throw e;
    }
  },
}));
