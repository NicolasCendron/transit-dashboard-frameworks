export const tripStatusOptions = [
    { value: "scheduled", label: "status.scheduled" },
    { value: "delayed", label: "status.delayed" },
    { value: "cancelled", label: "status.cancelled" },
    { value: "arrived", label: "status.arrived" },
];
export const tripStatusFilterOptions = [
    { value: "", label: "trips.allStatuses" },
    ...tripStatusOptions,
];
