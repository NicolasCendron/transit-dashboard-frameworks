<script setup lang="ts">
import { computed } from "vue";
import { useLocale } from "@/composables/useLocale";
import type { StatusOption } from "@common/models/tripStatusOptions";
import CustomSelect from "./CustomSelect.vue";

const props = defineProps<{
  modelValue: string;
  options: StatusOption[];
}>();

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const { t } = useLocale();

const mapped = computed(() =>
  props.options.map(o => ({ value: o.value, label: t(o.label) }))
);

function badgeClass(value: string) {
  return value && value !== "" ? `badge-${value}` : "badge-select-all";
}
</script>

<template>
  <CustomSelect
    :modelValue="modelValue"
    :options="mapped"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #trigger="{ option }">
      <span class="badge status-select-trigger-badge" :class="badgeClass(option?.value ?? '')">
        {{ option?.label }}
        <span class="status-select-chevron">▾</span>
      </span>
    </template>
    <template #option="{ option }">
      <span class="badge status-select-option" :class="badgeClass(option.value)">{{ option.label }}</span>
    </template>
  </CustomSelect>
</template>
