import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, Navigate } from 'react-router-dom'
import { CAMPOS_RESTABLECER, valoresDe } from '@shared/perfil/campos'
import { puedeCambiarSinLaActual, restablecerPassword } from '@shared/perfil/perfil'
import { api } from '../api'
import { TarjetaAuth, claseBotonPrincipal } from '../componentes/FormularioAuth'
import {
  AvisoFormulario,
  CamposFormulario,
  RequisitosPassword,
} from '../componentes/perfil/PiezasPerfil'
import { useFormulario } from '../hooks/useFormulario'
import { useSesion } from '../hooks/useSesion'

const VACIOS = valoresDe(CAMPOS_RESTABLECER, {})

// Cambio directo despues de entrar con una contrasena temporal: no pide la actual.
// Terminado ese tiempo, el cambio se hace en /perfil/seguridad.
export default function RestablecerPassword() {
  const { usuario, actualizarUsuario } = useSesion()
  const formulario = useFormulario(CAMPOS_RESTABLECER, VACIOS)
  const [verPassword, setVerPassword] = useState(false)
  const [listo, setListo] = useState(false)

  const guardar = useMutation({
    mutationFn: (datos) => restablecerPassword(api, datos),
    onSuccess: (respuesta) => {
      setListo(true)
      actualizarUsuario(respuesta.usuario)
    },
    onError: formulario.fallo,
  })

  if (!listo && !puedeCambiarSinLaActual(usuario)) {
    return <Navigate to="/perfil/seguridad" replace />
  }

  function enviar(e) {
    e.preventDefault()
    if (!formulario.validar()) return
    guardar.mutate(formulario.datos)
  }

  if (listo) {
    return (
      <TarjetaAuth titulo="Contraseña actualizada">
        <div className="flex flex-col gap-4">
          <AvisoFormulario
            mensaje={{
              tipo: 'exito',
              texto: 'Listo: usa tu nueva contraseña la próxima vez que entres.',
            }}
          />
          <Link to="/" className={`${claseBotonPrincipal} text-center`}>
            Continuar
          </Link>
        </div>
      </TarjetaAuth>
    )
  }

  return (
    <TarjetaAuth
      titulo="Cambiar contraseña"
      subtitulo="Elige una contraseña que puedas recordar. Ya no necesitarás la del correo."
    >
      <form className="flex flex-col gap-4" onSubmit={enviar} noValidate>
        <CamposFormulario
          prefijo="restablecer"
          campos={CAMPOS_RESTABLECER}
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

        <button type="submit" disabled={guardar.isPending} className={claseBotonPrincipal}>
          {guardar.isPending ? 'Guardando...' : 'Cambiar contraseña'}
        </button>

        <Link to="/" className="text-center text-sm text-gray-600 hover:underline">
          Ahora no
        </Link>
      </form>
    </TarjetaAuth>
  )
}
