<script setup lang="ts">
import { useLocale } from "@/composables/useLocale";
import { tripStatusFilterOptions as statusOptions } from "@common/models/tripStatusOptions";
import StatusSelect from "@/components/StatusSelect.vue";

const props = defineProps<{
  search: string;
  dateFrom: string;
  dateTo: string;
  status: string;
}>();

const emit = defineEmits<{
  "update:search": [value: string];
  "update:dateFrom": [value: string];
  "update:dateTo": [value: string];
  "update:status": [value: string];
}>();

const { t } = useLocale();
</script>

<template>
  <div class="filters-bar">
    <div class="filter-group filter-search">
      <label class="filter-label">{{ t("trips.search") }}</label>
      <input
        type="text"
        class="filter-input"
        :placeholder="t('trips.search')"
        :value="search"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="filter-group">
      <label class="filter-label">{{ t("trips.dateFrom") }}</label>
      <input
        type="date"
        class="filter-input"
        :value="dateFrom"
        @input="emit('update:dateFrom', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="filter-group">
      <label class="filter-label">{{ t("trips.dateTo") }}</label>
      <input
        type="date"
        class="filter-input"
        :value="dateTo"
        @input="emit('update:dateTo', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="filter-group">
      <label class="filter-label">{{ t("table.status") }}</label>
      <StatusSelect
        :modelValue="status"
        :options="statusOptions"
        @update:modelValue="emit('update:status', $event)"
      />
    </div>
  </div>
</template>
