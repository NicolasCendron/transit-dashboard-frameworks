import type { TripStatus } from "./trip";

export interface StatusOption {
  value: TripStatus | "";
  key: string;
}

export const tripStatusOptions: StatusOption[] = [
  { value: "scheduled", key: "status.scheduled" },
  { value: "delayed",   key: "status.delayed" },
  { value: "cancelled", key: "status.cancelled" },
  { value: "arrived",   key: "status.arrived" },
];

export const tripStatusFilterOptions: StatusOption[] = [
  { value: "", key: "trips.allStatuses" },
  ...tripStatusOptions,
];
