# Usamos una imagen de Node.js oficial (versión 20 LTS)
FROM node:20-slim

# Creamos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto que usa nuestra app (por defecto 3000 o el de tu .env)
EXPOSE 3000

# Comando para arrancar la aplicación
CMD ["npm", "run", "start"]
