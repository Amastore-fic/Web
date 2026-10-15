import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { URL_TIENDA } from '@shared/utilidades/enlaces'
import { ROLES_PANEL, ROLES_TIENDA, urlConSesion } from '@shared/sesion/traspaso'
import { api, sesion } from '../api'
import { SesionContext } from '../hooks/useSesion'

export default function SesionProvider({ children }) {
  const queryClient = useQueryClient()
  const [usuario, setUsuario] = useState(() => sesion.usuario())

  async function iniciar(correo, password) {
    const datos = await api.post('/auth/login', { correo, password, dispositivo: 'web-panel' })
    const { rol } = datos.usuario

    // Los clientes compran en la tienda: se les manda alla con su sesion
    if (ROLES_TIENDA.includes(rol)) {
      window.location.assign(urlConSesion(URL_TIENDA, datos.token))
      // La pagina se va a la tienda; la promesa no termina para que el login no siga
      return new Promise(() => {})
    }

    // Cualquier otro rol: mismo mensaje que una contrasena equivocada, sin revelar nada
    if (!ROLES_PANEL.includes(rol)) {
      throw new Error('Credenciales incorrectas.')
    }

    sesion.guardar(datos)
    setUsuario(datos.usuario)
    return datos.usuario
  }

  // Crea la cuenta de vendedor y deja la sesion iniciada (la API responde igual que el login)
  async function registrar(datosCuenta) {
    const datos = await api.post('/auth/registro-vendedor', {
      ...datosCuenta,
      dispositivo: 'web-panel',
    })
    sesion.guardar(datos)
    setUsuario(datos.usuario)
    return datos.usuario
  }

  async function cerrar() {
    await api.post('/auth/logout').catch(() => {})
    sesion.cerrar()
    setUsuario(null)
    // Que el siguiente usuario que entre no vea datos en cache del anterior (perfil, etc.)
    queryClient.clear()
  }

  // Despues de editar el perfil: conserva el token y guarda los datos nuevos
  function actualizarUsuario(nuevo) {
    sesion.guardar({ token: sesion.token(), usuario: nuevo })
    setUsuario(nuevo)
  }

  return (
    <SesionContext.Provider value={{ usuario, iniciar, registrar, cerrar, actualizarUsuario }}>
      {children}
    </SesionContext.Provider>
  )
}
