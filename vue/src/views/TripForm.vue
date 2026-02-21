<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTripStore } from "@/stores/tripStore";
import { useLocale } from "@/composables/useLocale";
import { useTimezone } from "@/composables/useTimezone";
import { tripStatusOptions } from "@common/models/tripStatusOptions";
import { EUROPEAN_CITIES, timezoneForCity } from "@common/models/cities";
import { formatDuration, utcToLocalInput, localInputToUtc } from "@common/utils/time";
import { validateTripForm } from "@/utils/validation";
import type { TripStatus } from "@common/models/trip";
import TripFormSkeleton from "@/components/TripFormSkeleton.vue";
import StatusSelect from "@/components/StatusSelect.vue";

const route = useRoute();
const router = useRouter();
const store = useTripStore();
const { t } = useLocale();
const { timezone, currentLabel } = useTimezone();

const isEdit = computed(() => route.name === "trip-edit");
const tripId = computed(() => Number(route.params.id));

const form = ref({
  origin: "" as string,
  destination: "" as string,
  departureTime: "",
  arrivalTime: "",
  status: "scheduled" as TripStatus,
  driver: "",
});

// UTC source of truth — kept in sync with form inputs via timezone conversion
const storedUtcDeparture = ref("");
const storedUtcArrival = ref("");

const departureTimezone = computed(() => timezoneForCity(form.value.origin));
const arrivalTimezone = computed(() => timezoneForCity(form.value.destination));

const calculatedDuration = computed(() => {
  if (!storedUtcDeparture.value || !storedUtcArrival.value) return "—";
  try { return formatDuration(storedUtcDeparture.value, storedUtcArrival.value); }
  catch { return "—"; }
});

// User edits an input → convert to UTC and store
watch(() => form.value.departureTime, (val) => {
  storedUtcDeparture.value = val ? localInputToUtc(val, timezone.value) : "";
});
watch(() => form.value.arrivalTime, (val) => {
  storedUtcArrival.value = val ? localInputToUtc(val, timezone.value) : "";
});

// Display timezone changes → re-display stored UTC in new timezone
watch(timezone, (tz) => {
  if (storedUtcDeparture.value) form.value.departureTime = utcToLocalInput(storedUtcDeparture.value, tz);
  if (storedUtcArrival.value) form.value.arrivalTime = utcToLocalInput(storedUtcArrival.value, tz);
});

watch(() => form.value.status, (newStatus, oldStatus) => {
  if (oldStatus === "arrived" && newStatus !== "arrived") {
    form.value.arrivalTime = "";
  }
});

const errors = ref<Record<string, string>>({});
const submitting = ref(false);

function validate(): boolean {
  errors.value = validateTripForm(form.value, t);
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;
  submitting.value = true;
  try {
    const payload = {
      origin: form.value.origin,
      destination: form.value.destination,
      departureTime: storedUtcDeparture.value,
      departureTimezone: departureTimezone.value,
      arrivalTime: storedUtcArrival.value || undefined,
      arrivalTimezone: arrivalTimezone.value,
      status: form.value.status,
      driver: form.value.driver,
    };
    if (isEdit.value) {
      await store.updateTrip(tripId.value, payload);
      router.push({ name: "trip-details", params: { id: tripId.value } });
    } else {
      await store.createTrip(payload);
      router.push({ name: "trips" });
    }
  } finally {
    submitting.value = false;
  }
}

function handleCancel() {
  router.push(isEdit.value ? { name: "trip-details", params: { id: tripId.value } } : { name: "trips" });
}

onMounted(async () => {
  if (isEdit.value) {
    await store.fetchTrip(tripId.value);
    if (store.currentTrip) {
      const trip = store.currentTrip;
      storedUtcDeparture.value = trip.departureTime;
      storedUtcArrival.value = trip.arrivalTime || "";
      form.value = {
        origin: trip.origin,
        destination: trip.destination,
        departureTime: utcToLocalInput(trip.departureTime, timezone.value),
        arrivalTime: trip.arrivalTime ? utcToLocalInput(trip.arrivalTime, timezone.value) : "",
        status: trip.status,
        driver: trip.driver,
      };
    }
  }
});
</script>

<template>
  <div>
    <h2 class="page-title">
      {{ isEdit ? t("form.editTitle") : t("form.createTitle") }}
    </h2>

    <TripFormSkeleton v-if="isEdit && store.loading" />

    <form v-else class="card" @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">{{ t("form.origin") }}</label>
          <select v-model="form.origin" class="form-select" :class="{ 'is-invalid': errors.origin }">
            <option value="" disabled>—</option>
            <option v-for="city in EUROPEAN_CITIES" :key="city.name" :value="city.name">
              {{ city.name }}
            </option>
          </select>
          <p v-if="errors.origin" class="form-error">{{ errors.origin }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t("form.destination") }}</label>
          <select v-model="form.destination" class="form-select" :class="{ 'is-invalid': errors.destination }">
            <option value="" disabled>—</option>
            <option v-for="city in EUROPEAN_CITIES" :key="city.name" :value="city.name">
              {{ city.name }}
            </option>
          </select>
          <p v-if="errors.destination" class="form-error">{{ errors.destination }}</p>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">
            {{ t("form.departureTime") }}
            <span class="form-tz-hint">{{ currentLabel }}</span>
          </label>
          <input
            v-model="form.departureTime"
            type="datetime-local"
            class="form-input"
            :class="{ 'is-invalid': errors.departureTime }"
          />
          <p v-if="errors.departureTime" class="form-error">{{ errors.departureTime }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t("form.status") }}</label>
          <StatusSelect v-model="form.status" :options="tripStatusOptions" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">
            {{ t("form.arrivalTime") }}
            <span class="form-tz-hint">{{ currentLabel }}</span>
          </label>
          <input
            v-model="form.arrivalTime"
            type="datetime-local"
            class="form-input form-input-disableable"
            :class="{ 'is-invalid': errors.arrivalTime }"
            :disabled="form.status !== 'arrived'"
            :title="form.status !== 'arrived' ? t('form.arrivalRequiredWhenArrived') : ''"
          />
          <p v-if="errors.arrivalTime" class="form-error">{{ errors.arrivalTime }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">Duration</label>
          <input
            :value="calculatedDuration"
            type="text"
            class="form-input"
            disabled
            readonly
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">{{ t("form.driver") }}</label>
        <input v-model="form.driver" type="text" class="form-input" :class="{ 'is-invalid': errors.driver }" />
        <p v-if="errors.driver" class="form-error">{{ errors.driver }}</p>
      </div>

      <div class="flex gap-1 mt-3">
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting
            ? (isEdit ? t("action.saving") : t("action.creating"))
            : t("action.save") }}
        </button>
        <button type="button" class="btn btn-secondary" @click="handleCancel">
          {{ t("action.back") }}
        </button>
      </div>
    </form>
  </div>
</template>
