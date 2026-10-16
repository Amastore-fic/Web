import { useEffect, useState } from 'react'
import FiltrosUsuarios from '../../componentes/usuarios/FiltrosUsuarios'
import ModalEstadoUsuario from '../../componentes/usuarios/ModalEstadoUsuario'
import Paginacion from '../../componentes/usuarios/Paginacion'
import TablaUsuarios from '../../componentes/usuarios/TablaUsuarios'
import Toast from '../../componentes/usuarios/Toast'
import { useCambiarEstadoUsuario, useListaUsuarios } from '../../hooks/useUsuariosAdmin'

// GET /admin/usuarios y PATCH /admin/usuarios/{id}/estado
export default function Usuarios() {
  const [busqueda, setBusqueda] = useState('')
  const [buscar, setBuscar] = useState('') // busqueda con retardo para no consultar en cada tecla
  const [rol, setRol] = useState('')
  const [estado, setEstado] = useState('')
  const [pagina, setPagina] = useState(1)
  const [filas, setFilas] = useState(6)
  const [seleccionado, setSeleccionado] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setBuscar(busqueda.trim())
      setPagina(1)
    }, 400)
    return () => clearTimeout(t)
  }, [busqueda])

  const { data, isLoading, isFetching, error } = useListaUsuarios({
    pagina,
    porPagina: filas,
    buscar,
    rol,
    activo: estado,
  })
  const cambiarEstado = useCambiarEstadoUsuario()

  // Al cambiar un filtro se vuelve a la primera pagina
  const conReinicio = (setter) => (valor) => {
    setter(valor)
    setPagina(1)
  }

  function confirmar(usuario) {
    cambiarEstado.mutate(
      { id: usuario.id, activo: !usuario.activo },
      {
        onSuccess: (respuesta) => {
          setSeleccionado(null)
          setToast({ tipo: 'success', mensaje: respuesta?.message ?? 'Estado actualizado.' })
        },
        onError: (e) => {
          setSeleccionado(null)
          setToast({ tipo: 'error', mensaje: e.message })
        },
      }
    )
  }

  return (
    <section className="mx-auto max-w-[1640px] pt-10 pb-8 pl-20 pr-20">
      <h1 className="sr-only">Usuarios</h1>

      <div className="overflow-hidden rounded-3xl border border-gray-300 bg-white">
        <FiltrosUsuarios
          busqueda={busqueda}
          rol={rol}
          estado={estado}
          onBusqueda={setBusqueda}
          onRol={conReinicio(setRol)}
          onEstado={conReinicio(setEstado)}
        />
        <TablaUsuarios
          usuarios={data?.data ?? []}
          cargando={isLoading || (isFetching && !data)}
          error={error}
          onAccion={setSeleccionado}
        />
        <Paginacion
          datos={data}
          filasPorPagina={filas}
          onFilas={(n) => {
            setFilas(n)
            setPagina(1)
          }}
          onPagina={setPagina}
        />
      </div>

      <ModalEstadoUsuario
        usuario={seleccionado}
        procesando={cambiarEstado.isPending}
        onConfirmar={confirmar}
        onCancelar={() => setSeleccionado(null)}
      />
      <Toast toast={toast} onCerrar={() => setToast(null)} />
    </section>
  )
}