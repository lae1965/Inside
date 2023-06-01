import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { encode } from 'js-base64'

import { $api, $apiAuth } from '@/api'

export const useUserStore = defineStore('user', () => {
  const login = ref('')
  const id = ref(-1)
  const avatar = ref('')
  const alias = reactive({
    name: '',
    bgColor: '',
    color: ''
  })

  const setLogin = (newLogin: string) => {
    login.value = newLogin
  }

  const setAvatar = (newAvatar: string) => {
    avatar.value = newAvatar
  }

  const setAliasName = (name: string) => {
    alias.name = name
  }

  const setAliasColor = (color: string) => {
    alias.color = color
  }

  const createAliasName = () => {
    const name = login.value.split(' ')
    const nameClear = []
    for (const item of name) {
      if (item !== '') nameClear.push(item)
    }

    const firstItem = nameClear[0]
    let aliasName = firstItem.charAt(0).toUpperCase()
    if (nameClear.length === 1) {
      for (let i = 1; i < firstItem.length; i++) {
        if (firstItem.charAt(i) === firstItem.charAt(i).toUpperCase()) {
          aliasName += firstItem.charAt(i)
          break
        }
      }
      if (aliasName.length === 1 && firstItem.length > 1) aliasName += firstItem.charAt(1)
    } else {
      aliasName += nameClear[1].charAt(0).toUpperCase()
    }
    setAliasName(aliasName)
  }

  const createAliasColor = () => {
    let bgColor = ''
    for (let i = 0; i < 3; i++) {
      let x = Math.floor(Math.random() * 256).toString(16)
      if (x.length === 1) x = '0' + x
      bgColor += x
    }

    setAliasColor(bgColor)
  }

  const authFetch = async (password: string, isNewUser: boolean) => {
    try {
      const formData = new FormData()
      formData.append('login', encode(login.value))
      formData.append('password', encode(password))
      if (isNewUser) {
        if (avatar.value) {
          formData.append('avatar', avatar.value)
        } else {
          formData.append('aliasName', alias.name)
          formData.append('aliasColor', alias.color)
        }
      }
      const retcode = await $api.post(
        `${import.meta.env.VITE_SERVER_URL}/${isNewUser ? 'auth' : 'login'}`,
        formData
      )
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
      const retcode = await $apiAuth.get(`${import.meta.env.VITE_SERVER_URL}/auth`)
      if (retcode.status === 200) {
        id.value = retcode.data.id
        setLogin(retcode.data.login)
        setAliasColor(retcode.data.aliasColor)
        setAliasName(retcode.data.aliasName)
      }
    } catch (error) {
      console.log((error as Error).message)
      throw error
    }
  }
  return {
    login,
    id,
    alias,
    avatar,
    setLogin,
    setAvatar,
    createAliasName,
    createAliasColor,
    setAliasName,
    setAliasColor,
    authFetch,
    isAuthFetch
  }
})
