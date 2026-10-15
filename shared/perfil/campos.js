// Campos de los formularios de "Mi perfil". Mismo formato que los del registro:
//   completo: ocupa las dos columnas en pantallas medianas y grandes
//   filtro: limpia lo que se escribe; validar(valor, datos): mensaje de error o null
//   opciones: lo vuelve una lista desplegable; multilinea: lo vuelve un area de texto

import {
  REQUISITOS_PASSWORD,
  soloDigitos,
  soloLetras,
  validarCodigoPostal,
  validarConfirmacion,
  validarCorreo,
  validarNombre,
  validarPassword,
  validarTelefono,
  validarTexto,
} from '../utilidades/validaciones'

export { REQUISITOS_PASSWORD }

// "Datos personales"
export const CAMPOS_DATOS = [
  {
    nombre: 'nombre',
    etiqueta: 'Nombre',
    autoComplete: 'given-name',
    maxLength: 50,
    filtro: soloLetras,
    validar: (v) => validarNombre(v, 'El nombre'),
  },
  {
    nombre: 'apellido',
    etiqueta: 'Apellido',
    autoComplete: 'family-name',
    maxLength: 50,
    filtro: soloLetras,
    validar: (v) => validarNombre(v, 'El apellido'),
  },
  {
    nombre: 'telefono',
    etiqueta: 'Teléfono (opcional)',
    tipo: 'tel',
    autoComplete: 'tel-national',
    inputMode: 'numeric',
    placeholder: '10 dígitos',
    filtro: (v) => soloDigitos(v, 10),
    validar: validarTelefono,
  },
]

// "Inicio de sesion y seguridad": el correo es con el que se entra
export const CAMPOS_CORREO = [
  {
    nombre: 'correo',
    etiqueta: 'Correo electrónico',
    tipo: 'email',
    autoComplete: 'email',
    placeholder: 'nombre@dominio.com',
    completo: true,
    validar: validarCorreo,
  },
]

// Limites iguales a los de la API (RegistrarVendedorRequest)
export const CAMPOS_NEGOCIO = [
  {
    nombre: 'nombre_comercial',
    etiqueta: 'Nombre comercial',
    maxLength: 100,
    validar: (v) => validarTexto(v, 'El nombre comercial', { minimo: 3, maximo: 100 }),
  },
  {
    nombre: 'sucursal',
    etiqueta: 'Sucursal (opcional)',
    maxLength: 100,
    validar: (v) => validarTexto(v, 'La sucursal', { requerido: false, maximo: 100 }),
  },
  {
    nombre: 'descripcion',
    etiqueta: 'Descripción (opcional)',
    multilinea: true,
    completo: true,
    maxLength: 1000,
    validar: (v) => validarTexto(v, 'La descripción', { requerido: false, maximo: 1000 }),
  },
]

export const CAMPOS_PASSWORD = [
  {
    nombre: 'password_actual',
    etiqueta: 'Contraseña actual',
    tipo: 'password',
    autoComplete: 'current-password',
    completo: true,
    validar: (v) => (v ? null : 'Escribe tu contraseña actual.'),
  },
  {
    nombre: 'password',
    etiqueta: 'Nueva contraseña',
    tipo: 'password',
    autoComplete: 'new-password',
    validar: (v, datos) =>
      validarPassword(v) ??
      (v === datos.password_actual ? 'La nueva contraseña debe ser distinta a la actual.' : null),
  },
  {
    nombre: 'password_confirmation',
    etiqueta: 'Confirmar nueva contraseña',
    tipo: 'password',
    autoComplete: 'new-password',
    validar: (v, datos) => validarConfirmacion(v, datos.password),
  },
]

export const ESTADOS_MEXICO = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
]

// Limites iguales a los de la API (DireccionController@store)
export const CAMPOS_DIRECCION = [
  {
    nombre: 'destinatario',
    etiqueta: 'Nombre de quien recibe',
    autoComplete: 'name',
    maxLength: 100,
    completo: true,
    validar: (v) => validarTexto(v, 'El nombre de quien recibe', { minimo: 2, maximo: 100 }),
  },
  {
    nombre: 'calle',
    etiqueta: 'Calle',
    autoComplete: 'address-line1',
    maxLength: 255,
    completo: true,
    validar: (v) => validarTexto(v, 'La calle'),
  },
  {
    nombre: 'numero_exterior',
    etiqueta: 'Número exterior',
    maxLength: 20,
    validar: (v) => validarTexto(v, 'El número exterior', { maximo: 20 }),
  },
  {
    nombre: 'numero_interior',
    etiqueta: 'Número interior (opcional)',
    maxLength: 20,
    validar: (v) => validarTexto(v, 'El número interior', { requerido: false, maximo: 20 }),
  },
  {
    nombre: 'colonia',
    etiqueta: 'Colonia',
    maxLength: 255,
    validar: (v) => validarTexto(v, 'La colonia'),
  },
  {
    nombre: 'codigo_postal',
    etiqueta: 'Código postal',
    autoComplete: 'postal-code',
    inputMode: 'numeric',
    placeholder: '5 dígitos',
    filtro: (v) => soloDigitos(v, 5),
    validar: validarCodigoPostal,
  },
  {
    nombre: 'ciudad',
    etiqueta: 'Ciudad o municipio',
    autoComplete: 'address-level2',
    maxLength: 255,
    validar: (v) => validarTexto(v, 'La ciudad'),
  },
  {
    nombre: 'estado',
    etiqueta: 'Estado',
    autoComplete: 'address-level1',
    opciones: ESTADOS_MEXICO,
    validar: (v) => (v ? null : 'Elige un estado.'),
  },
  {
    nombre: 'telefono',
    etiqueta: 'Teléfono de contacto',
    tipo: 'tel',
    autoComplete: 'tel-national',
    inputMode: 'numeric',
    placeholder: '10 dígitos',
    filtro: (v) => soloDigitos(v, 10),
    validar: (v) => (v ? validarTelefono(v) : 'El teléfono es obligatorio.'),
  },
  {
    nombre: 'referencias',
    etiqueta: 'Referencias (opcional)',
    multilinea: true,
    completo: true,
    maxLength: 1000,
    placeholder: 'Entre calles, color de la casa, etc.',
    validar: (v) => validarTexto(v, 'Las referencias', { requerido: false, maximo: 1000 }),
  },
]

export function validarCampos(campos, datos) {
  const errores = {}
  for (const campo of campos) {
    const error = campo.validar(datos[campo.nombre] ?? '', datos)
    if (error) errores[campo.nombre] = error
  }
  return errores
}

// Toma de un objeto solo los valores de los campos (null de la API -> '')
export function valoresDe(campos, origen) {
  return Object.fromEntries(campos.map((c) => [c.nombre, origen?.[c.nombre] ?? '']))
}

// Valores listos para la API: textos sin espacios de sobra y opcionales vacios como null
export function limpiarValores(campos, datos) {
  return Object.fromEntries(
    campos.map((c) => {
      const v = c.tipo === 'password' ? datos[c.nombre] : (datos[c.nombre] ?? '').trim()
      return [c.nombre, v === '' ? null : v]
    })
  )
}

export function hayCambios(campos, datos, originales) {
  return campos.some((c) => (datos[c.nombre] ?? '') !== (originales[c.nombre] ?? ''))
}
