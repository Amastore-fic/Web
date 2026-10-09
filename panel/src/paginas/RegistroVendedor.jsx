import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  REQUISITOS_PASSWORD,
  mensajeApi,
  soloDigitos,
  soloLetras,
  validarConfirmacion,
  validarCorreo,
  validarNombre,
  validarPassword,
  validarTelefono,
} from '@shared/utilidades/validaciones'
import {
  Alerta,
  Campo,
  Seccion,
  TarjetaAuth,
  claseBotonPrincipal,
} from '../componentes/FormularioAuth'
import { useSesion } from '../hooks/useSesion'

// Limites iguales a los de la API (RegistrarVendedorRequest)
const MAX_NOMBRE_COMERCIAL = 100
const MAX_SUCURSAL = 100
const MAX_DESCRIPCION = 1000

function validarNombreComercial(valor) {
  const v = (valor ?? '').trim()
  if (!v) return 'El nombre comercial es obligatorio.'
  if (v.length < 3) return 'El nombre comercial debe tener al menos 3 caracteres.'
  if (v.length > MAX_NOMBRE_COMERCIAL) {
    return `El nombre comercial no puede tener más de ${MAX_NOMBRE_COMERCIAL} caracteres.`
  }
  return null
}

const opcionalHasta = (maximo, etiqueta) => (valor) =>
  (valor ?? '').trim().length > maximo
    ? `${etiqueta} no puede tener más de ${maximo} caracteres.`
    : null

// completo: ocupa las dos columnas en pantallas medianas y grandes
// filtro: limpia lo que se escribe; validar: devuelve el mensaje de error o null
const CAMPOS_CUENTA = [
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
    nombre: 'correo',
    etiqueta: 'Correo',
    tipo: 'email',
    autoComplete: 'email',
    placeholder: 'nombre@dominio.com',
    completo: true,
    validar: validarCorreo,
  },
  {
    nombre: 'telefono',
    etiqueta: 'Teléfono (opcional)',
    tipo: 'tel',
    autoComplete: 'tel-national',
    inputMode: 'numeric',
    placeholder: '10 dígitos',
    completo: true,
    filtro: (v) => soloDigitos(v, 10),
    validar: validarTelefono,
  },
  {
    nombre: 'password',
    etiqueta: 'Contraseña',
    tipo: 'password',
    autoComplete: 'new-password',
    validar: validarPassword,
  },
  {
    nombre: 'password_confirmation',
    etiqueta: 'Confirmar contraseña',
    tipo: 'password',
    autoComplete: 'new-password',
    validar: (v, datos) => validarConfirmacion(v, datos.password),
  },
]

const CAMPOS_NEGOCIO = [
  {
    nombre: 'nombre_comercial',
    etiqueta: 'Nombre comercial',
    autoComplete: 'organization',
    maxLength: MAX_NOMBRE_COMERCIAL,
    placeholder: 'Así te verán los compradores',
    completo: true,
    validar: validarNombreComercial,
  },
  {
    nombre: 'sucursal',
    etiqueta: 'Sucursal o ciudad (opcional)',
    maxLength: MAX_SUCURSAL,
    placeholder: 'Por ejemplo: Culiacán',
    completo: true,
    validar: opcionalHasta(MAX_SUCURSAL, 'La sucursal'),
  },
  {
    nombre: 'descripcion',
    etiqueta: 'Descripción del negocio (opcional)',
    multilinea: true,
    maxLength: MAX_DESCRIPCION,
    placeholder: 'Qué vendes y qué te distingue',
    completo: true,
    validar: opcionalHasta(MAX_DESCRIPCION, 'La descripción'),
  },
]

const TODOS_LOS_CAMPOS = [...CAMPOS_CUENTA, ...CAMPOS_NEGOCIO]

function validarTodo(datos) {
  const errores = {}
  for (const campo of TODOS_LOS_CAMPOS) {
    const error = campo.validar(datos[campo.nombre] ?? '', datos)
    if (error) errores[campo.nombre] = error
  }
  return errores
}

// Quita espacios sobrantes y no envia los opcionales vacios
function prepararEnvio(datos) {
  const envio = {}
  for (const [clave, valor] of Object.entries(datos)) {
    const limpio = clave.startsWith('password') ? valor : valor.trim()
    if (limpio !== '') envio[clave] = limpio
  }
  return envio
}

