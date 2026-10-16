// Cliente HTTP minimo sobre fetch. Todas las llamadas a la API pasan por aqui.
//   const api = crearClienteApi({ baseUrl, sesion })
//   await api.get('/productos', { buscar: 'audifonos' })
//   await api.post('/auth/login', { correo, password })

export class ErrorApi extends Error {
  constructor(estado, cuerpo) {
    super(cuerpo?.message ?? `Error ${estado}`)
    this.estado = estado
    // Errores de validacion de Laravel: { campo: ['mensaje', ...] }
    this.errores = cuerpo?.errors ?? {}
  }
}

export function crearClienteApi({ baseUrl, sesion, alNoAutenticado }) {
  async function solicitar(metodo, ruta, { cuerpo, parametros } = {}) {
    const url = new URL(baseUrl + ruta)
    Object.entries(parametros ?? {}).forEach(([clave, valor]) => {
      if (valor !== undefined && valor !== null && valor !== '') url.searchParams.set(clave, valor)
    })

    const cabeceras = { Accept: 'application/json' }
    
    // VERIFICAR SI EL CUERPO ES UN FORMDATA
    const esFormData = cuerpo instanceof FormData

    if (cuerpo !== undefined) {
      // Si no es FormData, aplicamos el comportamiento tradicional JSON
      if (!esFormData) {
        cabeceras['Content-Type'] = 'application/json'
      }
      // Si es FormData, NO asignamos 'Content-Type' para que el navegador cree el boundary automáticamente
    }

    const token = sesion?.token()
    if (token) cabeceras.Authorization = `Bearer ${token}`

    const respuesta = await fetch(url, {
      method: metodo,
      headers: cabeceras,
      // Si es FormData, lo pasamos directo; si no, aplicamos JSON.stringify
      body: cuerpo !== undefined ? (esFormData ? cuerpo : JSON.stringify(cuerpo)) : undefined,
    })

    const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null)

    if (!respuesta.ok) {
      if (respuesta.status === 401 && token) {
        sesion?.cerrar()
        alNoAutenticado?.()
      }
      throw new ErrorApi(respuesta.status, datos)
    }

    return datos
  }

  return {
    get: (ruta, parametros) => solicitar('GET', ruta, { parametros }),
    post: (ruta, cuerpo) => solicitar('POST', ruta, { cuerpo }),
    put: (ruta, cuerpo) => solicitar('PUT', ruta, { cuerpo }),
    patch: (ruta, cuerpo) => solicitar('PATCH', ruta, { cuerpo }),
    delete: (ruta) => solicitar('DELETE', ruta),
  }
}