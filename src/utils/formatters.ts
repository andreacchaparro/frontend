export const GAS_COLORS: Record<string, string> = {
  CO2: '#22c55e',
  CH4: '#f59e0b',
  N2O: '#3b82f6',
}

export const GAS_LABELS: Record<string, string> = {
  CO2: 'CO₂ — Dióxido de carbono',
  CH4: 'CH₄ — Metano (próximamente)',
  N2O: 'N₂O — Óxido nitroso (próximamente)',
}

export const UNIDAD_LABELS: Record<string, string> = {
  g_m2_h: 'g/m²/h',
  umol_m2_s: 'µmol/m²/s',
  nmol_m2_s: 'nmol/m²/s',
}

export const formatUnidad = (unidad: string): string => UNIDAD_LABELS[unidad] ?? unidad

export const formatValor = (valor: number, unidad: string): string =>
  `${valor.toLocaleString('es-CO', { maximumFractionDigits: 3 })} ${formatUnidad(unidad)}`
