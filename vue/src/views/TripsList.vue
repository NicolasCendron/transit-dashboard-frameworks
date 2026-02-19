<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTripStore } from "@/stores/tripStore";
import { useLocale } from "@/composables/useLocale";
import SearchFilter from "@/components/SearchFilter.vue";
import TripTable from "@/components/TripTable.vue";
import TripTableSkeleton from "@/components/TripTableSkeleton.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

const store = useTripStore();
const router = useRouter();
const { t } = useLocale();

const search = ref("");
const dateFrom = ref("");
const dateTo = ref("");
const statusFilter = ref("");

const filteredTrips = computed(() => {
  let result = store.trips;

  const query = search.value.toLowerCase();
  if (query) {
    result = result.filter(
      (trip) =>
        trip.origin.toLowerCase().includes(query) ||
        trip.destination.toLowerCase().includes(query) ||
        trip.driver.toLowerCase().includes(query)
    );
  }

  if (dateFrom.value) {
    const from = new Date(dateFrom.value).getTime();
    result = result.filter((trip) => new Date(trip.departureTime).getTime() >= from);
  }

  if (dateTo.value) {
    const to = new Date(dateTo.value + "T23:59:59").getTime();
    result = result.filter((trip) => new Date(trip.departureTime).getTime() <= to);
  }

  if (statusFilter.value) {
    result = result.filter((trip) => trip.status === statusFilter.value);
  }

  return result;
});

function handleView(id: number) {
  router.push({ name: "trip-details", params: { id } });
}

function handleEdit(id: number) {
  router.push({ name: "trip-edit", params: { id } });
}

async function handleCancel(id: number) {
  if (!confirm(t("trips.cancelConfirm"))) return;
  await store.cancelTrip(id);
}

onMounted(() => store.fetchTrips());
</script>

<template>
  <div>
    <div class="flex-between mb-2">
      <h2 class="page-title">{{ t("trips.title") }}</h2>
      <router-link :to="{ name: 'trip-create' }" class="btn btn-primary">
        {{ t("trips.create") }}
      </router-link>
    </div>

    <SearchFilter
      v-model:search="search"
      v-model:date-from="dateFrom"
      v-model:date-to="dateTo"
      v-model:status="statusFilter"
    />

    <TripTableSkeleton v-if="store.loading" />

    <ErrorMessage
      v-else-if="store.error"
      :message="t('trips.error')"
      @retry="store.fetchTrips()"
    />

    <div v-else-if="filteredTrips.length === 0" class="empty">
      {{ t("trips.empty") }}
    </div>

    <TripTable
      v-else
      :trips="filteredTrips"
      @view="handleView"
      @edit="handleEdit"
      @cancel="handleCancel"
    />
  </div>
</template>
