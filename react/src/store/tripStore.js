import { create } from "zustand";
import { tripApi } from "@common/api/fake-api";
export const useTripStore = create((set) => ({
    trips: [],
    currentTrip: null,
    loading: false,
    error: null,
    async fetchTrips() {
        set({ loading: true, error: null });
        try {
            const trips = await tripApi.getAll();
            set({ trips });
        }
        catch (e) {
            set({ error: e.message ?? "Unknown error" });
        }
        finally {
            set({ loading: false });
        }
    },
    async fetchTrip(id) {
        set({ loading: true, error: null, currentTrip: null });
        try {
            const currentTrip = await tripApi.getById(id);
            set({ currentTrip });
        }
        catch (e) {
            set({ error: e.message ?? "Unknown error" });
        }
        finally {
            set({ loading: false });
        }
    },
    async createTrip(data) {
        set({ loading: true, error: null });
        try {
            await tripApi.create(data);
        }
        catch (e) {
            set({ error: e.message ?? "Unknown error" });
            throw e;
        }
        finally {
            set({ loading: false });
        }
    },
    async updateTrip(id, data) {
        set({ loading: true, error: null });
        try {
            await tripApi.update(id, data);
        }
        catch (e) {
            set({ error: e.message ?? "Unknown error" });
            throw e;
        }
        finally {
            set({ loading: false });
        }
    },
    async cancelTrip(id) {
        try {
            await tripApi.cancel(id);
            const trips = await tripApi.getAll();
            set({ trips });
        }
        catch (e) {
            set({ error: e.message ?? "Unknown error" });
            throw e;
        }
    },
}));
