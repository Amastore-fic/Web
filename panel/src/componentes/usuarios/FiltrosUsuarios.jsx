import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
 
const claseControl =
  'h-[48px] w-full rounded-md border border-gray-400 bg-white px-4 text-[15px] text-gray-700 placeholder:text-gray-500 focus:border-panel-acento focus:outline-none focus:ring-2 focus:ring-panel-acento/40'
 
function Selector({ valor, onChange, etiqueta, opciones }) {
  return (
    <div className="relative lg:w-[200px]">
      <select
        aria-label={etiqueta}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className={`${claseControl} cursor-pointer appearance-none pr-10`}
      >
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
      <KeyboardArrowDownRoundedIcon className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-600" />
    </div>
  )
}
 
const OPCIONES_ROL = [
  { valor: '', texto: 'Todos los roles' },
  { valor: 'cliente', texto: 'Clientes' },
  { valor: 'vendedor', texto: 'Vendedores' },
  { valor: 'administrador', texto: 'Administradores' },
]
 
const OPCIONES_ESTADO = [
  { valor: '', texto: 'Todos los estados' },
  { valor: '1', texto: 'Activos' },
  { valor: '0', texto: 'Bloqueados' },
]
 
export default function FiltrosUsuarios({ busqueda, rol, estado, onBusqueda, onRol, onEstado }) {
  return (
    <div className="flex gap-4 p-5 flex-row">
      <div className="relative flex-1">
        <input
          type="search"
          aria-label="Buscar usuario por nombre o correo"
          placeholder="Buscar usuario por nombre o correo..."
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          className={`${claseControl} pr-12 [&::-webkit-search-cancel-button]:hidden`}
        />
        <SearchRoundedIcon className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-600" />
      </div>
      <Selector valor={rol} onChange={onRol} etiqueta="Filtrar por rol" opciones={OPCIONES_ROL} />
      <Selector
        valor={estado}
        onChange={onEstado}
        etiqueta="Filtrar por estado"
        opciones={OPCIONES_ESTADO}
      />
    </div>
  )
}