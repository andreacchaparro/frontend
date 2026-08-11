import type { SitiosFeatureCollection, SerieResponse, SeriesFilters } from '@/types'

const GEO_API_BASE = import.meta.env.VITE_GEO_API_BASE_URL ?? 'http://localhost:8000/api/geo'

export const geoService = {
  getSitios: async (): Promise<SitiosFeatureCollection> => {
    const url = `${GEO_API_BASE}/sitios/`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`API error ${res.status}: ${url}`)
    return res.json() as Promise<SitiosFeatureCollection>
  },

  getSeries: async (filters: SeriesFilters = {}): Promise<SerieResponse> => {
    const params = new URLSearchParams(
      Object.entries(filters)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    )
    const query = params.toString()
    const url = `${GEO_API_BASE}/series/${query ? `?${query}` : ''}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`API error ${res.status}: ${url}`)
    return res.json() as Promise<SerieResponse>
  },
}
