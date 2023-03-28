import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { useUserStore } from './userStore'
import { $apiAuth } from '@/api'

interface Topic {
  id: number
  topic: string
  author: string
}

export const useTopicsStore = defineStore('topics', () => {
  const topicList = reactive([] as Topic[])
  const curTopic = ref('')
  const curTopicId = ref(-1)
  const userStore = useUserStore()

  const setCurTopic = (id: number, topic: string) => {
    curTopic.value = topic
    curTopicId.value = id
  }

  const fetchCreateTopic = async (newTopic: string) => {
    try {
      const retcode = await $apiAuth.post(`${import.meta.env.VITE_SERVER_URL}/topic`, {
        authorId: userStore.id,
        topic: newTopic
      })
      if (!retcode) throw new Error('Ошибка создания новой темы')
      if (retcode.status !== 201)
        throw new Error(`Ошибка создания новой темы: статус ответа ${retcode.status}`)
      topicList.unshift(retcode.data)
      return
    } catch (error) {
      console.log((error as Error).message)
      throw error
    }
  }

  const fetchGetTopics = async () => {
    try {
      const retcode = await $apiAuth.get(`${import.meta.env.VITE_SERVER_URL}/topic`)
      if (!retcode) throw new Error('Ошибка получения списка тем')
      if (retcode.status !== 200)
        throw new Error(`Ошибка получения списка тем: статус ответа ${retcode.status}`)
      topicList.splice(0, topicList.length)
      retcode.data.result.topics.forEach((item: Topic) => {
        topicList.unshift(item)
      })
      return
    } catch (error) {
      console.log((error as Error).message)
      throw error
    }
  }

  return { topicList, curTopic, curTopicId, setCurTopic, fetchCreateTopic, fetchGetTopics }
})
