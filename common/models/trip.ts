export type TripStatus = "scheduled" | "delayed" | "cancelled" | "arrived";

export interface Trip {
  id: number;
  origin: string;
  destination: string;
  departureTime: string;       // UTC ISO
  departureTimezone: string;   // IANA tz, e.g. "Europe/Lisbon"
  arrivalTime?: string;        // UTC ISO — only set when status === "arrived"
  arrivalTimezone?: string;    // IANA tz, e.g. "Europe/Warsaw"
  status: TripStatus;
  driver: string;
}

export type TripCreate = Omit<Trip, "id">;
export type TripUpdate = Partial<TripCreate>;

export interface ApiError {
  status: number;
  message: string;
}
