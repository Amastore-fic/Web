# CompraSegura · Web

Dos aplicaciones React (Vite) independientes que comparten código vía `shared/`.

| Carpeta | Qué es | Quién la usa |
|---|---|---|
| `tienda/` | Tienda en línea: catálogo, ficha, carrito, checkout, pedidos, calificaciones | Cliente (comprador) |
| `panel/` | Panel de gestión, servido bajo `/panel/` | Vendedor y administrador |
| `shared/` | Cliente HTTP, sesión, formato y tokens de diseño. Se importa con el alias `@shared` | Ambas |

No es un monorepo con workspaces: cada app tiene su propio `package.json`. `shared/` no se instala, se importa por alias de Vite.

## Arrancar con Docker (recomendado)

Requisitos: **Docker Desktop** abierto y la API corriendo en `http://localhost:8000` (ver el README del repo `api`). No hace falta instalar Node.

Estos comandos son iguales en Windows, Linux y macOS:

```bash
docker compose up -d
```

- Tienda: `http://localhost:5173` (entra con `cliente@comprasegura.test` / `password123`)
- Panel: `http://localhost:5174/panel/` (entra con `vendedor1@comprasegura.test` o `admin@comprasegura.test`, misma contraseña)

La primera vez tarda uno o dos minutos porque instala las dependencias dentro del contenedor. Los cambios que hagas en el código se ven al instante en el navegador, igual que con `npm run dev`.

| Qué | Comando |
|---|---|
| Encender | `docker compose up -d` |
| Apagar | `docker compose down` |
| Ver logs | `docker compose logs -f tienda` (o `panel`) |
| Instalar una dependencia nueva | `docker compose exec tienda npm install <paquete>` (o `panel`) |
| Después de un `git pull` que cambió `package-lock.json` | `docker compose restart` |

### Versión de producción (Nginx)

`Dockerfile` compila las dos apps y las sirve con Nginx en un solo contenedor: la tienda en `/` y el panel en `/panel/`. Es la imagen que se usará en el servidor. Para probarla localmente en `http://localhost:8080`:

```bash
docker compose --profile produccion up -d --build web
```

La URL de la API queda fija al compilar. Para otro servidor se pasa con `VITE_API_URL`, por ejemplo `docker build --build-arg VITE_API_URL=https://mi-dominio/api/v1 -t comprasegura/web .`

## Arrancar sin Docker

Requisitos: **Node.js 22 o superior** y la API corriendo en `http://localhost:8000`.

Cada app se corre en su propia terminal y se queda abierta mientras la usas.

**Windows (cmd o PowerShell):**

```bat
cd tienda
npm install
npm run dev
```

```bat
cd panel
npm install
npm run dev
```

**Linux / macOS / Git Bash:**

```bash
cd tienda && npm install && npm run dev
cd panel  && npm install && npm run dev
```

Las URLs son las mismas que con Docker. No se pueden usar las dos formas a la vez porque ocupan los mismos puertos: apaga los contenedores (`docker compose down`) antes de usar `npm run dev`.

`npm run dev` crea el `.env` automáticamente a partir de `.env.example` si no existe. Solo hay que editarlo si la API no está en `http://localhost:8000`.

`npm install` solo es necesario la primera vez y cuando cambie `package-lock.json` después de un `git pull`.

## Scripts (en cada app)

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier

## Estructura

```
docker-compose.yml   desarrollo (tienda + panel) y perfil "produccion"
Dockerfile           imagen de produccion: build + Nginx
docker/nginx/        configuracion de Nginx (rutas de tienda y panel)
shared/              codigo compartido
tienda/  panel/      una app React cada una
```

Dentro de cada app:

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
