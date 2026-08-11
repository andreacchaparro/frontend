import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useSitios } from '@/hooks/useSitios'
import { useAppStore } from '@/store/useAppStore'
import { useThemeStore } from '@/store/useThemeStore'
import { GAS_COLORS, formatValor } from '@/utils/formatters'

const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
const MAP_STYLE_OVERRIDE = import.meta.env.VITE_MAP_STYLE

const SATELLITE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [{ id: 'satellite', type: 'raster', source: 'satellite' }],
}

type BasemapMode = 'map' | 'satellite'

const COLOMBIA_CENTER: [number, number] = [-74.297, 4.571]

export function GeoMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const sitiosMarkersRef = useRef<maplibregl.Marker[]>([])

  const { data: sitios } = useSitios()
  const { filters } = useAppStore()
  const isDark = useThemeStore((s) => s.theme === 'dark')
  const [basemap, setBasemap] = useState<BasemapMode>('map')

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE_OVERRIDE ?? (isDark ? DARK_STYLE : LIGHT_STYLE),
      center: COLOMBIA_CENTER,
      zoom: 5,
    })

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right')
    mapRef.current.addControl(new maplibregl.ScaleControl(), 'bottom-right')

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Swap basemap style when the theme or satellite toggle changes
  useEffect(() => {
    if (!mapRef.current) return

    if (basemap === 'satellite') {
      mapRef.current.setStyle(SATELLITE_STYLE)
      return
    }

    if (MAP_STYLE_OVERRIDE) return
    mapRef.current.setStyle(isDark ? DARK_STYLE : LIGHT_STYLE)
  }, [isDark, basemap])

  // Render sitios georreferenciados (GeoJSON) as pins, filtered by proyecto
  useEffect(() => {
    if (!mapRef.current || !sitios?.features.length) return

    sitiosMarkersRef.current.forEach((m) => m.remove())
    sitiosMarkersRef.current = []

    const color = GAS_COLORS.CO2

    const features = filters.proyectoId
      ? sitios.features.filter((f) =>
          f.properties.proyectos.some((p) => p.id === filters.proyectoId)
        )
      : sitios.features

    features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates
      const p = feature.properties

      const el = document.createElement('div')
      el.style.cssText = `
        width: 14px;
        height: 14px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: ${color};
        border: 2px solid #0f172a;
        cursor: pointer;
      `

      const proyectos = p.proyectos.map((pr) => pr.nombre).join(', ') || '—'
      const ubicacion = [p.municipio, p.departamento].filter(Boolean).join(', ') || 'Sin datos'
      const altitud = p.altitud != null ? `${p.altitud.toFixed(0)} m s.n.m.` : 'Sin datos'
      const ultimaMedicion = p.ultima_medicion_co2
        ? `${formatValor(p.ultima_medicion_co2.valor, p.ultima_medicion_co2.unidad)} (${p.ultima_medicion_co2.fecha})`
        : 'Sin datos'

      const popup = new maplibregl.Popup({ offset: 20, closeButton: false }).setHTML(`
        <strong style="color:#0f172a">${p.nombre || 'Sitio ' + p.id}</strong>
        <br/><span style="color:#374151">Ubicación: ${ubicacion}</span>
        <br/><span style="color:#374151">Altitud: ${altitud}</span>
        <br/><span style="color:#374151">Proyecto(s): ${proyectos}</span>
        <br/><span style="color:#374151">Unidades de muestreo: ${p.unidades_muestreo.length}</span>
        <br/><span style="color:#374151">Última medición: ${ultimaMedicion}</span>
        <br/><span style="color:#374151">Total de muestras: ${p.total_muestras_co2}</span>
      `)

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current!)

      sitiosMarkersRef.current.push(marker)
    })
  }, [sitios, filters.proyectoId])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-3 left-3 z-10 flex overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => setBasemap('map')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            basemap === 'map'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Mapa
        </button>
        <button
          type="button"
          onClick={() => setBasemap('satellite')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            basemap === 'satellite'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Satélite
        </button>
      </div>
    </div>
  )
}
