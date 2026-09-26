// Guarda el token y el usuario en localStorage.
// Cada app usa su propio espacio (tienda / panel) para que una sesion de
// vendedor en el panel no pise la de cliente en la tienda del mismo dominio.

export function crearSesion(espacio) {
  const claveToken = `comprasegura:${espacio}:token`
  const claveUsuario = `comprasegura:${espacio}:usuario`

  return {
    token: () => localStorage.getItem(claveToken),

    usuario: () => {
      const crudo = localStorage.getItem(claveUsuario)
      return crudo ? JSON.parse(crudo) : null
    },

    guardar: ({ token, usuario }) => {
      localStorage.setItem(claveToken, token)
      localStorage.setItem(claveUsuario, JSON.stringify(usuario))
    },

    cerrar: () => {
      localStorage.removeItem(claveToken)
      localStorage.removeItem(claveUsuario)
    },
  }
}
