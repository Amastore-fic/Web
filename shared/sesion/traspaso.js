// Traspaso de la sesion entre la tienda y el panel.
//
// La tienda y el panel guardan su sesion por separado (y en desarrollo corren en
// puertos distintos). Cuando alguien inicia sesion en la app que no le corresponde
// por su rol, se le manda a la otra con su token en el fragmento de la direccion
// (#sesion=...). El fragmento nunca se envia al servidor; la app que lo recibe lo
// borra de la barra de direcciones y del historial antes de hacer cualquier otra
// cosa, y no confia en lo que llega: le pregunta a la API de quien es el token.

const CLAVE = 'sesion'

// Que roles usa cada app
export const ROLES_TIENDA = ['cliente']
export const ROLES_PANEL = ['vendedor', 'administrador']

export function urlConSesion(urlDestino, token) {
  return `${urlDestino}#${CLAVE}=${encodeURIComponent(token)}`
}

// Llamar antes de montar la app. Si la direccion trae una sesion y el rol del
// usuario corresponde a esta app, la deja guardada; si no, no guarda nada.
export async function recibirSesion({ sesion, api, roles }) {
  const fragmento = new URLSearchParams(window.location.hash.slice(1))
  const token = fragmento.get(CLAVE)
  if (!token) return

  // Primero se quita el token de la direccion y del historial
  window.history.replaceState(
    window.history.state,
    '',
    window.location.pathname + window.location.search
  )

  try {
    // El cliente HTTP toma el token de la sesion, por eso se guarda antes de validar
    sesion.guardar({ token, usuario: null })
    const usuario = await api.get('/auth/perfil')
    if (roles.includes(usuario.rol)) {
      sesion.guardar({ token, usuario })
    } else {
      sesion.cerrar()
    }
  } catch {
    sesion.cerrar()
  }
}
