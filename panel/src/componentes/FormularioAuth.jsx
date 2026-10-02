// Piezas de los formularios de cuenta del panel. Mismo diseno que
// tienda/src/componentes/FormularioAuth.jsx para que ambas apps se vean iguales.

export const claseBotonPrincipal =
  'w-full rounded-md bg-panel-acento px-4 py-2.5 text-[15px] font-semibold text-white cursor-pointer hover:bg-panel-acento-hover disabled:cursor-not-allowed disabled:opacity-60'

// Tarjeta centrada con titulo y subtitulo
export function TarjetaAuth({ titulo, subtitulo, children, ancho = 'max-w-md' }) {
  return (
    <section className="flex justify-center bg-gray-100 px-3.5 py-10 sm:px-5 sm:py-14 lg:py-20">
      <div
        className={`w-full ${ancho} rounded-lg bg-white p-6 shadow-[0_0_8px_3px_rgba(0,0,0,0.08)] sm:p-8`}
      >
        <h1 className="text-2xl font-bold text-panel-oscuro">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-panel-tenue">{subtitulo}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  )
}

// Grupo de campos con su titulo (por ejemplo "Datos de tu negocio")
export function Seccion({ titulo, descripcion, children }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-3">
        <span className="block text-[15px] font-bold text-panel-oscuro">{titulo}</span>
        {descripcion && (
          <span className="mt-0.5 block text-xs text-panel-tenue">{descripcion}</span>
        )}
      </legend>
      {children}
    </fieldset>
  )
}

// Campo con etiqueta, ayuda opcional y mensaje de error debajo.
// multilinea: usa <textarea> en lugar de <input>.
export function Campo({ id, etiqueta, error, ayuda, multilinea = false, ...props }) {
  const Control = multilinea ? 'textarea' : 'input'
  const descripciones = [error && `${id}-error`, ayuda && `${id}-ayuda`].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-panel-oscuro">
        {etiqueta}
      </label>
      <Control
        id={id}
        className={`rounded-md border bg-white px-3 py-2.5 text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-panel-acento/40 ${
          multilinea ? 'min-h-24 resize-y' : ''
        } ${error ? 'border-red-500' : 'border-gray-300 focus:border-panel-acento'}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={descripciones || undefined}
        {...props}
      />
      {ayuda && !error && (
        <p id={`${id}-ayuda`} className="text-xs text-panel-tenue">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

// Mensaje general del formulario: error (rojo) o exito (verde)
export function Alerta({ tipo = 'error', children }) {
  const estilos =
    tipo === 'exito'
      ? 'border-green-200 bg-green-50 text-green-800'
      : 'border-red-200 bg-red-50 text-red-700'
  return (
    <p
      role={tipo === 'exito' ? 'status' : 'alert'}
      className={`rounded-md border px-3 py-2.5 text-sm ${estilos}`}
    >
      {children}
    </p>
  )
}
