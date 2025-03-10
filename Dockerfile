# Etapa 1: Build de la aplicación con Node.js
FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ⚠️ Compilar la aplicación y asegurarse de que los archivos se generen en /app/dist
RUN npm run build

# ✅ Verificar que el directorio /app/dist exista
RUN ls -la /app/dist

# Etapa 2: Servir el contenido compilado con NGINX
FROM nginx:alpine AS production-stage

# Copiar el archivo de configuración personalizado de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados al directorio predeterminado de NGINX
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
