import { defineStore } from 'pinia'

import type { Message, Reaction } from '@/interfaces/interfaces'

export const useReactionsStore = defineStore('reaction', () => {
  const createReaction = (message: Message, newReaction: Reaction) => {
    message.reactions.push(newReaction)
  }

  const updateReaction = (message: Message, newReaction: Reaction) => {
    const index = message.reactions.findIndex(
      (reactionFrom) => reactionFrom.authorId === newReaction.authorId
    )
    if (index !== -1) message.reactions[index].reaction = newReaction.reaction
  }

  const removeReaction = (message: Message, reaction: Reaction) => {
    const index = message.reactions.findIndex(
      (reactionFrom) => reactionFrom.authorId === reaction.authorId
    )
    if (index !== -1) message.reactions.splice(index, 1)
  }

  return {
    createReaction,
    updateReaction,
    removeReaction
  }
})
