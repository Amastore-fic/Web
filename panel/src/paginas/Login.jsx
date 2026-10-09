import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { validarCorreo } from '@shared/utilidades/validaciones'
import { Alerta, Campo, TarjetaAuth, claseBotonPrincipal } from '../componentes/FormularioAuth'
import { useSesion } from '../hooks/useSesion'

export default function Login() {
  const { iniciar } = useSesion()
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState({})
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setError(null)

    const nuevos = {}
    const errorCorreo = validarCorreo(correo)
    if (errorCorreo) nuevos.correo = errorCorreo
    if (!password) nuevos.password = 'La contraseña es obligatoria.'
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    setEnviando(true)
    try {
      await iniciar(correo.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <TarjetaAuth
      titulo="Panel de vendedores"
      subtitulo="Administra tus productos y consulta tus ventas."
    >
      <form className="flex flex-col gap-4" onSubmit={enviar} noValidate>
        <Campo
          id="panel-login-correo"
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
        <Campo
          id="panel-login-password"
          etiqueta="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setErrores((previos) => ({ ...previos, password: undefined }))
          }}
          error={errores.password}
        />

        {error && <Alerta>{error}</Alerta>}

        <button type="submit" disabled={enviando} className={`${claseBotonPrincipal} mt-2`}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-sm text-gray-600">
          ¿Quieres vender tus productos?{' '}
          <Link to="/registro" className="font-semibold text-panel-acento hover:underline">
            Crea tu cuenta de vendedor
          </Link>
        </p>
      </form>
    </TarjetaAuth>
  )
}
