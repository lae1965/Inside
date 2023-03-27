<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { AxiosError } from 'axios';

import { useTopicsStore } from '@/stores/topicsStore';
import { useUserStore } from '@/stores/userStore';

const newTopic = ref('');
const router = useRouter();
const userStore = useUserStore();
const topicStore = useTopicsStore();

const handleSubmit = async () => {
  try {
    await topicStore.fetchCreateTopic(newTopic.value);
  } catch (e) {
    if ((e as AxiosError).response?.status) router.push({ name: 'login' });
    else alert('Ошибка добавления');
  }
  newTopic.value = '';
}

const handleTopic = (id: number, topic: string) => {
  topicStore.setCurTopic(id, topic);
  router.push({ name: 'chat' });
}

onMounted(async () => {
  try {
    await userStore.isAuthFetch();
    await topicStore.fetchGetTopics();
  } catch {
    alert('Ошибка загрузки');
  }
});
</script>

<template>
  <header>
    <h2 class="header">Пользователь: <span class="header__name">{{ userStore.login }}</span></h2>
  </header>
  <form class="new-themes" @submit.prevent="handleSubmit">
    <input type="text" name="new-themes" class="new-themes__input" placeholder="Новая тема" v-model="newTopic">
    <button type="submit" class="new-themes__submit" :disabled="!newTopic.length">Создать</button>
  </form>
  <table class="themes" v-if="!!topicStore.topicList.length">
    <thead class="themes__header">
      <tr>
        <td class="themes__message">Темы</td>
        <td class="themes__author">Автор</td>
      </tr>
    </thead>
    <tbody>
      <tr @click="handleTopic(item.id, item.topic)" v-for="item in topicStore.topicList" :key="item.id">
        <td class="themes__message">{{ item.topic }}</td>
        <td class="themes__author">{{ item.author }}</td>
      </tr>
    </tbody>
  </table>
  <h3 class="no-content" v-else>Список тем пуст</h3>
</template>

<style>
.header {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
}

.header__name {
  color: royalblue;
}

.new-themes {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 10px;
}

.new-themes__input,
.new-themes__submit {
  padding: 6px;
  border: 1px solid #DDDDDD;
  border-radius: 3px;
}

.new-themes__input {
  width: 85%;
  outline: none;
}

.new-themes__submit {
  flex: 1;
}

.new-themes__submit:enabled:hover {
  color: orangered;
  background-color: aqua;
}

.themes {
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #DDDDDD;
  border-collapse: collapse;
}

.themes__header {
  text-align: center;
  font-weight: bold;
  background-color: #B0ACAC;
  color: #FFFFFF;
}

.themes td {
  border: 1px solid #DDDDDD;
  padding: 5px;
}

.themes tbody tr:hover {
  background-color: aqua;
  color: orangered;
}

.themes__message {
  width: 85%;
}

.themes__author {
  width: 15%;
}

.no-content {
  color: red;
}
</style>