export default function RegistroVendedor() {
  const { usuario, registrar } = useSesion()
  const navigate = useNavigate()
  const [datos, setDatos] = useState({})
  // Un campo muestra su error despues de salir de el, o despues de intentar enviar
  const [tocados, setTocados] = useState({})
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [erroresApi, setErroresApi] = useState({})
  const [mensaje, setMensaje] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Con sesion iniciada no tiene sentido registrarse: se va a su pantalla principal
  if (usuario) return <Navigate to="/" replace />

  const errores = validarTodo(datos)
  const password = datos.password ?? ''
  const largoDescripcion = (datos.descripcion ?? '').length

  function errorVisible(nombre) {
    if (erroresApi[nombre]) return erroresApi[nombre]
    return tocados[nombre] || intentoEnviar ? errores[nombre] : null
  }

  function cambiar(campo, valor) {
    const limpio = campo.filtro ? campo.filtro(valor) : valor
    setDatos((anteriores) => ({ ...anteriores, [campo.nombre]: limpio }))
    // El error de la API deja de aplicar en cuanto el usuario corrige el campo
    if (erroresApi[campo.nombre]) {
      setErroresApi((previos) => ({ ...previos, [campo.nombre]: undefined }))
    }
  }

  async function enviar(e) {
    e.preventDefault()
    setIntentoEnviar(true)
    setMensaje(null)

    if (Object.keys(errores).length > 0) {
      setMensaje('Revisa los campos marcados en rojo.')
      return
    }

    setEnviando(true)
    try {
      // Al crear la cuenta ya queda con sesion iniciada y entra directo a su panel
      await registrar(prepararEnvio(datos))
      navigate('/', { replace: true })
    } catch (err) {
      const deApi = Object.fromEntries(
        Object.entries(err.errores ?? {}).map(([campo, mensajes]) => [
          campo,
          mensajeApi(mensajes[0]),
        ])
      )
      setErroresApi(deApi)
      setMensaje(
        Object.keys(deApi).length > 0 ? 'Revisa los campos marcados en rojo.' : err.message
      )
    } finally {
      setEnviando(false)
    }
  }

  function renderCampo(campo) {
    return (
      <div key={campo.nombre} className={campo.completo ? 'sm:col-span-2' : ''}>
        <Campo
          id={`vendedor-${campo.nombre}`}
          etiqueta={campo.etiqueta}
          type={campo.multilinea ? undefined : (campo.tipo ?? 'text')}
          multilinea={campo.multilinea}
          autoComplete={campo.autoComplete}
          inputMode={campo.inputMode}
          placeholder={campo.placeholder}
          maxLength={campo.maxLength}
          value={datos[campo.nombre] ?? ''}
          onChange={(e) => cambiar(campo, e.target.value)}
          onBlur={() => setTocados((t) => ({ ...t, [campo.nombre]: true }))}
          error={errorVisible(campo.nombre)}
          ayuda={
            campo.nombre === 'descripcion'
              ? `${largoDescripcion} / ${MAX_DESCRIPCION} caracteres`
              : undefined
          }
        />
      </div>
    )
  }

  return (
    <TarjetaAuth
      titulo="Crea tu cuenta de vendedor"
      subtitulo="Publica tus productos con tu negocio identificado ante los compradores."
      ancho="max-w-xl"
    >
      <form className="flex flex-col gap-6" onSubmit={enviar} noValidate>
        <Seccion titulo="Datos de tu cuenta">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CAMPOS_CUENTA.map(renderCampo)}
          </div>

          {/* Requisitos de la contrasena: se marcan en verde conforme se cumplen */}
          <ul className="flex flex-col gap-1 text-xs" aria-label="Requisitos de la contraseña">
            {REQUISITOS_PASSWORD.map((requisito) => {
              const cumple = requisito.cumple(password)
              return (
                <li
                  key={requisito.id}
                  className={`flex items-center gap-1.5 ${cumple ? 'text-green-700' : 'text-panel-tenue'}`}
                >
                  <span aria-hidden="true">{cumple ? '✓' : '•'}</span>
                  {requisito.texto}
                  <span className="sr-only">{cumple ? ' (cumplido)' : ' (pendiente)'}</span>
                </li>
              )
            })}
          </ul>
        </Seccion>

        <Seccion
          titulo="Datos de tu negocio"
          descripcion="Se muestran en la ficha de cada producto que publiques."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CAMPOS_NEGOCIO.map(renderCampo)}
          </div>
        </Seccion>

        {mensaje && <Alerta>{mensaje}</Alerta>}

        <button type="submit" disabled={enviando} className={claseBotonPrincipal}>
          {enviando ? 'Creando cuenta...' : 'Crear cuenta de vendedor'}
        </button>

        <p className="text-center text-sm text-gray-600">
          ¿Ya vendes con nosotros?{' '}
          <Link to="/login" className="font-semibold text-panel-acento hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </TarjetaAuth>
  )
}
