import { useState } from 'react'
import { Link } from 'react-router-dom'
import { validarCorreo } from '@shared/utilidades/validaciones'
import { api } from '../api'
import { AlertaError, Campo, TarjetaAuth, claseBotonPrincipal } from '../componentes/FormularioAuth'

export default function RecuperarPassword() {
  const [correo, setCorreo] = useState('')
  const [errores, setErrores] = useState({})
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setError(null)
    setExito(false)

    const nuevos = {}
    const errorCorreo = validarCorreo(correo)
    if (errorCorreo) nuevos.correo = errorCorreo
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    setEnviando(true)
    try {
      await api.post('/auth/forgot-password', { correo: correo.trim() })
      setExito(true)
    } catch (err) {
      setError(err.estado ? err.message : 'No se pudo conectar con el servidor.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <TarjetaAuth
      titulo="Recuperar contraseña"
      subtitulo="Te enviaremos una contraseña temporal por correo. Tu contraseña actual seguirá funcionando."
    >
      {exito ? (
        <div className="flex flex-col gap-4 text-center">
          <div className="p-4 bg-green-50 text-green-700 rounded-md text-sm">
            Si el correo está registrado, te enviamos una contraseña temporal. Revisa tu bandeja de entrada: vence en 10 minutos.
          </div>
          <Link to="/login" className={`${claseBotonPrincipal} inline-block text-center`}>
            Volver a iniciar sesión
          </Link>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={enviar} noValidate>
          <Campo
            id="recuperar-correo"
            etiqueta="Correo"
            type="email"
            autoComplete="email"
            placeholder="nombre@dominio.com"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value)
              setErrores((previos) => ({ ...previos, correo: undefined }))
            }}
            error={errores.correo}
          />

          {error && <AlertaError>{error}</AlertaError>}

          <button type="submit" disabled={enviando} className={`${claseBotonPrincipal} mt-2`}>
            {enviando ? 'Enviando...' : 'Enviar contraseña temporal'}
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿Recordaste tu contraseña?{' '}
            <Link to="/login" className="font-semibold text-[#607ADB] hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      )}
    </TarjetaAuth>
  )
}