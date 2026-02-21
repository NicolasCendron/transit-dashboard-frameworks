<script setup lang="ts">
import { useTimezone } from "@/composables/useTimezone";
import CustomSelect from "./CustomSelect.vue";

const { timezone, timezoneOptions, setTimezone } = useTimezone();
</script>

<template>
  <CustomSelect
    :modelValue="timezone"
    :options="timezoneOptions"
    class="timezone-select"
    @update:modelValue="setTimezone($event)"
  >
    <template #trigger="{ option }">🌍 {{ option?.label }}</template>
    <template #option="{ option }">{{ option.label }}</template>
  </CustomSelect>
</template>
