<script setup lang="ts">
import { computed, ref } from 'vue';

import { useUserStore } from '@/stores/userStore';

const props = defineProps(['radius', 'avatar', 'aliasName', 'aliasColor', 'enableModify']);

const modifyMenu = ref(false);
const bgColor = ref(props.aliasColor);
const color = computed(() => ((~parseInt(bgColor.value, 16) << 8) >>> 8).toString(16));

const userStore = useUserStore();

const size = `${props.radius}px`;
const font = `${(Math.floor(parseInt(props.radius) * 0.6)).toString()}px`;
const x = Math.floor(parseInt(props.radius) * 0.1);
const shadow = `${x.toString()}px ${Math.floor(x / 2).toString()}px 10px 0px rgba(0, 0, 0, 0.3)`;
const top = `${parseInt(props.radius) + 8}px`;
const left = `${parseInt(props.radius) / 2 - 4}px`;

const emit = defineEmits(['change-avatar-alias']);

const handleChangeColor = async () => {
  userStore.createAliasColor();
  bgColor.value = userStore.alias.color;
  await userStore.updateFetch({ aliasColor: bgColor.value });
  emit('change-avatar-alias');
}

</script>

<template>
  <div class="avatar-alias">
    <div class="avatar-alias__content" @mouseenter="() => { if (props.enableModify) modifyMenu = true; }"
      @mouseleave="modifyMenu = false">
      <div class="alias">{{ props.aliasName }}</div>
      <div v-if="modifyMenu" class="menu">
        <ul v-if="props.avatar" class="menu__variant">
          <li>Изменить аватар</li>
          <li>Удалить аватар</li>
        </ul>
        <ul v-else class="menu__variant">
          <li @click="handleChangeColor()">Изменить цвет псевдонима</li>
          <li>Изменить текст псевдонима</li>
          <li>Загрузить аватар</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-alias {
  min-height: v-bind(size);
  display: flex;
  justify-content: center;
}

.avatar-alias__content {
  position: relative;
  padding-bottom: 10px;
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
  background-color: v-bind('`#${bgColor}`');
}

.menu {
  background-color: cadetblue;
  color: azure;
  position: absolute;
  top: v-bind(top);
  width: max-content;
  font-size: 11px;
  border-radius: 5px;
}

li {
  border-bottom: 1px solid azure;
  list-style-type: none;
  padding: 5px;
  text-align: center;
}

li:first-of-type {
  border-radius: 5px 5px 0 0;
  position: relative;
}

li:first-of-type::before {
  position: absolute;
  top: -5px;
  left: v-bind(left);
  display: inline-block;
  content: '';
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  background-color: cadetblue;
  z-index: -99;
}

li:last-of-type {
  border-bottom: none;
  border-radius: 0 0 5px 5px;
}

li:hover {
  background-color: aqua;
  color: orangered;
}
</style>
