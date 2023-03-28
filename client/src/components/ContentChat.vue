<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

import { useMessagesStore } from '@/stores/messagesStore';
import { useTopicsStore } from '@/stores/topicsStore';
import { useUserStore } from '@/stores/userStore';
import { useSocketStore } from '@/stores/socketStore';
import { IdleTimer } from '@/util/idleTimer';

const router = useRouter();
const newMessage = ref('');
let idleTimer: IdleTimer | null = null;
const first = ref(true);
const userStore = useUserStore();
const topicsStore = useTopicsStore();
const messagesStore = useMessagesStore();
const socketStore = useSocketStore();

const handleSubmit = async () => {
  try {
    socketStore.emitSocketEvent({
      authorId: userStore.id,
      topicId: topicsStore.curTopicId,
      message: newMessage.value,
    });
    messagesStore.createMessage({
      id: Date.now(),
      message: newMessage.value,
      author: userStore.login,
    });
  } catch (e) {
    alert('Ошибка сохранения');
    console.log(e);
  }

  newMessage.value = '';
}

const handleToList = () => {
  router.push({ name: 'chats-list' });
}

onMounted(async () => {
  idleTimer = new IdleTimer(3 * 60 * 1000, () => { // 3 минуты в мс
    handleToList();
  });
  try {
    await messagesStore.fetchGetMessages();
    socketStore.initSocket();
    socketStore.subscribeToChatEvent(data => {
      messagesStore.createMessage(data);
    });
    socketStore.subscribeToError(() => {
      router.push({ name: 'login' });
    })
  } catch {
    handleToList();
  }
});

onUnmounted(() => {
  if (idleTimer) {
    idleTimer.destroy();
    idleTimer = null;
  }
  socketStore.disconnectSocket();
});
</script>

<template>
  <header>
    <h2 class="header header__name">{{ topicsStore.curTopic }}</h2>
  </header>
  <button class="to-list" @click="handleToList">Список тем</button>
  <form class="new-themes" @submit.prevent="handleSubmit">
    <input type="text" name="new-message" class="new-themes__input" placeholder="Новое сообщение" v-model="newMessage">
    <button type="submit" class="new-themes__submit" :disabled="!newMessage.length">Отправить</button>
  </form>
  <div class="modal" v-if="!messagesStore.messageList.length && first">
    <button class="modal__exit" @click="first = false">x</button>
    <p class="modal__message">В теме {{ topicsStore.curTopic }} пока нет ни одного сообщения</p>
    <button class="ok" @click="first = false">OK</button>
  </div>
  <table class="themes" v-else-if="messagesStore.messageList.length">
    <thead class="themes__header">
      <tr>
        <td class="flex1">Сообщение</td>
        <td class="themes__author">Автор</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="message in messagesStore.messageList" :key="message.id">
        <td>{{ message.message }}</td>
        <td class="themes__author">{{ message.author }}</td>
      </tr>
    </tbody>
  </table>
  <h3 class="no-content" v-else>Список сообщений пуст</h3>
</template>

<style scoped>
.header {
  position: relative;
}

.flex1 {
  flex: 1;
}

.to-list {
  position: absolute;
  top: 40px;
  padding: 6px 70px;
  border: 1px solid #DDDDDD;
  border-radius: 3px;
}

.to-list:hover {
  color: orangered;
  background-color: aqua;
}

.new-themes {
  position: relative;
}

.new-themes__input {
  width: auto !important;
  flex: 1 !important;
}

.new-themes__submit {
  flex: none !important;
  width: 15% !important;
}


.themes tr:hover {
  color: initial;
  background-color: initial;
}

.modal {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 110px;
  width: 20vw;
  height: 30vh;
  top: 5vh;
  left: 40vw;
  z-index: 2;
  background-color: #DDDDDD;
  border-radius: 3px;
  padding: 10px;
  border: 2px solid darkgray;
}

.modal__exit {
  width: 25px;
  height: 25px;
  font-size: 20px;
  align-self: flex-end;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 10px;
}

.modal__message {
  text-align: center;
  width: 80%;
  align-self: center;
}

.ok {
  padding: 6px;
}
</style>