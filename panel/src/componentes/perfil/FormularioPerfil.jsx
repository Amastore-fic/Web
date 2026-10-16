import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hayCambios, limpiarValores, valoresDe } from '@shared/perfil/campos'
import { actualizarPerfil } from '@shared/perfil/perfil'
import { api } from '../../api'
import { useFormulario } from '../../hooks/useFormulario'
import { useSesion } from '../../hooks/useSesion'
import {
  AvisoFormulario,
  CamposFormulario,
  TarjetaPerfil,
  claseBoton,
  claseBotonSecundario,
} from './PiezasPerfil'

// Edita una parte del perfil con PUT /auth/perfil (la API solo cambia los campos enviados).
// origen(usuario): de donde salen los valores (el usuario, o usuario.vendedor para el negocio)
export default function FormularioPerfil({
  id,
  titulo,
  descripcion,
  campos,
  perfil,
  origen = (usuario) => usuario,
  mensajeExito = 'Tus cambios se guardaron.',
}) {
  const queryClient = useQueryClient()
  const { actualizarUsuario } = useSesion()
  const [originales, setOriginales] = useState(() => valoresDe(campos, origen(perfil)))
  const formulario = useFormulario(campos, originales)
  const cambios = hayCambios(campos, formulario.datos, originales)

  const guardar = useMutation({
    mutationFn: (datos) => actualizarPerfil(api, datos),
    onSuccess: (usuario) => {
      queryClient.setQueryData(['perfil'], usuario)
      actualizarUsuario(usuario)
      const nuevos = valoresDe(campos, origen(usuario))
      setOriginales(nuevos)
      formulario.reiniciar(nuevos)
      formulario.setMensaje({ tipo: 'exito', texto: mensajeExito })
    },
    onError: formulario.fallo,
  })

  function enviar(e) {
    e.preventDefault()
    if (!formulario.validar()) return
    guardar.mutate(limpiarValores(campos, formulario.datos))
  }

  function descartar() {
    formulario.reiniciar(originales)
    formulario.setMensaje(null)
  }

  return (
    <TarjetaPerfil id={id} titulo={titulo} descripcion={descripcion}>
      <form className="flex flex-col gap-4" onSubmit={enviar} noValidate>
        <CamposFormulario prefijo={id} campos={campos} formulario={formulario} />

        <AvisoFormulario mensaje={formulario.mensaje} />

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={descartar}
            disabled={!cambios || guardar.isPending}
            className={claseBotonSecundario}
          >
            Descartar cambios
          </button>
          <button type="submit" disabled={!cambios || guardar.isPending} className={claseBoton}>
            {guardar.isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </TarjetaPerfil>
  )
}
