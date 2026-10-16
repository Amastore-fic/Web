import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { CAMPOS_PASSWORD, valoresDe } from '@shared/perfil/campos'
import { cambiarPassword } from '@shared/perfil/perfil'
import { api } from '../../api'
import { useFormulario } from '../../hooks/useFormulario'
import {
  AvisoFormulario,
  CamposFormulario,
  RequisitosPassword,
  TarjetaPerfil,
  claseBoton,
} from './PiezasPerfil'

const VACIOS = valoresDe(CAMPOS_PASSWORD, {})

// Contrasena actual + nueva dos veces, igual que la pantalla de restablecer. PUT /auth/password
export default function SeccionPassword() {
  const formulario = useFormulario(CAMPOS_PASSWORD, VACIOS)
  const [verPassword, setVerPassword] = useState(false)

  const guardar = useMutation({
    mutationFn: (datos) => cambiarPassword(api, datos),
    onSuccess: () => {
      formulario.reiniciar(VACIOS)
      setVerPassword(false)
      formulario.setMensaje({ tipo: 'exito', texto: 'Tu contraseña se cambió.' })
    },
    onError: formulario.fallo,
  })

  function enviar(e) {
    e.preventDefault()
    if (!formulario.validar()) return
    guardar.mutate(formulario.datos)
  }

  return (
    <TarjetaPerfil
      id="password"
      titulo="Cambiar contraseña"
      descripcion="Para confirmar que eres tú, escribe primero tu contraseña actual."
    >
      <form className="flex flex-col gap-4" onSubmit={enviar} noValidate>
        <CamposFormulario
          prefijo="password"
          campos={CAMPOS_PASSWORD}
          formulario={formulario}
          verPassword={verPassword}
        />

        <button
          type="button"
          onClick={() => setVerPassword((v) => !v)}
          className="self-start text-sm text-gray-600 hover:underline"
        >
          {verPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
        </button>

        <RequisitosPassword password={formulario.datos.password} />

        <AvisoFormulario mensaje={formulario.mensaje} />

        <div className="flex justify-end">
          <button type="submit" disabled={guardar.isPending} className={claseBoton}>
            {guardar.isPending ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </TarjetaPerfil>
  )
}
