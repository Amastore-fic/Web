import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { InsigniaEstado, InsigniaRol, Iniciales } from './Insignias'
 
const th = 'px-[30px] py-4 text-left text-[16px] font-medium text-gray-700'
const td = 'px-[30px] py-4 align-middle'
 
function fecha(iso) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
 
function Accion({ usuario, onAccion }) {
  // A los administradores no se les puede bloquear ni desbloquear
  if (usuario.rol === 'administrador') return null
 
  return usuario.activo ? (
    <button
      type="button"
      onClick={() => onAccion(usuario)}
      className="inline-flex h-[45px] items-center gap-2 rounded-md border border-red-800 bg-white px-4 text-[16px] font-medium text-red-800 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
    >
      <LockOutlinedIcon sx={{ fontSize: 20 }} />
      Bloquear
    </button>
  ) : (
    <button
      type="button"
      onClick={() => onAccion(usuario)}
      className="inline-flex h-[45px] items-center gap-2 rounded-md bg-green-800 px-4 text-[16px] font-medium text-white hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
    >
      <LockOpenOutlinedIcon sx={{ fontSize: 20 }} />
      Desbloquear
    </button>
  )
}
 
export default function TablaUsuarios({ usuarios, cargando, error, onAccion }) {
  return (
    <div className="overflow-x-auto" aria-busy={cargando}>
      <table className="w-full min-w-[820px] border-collapse">
        <thead className="bg-[#F3F6F5]">
          <tr>
            <th scope="col" className={th}>Usuario</th>
            <th scope="col" className={th}>Rol</th>
            <th scope="col" className={th}>Estado</th>
            <th scope="col" className={th}>Registro</th>
            <th scope="col" className={`${th} text-right`}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-b border-gray-200">
              <td className={td}>
                <div className="flex items-center gap-4">
                  <Iniciales usuario={u} />
                  <div>
                    <p className="text-[15px] font-semibold text-black">
                      {u.nombre} {u.apellido}
                    </p>
                    <p className="text-[14.5px] text-gray-600">{u.correo}</p>
                  </div>
                </div>
              </td>
              <td className={td}><InsigniaRol rol={u.rol} /></td>
              <td className={td}><InsigniaEstado activo={u.activo} /></td>
              <td className={`${td} text-[17px] text-black`}>{fecha(u.created_at)}</td>
              <td className={`${td} text-right`}>
                <Accion usuario={u} onAccion={onAccion} />
              </td>
            </tr>
          ))}
          {!cargando && !error && usuarios.length === 0 && (
            <tr>
              <td colSpan={5} className="px-[30px] py-16 text-center text-gray-600">
                No hay usuarios que coincidan con la búsqueda. Prueba con otro nombre o quita los
                filtros.
              </td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan={5} className="px-[30px] py-16 text-center text-red-800">
                No se pudo cargar la lista de usuarios: {error.message}
              </td>
            </tr>
          )}
          {cargando && usuarios.length === 0 && (
            <tr>
              <td colSpan={5} className="px-[30px] py-16 text-center text-gray-600">
                Cargando usuarios…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}