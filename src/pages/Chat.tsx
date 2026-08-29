import { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { ChatTypingIndicator } from '@/components/chat/ChatTypingIndicator'
import { ChatInput } from '@/components/chat/ChatInput'

export function Chat() {
  const { messages, sendMessage, isSending } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full h-[calc(100vh-3.5rem)]">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-xl font-bold text-fg">Asistente COLFLUX</h1>
        <p className="text-sm text-fg-muted mt-1">
          Pregunta sobre los datos de gases de efecto invernadero de la plataforma.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {!messages.length && (
          <p className="text-sm text-fg-subtle text-center mt-10">
            Escribe una pregunta para comenzar la conversación.
          </p>
        )}
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {isSending && <ChatTypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} disabled={isSending} />
    </div>
  )
}
