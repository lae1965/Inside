import { ref } from 'vue'
import { defineStore } from 'pinia'
import { encode } from 'js-base64'

import { $api, $apiAuth } from '@/api'
import { SERVER_URL } from '@/util/constants'

export const useUserStore = defineStore('user', () => {
  const login = ref('')
  const id = ref(-1)
  function setLogin(newLogin: string) {
    login.value = newLogin
  }

  const authFetch = async (password: string, isNewUser: boolean) => {
    try {
      const retcode = await $api.post(`${SERVER_URL}/${isNewUser ? 'auth' : 'login'}`, {
        login: encode(login.value),
        password: encode(password)
      })
      if (!retcode) throw new Error('Ошибка авторизации')
      if (retcode.status !== 200 && retcode.status !== 201)
        throw new Error(`Ошибка авторизации: статус ответа ${retcode.status}`)
      if (retcode.data?.token) {
        window.localStorage.setItem('token', retcode.data.token)
        id.value = retcode.data?.id
      }
      return
    } catch (error) {
      console.log((error as Error).message)
      throw error
    }
  }

  const isAuthFetch = async () => {
    try {
      const retcode = await $apiAuth.get(`${SERVER_URL}/auth`)
      if (retcode.status === 200) {
        id.value = retcode.data.id
        login.value = retcode.data.login
      }
    } catch (error) {
      console.log((error as Error).message)
      throw error
    }
  }
  return { login, id, setLogin, authFetch, isAuthFetch }
})
