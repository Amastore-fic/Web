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
    if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json'
    const token = sesion?.token()
    if (token) cabeceras.Authorization = `Bearer ${token}`

    const respuesta = await fetch(url, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    })

    const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null)

    if (!respuesta.ok) {
      // 401 con sesion = la sesion vencio: se cierra y se manda al login.
      // 401 sin sesion (por ejemplo, contrasena equivocada en el login) solo es un error
      // que la pantalla debe mostrar; recargar la pagina lo borraria.
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
