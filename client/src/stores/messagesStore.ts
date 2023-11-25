import { defineStore } from 'pinia'
import { reactive } from 'vue'

import { useTopicsStore } from './topicsStore'
import { $apiAuth } from '@/api'
import type { Message } from '@/interfaces/interfaces'

export const useMessagesStore = defineStore('message', () => {
  const messageList = reactive([] as Message[])
  const topicStore = useTopicsStore()

  const createMessage = async (message: Message) => {
    messageList.unshift(message)
  }

  const fetchGetMessages = async () => {
    try {
      if (topicStore.curTopicId === -1) throw new Error('Ошибка получения списка сообщений')
      const retcode = await $apiAuth.get(
        `${import.meta.env.VITE_SERVER_URL}/chat/${topicStore.curTopicId}`
      )
      if (!retcode) throw new Error('Ошибка получения списка сообщений')
      if (retcode.status !== 200)
        throw new Error(`Ошибка получения списка сообщений: статус ответа ${retcode.status}`)
      messageList.splice(0, messageList.length) // Обнуляем содержимое массива
      retcode.data.result.forEach((item: Message) => {
        messageList.unshift(item)
      })
      messageList.sort((msg1: Message, msg2: Message) => msg2.id - msg1.id)
      return
    } catch (error) {
      console.log((error as Error).message)
      throw error
    }
  }

  return { messageList, createMessage, fetchGetMessages }
})
