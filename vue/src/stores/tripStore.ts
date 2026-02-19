import { defineStore } from "pinia";
import { ref } from "vue";
import { tripApi } from "@common/api/fake-api";
import type { Trip, TripCreate, TripUpdate } from "@common/models/trip";

export const useTripStore = defineStore("trips", () => {
  const trips = ref<Trip[]>([]);
  const currentTrip = ref<Trip | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchTrips() {
    loading.value = true;
    error.value = null;
    try {
      trips.value = await tripApi.getAll();
    } catch (e: unknown) {
      error.value = (e as { message?: string }).message ?? "Unknown error";
    } finally {
      loading.value = false;
    }
  }

  async function fetchTrip(id: number) {
    loading.value = true;
    error.value = null;
    currentTrip.value = null;
    try {
      currentTrip.value = await tripApi.getById(id);
    } catch (e: unknown) {
      error.value = (e as { message?: string }).message ?? "Unknown error";
    } finally {
      loading.value = false;
    }
  }

  async function createTrip(data: TripCreate) {
    try {
      await tripApi.create(data);
    } catch (e: unknown) {
      error.value = (e as { message?: string }).message ?? "Unknown error";
      throw e;
    }
  }

  async function updateTrip(id: number, data: TripUpdate) {
    try {
      await tripApi.update(id, data);
    } catch (e: unknown) {
      error.value = (e as { message?: string }).message ?? "Unknown error";
      throw e;
    }
  }

  async function cancelTrip(id: number) {
    try {
      await tripApi.cancel(id);
      await fetchTrips();
    } catch (e: unknown) {
      error.value = (e as { message?: string }).message ?? "Unknown error";
      throw e;
    }
  }

  return {
    trips,
    currentTrip,
    loading,
    error,
    fetchTrips,
    fetchTrip,
    createTrip,
    updateTrip,
    cancelTrip,
  };
});
