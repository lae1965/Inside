<script setup lang="ts">
import { iconList } from '@/util/reactions';

const iconSrc = (icon: string) => new URL(`../asserts/reactions/${icon}.png`, import.meta.url).href;
</script>

<template>
  <div class="reaction-list" @mouseleave="$emit('icon-escape')">
    <div class="reaction-shell" v-for="(icon, i) in iconList" :key="i" @mouseup.left="$emit('iconSelected', i)">
      <img :src="iconSrc(icon)" :alt="i.toString()" class="reaction-item">
    </div>
  </div>
</template>

<style scoped>
.reaction-item {
  width: 15px;
  height: 15px;
}

.reaction-shell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.reaction-list {
  height: 130px;
  width: 30px;
  position: absolute;
  top: 4px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow-y: scroll;
  align-items: center;
  background-color: aquamarine;
  padding-top: 5px;
  border-radius: 15px;
}

.reaction-list::-webkit-scrollbar {
  display: none;
}
</style>