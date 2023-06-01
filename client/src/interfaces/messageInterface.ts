export interface Reaction {
  reaction: string
  author: string
  authorId: number
  avatar?: string
  aliasName?: string
  aliasColor?: string
}

export interface Message {
  id: number
  message: string
  author: string
  avatar: string
  aliasName: string
  aliasColor: string
  reactions: Reaction[]
}
