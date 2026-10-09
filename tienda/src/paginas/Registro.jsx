import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { AlertaError, Campo, TarjetaAuth, claseBotonPrincipal } from '../componentes/FormularioAuth'
import { useSesion } from '../hooks/useSesion'

// completo: ocupa las dos columnas en pantallas medianas y grandes
// filtro: limpia lo que se escribe; validar: devuelve el mensaje de error o null
const CAMPOS = [
  {
    nombre: 'nombre',
    etiqueta: 'Nombre',
    tipo: 'text',
    autoComplete: 'given-name',
    maxLength: 50,
    filtro: soloLetras,
    validar: (v) => validarNombre(v, 'El nombre'),
  },
  {
    nombre: 'apellido',
    etiqueta: 'Apellido',
    tipo: 'text',
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

function validarTodo(datos) {
  const errores = {}
  for (const campo of CAMPOS) {
    const error = campo.validar(datos[campo.nombre] ?? '', datos)
    if (error) errores[campo.nombre] = error
  }
  return errores
}

export default function Registro() {
  const { registrar } = useSesion()
  const navigate = useNavigate()
  const [datos, setDatos] = useState({})
  // Un campo muestra su error despues de salir de el, o despues de intentar enviar
  const [tocados, setTocados] = useState({})
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [erroresApi, setErroresApi] = useState({})
  const [mensaje, setMensaje] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const errores = validarTodo(datos)
  const password = datos.password ?? ''

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
      // Al crear la cuenta ya queda con sesion iniciada: no hay que volver a escribir los datos
      await registrar({
        ...datos,
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        correo: datos.correo.trim(),
      })
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

  return (
    <TarjetaAuth
      titulo="Crear cuenta"
      subtitulo="Regístrate para comprar con vendedores verificados."
      ancho="max-w-xl"
    >
      <form className="flex flex-col gap-4" onSubmit={enviar} noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CAMPOS.map((campo) => (
            <div key={campo.nombre} className={campo.completo ? 'sm:col-span-2' : ''}>
              <Campo
                id={`registro-${campo.nombre}`}
                etiqueta={campo.etiqueta}
                type={campo.tipo}
                autoComplete={campo.autoComplete}
                inputMode={campo.inputMode}
                placeholder={campo.placeholder}
                maxLength={campo.maxLength}
                value={datos[campo.nombre] ?? ''}
                onChange={(e) => cambiar(campo, e.target.value)}
                onBlur={() => setTocados((t) => ({ ...t, [campo.nombre]: true }))}
                error={errorVisible(campo.nombre)}
              />
            </div>
          ))}
        </div>

        {/* Requisitos de la contrasena: se marcan en verde conforme se cumplen */}
        <ul className="flex flex-col gap-1 text-xs" aria-label="Requisitos de la contraseña">
          {REQUISITOS_PASSWORD.map((requisito) => {
            const cumple = requisito.cumple(password)
            return (
              <li
                key={requisito.id}
                className={`flex items-center gap-1.5 ${cumple ? 'text-green-700' : 'text-[#8A8FA3]'}`}
              >
                <span aria-hidden="true">{cumple ? '✓' : '•'}</span>
                {requisito.texto}
                <span className="sr-only">{cumple ? ' (cumplido)' : ' (pendiente)'}</span>
              </li>
            )
          })}
        </ul>

        {mensaje && <AlertaError>{mensaje}</AlertaError>}

        <button type="submit" disabled={enviando} className={`${claseBotonPrincipal} mt-2`}>
          {enviando ? 'Creando cuenta...' : 'Registrarme'}
        </button>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-[#607ADB] hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </TarjetaAuth>
  )
}
