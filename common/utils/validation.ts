import type { TripStatus } from "../models/trip";

export interface TripFormData {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: TripStatus;
  driver: string;
}

export function validateTripForm(
  form: TripFormData,
  t: (key: string) => string,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const required = ["origin", "destination", "departureTime", "driver"] as const;

  for (const field of required) {
    if (!form[field].trim()) errors[field] = t("form.required");
  }

  if (form.status === "arrived" && !form['arrivalTime']) {
    errors['arrivalTime'] = t("form.arrivalRequiredWhenArrived");
  }

  if (form.departureTime && form['arrivalTime']) {
    const depTime = new Date(form.departureTime).getTime();
    const arrTime = new Date(form['arrivalTime']).getTime();
    if (!isNaN(depTime) && !isNaN(arrTime) && arrTime <= depTime) {
      errors['arrivalTime'] = t("form.arrivalMustBeAfterDeparture");
    }
  }

  return errors;
}
