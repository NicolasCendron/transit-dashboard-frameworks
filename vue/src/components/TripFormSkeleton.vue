<template>
  <div class="card">
    <div v-for="row in 3" :key="row" class="form-row">
      <div v-for="col in 2" :key="col" class="form-group">
        <div class="skeleton skeleton-text" style="width: 90px; height: 13px; margin-bottom: 8px;"></div>
        <div class="skeleton skeleton-text" style="height: 38px; border-radius: 6px;"></div>
      </div>
    </div>
    <div class="form-group">
      <div class="skeleton skeleton-text" style="width: 60px; height: 13px; margin-bottom: 8px;"></div>
      <div class="skeleton skeleton-text" style="height: 38px; border-radius: 6px;"></div>
    </div>
    <div class="flex gap-1 mt-3">
      <div class="skeleton skeleton-text" style="width: 80px; height: 36px; border-radius: 6px;"></div>
      <div class="skeleton skeleton-text" style="width: 80px; height: 36px; border-radius: 6px;"></div>
    </div>
  </div>
</template>
