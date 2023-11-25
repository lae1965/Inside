export interface Reaction {
  reaction: string
  author: string
  authorId: number
  avatar?: string | null
  aliasName?: string
  aliasColor?: string
}

export interface Message {
  id: number
  message: string
  author: string
  avatar: string | null
  aliasName: string
  aliasColor: string
  reactions: Reaction[]
}

export interface Topic {
  id: number
  topic: string
  author: string
  avatar: string | null
  aliasName: string
  aliasColor: string
}
