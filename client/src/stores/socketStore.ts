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

interface Reaction {
  authorId: number
  messageId: number
  reaction?: string
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

  const emitSocketCreateMessageEvent = (data: Message) => {
    socketState.socket?.emit('chat', data)
  }

  const emitSocketCreateReactionEvent = (data: Reaction) => {
    socketState.socket?.emit('reaction-create', data)
  }

  const emitSocketUpdateReactionEvent = (data: Reaction) => {
    socketState.socket?.emit('reaction-update', data)
  }

  const emitSocketRemoveReactionEvent = (data: { authorId: number; messageId: number }) => {
    socketState.socket?.emit('reaction-remove', data)
  }

  const subscribeToEvent = (event: string, callback: (data: any) => void) => {
    socketState.socket?.on(event, callback)
  }

  const subscribeToError = (callback: (error: Error) => void) => {
    socketState.socket?.on('error', callback)
  }
  return {
    initSocket,
    disconnectSocket,
    emitSocketCreateMessageEvent,
    emitSocketCreateReactionEvent,
    emitSocketUpdateReactionEvent,
    emitSocketRemoveReactionEvent,
    subscribeToEvent,
    subscribeToError
  }
})
