import { useState } from 'react'
import { URL_PANEL } from '@shared/utilidades/enlaces'
import { ROLES_PANEL, ROLES_TIENDA, urlConSesion } from '@shared/sesion/traspaso'
import { api, sesion } from '../api'
import { SesionContext } from '../hooks/useSesion'

export default function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(() => sesion.usuario())

  async function iniciar(correo, password) {
    const datos = await api.post('/auth/login', { correo, password, dispositivo: 'web-tienda' })
    const { rol } = datos.usuario

    // Vendedores y administradores trabajan en el panel: se les manda alla con su sesion
    if (ROLES_PANEL.includes(rol)) {
      window.location.assign(urlConSesion(URL_PANEL, datos.token))
      // La pagina se va al panel; la promesa no termina para que el login no siga
      return new Promise(() => {})
    }

    // Cualquier otro rol: mismo mensaje que una contrasena equivocada, sin revelar nada
    if (!ROLES_TIENDA.includes(rol)) {
      throw new Error('Credenciales incorrectas.')
    }

    sesion.guardar(datos)
    setUsuario(datos.usuario)
    return datos.usuario
  }

  // Crea la cuenta de cliente y deja la sesion iniciada (la API responde igual que el login)
  async function registrar(datosCuenta) {
    const datos = await api.post('/auth/registro', { ...datosCuenta, dispositivo: 'web-tienda' })
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
    <SesionContext.Provider value={{ usuario, iniciar, registrar, cerrar }}>
      {children}
    </SesionContext.Provider>
  )
}
