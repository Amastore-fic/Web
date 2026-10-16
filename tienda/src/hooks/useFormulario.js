import { useState } from 'react'
import { validarCampos } from '@shared/perfil/campos'
import { erroresDeApi, mensajeError } from '@shared/perfil/perfil'

// Estado de un formulario armado con los campos de @shared/perfil/campos.
// Un campo muestra su error despues de salir de el, o despues de intentar enviar.
// mensaje: { tipo: 'error' | 'exito', texto } para el aviso general del formulario.
export function useFormulario(campos, iniciales) {
  const [datos, setDatos] = useState(iniciales)
  const [tocados, setTocados] = useState({})
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [erroresApi, setErroresApi] = useState({})
  const [mensaje, setMensaje] = useState(null)

  const errores = validarCampos(campos, datos)

  function cambiar(campo, valor) {
    const limpio = campo.filtro ? campo.filtro(valor) : valor
    setDatos((anteriores) => ({ ...anteriores, [campo.nombre]: limpio }))
    // El error de la API deja de aplicar en cuanto el usuario corrige el campo
    if (erroresApi[campo.nombre]) {
      setErroresApi((previos) => ({ ...previos, [campo.nombre]: undefined }))
    }
    if (mensaje?.tipo === 'exito') setMensaje(null)
  }

  function salir(nombre) {
    setTocados((t) => ({ ...t, [nombre]: true }))
  }

  function errorVisible(nombre) {
    if (erroresApi[nombre]) return erroresApi[nombre]
    return tocados[nombre] || intentoEnviar ? errores[nombre] : null
  }

  function reiniciar(nuevos = iniciales) {
    setDatos(nuevos)
    setTocados({})
    setIntentoEnviar(false)
    setErroresApi({})
  }

  // Llamar al enviar: devuelve false (y avisa) si algun campo tiene error
  function validar() {
    setIntentoEnviar(true)
    setMensaje(null)
    if (Object.keys(errores).length > 0) {
      setMensaje({ tipo: 'error', texto: 'Revisa los campos marcados en rojo.' })
      return false
    }
    return true
  }

  // Muestra el error de la API en sus campos y en el aviso general
  function fallo(error) {
    setErroresApi(erroresDeApi(error))
    setMensaje({ tipo: 'error', texto: mensajeError(error) })
  }

  return {
    datos,
    setDatos,
    cambiar,
    salir,
    errorVisible,
    reiniciar,
    validar,
    fallo,
    mensaje,
    setMensaje,
  }
}
