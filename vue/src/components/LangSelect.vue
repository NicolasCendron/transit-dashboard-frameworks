<script setup lang="ts">
import { computed } from "vue";
import { useLocale } from "@/composables/useLocale";
import type { Locale } from "@common/i18n/locale";
import CustomSelect from "./CustomSelect.vue";

const { locale, localeOptions, setLocale } = useLocale();

const mapped = computed(() =>
  localeOptions.value.map(o => ({ value: o.code, label: `${o.flag} ${o.label}` }))
);
</script>

<template>
  <CustomSelect
    :modelValue="locale"
    :options="mapped"
    @update:modelValue="setLocale($event as Locale)"
  >
    <template #trigger="{ option }">{{ option?.label }}</template>
    <template #option="{ option }">{{ option.label }}</template>
  </CustomSelect>
</template>
