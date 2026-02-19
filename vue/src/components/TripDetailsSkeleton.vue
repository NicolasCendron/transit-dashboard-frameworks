<template>
  <div class="card">
    <div class="detail-grid">
      <div class="detail-item" v-for="i in 7" :key="i">
        <div class="skeleton skeleton-text" style="width: 80px; height: 14px; margin-bottom: 8px;"></div>
        <div class="skeleton skeleton-text" style="width: 180px; height: 16px;"></div>
      </div>
    </div>
  </div>
</template>
