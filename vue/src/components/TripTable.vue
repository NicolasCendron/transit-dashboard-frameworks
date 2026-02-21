<script setup lang="ts">
import { useLocale } from "@/composables/useLocale";
import { useTimezone } from "@/composables/useTimezone";
import { formatCompactDateTime, formatDuration, isNextDay } from "@common/utils/time";
import type { Trip } from "@common/models/trip";
import TripStatusBadge from "./TripStatusBadge.vue";

defineProps<{ trips: Trip[] }>();
defineEmits<{
  view: [id: number];
  edit: [id: number];
  cancel: [id: number];
}>();

const { t } = useLocale();
const { timezone } = useTimezone();
</script>

<template>
  <div class="card">
    <table class="table">
      <thead>
        <tr>
          <th>{{ t("table.origin") }}</th>
          <th>{{ t("table.destination") }}</th>
          <th>{{ t("table.departure") }}</th>
          <th>{{ t("table.arrival") }}</th>
          <th>{{ t("table.status") }}</th>
          <th>{{ t("table.duration") }}</th>
          <th>{{ t("table.driver") }}</th>
          <th>{{ t("table.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trip in trips" :key="trip.id" class="table-row-clickable" @click="$emit('view', trip.id)">
          <td>{{ trip.origin }}</td>
          <td>{{ trip.destination }}</td>
          <td class="time-cell">{{ formatCompactDateTime(trip.departureTime, timezone) }}</td>
          <td class="time-cell">
            <template v-if="trip.arrivalTime">
              {{ formatCompactDateTime(trip.arrivalTime, timezone) }}
              <span v-if="isNextDay(trip.departureTime, trip.departureTimezone, trip.arrivalTime, trip.arrivalTimezone || '')" class="next-day">+1</span>
            </template>
            <span v-else class="text-secondary">—</span>
          </td>
          <td><TripStatusBadge :status="trip.status" /></td>
          <td class="text-secondary">
            <span v-if="trip.arrivalTime">{{ formatDuration(trip.departureTime, trip.arrivalTime) }}</span>
            <span v-else>—</span>
          </td>
          <td>{{ trip.driver }}</td>
          <td>
            <div class="actions">
              <button class="btn btn-sm" @click.stop="$emit('view', trip.id)">
                {{ t("action.view") }}
              </button>
              <button class="btn btn-sm" @click.stop="$emit('edit', trip.id)">
                {{ t("action.edit") }}
              </button>
              <button
                v-if="trip.status !== 'cancelled' && trip.status !== 'arrived'"
                class="btn btn-sm btn-danger"
                @click.stop="$emit('cancel', trip.id)"
              >
                {{ t("action.cancel") }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
