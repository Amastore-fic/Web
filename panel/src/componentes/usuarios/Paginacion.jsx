import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
 
const FILAS = [6, 12, 24] // valores que acepta la validacion de la API
 
const boton =
  'flex size-[35px] items-center justify-center rounded-md border border-gray-300 bg-white text-[16px] text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white focus-visible:outline-2 focus-visible:outline-panel-acento'
 
const base =
  'flex size-[35px] items-center justify-center rounded-md border text-[16px] focus-visible:outline-2 focus-visible:outline-panel-acento disabled:cursor-not-allowed disabled:opacity-40'

const inactivo = `${base} border-gray-300 bg-white text-gray-800 hover:bg-gray-100 disabled:hover:bg-white`

const activo = `${base} border-panel-acento bg-panel-acento text-white hover:bg-panel-acento-hover`

// 1 ... 4 5 6 ... 20
function paginasVisibles(actual, ultima) {
  if (ultima <= 7) return Array.from({ length: ultima }, (_, i) => i + 1)
  const set = new Set([1, ultima, actual - 1, actual, actual + 1])
  const orden = [...set].filter((n) => n >= 1 && n <= ultima).sort((a, b) => a - b)
  return orden.flatMap((n, i) => (i > 0 && n - orden[i - 1] > 1 ? ['…' + n, n] : [n]))
}
 
export default function Paginacion({ datos, filasPorPagina, onFilas, onPagina }) {
  const actual = datos?.current_page ?? 1
  const ultima = datos?.last_page ?? 1
  const rango = datos?.total ? `${datos.from}-${datos.to} de ${datos.total}` : '0 de 0'
 
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row">
      <div className="flex items-center gap-4 text-[15px] text-gray-800">
        <label htmlFor="filas-por-pagina">Filas por página</label>
        <div className="relative">
          <select
            id="filas-por-pagina"
            value={filasPorPagina}
            onChange={(e) => onFilas(Number(e.target.value))}
            className="h-[40px] w-[62px] cursor-pointer appearance-none rounded-md border border-gray-300 bg-white pr-6 pl-3 text-gray-600 focus:outline-2 focus:outline-panel-acento"
          >
            {FILAS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <KeyboardArrowDownRoundedIcon
            sx={{ fontSize: 18 }}
            className="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 text-gray-700"
          />
        </div>
        <span>{rango}</span>
      </div>
 
      <nav aria-label="Paginación" className="flex flex-wrap gap-2.5">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={actual <= 1}
          onClick={() => onPagina(actual - 1)}
          className={boton}
        >
          <ChevronLeftRoundedIcon />
        </button>
        {paginasVisibles(actual, ultima).map((n) =>
          typeof n === 'string' ? (
            <span key={n} className="flex size-[49px] items-center justify-center text-gray-500">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              aria-current={n === actual ? 'page' : undefined}
              onClick={() => onPagina(n)}
              className={n === actual ? activo : inactivo}
            >
              {n}
            </button>
          )
        )}
        <button
          type="button"
          aria-label="Página siguiente"
          disabled={actual >= ultima}
          onClick={() => onPagina(actual + 1)}
          className={inactivo}
        >
          <ChevronRightRoundedIcon />
        </button>
      </nav>
    </div>
  )
}