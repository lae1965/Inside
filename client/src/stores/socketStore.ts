import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { io, Socket } from 'socket.io-client'

interface SocketState {
  socket: Socket | null
}

interface Message {
  authorId: number
  topicId: number
  message: string
}

export const useSocketStore = defineStore('socket', () => {
  const socketState = reactive<SocketState>({ socket: null })

  const initSocket = () => {
    socketState.socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: `Bearer ${window.localStorage.getItem('token')}`
      },
      transports: ['websocket']
    })
    socketState.socket.connect()
  }

  const disconnectSocket = () => {
    if (socketState.socket) {
      socketState.socket.disconnect()
      socketState.socket.close()
    }
  }

  const emitSocketEvent = (data: Message) => {
    if (socketState.socket) {
      socketState.socket.emit('chat', data)
    }
  }

  const subscribeToChatEvent = (callback: (data: any) => void) => {
    if (socketState.socket) {
      socketState.socket.on('chat', callback)
    }
  }

  const subscribeToError = (callback: (error: Error) => void) => {
    if (socketState.socket) {
      socketState.socket.on('error', callback)
    }
  }
  return {
    initSocket,
    disconnectSocket,
    emitSocketEvent,
    subscribeToChatEvent,
    subscribeToError
  }
})
