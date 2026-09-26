import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

const CAMPOS = [
  { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text' },
  { nombre: 'apellido', etiqueta: 'Apellido', tipo: 'text' },
  { nombre: 'correo', etiqueta: 'Correo', tipo: 'email' },
  { nombre: 'telefono', etiqueta: 'Telefono (opcional)', tipo: 'tel', opcional: true },
  { nombre: 'password', etiqueta: 'Contrasena', tipo: 'password' },
  { nombre: 'password_confirmation', etiqueta: 'Confirmar contrasena', tipo: 'password' },
]

export default function Registro() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({})
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState(null)

  async function enviar(e) {
    e.preventDefault()
    setErrores({})
    setMensaje(null)
    try {
      await api.post('/auth/registro', datos)
      navigate('/login')
    } catch (err) {
      setErrores(err.errores ?? {})
      setMensaje(err.message)
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h1>Crear cuenta</h1>
      {CAMPOS.map((campo) => (
        <label key={campo.nombre}>
          {campo.etiqueta}
          <input
            type={campo.tipo}
            required={!campo.opcional}
            value={datos[campo.nombre] ?? ''}
            onChange={(e) => setDatos({ ...datos, [campo.nombre]: e.target.value })}
          />
          {errores[campo.nombre] && <span className="error">{errores[campo.nombre][0]}</span>}
        </label>
      ))}
      {mensaje && <p className="error">{mensaje}</p>}
      <button type="submit">Registrarme</button>
    </form>
  )
}
