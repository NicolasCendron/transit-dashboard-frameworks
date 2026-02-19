<script setup lang="ts">
import { useLocale } from "@/composables/useLocale";
import type { TripStatus } from "@common/models/trip";

defineProps<{ status: TripStatus }>();

const { t } = useLocale();
</script>

<template>
  <span class="badge" :class="`badge-${status}`">
    {{ t(`status.${status}`) }}
  </span>
</template>
