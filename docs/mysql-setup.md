# Configuración local de MySQL para el proyecto

## 1. Instalar MySQL en Windows

Recomendado: usa XAMPP si quieres la forma más rápida con phpMyAdmin.

- Descarga XAMPP desde https://www.apachefriends.org/es/index.html
- Instala XAMPP
- Abre el Panel de Control de XAMPP
- Inicia `MySQL`
- Abre `http://localhost/phpmyadmin`

Alternativa: instala MySQL Community Server desde https://dev.mysql.com/downloads/installer/

## 2. Crear la base de datos e importar el esquema

### Con phpMyAdmin

1. Abre `http://localhost/phpmyadmin`
2. Crea la base de datos: `peluqueria`
3. Ve a `Importar`
4. Selecciona `db/schema.sql`
5. Ejecuta

### Con MySQL CLI (si está instalado)

Abre PowerShell y ejecuta:

```powershell
mysql -u root -p
```

Luego dentro de MySQL:

```sql
SOURCE C:/Users/Casa/Desktop/TFG/db/schema.sql;
```

## 3. Archivo de configuración local

Ya se ha creado el archivo `.env` en el proyecto con estas variables:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Jorge2812$
DB_NAME=peluqueria

JWT_SECRET=una_clave_segura_para_local
```

## 4. Iniciar el servidor

Desde la carpeta del proyecto:

```powershell
npm start
```

Esto arrancará el backend en `http://localhost:3000`.

## 5. Verificar conexión

Si el servidor arranca, la conexión a MySQL local está funcionando.

Si hay errores de conexión, revisa que:

- MySQL esté arrancado
- las credenciales en `.env` sean correctas
- el puerto sea `3306`
