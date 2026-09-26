import { useState } from 'react'
import { api, sesion } from '../api'
import { SesionContext } from '../hooks/useSesion'

export default function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(() => sesion.usuario())

  async function iniciar(correo, password) {
    const datos = await api.post('/auth/login', { correo, password, dispositivo: 'web-tienda' })
    if (datos.usuario.rol !== 'cliente') {
      throw new Error('Esta cuenta no es de cliente. Vendedores y administradores usan el panel.')
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
