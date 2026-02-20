import type { TripStatus } from "./trip";

export interface StatusOption {
  value: TripStatus | "";
  label: string;
}

export const tripStatusOptions: StatusOption[] = [
  { value: "scheduled", label: "status.scheduled" },
  { value: "delayed",   label: "status.delayed" },
  { value: "cancelled", label: "status.cancelled" },
  { value: "arrived",   label: "status.arrived" },
];

export const tripStatusFilterOptions: StatusOption[] = [
  { value: "", label: "trips.allStatuses" },
  ...tripStatusOptions,
];
