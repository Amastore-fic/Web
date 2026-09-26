# CompraSegura · Web

Dos aplicaciones React (Vite) independientes que comparten código vía `shared/`.

| Carpeta | Qué es | Quién la usa |
|---|---|---|
| `tienda/` | Tienda en línea: catálogo, ficha, carrito, checkout, pedidos, calificaciones | Cliente (comprador) |
| `panel/` | Panel de gestión, servido bajo `/panel/` | Vendedor y administrador |
| `shared/` | Cliente HTTP, sesión, formato y tokens de diseño. Se importa con el alias `@shared` | Ambas |

No es un monorepo con workspaces: cada app tiene su propio `package.json`. `shared/` no se instala, se importa por alias de Vite.

## Arrancar

Con la API corriendo en `http://localhost:8000` (ver `api/README.md`):

```bash
cd tienda && npm install && cp .env.example .env && npm run dev   # http://localhost:5173
cd panel  && npm install && cp .env.example .env && npm run dev   # http://localhost:5174/panel/
```

## Scripts (en cada app)

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier

## Estructura de cada app

```
src/
  api.js           instancia del cliente HTTP + sesión de esta app
  main.jsx         providers (React Query, sesión, router)
  App.jsx          rutas
  componentes/     Layout, protección de rutas, SesionProvider
  hooks/           useSesion, consultas con React Query
  paginas/         una pantalla por archivo
```

## Estado

- **Tienda:** listos login, registro, catálogo (búsqueda + filtro por categoría) y ficha de producto con vendedor y calificación promedio. Carrito, checkout, pedidos y calificar son marcadores con la descripción de lo que falta.
- **Panel:** listos login por rol, menú por rol y alta de categorías (admin). Productos del vendedor, ventas, usuarios y supervisión de pedidos son marcadores.

## Convenciones

- Los datos de la API conservan su `snake_case`; no se convierten a `camelCase`.
- El cliente nunca calcula precios, totales ni existencias: solo muestra y envía.
- La tienda y el panel guardan su sesión en espacios separados de `localStorage`, así un vendedor puede tener abierto el panel y una cuenta de cliente en la tienda a la vez.
- La validación de rol en el cliente es solo de navegación; la que cuenta es la de la API.
