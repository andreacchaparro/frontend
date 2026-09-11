export function ChatTypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-panel border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-fg-subtle animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-fg-subtle animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-fg-subtle animate-bounce" />
      </div>
    </div>
  )
}
