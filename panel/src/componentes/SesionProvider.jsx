import { useState } from 'react'
import { api, sesion } from '../api'
import { SesionContext } from '../hooks/useSesion'

const ROLES_PANEL = ['vendedor', 'administrador']

export default function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(() => sesion.usuario())

  async function iniciar(correo, password) {
    const datos = await api.post('/auth/login', { correo, password, dispositivo: 'web-panel' })
    if (!ROLES_PANEL.includes(datos.usuario.rol)) {
      throw new Error('El panel es solo para vendedores y administradores.')
    }
    sesion.guardar(datos)
    setUsuario(datos.usuario)
    return datos.usuario
  }

  async function cerrar() {
    await api.post('/auth/logout').catch(() => {})
    sesion.cerrar()
    setUsuario(null)
  }

  return (
    <SesionContext.Provider value={{ usuario, iniciar, cerrar }}>{children}</SesionContext.Provider>
  )
}
