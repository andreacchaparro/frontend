// Descarga el archivo servido por `url`. Se hace fetch primero (en vez de
// navegar directo) para poder detectar un 404 con {"error": "..."} del
// backend y mostrarlo en vez de dejar que el navegador intente abrir el JSON
// como si fuera el archivo.
export async function downloadFile(url: string): Promise<void> {
  const res = await fetch(url)

  if (!res.ok) {
    let mensaje = `Error ${res.status} al descargar el archivo.`
    try {
      const data = await res.json()
      if (data?.error) mensaje = data.error
    } catch {
      // el error no vino como JSON, se deja el mensaje genérico
    }
    throw new Error(mensaje)
  }

  const blob = await res.blob()
  const disposition = res.headers.get('Content-Disposition') ?? ''
  const match = /filename="?([^";]+)"?/.exec(disposition)
  const filename = match?.[1] ?? 'descarga.xlsx'

  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}
