// Validaciones de formularios compartidas por tienda y panel.
// Cada validador recibe el valor y devuelve un mensaje de error, o null si es valido.
// La API vuelve a validar todo: esto solo da respuesta inmediata al usuario.

const SOLO_LETRAS = /^\p{L}[\p{L} '-]*$/u
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const REQUISITOS_PASSWORD = [
  { id: 'largo', texto: 'Al menos 8 caracteres', cumple: (v) => v.length >= 8 },
  { id: 'letra', texto: 'Al menos una letra', cumple: (v) => /\p{L}/u.test(v) },
  { id: 'numero', texto: 'Al menos un número', cumple: (v) => /\d/.test(v) },
]

export function validarNombre(valor, etiqueta = 'Este campo') {
  const v = (valor ?? '').trim()
  if (!v) return `${etiqueta} es obligatorio.`
  if (v.length < 2) return `${etiqueta} debe tener al menos 2 letras.`
  if (v.length > 50) return `${etiqueta} no puede tener más de 50 caracteres.`
  if (!SOLO_LETRAS.test(v)) return `${etiqueta} solo puede tener letras y espacios.`
  return null
}

export function validarCorreo(valor) {
  const v = (valor ?? '').trim()
  if (!v) return 'El correo es obligatorio.'
  if (!CORREO.test(v)) return 'Escribe un correo válido, por ejemplo nombre@dominio.com.'
  return null
}

// Opcional: si se escribe algo, deben ser 10 digitos (numero de Mexico)
export function validarTelefono(valor) {
  const v = (valor ?? '').trim()
  if (!v) return null
  if (!/^\d{10}$/.test(v)) return 'El teléfono debe tener 10 dígitos.'
  return null
}

export function validarPassword(valor) {
  const v = valor ?? ''
  if (!v) return 'La contraseña es obligatoria.'
  const faltantes = REQUISITOS_PASSWORD.filter((r) => !r.cumple(v))
  if (faltantes.length > 0) {
    return `La contraseña necesita: ${faltantes.map((r) => r.texto.toLowerCase()).join(', ')}.`
  }
  return null
}

export function validarConfirmacion(valor, password) {
  if (!valor) return 'Confirma tu contraseña.'
  if (valor !== password) return 'Las contraseñas no coinciden.'
  return null
}

// Texto libre con largo minimo y maximo; requerido = false lo deja opcional.
// etiqueta lleva su articulo ("La calle") para que los mensajes concuerden.
export function validarTexto(valor, etiqueta, { requerido = true, minimo = 1, maximo = 255 } = {}) {
  const v = (valor ?? '').trim()
  if (!v) return requerido ? `Escribe ${etiqueta.toLowerCase()}.` : null
  if (v.length < minimo) return `${etiqueta} debe tener al menos ${minimo} caracteres.`
  if (v.length > maximo) return `${etiqueta} no puede tener más de ${maximo} caracteres.`
  return null
}

export function validarCodigoPostal(valor) {
  const v = (valor ?? '').trim()
  if (!v) return 'El código postal es obligatorio.'
  if (!/^\d{5}$/.test(v)) return 'El código postal debe tener 5 dígitos.'
  return null
}

// Filtros para escribir: evitan que entren caracteres no permitidos
export const soloLetras = (v) => v.replace(/[^\p{L} '-]/gu, '')
export const soloDigitos = (v, max = 10) => v.replace(/\D/g, '').slice(0, max)

// Mientras la API no tenga traducciones, algunos errores llegan como claves de Laravel
// ("validation.unique"). Esto las convierte en mensajes legibles.
const MENSAJES_API = {
  'validation.unique': 'Ya existe una cuenta con este correo.',
  'validation.required': 'Este campo es obligatorio.',
  'validation.email': 'Escribe un correo válido, por ejemplo nombre@dominio.com.',
  'validation.confirmed': 'Las contraseñas no coinciden.',
  'validation.min.string': 'Es demasiado corto.',
  'validation.max.string': 'Es demasiado largo.',
  'validation.password.letters': 'La contraseña necesita al menos una letra.',
  'validation.password.numbers': 'La contraseña necesita al menos un número.',
}

export function mensajeApi(mensaje) {
  if (!mensaje) return mensaje
  return (
    MENSAJES_API[mensaje] ?? (mensaje.startsWith('validation.') ? 'Revisa este dato.' : mensaje)
  )
}
