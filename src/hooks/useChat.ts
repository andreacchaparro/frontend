import { useCallback, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { chatService } from '@/services/chat.service'
import type { ChatMessage } from '@/types'

let nextId = 0
const makeId = () => `msg-${++nextId}`

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const mutation = useMutation({ mutationFn: chatService.postChat })

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || mutation.isPending) return

      setMessages((prev) => [...prev, { id: makeId(), role: 'user', content: trimmed }])

      try {
        const { answer, sources } = await mutation.mutateAsync(trimmed)
        setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content: answer, sources }])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: 'assistant',
            content: 'No se pudo contactar al asistente. Verifica tu conexión e intenta de nuevo.',
            error: true,
          },
        ])
      }
    },
    [mutation]
  )

  return { messages, sendMessage, isSending: mutation.isPending }
}
