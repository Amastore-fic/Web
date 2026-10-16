const base = 'inline-block rounded px-3 py-1 text-[14px] font-semibold whitespace-nowrap'
 
const ROLES = {
  cliente: { texto: 'Cliente', clases: 'bg-gray-100 text-gray-700' },
  vendedor: { texto: 'Vendedor', clases: 'bg-blue-100 text-blue-800' },
  administrador: { texto: 'Administrador', clases: 'bg-purple-100 text-purple-800' },
}
 
export function InsigniaRol({ rol }) {
  const config = ROLES[rol] ?? { texto: rol, clases: 'bg-gray-100 text-gray-700' }
  return <span className={`${base} ${config.clases}`}>{config.texto}</span>
}
 
export function InsigniaEstado({ activo }) {
  return (
    <span
      className={`${base} ${activo ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}
    >
      {activo ? 'Activo' : 'Bloqueado'}
    </span>
  )
}
 
export function Iniciales({ usuario, className = 'size-[46px] text-[16px]' }) {
  const texto = `${usuario.nombre?.[0] ?? ''}${usuario.apellido?.[0] ?? ''}`.toUpperCase()
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-900 ${className}`}
    >
      {texto}
    </span>
  )
}