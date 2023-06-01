<script setup lang="ts">
import type { Reaction } from '@/interfaces/messageInterface';
import { useReactionsStore } from '@/stores/reactionsStore';
import { useSocketStore } from '@/stores/socketStore';
import { useUserStore } from '@/stores/userStore';
import AvatarAlias from './AvatarAlias.vue';

const props = defineProps(['message']);

const userStore = useUserStore();
const reactionStore = useReactionsStore();
const socketStore = useSocketStore();

const iconSrc = (icon: string) => new URL(`../asserts/reactions/${icon}.png`, import.meta.url).href;
const handleDeleteReaction = (reaction: Reaction) => {
  if (reaction.authorId !== userStore.id) return;
  socketStore.emitSocketRemoveReactionEvent({
    authorId: reaction.authorId,
    messageId: props.message.id,
  });
  reactionStore.removeReaction(props.message, reaction);
}
</script>

<template>
  <div v-for="(reaction, i) in props.message.reactions" :key="i" class="reactions"
    @click="() => handleDeleteReaction(reaction)">
    <img :src="iconSrc(reaction.reaction)" :alt="i.toString()" class="reaction-item">
    <AvatarAlias radius="15" :avatar="reaction.avatar" :alias-name="reaction.aliasName"
      :alias-color="reaction.aliasColor" />
  </div>
</template>

<style scoped>
.reactions {
  display: flex;
  gap: 1px;
  align-items: center;
  cursor: pointer;
}

.reaction-item {
  width: 15px;
  height: 15px;
}

.reactions:hover .reaction-item {
  animation: bounce 1s;
}

@keyframes bounce {

  0%,
  33%,
  66%,
  100% {
    transform: translateY(0);
  }

  16% {
    transform: translateY(-40px);
  }

  49% {
    transform: translateY(-20px);
  }

  83% {
    transform: translateY(-10px);
  }
}
</style>