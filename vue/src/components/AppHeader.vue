<script setup lang="ts">
import { useLocale } from "@/composables/useLocale";
import LangSelect from "@/components/LangSelect.vue";

const { t } = useLocale();
</script>

<template>
  <header class="app-header flex-between">
    <h1>
      {{ t("app.title") }}
      <span class="framework-badge">Vue</span>
    </h1>
    <LangSelect />
  </header>
</template>
