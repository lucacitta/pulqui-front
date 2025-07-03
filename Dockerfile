# Etapa 1: Construir la aplicación Angular
FROM node:22 AS builder

WORKDIR /app

COPY ./ /app/

RUN npm install

COPY . .

RUN npm run build --prod

# Etapa 2: Crear la imagen final
FROM nginx:alpine

# Copiar los archivos de la etapa de construcción
COPY --from=builder /app/dist/browser /usr/share/nginx/html

# Configurar Nginx para que sirva la aplicación Angular
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]