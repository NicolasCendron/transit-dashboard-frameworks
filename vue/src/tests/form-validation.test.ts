import { describe, it, expect, beforeEach } from "vitest";
import { validateTripForm } from "../utils/validation";
import type { TripStatus } from "../../../common/models/trip";

const mockTranslate = (key: string) => {
  const translations: Record<string, string> = {
    "form.required": "This field is required.",
    "form.arrivalRequiredWhenArrived": "Arrival time is required when status is Arrived.",
    "form.arrivalMustBeAfterDeparture": "Arrival time must be after departure time.",
  };
  return translations[key] || key;
};

describe("TripForm validation", () => {
  let validForm: {
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    status: TripStatus;
    driver: string;
  };

  beforeEach(() => {
    validForm = {
      origin: "Lisbon",
      destination: "Paris",
      departureTime: "2026-02-20T08:00",
      arrivalTime: "",
      status: "scheduled",
      driver: "John Doe",
    };
  });

  describe("required fields", () => {
    it("passes validation with all required fields filled", () => {
      const errors = validateTripForm(validForm, mockTranslate);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("fails when origin is empty", () => {
      validForm.origin = "";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.origin).toBe("This field is required.");
    });

    it("fails when origin is only whitespace", () => {
      validForm.origin = "   ";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.origin).toBe("This field is required.");
    });

    it("fails when destination is empty", () => {
      validForm.destination = "";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.destination).toBe("This field is required.");
    });

    it("fails when departureTime is empty", () => {
      validForm.departureTime = "";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.departureTime).toBe("This field is required.");
    });

    it("fails when driver is empty", () => {
      validForm.driver = "";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.driver).toBe("This field is required.");
    });

    it("accumulates multiple errors", () => {
      validForm.origin = "";
      validForm.driver = "";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(Object.keys(errors)).toHaveLength(2);
      expect(errors.origin).toBe("This field is required.");
      expect(errors.driver).toBe("This field is required.");
    });
  });

  describe("arrival time validation when status is arrived", () => {
    it("fails when status is arrived but arrivalTime is empty", () => {
      validForm.status = "arrived";
      validForm.arrivalTime = "";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.arrivalTime).toBe("Arrival time is required when status is Arrived.");
    });

    it("passes when status is arrived and arrivalTime is filled", () => {
      validForm.status = "arrived";
      validForm.arrivalTime = "2026-02-20T12:00";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.arrivalTime).toBeUndefined();
    });

    it("passes when status is scheduled and arrivalTime is empty", () => {
      validForm.status = "scheduled";
      validForm.arrivalTime = "";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.arrivalTime).toBeUndefined();
    });

    it("passes when status is delayed and arrivalTime is empty", () => {
      validForm.status = "delayed";
      validForm.arrivalTime = "";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.arrivalTime).toBeUndefined();
    });

    it("passes when status is cancelled and arrivalTime is empty", () => {
      validForm.status = "cancelled";
      validForm.arrivalTime = "";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.arrivalTime).toBeUndefined();
    });
  });

  describe("arrival time must be after departure time", () => {
    it("fails when arrival is before departure", () => {
      validForm.departureTime = "2026-02-20T12:00";
      validForm.arrivalTime = "2026-02-20T08:00";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.arrivalTime).toBe("Arrival time must be after departure time.");
    });

    it("fails when arrival equals departure", () => {
      validForm.departureTime = "2026-02-20T12:00";
      validForm.arrivalTime = "2026-02-20T12:00";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.arrivalTime).toBe("Arrival time must be after departure time.");
    });

    it("passes when arrival is after departure", () => {
      validForm.departureTime = "2026-02-20T08:00";
      validForm.arrivalTime = "2026-02-20T12:00";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.arrivalTime).toBeUndefined();
    });

    it("passes when arrival is next day", () => {
      validForm.departureTime = "2026-02-20T22:00";
      validForm.arrivalTime = "2026-02-21T02:00";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.arrivalTime).toBeUndefined();
    });

    it("skips validation when arrivalTime is empty", () => {
      validForm.departureTime = "2026-02-20T12:00";
      validForm.arrivalTime = "";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(errors.arrivalTime).toBeUndefined();
    });

    it("skips validation when departureTime is empty", () => {
      validForm.departureTime = "";
      validForm.arrivalTime = "2026-02-20T12:00";
      const errors = validateTripForm(validForm, mockTranslate);
      // Should have error for required departureTime, but not for arrival comparison
      expect(errors.departureTime).toBe("This field is required.");
      expect(errors.arrivalTime).toBeUndefined();
    });
  });

  describe("combined validation scenarios", () => {
    it("shows both required and arrival validation errors for arrived status", () => {
      validForm.status = "arrived";
      validForm.origin = "";
      validForm.arrivalTime = "";
      const errors = validateTripForm(validForm, mockTranslate);
      expect(Object.keys(errors)).toHaveLength(2);
      expect(errors.origin).toBe("This field is required.");
      expect(errors.arrivalTime).toBe("Arrival time is required when status is Arrived.");
    });

    it("prioritizes time comparison over required when both apply", () => {
      validForm.status = "arrived";
      validForm.departureTime = "2026-02-20T12:00";
      validForm.arrivalTime = "2026-02-20T08:00";
      const errors = validateTripForm(validForm, mockTranslate);
      // Should show comparison error, not required error
      expect(errors.arrivalTime).toBe("Arrival time must be after departure time.");
    });
  });
});
