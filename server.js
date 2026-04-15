import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

// Import routes
import appointmentsRouter from './routes/appointments.js';
import suggestionsRouter from './routes/suggestions.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Este servidor Express expone la API local y, en producción, sirve los archivos
// construidos de Vite desde la carpeta `dist`.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(morgan('combined')); // Registro de peticiones para eventos del backend
app.use(cors()); // Permite solicitudes desde el frontend en otro origen
app.use(express.json()); // Parsear cuerpos JSON en las peticiones de la API

// El rate limiting mantiene la API estable ante solicitudes repetidas.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limitar cada IP a 100 peticiones por ventana
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Registrar los grupos de rutas de la API.
app.use('/api/appointments', appointmentsRouter);
app.use('/api/suggestions', suggestionsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// Servir los archivos estáticos generados por React/Vite.
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint de salud para verificar que el backend funciona.
app.get('/api/status', (req, res) => {
    res.json({ status: 'server is running' });
});

// Middleware de manejo de errores.
app.use(errorHandler);

// Atiende cualquier petición que no encaje con las rutas anteriores.
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
