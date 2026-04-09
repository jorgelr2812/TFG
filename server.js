import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

// Import routes
import appointmentsRouter from './routes/appointments.js';
import suggestionsRouter from './routes/suggestions.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(morgan('combined')); // Logging
app.use(cors()); // CORS
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Routes
app.use('/api/appointments', appointmentsRouter);
app.use('/api/suggestions', suggestionsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// Serve the static files from the React app (Vite build)
app.use(express.static(path.join(__dirname, 'dist')));

// An api endpoint that returns a short list of items
app.get('/api/status', (req, res) => {
    res.json({ status: 'server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Handles any requests that don't match the ones above
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
