import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { CAMPOS_DIRECCION, limpiarValores, valoresDe } from '@shared/perfil/campos'
import {
  actualizarDireccion,
  crearDireccion,
  eliminarDireccion,
  listarDirecciones,
  mensajeError,
} from '@shared/perfil/perfil'
import { api } from '../../api'
import { useDireccionEnvio } from '../../hooks/useDireccionEnvio'
import { useFormulario } from '../../hooks/useFormulario'
import { AlertaError } from '../FormularioAuth'
import {
  AvisoFormulario,
  CamposFormulario,
  TarjetaPerfil,
  claseBoton,
  claseBotonSecundario,
} from './PiezasPerfil'

const CLAVE = ['direcciones']

// Direcciones de envio del cliente: GET/POST /direcciones, PUT/DELETE /direcciones/{id}
export default function SeccionDirecciones() {
  const {
    data: direcciones,
    isPending,
    error,
  } = useQuery({
    queryKey: CLAVE,
    queryFn: () => listarDirecciones(api),
  })
  // null: la lista; 'nueva': formulario vacio; un id: editando esa direccion
  const [editando, setEditando] = useState(null)
  // La que aparece en "Enviar a ..." del encabezado
  const envio = useDireccionEnvio()

  if (isPending) return <p className="text-gray-600">Cargando direcciones...</p>
  if (error) return <AlertaError>{mensajeError(error)}</AlertaError>

  // Mientras se agrega o edita, solo se muestra el formulario
  if (editando !== null) {
    const direccion = direcciones.find((d) => d.id === editando)
    return <FormularioDireccion direccion={direccion} alTerminar={() => setEditando(null)} />
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li>
        <button
          type="button"
          onClick={() => setEditando('nueva')}
          className="flex h-full min-h-52 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white text-gray-600 hover:border-[#607ADB] hover:text-[#607ADB]"
        >
          <AddRoundedIcon sx={{ fontSize: 40 }} />
          <span className="text-[17px] font-semibold">Agregar dirección</span>
        </button>
      </li>
      {direcciones.map((direccion) => (
        <li key={direccion.id}>
          <TarjetaDireccion
            direccion={direccion}
            elegida={direccion.id === envio.direccion?.id}
            alEditar={() => setEditando(direccion.id)}
            alElegir={() => envio.elegir(direccion.id)}
          />
        </li>
      ))}
    </ul>
  )
}

function TarjetaDireccion({ direccion, elegida, alEditar, alElegir }) {
  const queryClient = useQueryClient()
  const [confirmando, setConfirmando] = useState(false)

  const eliminar = useMutation({
    mutationFn: () => eliminarDireccion(api, direccion.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLAVE }),
    onError: () => setConfirmando(false),
  })

  const interior = direccion.numero_interior ? `, int. ${direccion.numero_interior}` : ''

  return (
    <article
      className={`flex h-full min-h-52 flex-col justify-between gap-4 rounded-lg border bg-white p-5 ${
        elegida ? 'border-2 border-[#607ADB]' : 'border-gray-200'
      }`}
    >
      <div className="text-sm leading-relaxed text-gray-700">
        {elegida && (
          <p className="mb-2 border-b border-gray-100 pb-2 text-xs font-semibold tracking-wide text-[#607ADB] uppercase">
            Dirección de envío
          </p>
        )}
        <p className="text-[15px] font-semibold text-[#1B1F2E]">{direccion.destinatario}</p>
        <p>
          {direccion.calle} {direccion.numero_exterior}
          {interior}
        </p>
        <p>Col. {direccion.colonia}</p>
        <p>
          {direccion.ciudad}, {direccion.estado}, C.P. {direccion.codigo_postal}
        </p>
        <p>Tel. {direccion.telefono}</p>
        {direccion.referencias && (
          <p className="mt-1 text-[#8A8FA3]">Referencias: {direccion.referencias}</p>
        )}
        {eliminar.error && (
          <p role="alert" className="mt-2 text-red-600">
            {mensajeError(eliminar.error)}
          </p>
        )}
      </div>

      {confirmando ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="w-full text-gray-700">¿Eliminar esta dirección?</span>
          <button
            type="button"
            onClick={() => eliminar.mutate()}
            disabled={eliminar.isPending}
            className="cursor-pointer rounded-md bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {eliminar.isPending ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
          <button
            type="button"
            onClick={() => setConfirmando(false)}
            disabled={eliminar.isPending}
            className="cursor-pointer rounded-md px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-100"
          >
            No
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 pt-3 text-sm font-semibold">
          <button
            type="button"
            onClick={alEditar}
            className="cursor-pointer text-[#607ADB] hover:underline"
          >
            Editar
          </button>
          <span aria-hidden="true" className="text-gray-300">
            |
          </span>
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="cursor-pointer text-red-600 hover:underline"
          >
            Eliminar
          </button>
          {!elegida && (
            <>
              <span aria-hidden="true" className="text-gray-300">
                |
              </span>
              <button
                type="button"
                onClick={alElegir}
                className="cursor-pointer text-[#607ADB] hover:underline"
              >
                Usar para envíos
              </button>
            </>
          )}
        </div>
      )}
    </article>
  )
}

// Alta (sin direccion) o edicion (con direccion)
function FormularioDireccion({ direccion, alTerminar }) {
  const queryClient = useQueryClient()
  const formulario = useFormulario(CAMPOS_DIRECCION, valoresDe(CAMPOS_DIRECCION, direccion))
  const prefijo = direccion ? `direccion-${direccion.id}` : 'direccion-nueva'

  const guardar = useMutation({
    mutationFn: (datos) =>
      direccion ? actualizarDireccion(api, direccion.id, datos) : crearDireccion(api, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAVE })
      alTerminar()
    },
    onError: formulario.fallo,
  })

  function enviar(e) {
    e.preventDefault()
    if (!formulario.validar()) return
    guardar.mutate(limpiarValores(CAMPOS_DIRECCION, formulario.datos))
  }

  return (
    <TarjetaPerfil id={prefijo} titulo={direccion ? 'Editar dirección' : 'Nueva dirección'}>
      <form className="flex flex-col gap-4" onSubmit={enviar} noValidate>
        <CamposFormulario prefijo={prefijo} campos={CAMPOS_DIRECCION} formulario={formulario} />

        <AvisoFormulario mensaje={formulario.mensaje} />

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={alTerminar}
            disabled={guardar.isPending}
            className={claseBotonSecundario}
          >
            Cancelar
          </button>
          <button type="submit" disabled={guardar.isPending} className={claseBoton}>
            {guardar.isPending ? 'Guardando...' : 'Guardar dirección'}
          </button>
        </div>
      </form>
    </TarjetaPerfil>
  )
}
