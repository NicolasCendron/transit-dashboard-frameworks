<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTripStore } from "@/stores/tripStore";
import { useLocale } from "@/composables/useLocale";
import { useTimezone } from "@/composables/useTimezone";
import { formatCompactDateTime, formatDuration, isNextDay } from "@common/utils/time";
import TripStatusBadge from "@/components/TripStatusBadge.vue";
import TripDetailsSkeleton from "@/components/TripDetailsSkeleton.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

const route = useRoute();
const router = useRouter();
const store = useTripStore();
const { t } = useLocale();
const { timezone } = useTimezone();

function loadTrip() {
  store.fetchTrip(Number(route.params.id));
}

watch(() => route.params.id, loadTrip);
onMounted(loadTrip);
</script>

<template>
  <div>
    <TripDetailsSkeleton v-if="store.loading" />

    <ErrorMessage
      v-else-if="store.error"
      :message="t('detail.notFound')"
      @retry="loadTrip"
    />

    <template v-else-if="store.currentTrip">
      <div class="flex-between mb-2">
        <h2 class="page-title">{{ t("detail.title") }}</h2>
        <div class="actions">
          <router-link
            :to="{ name: 'trip-edit', params: { id: store.currentTrip.id } }"
            class="btn btn-primary"
          >
            {{ t("action.edit") }}
          </router-link>
          <button class="btn btn-secondary" @click="router.push({ name: 'trips' })">
            {{ t("action.back") }}
          </button>
        </div>
      </div>

      <div class="card">
        <div class="detail-grid">
          <div class="detail-item">
            <label>{{ t("table.origin") }}</label>
            <span>{{ store.currentTrip.origin }}</span>
          </div>
          <div class="detail-item">
            <label>{{ t("table.destination") }}</label>
            <span>{{ store.currentTrip.destination }}</span>
          </div>
          <div class="detail-item">
            <label>{{ t("table.departure") }}</label>
            <span>{{ formatCompactDateTime(store.currentTrip.departureTime, timezone) }}</span>
          </div>
          <div class="detail-item">
            <label>{{ t("table.arrival") }}</label>
            <span v-if="store.currentTrip.arrivalTime">
              {{ formatCompactDateTime(store.currentTrip.arrivalTime, timezone) }}
              <span v-if="isNextDay(store.currentTrip.departureTime, store.currentTrip.departureTimezone, store.currentTrip.arrivalTime, store.currentTrip.arrivalTimezone || '')" class="next-day">+1</span>
            </span>
            <span v-else class="text-secondary">—</span>
          </div>
          <div class="detail-item">
            <label>{{ t("table.status") }}</label>
            <TripStatusBadge :status="store.currentTrip.status" />
          </div>
          <div class="detail-item" v-if="store.currentTrip.arrivalTime">
            <label>{{ t("table.duration") }}</label>
            <span>{{ formatDuration(store.currentTrip.departureTime, store.currentTrip.arrivalTime) }}</span>
          </div>
          <div class="detail-item">
            <label>{{ t("table.driver") }}</label>
            <span>{{ store.currentTrip.driver }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
