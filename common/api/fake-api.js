import { SEED_TRIPS } from "./seed-data";
// amazonq-ignore-next-line
const STORAGE_KEY = "transit-dashboard-trips";
const SIMULATED_DELAY_MS = 400;
function delay(value) {
    return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}
function throwError(status, message) {
    const error = { status, message };
    throw error;
}
function loadTrips() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            return JSON.parse(raw);
        }
        catch {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TRIPS));
            return [...SEED_TRIPS];
        }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TRIPS));
    return [...SEED_TRIPS];
}
function saveTrips(trips) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}
function nextId(trips) {
    if (trips.length === 0)
        return 1;
    return Math.max(...trips.map((t) => t.id)) + 1;
}
export const tripApi = {
    async getAll() {
        const trips = loadTrips();
        trips.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        return delay(trips);
    },
    async getById(id) {
        const trips = loadTrips();
        const trip = trips.find((t) => t.id === id);
        if (!trip)
            throwError(404, "Trip not found");
        return delay(trip);
    },
    async create(data) {
        const trips = loadTrips();
        const trip = { id: nextId(trips), ...data };
        trips.push(trip);
        saveTrips(trips);
        return delay(trip);
    },
    async update(id, data) {
        const trips = loadTrips();
        const index = trips.findIndex((t) => t.id === id);
        if (index === -1)
            throwError(404, "Trip not found");
        trips[index] = { ...trips[index], ...data };
        saveTrips(trips);
        return delay(trips[index]);
    },
    async cancel(id) {
        return this.update(id, { status: "cancelled" });
    },
    async delete(id) {
        const trips = loadTrips();
        const index = trips.findIndex((t) => t.id === id);
        if (index === -1)
            throwError(404, "Trip not found");
        trips.splice(index, 1);
        saveTrips(trips);
        return delay(undefined);
    },
    async reset() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TRIPS));
        return delay(undefined);
    },
};
