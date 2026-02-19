<script setup lang="ts" generic="T extends string">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  modelValue: T;
  options: { value: T; label: string }[];
}>();

const emit = defineEmits<{ "update:modelValue": [value: T] }>();

const open = ref(false);
const container = ref<HTMLElement>();

function onOutside(e: MouseEvent) {
  if (!container.value?.contains(e.target as Node)) open.value = false;
}
onMounted(() => document.addEventListener("mousedown", onOutside));
onUnmounted(() => document.removeEventListener("mousedown", onOutside));

function select(value: T) {
  emit("update:modelValue", value);
  open.value = false;
}
</script>

<template>
  <div class="custom-select" ref="container">
    <button type="button" class="custom-select-trigger" @click="open = !open">
      <slot name="trigger" :option="options.find(o => o.value === modelValue)" />
    </button>

    <div v-if="open" class="custom-select-dropdown">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="custom-select-option"
        :class="{ 'is-selected': opt.value === modelValue }"
        @click="select(opt.value)"
      >
        <slot name="option" :option="opt" />
      </button>
    </div>
  </div>
</template>
