import { useRef } from 'react'
import { Link } from 'react-router-dom'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { useDireccionEnvio } from '../hooks/useDireccionEnvio'

const primerNombre = (texto) => (texto ?? '').trim().split(/\s+/)[0]

// Boton "Enviar a ..." del encabezado. Abre una ventana para elegir rapido a que
// direccion se envia (ver DireccionEnvioProvider).
export default function SelectorDireccion() {
  const { direcciones, direccion, elegir, cargando } = useDireccionEnvio()
  const ventana = useRef(null)

  const abrir = () => ventana.current?.showModal()
  const cerrar = () => ventana.current?.close()

  function seleccionar(id) {
    elegir(id)
    cerrar()
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        aria-haspopup="dialog"
        className="flex cursor-pointer items-center gap-1.5 rounded-[7px] border border-transparent px-2 py-1.5 text-left text-white hover:border-white/70"
      >
        <LocationOnOutlinedIcon sx={{ fontSize: 22 }} />
        <span className="flex flex-col leading-tight">
          <span className="text-[12px] text-gray-300">
            {direccion ? `Enviar a ${primerNombre(direccion.destinatario)}` : 'Enviar a'}
          </span>
          <span className="max-w-40 truncate text-[14px] font-bold">
            {cargando
              ? '...'
              : direccion
                ? `${direccion.ciudad} ${direccion.codigo_postal}`
                : 'Agrega una dirección'}
          </span>
        </span>
      </button>

      {/* <dialog> con showModal: atrapa el foco y se cierra con Esc */}
      <dialog
        ref={ventana}
        aria-labelledby="selector-direccion-titulo"
        onClick={(e) => e.target === e.currentTarget && cerrar()}
        className="m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-lg p-0 text-[#1B1F2E] shadow-xl backdrop:bg-black/50"
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-4">
          <h2 id="selector-direccion-titulo" className="text-lg font-bold">
            Elige tu dirección de envío
          </h2>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="cursor-pointer rounded-md p-1 text-gray-600 hover:bg-gray-200"
          >
            <CloseRoundedIcon />
          </button>
        </div>

        <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto px-5 py-4">
          {direcciones.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-600">
              Aún no tienes direcciones guardadas.
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Usaremos esta dirección al confirmar tu compra. Puedes cambiarla en cualquier
                momento.
              </p>
              <ul className="flex flex-col gap-2.5">
                {direcciones.map((d) => {
                  const elegida = d.id === direccion?.id
                  return (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => seleccionar(d.id)}
                        aria-pressed={elegida}
                        className={`w-full cursor-pointer rounded-lg border px-4 py-3 text-left text-sm ${
                          elegida
                            ? 'border-2 border-[#607ADB] bg-[#607ADB]/10'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="block text-[15px] font-semibold">{d.destinatario}</span>
                        <span className="block text-gray-700">
                          {d.calle} {d.numero_exterior}
                          {d.numero_interior ? `, int. ${d.numero_interior}` : ''}, col. {d.colonia}
                          , {d.ciudad}, {d.estado}, C.P. {d.codigo_postal}
                        </span>
                        {elegida && (
                          <span className="mt-1 block font-semibold text-[#607ADB]">
                            Dirección elegida
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          <Link
            to="/perfil/direcciones"
            onClick={cerrar}
            className="self-start text-sm font-semibold text-[#607ADB] hover:underline"
          >
            {direcciones.length === 0 ? 'Agregar una dirección' : 'Agregar o editar direcciones'}
          </Link>
        </div>
      </dialog>
    </>
  )
}
