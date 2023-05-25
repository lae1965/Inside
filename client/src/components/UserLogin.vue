<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '../stores/userStore';

const password = ref('');
const router = useRouter();
const user = useUserStore();
const login = computed({
  get() {
    return user.login;
  },
  set(newLogin: string) {
    user.setLogin(newLogin);
  },
});
const handleSubmit = async () => {
  try {
    await user.authFetch(password.value, false);
    router.push({ name: 'chats-list' })
  } catch {
    alert('Ошибка регистрации');
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input type="text" name="login" placeholder="Логин" v-model="login">
    <input type="password" name="password" placeholder="Пароль" v-model="password">
    <button type="submit" :disabled="!user.login.length || !password.length">
      Залогиниться
    </button>
    <RouterLink to="/auth">
      <button type="button">Нет аккаунта? Зарегистрироваться</button>
    </RouterLink>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 30%;
  margin: 8vw auto 0;
}

input,
button {
  padding: 6px;
  outline: none;
}

button:enabled:hover {
  background-color: aqua;
  color: orangered;
  border-color: aqua;
  box-shadow: none;
}
</style>