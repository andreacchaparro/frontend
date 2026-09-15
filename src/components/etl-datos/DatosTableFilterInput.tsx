import { useEffect, useRef, useState } from 'react'

interface Props {
  clave: string
  value: string
  onChange: (clave: string, valor: string) => void
}

// Debounce local: el input queda controlado por su propio estado para no
// perder tecleo mientras se espera el debounce, y solo dispara onChange
// (que termina disparando el fetch) 400ms después de la última tecla.
export function DatosTableFilterInput({ clave, value, onChange }: Props) {
  const [local, setLocal] = useState(value)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    setLocal(value)
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = e.target.value
    setLocal(valor)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => onChange(clave, valor), 400)
  }

  return (
    <input
      type="text"
      placeholder="filtrar…"
      value={local}
      onChange={handleChange}
      className="w-full border border-border rounded-md px-2 py-1 text-xs bg-panel text-fg focus:outline-none focus:ring-1 focus:ring-brand-teal"
    />
  )
}
