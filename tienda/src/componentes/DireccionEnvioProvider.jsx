import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listarDirecciones } from '@shared/perfil/perfil'
import { api } from '../api'
import { DireccionEnvioContext } from '../hooks/useDireccionEnvio'
import { useSesion } from '../hooks/useSesion'

// La API aun no guarda una direccion predeterminada: la elegida se recuerda en este
// navegador, por usuario. Si no hay una elegida (o se borro) se usa la mas antigua.
function leer(clave) {
  try {
    return Number(localStorage.getItem(clave)) || null
  } catch {
    return null
  }
}

function escribir(clave, id) {
  try {
    localStorage.setItem(clave, String(id))
  } catch {
    // Sin almacenamiento (modo privado, etc.) la eleccion solo dura mientras la pagina este abierta
  }
}

export default function DireccionEnvioProvider({ children }) {
  const { usuario } = useSesion()
  const esCliente = usuario?.rol === 'cliente'
  const clave = usuario ? `comprasegura:tienda:direccion-envio:${usuario.id}` : null

  // Misma clave que usa "Mi cuenta > Direcciones": se comparte la cache
  const { data: direcciones, isPending } = useQuery({
    queryKey: ['direcciones'],
    queryFn: () => listarDirecciones(api),
    enabled: esCliente,
  })

  const [elegidas, setElegidas] = useState({})
  const idElegido = clave ? (elegidas[clave] ?? leer(clave)) : null
  // La API las manda de la mas reciente a la mas antigua: sin eleccion se usa la primera
  // que registro, para que agregar otra no cambie el envio sin avisar
  const direccion = direcciones?.find((d) => d.id === idElegido) ?? direcciones?.at(-1) ?? null

  function elegir(id) {
    if (!clave) return
    escribir(clave, id)
    setElegidas((previas) => ({ ...previas, [clave]: id }))
  }

  return (
    <DireccionEnvioContext.Provider
      value={{
        direcciones: direcciones ?? [],
        direccion,
        elegir,
        cargando: esCliente && isPending,
      }}
    >
      {children}
    </DireccionEnvioContext.Provider>
  )
}
