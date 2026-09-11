import { useEffect, useRef, useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { ChatTypingIndicator } from '@/components/chat/ChatTypingIndicator'
import { ChatInput } from '@/components/chat/ChatInput'

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const { messages, sendMessage, isSending } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending, open])

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir chat"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-brand-teal hover:bg-brand-teal-dark text-white shadow-md flex items-center justify-center text-2xl transition-colors"
      >
        💬
      </button>
    )
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 w-[22rem] max-w-[calc(100vw-2.5rem)] h-[32rem] max-h-[calc(100vh-6rem)] bg-panel border border-border rounded-2xl shadow-lg flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-border shrink-0 flex items-center justify-between bg-brand-teal text-white">
        <div>
          <h2 className="text-sm font-bold leading-none">Asistente COLFLUX</h2>
          <p className="text-xs text-white/80 mt-1">Pregunta sobre los datos de la plataforma</p>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Minimizar chat"
          className="text-white/80 hover:text-white text-lg leading-none px-1"
        >
          −
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
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
