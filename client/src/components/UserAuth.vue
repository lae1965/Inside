<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '@/stores/userStore';
import AvatarAlias from './AvatarAlias.vue';

const password = ref('');
const checkPassword = ref('');
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

onMounted(() => {
  user.createAliasColor();
});

const handleSubmit = async () => {
  try {
    await user.authFetch(password.value, true);
    router.push({ name: 'chats-list' });
  } catch {
    alert('Ошибка регистрации');
  }
}

const handleLoginChange = () => {
  if (user.login) user.createAliasName();
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <AvatarAlias radius="100" :avatar="user.avatar" :aliasName="user.alias.name" :alias-color="user.alias.color"
      :enable-modify="true" />
    <input type="text" name="login" placeholder="Логин" v-model="login" @change="handleLoginChange">
    <input type="password" name="password" placeholder="Пароль" v-model="password">
    <input type="password" name="check-password" placeholder="Повторите пароль" v-model="checkPassword">
    <button type="submit"
      :disabled="!user.login.length || !password.length || !checkPassword.length || password !== checkPassword">Зарегистрироваться</button>
    <RouterLink to="/login">
      <button type="button">Уже есть аккаунт? Залогиниться</button>
    </RouterLink>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 30%;
  margin: 20vh auto 0;
}

input,
button {
  padding: 6px;
  outline: none;
  width: 100%;
}

button:enabled:hover {
  background-color: aqua;
  color: orangered;
  border-color: aqua;
  box-shadow: none;
}
</style>