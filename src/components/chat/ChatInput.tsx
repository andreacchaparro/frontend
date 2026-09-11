import { useState } from 'react'
import type { KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled = false }: Props) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2 p-3 border-t border-border bg-panel">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu pregunta…"
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50 max-h-32"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="shrink-0 bg-green-700 hover:bg-green-800 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Enviar mensaje"
      >
        ➤
      </button>
    </div>
  )
}
