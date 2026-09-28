# Imagen de produccion: compila tienda y panel y los sirve con Nginx.
#   tienda -> /
#   panel  -> /panel/
#
#   docker build --build-arg VITE_API_URL=https://mi-dominio/api/v1 -t comprasegura/web .

# Etapa de compilacion
FROM node:22-alpine AS compilacion

WORKDIR /web

# Primero solo los package*.json para aprovechar la cache de Docker:
# si no cambian las dependencias, no se vuelve a ejecutar npm ci
COPY tienda/package.json tienda/package-lock.json ./tienda/
COPY panel/package.json panel/package-lock.json ./panel/
RUN cd tienda && npm ci --no-audit --no-fund \
    && cd ../panel && npm ci --no-audit --no-fund

COPY shared ./shared
COPY tienda ./tienda
COPY panel ./panel

# La URL de la API queda fija en el JavaScript al compilar
ARG VITE_API_URL=http://localhost:8000/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN cd tienda && npm run build \
    && cd ../panel && npm run build

# Etapa final: solo Nginx y los archivos compilados
FROM nginx:1.27-alpine AS produccion

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=compilacion /web/tienda/dist /usr/share/nginx/html
COPY --from=compilacion /web/panel/dist /usr/share/nginx/html/panel

EXPOSE 80
