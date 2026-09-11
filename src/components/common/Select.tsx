interface Option {
  value: string
  label: string
  disabled?: boolean
}

interface Props {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
}

export function Select({ label, value, options, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-fg-muted font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
