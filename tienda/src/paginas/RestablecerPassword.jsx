import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { AlertaError, Campo, TarjetaAuth, claseBotonPrincipal } from '../componentes/FormularioAuth'

export default function RestablecerPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')
  const correo = searchParams.get('correo') || ''

  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errores, setErrores] = useState({})
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setError(null)

    const nuevos = {}
    if (!password) {
      nuevos.password = 'La contraseña es obligatoria.'
    } else if (password.length < 8) {
      nuevos.password = 'Debe tener al menos 8 caracteres.'
    }

    if (password !== passwordConfirmation) {
      nuevos.passwordConfirmation = 'Las contraseñas no coinciden.'
    }

    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    if (!token || !correo) {
      setError('El enlace de recuperación es inválido o ha expirado.')
      return
    }

    setEnviando(true)
    try {
      // Petición real a tu API de Laravel
      const respuesta = await fetch('http://localhost:8000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          token,
          correo, 
          password,
          password_confirmation: passwordConfirmation,
        }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.message || 'No se pudo restablecer la contraseña.')
      }

      setExito(true)
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar la solicitud.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <TarjetaAuth
      titulo="Restablecer contraseña"
      subtitulo="Ingresa tu nueva contraseña para acceder a tu cuenta."
    >
      {exito ? (
        <div className="flex flex-col gap-4 text-center">
          <div className="p-4 bg-green-50 text-green-700 rounded-md text-sm">
            ¡Tu contraseña se ha restablecido con éxito! Ya puedes iniciar sesión con tu nueva clave.
          </div>
          <button 
            type="button"
            onClick={() => navigate('/login')} 
            className={`${claseBotonPrincipal} inline-block text-center`}
          >
            Ir a iniciar sesión
          </button>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={enviar} noValidate>
          <Campo
            id="reset-password"
            etiqueta="Nueva contraseña"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrores((previos) => ({ ...previos, password: undefined }))
            }}
            error={errores.password}
          />

          <Campo
            id="reset-password-confirmation"
            etiqueta="Confirmar nueva contraseña"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={passwordConfirmation}
            onChange={(e) => {
              setPasswordConfirmation(e.target.value)
              setErrores((previos) => ({ ...previos, passwordConfirmation: undefined }))
            }}
            error={errores.passwordConfirmation}
          />

          {error && <AlertaError>{error}</AlertaError>}

          <button type="submit" disabled={enviando} className={`${claseBotonPrincipal} mt-2`}>
            {enviando ? 'Guardando...' : 'Restablecer contraseña'}
          </button>

          <p className="text-center text-sm text-gray-600">
            <Link to="/login" className="font-semibold text-[#607ADB] hover:underline">
              Cancelar y volver al login
            </Link>
          </p>
        </form>
      )}
    </TarjetaAuth>
  )
}