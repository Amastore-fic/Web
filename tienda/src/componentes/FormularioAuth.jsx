// Piezas compartidas por las pantallas de inicio de sesion y registro.

export const claseBotonPrincipal =
  'w-full rounded-md bg-[#607ADB] px-4 py-2.5 text-[15px] font-semibold text-white cursor-pointer hover:bg-[#4f68c4] disabled:cursor-not-allowed disabled:opacity-60'

// Tarjeta centrada con titulo y subtitulo
export function TarjetaAuth({ titulo, subtitulo, children, ancho = 'max-w-md' }) {
  return (
    <section className="flex justify-center bg-gray-100 px-3.5 py-10 sm:px-5 sm:py-14 lg:py-20">
      <div
        className={`w-full ${ancho} rounded-lg bg-white p-6 shadow-[0_0_8px_3px_rgba(0,0,0,0.08)] sm:p-8`}
      >
        <h1 className="text-2xl font-bold text-[#1B1F2E]">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-[#8A8FA3]">{subtitulo}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  )
}

// Campo con etiqueta y mensaje de error debajo.
// multilinea: usa <textarea>; opciones: usa <select> con esas opciones.
export function Campo({ id, etiqueta, error, multilinea = false, opciones, ...props }) {
  const Control = opciones ? 'select' : multilinea ? 'textarea' : 'input'

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-[#1B1F2E]">
        {etiqueta}
      </label>
      <Control
        id={id}
        className={`rounded-md border bg-white px-3 py-2.5 text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#607ADB]/40 ${
          multilinea ? 'min-h-24 resize-y' : ''
        } ${error ? 'border-red-500' : 'border-gray-300 focus:border-[#607ADB]'}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {opciones && (
          <>
            <option value="">Elige una opción</option>
            {opciones.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </>
        )}
      </Control>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

// Mensaje de error general del formulario
export function AlertaError({ children }) {
  return (
    <p
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
    >
      {children}
    </p>
  )
}

// Mensaje de exito general del formulario
export function AlertaExito({ children }) {
  return (
    <p
      role="status"
      className="rounded-md border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800"
    >
      {children}
    </p>
  )
}
