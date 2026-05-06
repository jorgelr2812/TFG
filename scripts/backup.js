import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Crear carpeta de backups si no existe
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `backup-${timestamp}.sql`;
const filepath = path.join(BACKUP_DIR, filename);

// Configuración de la base de datos (usando variables de entorno)
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'barberia_jlr';
const host = process.env.DB_HOST || 'localhost';

console.log(`Iniciando backup de la base de datos: ${database}...`);

// Comando mysqldump
const command = `mysqldump -h ${host} -u ${user} ${password ? `-p${password}` : ''} ${database} > ${filepath}`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error al crear el backup: ${error.message}`);
        return;
    }
    if (stderr) {
        console.warn(`Aviso: ${stderr}`);
    }
    console.log(`✅ Backup completado con éxito: ${filename}`);
});
