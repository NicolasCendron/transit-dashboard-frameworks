<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTripStore } from "@/stores/tripStore";
import { useLocale } from "@/composables/useLocale";
import { tripStatusOptions } from "@common/models/tripStatusOptions";
import { EUROPEAN_CITIES, timezoneForCity, timezoneAbbr } from "@common/models/cities";
import { formatDuration } from "@common/utils/time";
import { validateTripForm } from "@/utils/validation";
import type { TripStatus } from "@common/models/trip";
import TripFormSkeleton from "@/components/TripFormSkeleton.vue";
import StatusSelect from "@/components/StatusSelect.vue";

const route = useRoute();
const router = useRouter();
const store = useTripStore();
const { t } = useLocale();

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

const departureTimezone = computed(() => timezoneForCity(form.value.origin));
const arrivalTimezone = computed(() => timezoneForCity(form.value.destination));

const getTzAbbr = (tz: string) => timezoneAbbr(tz);

const calculatedDuration = computed(() => {
  if (!form.value.departureTime || !form.value.arrivalTime) return "—";
  try {
    const depUtc = new Date(form.value.departureTime).toISOString();
    const arrUtc = new Date(form.value.arrivalTime).toISOString();
    return formatDuration(depUtc, arrUtc);
  } catch {
    return "—";
  }
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
      departureTime: new Date(form.value.departureTime).toISOString(),
      departureTimezone: departureTimezone.value,
      arrivalTime: form.value.arrivalTime ? new Date(form.value.arrivalTime).toISOString() : undefined,
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
      const t = store.currentTrip;
      form.value = {
        origin: t.origin,
        destination: t.destination,
        departureTime: t.departureTime.slice(0, 16),
        arrivalTime: t.arrivalTime ? t.arrivalTime.slice(0, 16) : "",
        status: t.status,
        driver: t.driver,
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
              {{ city.name }} ({{ getTzAbbr(city.timezone) }})
            </option>
          </select>
          <p v-if="errors.origin" class="form-error">{{ errors.origin }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t("form.destination") }}</label>
          <select v-model="form.destination" class="form-select" :class="{ 'is-invalid': errors.destination }">
            <option value="" disabled>—</option>
            <option v-for="city in EUROPEAN_CITIES" :key="city.name" :value="city.name">
              {{ city.name }} ({{ getTzAbbr(city.timezone) }})
            </option>
          </select>
          <p v-if="errors.destination" class="form-error">{{ errors.destination }}</p>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">
            {{ t("form.departureTime") }}
            <span v-if="departureTimezone" class="form-tz-hint">{{ getTzAbbr(departureTimezone) }}</span>
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
            <span v-if="arrivalTimezone" class="form-tz-hint">{{ getTzAbbr(arrivalTimezone) }}</span>
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
