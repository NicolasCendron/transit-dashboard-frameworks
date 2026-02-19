<script setup lang="ts">
import { useLocale } from "@/composables/useLocale";

const { t } = useLocale();
</script>

<template>
  <div class="card">
    <table class="table">
      <thead>
        <tr>
          <th>{{ t("table.origin") }}</th>
          <th>{{ t("table.destination") }}</th>
          <th>{{ t("table.departure") }}</th>
          <th>{{ t("table.arrival") }}</th>
          <th>{{ t("table.status") }}</th>
          <th>Duration</th>
          <th>{{ t("table.driver") }}</th>
          <th>{{ t("table.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 5" :key="i">
          <td><div class="skeleton skeleton-text"></div></td>
          <td><div class="skeleton skeleton-text"></div></td>
          <td><div class="skeleton skeleton-text"></div></td>
          <td><div class="skeleton skeleton-text"></div></td>
          <td><div class="skeleton skeleton-badge"></div></td>
          <td><div class="skeleton skeleton-text-sm"></div></td>
          <td><div class="skeleton skeleton-text"></div></td>
          <td><div class="skeleton skeleton-actions"></div></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
