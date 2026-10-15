// Piezas de "Mi cuenta" y sus subpaginas (paginas/cuenta/).
import { Link } from 'react-router-dom'
import { REQUISITOS_PASSWORD } from '@shared/perfil/campos'
import { Alerta, Campo } from '../FormularioAuth'

export const claseBoton =
  'rounded-md bg-panel-acento px-4 py-2 text-[14px] font-semibold text-white cursor-pointer hover:bg-panel-acento-hover disabled:cursor-not-allowed disabled:opacity-60'

export const claseBotonSecundario =
  'rounded-md border border-gray-300 bg-white px-4 py-2 text-[14px] font-semibold text-panel-oscuro cursor-pointer hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'

// Tarjeta blanca para cada bloque de una subpagina de "Mi cuenta"
export function TarjetaPerfil({ id, titulo, descripcion, accion, children }) {
  return (
    <section
      id={id}
      aria-labelledby={titulo ? `${id}-titulo` : undefined}
      className="rounded-lg border border-gray-200 bg-white p-5 sm:p-7"
    >
      {(titulo || accion) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          {titulo && (
            <div>
              <h2 id={`${id}-titulo`} className="text-lg font-bold text-panel-oscuro">
                {titulo}
              </h2>
              {descripcion && <p className="mt-0.5 text-sm text-panel-tenue">{descripcion}</p>}
            </div>
          )}
          {accion}
        </div>
      )}
      {children}
    </section>
  )
}

// Rejilla de campos a partir de las definiciones de @shared/perfil/campos.
// formulario: lo que devuelve useFormulario. verPassword: muestra las contrasenas.
export function CamposFormulario({ prefijo, campos, formulario, verPassword = false }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {campos.map((campo) => {
        const valor = formulario.datos[campo.nombre] ?? ''
        // Un valor guardado que no esta en la lista (por ejemplo "CDMX") se conserva como opcion
        const opciones =
          campo.opciones && valor && !campo.opciones.includes(valor)
            ? [valor, ...campo.opciones]
            : campo.opciones

        return (
          <div key={campo.nombre} className={campo.completo ? 'sm:col-span-2' : ''}>
            <Campo
              id={`${prefijo}-${campo.nombre}`}
              etiqueta={campo.etiqueta}
              type={campo.tipo === 'password' && verPassword ? 'text' : (campo.tipo ?? 'text')}
              autoComplete={campo.autoComplete}
              inputMode={campo.inputMode}
              placeholder={campo.placeholder}
              maxLength={campo.maxLength}
              multilinea={campo.multilinea}
              opciones={opciones}
              value={valor}
              onChange={(e) => formulario.cambiar(campo, e.target.value)}
              onBlur={() => formulario.salir(campo.nombre)}
              error={formulario.errorVisible(campo.nombre)}
            />
          </div>
        )
      })}
    </div>
  )
}

export function AvisoFormulario({ mensaje }) {
  if (!mensaje) return null
  return <Alerta tipo={mensaje.tipo}>{mensaje.texto}</Alerta>
}

// Requisitos de la contrasena: se marcan en verde conforme se cumplen
export function RequisitosPassword({ password }) {
  return (
    <ul className="flex flex-col gap-1 text-xs" aria-label="Requisitos de la contraseña">
      {REQUISITOS_PASSWORD.map((requisito) => {
        const cumple = requisito.cumple(password)
        return (
          <li
            key={requisito.id}
            className={`flex items-center gap-1.5 ${cumple ? 'text-green-700' : 'text-panel-tenue'}`}
          >
            <span aria-hidden="true">{cumple ? '✓' : '•'}</span>
            {requisito.texto}
            <span className="sr-only">{cumple ? ' (cumplido)' : ' (pendiente)'}</span>
          </li>
        )
      })}
    </ul>
  )
}

// Tarjeta de "Mi cuenta" que lleva a una subpagina: icono, titulo y descripcion
export function TarjetaOpcion({ a, Icono, titulo, descripcion }) {
  return (
    <Link
      to={a}
      className="group flex h-full items-start gap-4 rounded-lg border border-gray-200 bg-white p-5 transition hover:border-panel-acento/60 hover:bg-panel-acento/5 focus-visible:ring-2 focus-visible:ring-panel-acento/40 focus-visible:outline-none"
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-panel-acento/15 text-panel-acento">
        <Icono sx={{ fontSize: 30 }} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[17px] font-semibold text-panel-oscuro group-hover:text-panel-acento">
          {titulo}
        </span>
        <span className="text-sm leading-snug text-gray-600">{descripcion}</span>
      </span>
    </Link>
  )
}
