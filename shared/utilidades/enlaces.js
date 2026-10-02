// Direcciones para pasar de la tienda al panel y de vuelta.
// En produccion comparten dominio (tienda en "/", panel en "/panel/");
// en desarrollo cada app corre en su propio puerto (5173 y 5174).
// Se pueden cambiar con VITE_TIENDA_URL y VITE_PANEL_URL en el .env de cada app.

const enDesarrollo = import.meta.env.DEV

const conDiagonalFinal = (url) => (url.endsWith('/') ? url : `${url}/`)

export const URL_TIENDA = conDiagonalFinal(
  import.meta.env.VITE_TIENDA_URL || (enDesarrollo ? 'http://localhost:5173/' : '/')
)

export const URL_PANEL = conDiagonalFinal(
  import.meta.env.VITE_PANEL_URL || (enDesarrollo ? 'http://localhost:5174/panel/' : '/panel/')
)

export const URL_REGISTRO_VENDEDOR = `${URL_PANEL}registro`
