<script setup lang="ts">

const props = defineProps(['radius', 'avatar', 'aliasName', 'aliasColor']);
const size = `${props.radius}px`;
const font = `${(Math.floor(parseInt(props.radius) * 0.6)).toString()}px`;
const x = Math.floor(parseInt(props.radius) * 0.1);
const shadow = `${x.toString()}px ${Math.floor(x / 2).toString()}px 10px 0px rgba(0, 0, 0, 0.3)`
const color = ((~parseInt(props.aliasColor, 16) << 8) >>> 8).toString(16)
</script>

<template>
  <div class="avatar-alias">
    <div class="alias">{{ props.aliasName }}</div>
  </div>
</template>

<style scoped>
.avatar-alias {
  height: v-bind(size);
  display: flex;
  justify-content: center;
}

.alias {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  border-radius: 50%;
  box-shadow: v-bind(shadow);
  width: v-bind(size);
  height: v-bind(size);
  font-size: v-bind(font);
  color: v-bind('`#${color}`');
  background-color: v-bind('`#${props.aliasColor}`');
}
</style>