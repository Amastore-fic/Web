// "Ahora no" en el aviso de cambiar la contrasena: se oculta hasta cerrar la pestana.
// Se guarda la fecha del permiso para que el aviso vuelva si hay otra contrasena temporal.
const CLAVE = 'comprasegura:aviso-password-oculto'

export function avisoOculto(hasta) {
  try {
    return sessionStorage.getItem(CLAVE) === hasta
  } catch {
    return false
  }
}

export function ocultarAviso(hasta) {
  try {
    sessionStorage.setItem(CLAVE, hasta)
  } catch {
    // Sin almacenamiento el aviso solo se oculta hasta recargar la pagina
  }
}
