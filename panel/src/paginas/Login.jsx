import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSesion } from '../hooks/useSesion'

export default function Login() {
  const { iniciar } = useSesion()
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await iniciar(correo, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h1>Panel de vendedores y administracion</h1>
      <label>
        Correo
        <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
      </label>
      <label>
        Contrasena
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={enviando}>
        Entrar
      </button>
    </form>
  )
}
