<script setup lang="ts">
import { useLocale } from "@/composables/useLocale";

defineProps<{ message: string }>();
defineEmits<{ retry: [] }>();

const { t } = useLocale();
</script>

<template>
  <div class="error">
    <p>{{ message }}</p>
    <button class="btn btn-primary mt-2" @click="$emit('retry')">
      {{ t("trips.retry") }}
    </button>
  </div>
</template>
