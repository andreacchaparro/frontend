import type { ChatResponse } from '@/types'

const CHAT_API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8001'

export const chatService = {
  postChat: async (message: string): Promise<ChatResponse> => {
    const res = await fetch(`${CHAT_API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) throw new Error(`API error ${res.status}`)
    return res.json() as Promise<ChatResponse>
  },

  postIngest: async (source: string, text: string): Promise<{ chunks_indexed: number }> => {
    const res = await fetch(`${CHAT_API_BASE}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, text }),
    })
    if (!res.ok) throw new Error(`API error ${res.status}`)
    return res.json() as Promise<{ chunks_indexed: number }>
  },
}
