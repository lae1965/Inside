<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="main">
    <RouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main {
  max-width: 1400px;
  margin: 0 auto;
}
</style>