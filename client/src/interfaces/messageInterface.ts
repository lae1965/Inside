export interface Reaction {
  reaction: string
  author: string
  authorId: number
}

export interface Message {
  id: number
  message: string
  author: string
  reactions: Reaction[]
}
