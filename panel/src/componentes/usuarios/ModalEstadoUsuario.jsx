import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { useEffect } from 'react'
import { InsigniaEstado, InsigniaRol, Iniciales } from './Insignias'
 
// Textos por accion y rol. Solo el vendedor tiene productos, por eso solo a el
// se le menciona la visibilidad de sus publicaciones.
function textoDescripcion(bloquear, rol) {
  const esVendedor = rol === 'vendedor'
  if (bloquear) {
    return `No podrá iniciar sesión ni usar la plataforma hasta que lo desbloquees.${
      esVendedor ? ' Sus productos se desactivarán.' : ''
    }`
  }
  return `Podrá volver a iniciar sesión y usar la plataforma de inmediato.${
    esVendedor ? ' Sus productos volverán a activarse.' : ''
  }`
}
 
// `usuario` es el usuario actual de la fila; `bloquear` es true si hoy esta activo.
export default function ModalEstadoUsuario({ usuario, procesando, onConfirmar, onCancelar }) {
  useEffect(() => {
    if (!usuario) return
    const alTeclear = (e) => e.key === 'Escape' && !procesando && onCancelar()
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [usuario, procesando, onCancelar])
 
  if (!usuario) return null
 
  const bloquear = usuario.activo
  const titulo = bloquear ? 'Bloquear usuario' : 'Desbloquear usuario'
  const nombre = `${usuario.nombre} ${usuario.apellido}`
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !procesando && onCancelar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-estado-titulo"
        className="w-full max-w-[526px] overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between bg-panel-oscuro px-9 py-3 text-white">
          <h2 id="modal-estado-titulo" className="text-[17px] font-semibold">
            {titulo}
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            disabled={procesando}
            onClick={onCancelar}
            className="rounded p-1 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            <CloseRoundedIcon />
          </button>
        </div>
 
        <div className="px-6 pt-9 pb-4 sm:px-9">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <span
              className={`flex size-[90px] shrink-0 items-center justify-center rounded-full text-white ${
                bloquear ? 'bg-red-700' : 'bg-green-700'
              }`}
            >
              {bloquear ? (
                <LockRoundedIcon sx={{ fontSize: 60 }} />
              ) : (
                <LockOpenRoundedIcon sx={{ fontSize: 60 }} />
              )}
            </span>
            <div>
              <p className="text-[17px] font-semibold text-black">
                {bloquear ? `¿Bloquear a ${nombre}?` : `¿Desbloquear a ${nombre}?`}
              </p>
              <p className="mt-3 text-[16px] leading-snug text-gray-900">
                {textoDescripcion(bloquear, usuario.rol)}
              </p>
            </div>
          </div>
 
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-md bg-[#F3F6F5] p-3">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <Iniciales usuario={usuario} className="size-[47px] text-[17px]" />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-black">{nombre}</p>
                <p className="truncate text-[14px] text-gray-600">{usuario.correo}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <InsigniaRol rol={usuario.rol} />
              <InsigniaEstado activo={usuario.activo} />
            </div>
          </div>
        </div>
 
        <div className="flex justify-end gap-5 border-t border-gray-200 px-6 py-5 sm:px-9">
          <button
            type="button"
            disabled={procesando}
            onClick={onCancelar}
            className="h-[42px] rounded-md border border-gray-400 bg-white px-5 text-[15px] text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={procesando}
            onClick={() => onConfirmar(usuario)}
            className={`h-[42px] rounded-md px-5 text-[15px] font-medium text-white disabled:opacity-60 ${
              bloquear ? 'bg-red-700 hover:bg-red-800' : 'bg-green-800 hover:bg-green-900'
            }`}
          >
            {procesando ? 'Procesando…' : titulo}
          </button>
        </div>
      </div>
    </div>
  )
}