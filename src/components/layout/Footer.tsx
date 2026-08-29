import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-green-800 text-green-50 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🌿
            </span>
            <span className="text-sm font-bold uppercase tracking-wide">Colflux</span>
          </div>
          <p className="text-xs text-green-100/80 mt-2 leading-relaxed">
            Sistema integrado de observación y cuantificación de carbono en Colombia.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-green-200 mb-3">
            Enlaces rápidos
          </h4>
          <ul className="flex flex-col gap-2 text-sm text-green-50/90">
            <li>
              <Link to="/" className="hover:underline">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/mapas" className="hover:underline">
                Mapas
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:underline">
                Datos abiertos
              </Link>
            </li>
            <li>
              <Link to="/reportar" className="hover:underline">
                Reportar
              </Link>
            </li>
            <li>
              <Link to="/educacion" className="hover:underline">
                Educación
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-green-200 mb-3">
            Síguenos
          </h4>
          <div className="flex gap-3 text-lg">
            <span aria-hidden>📘</span>
            <span aria-hidden>🐦</span>
            <span aria-hidden>📸</span>
            <span aria-hidden>💼</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-green-200 mb-3">
            Contáctanos
          </h4>
          <ul className="flex flex-col gap-2 text-sm text-green-50/90">
            <li>✉️ colflux@example.com</li>
            <li>📍 Bogotá, Colombia</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-green-700/60 py-4 text-center text-xs text-green-100/70">
        Hecho con 💚 por la naturaleza y las comunidades
      </div>
    </footer>
  )
}
