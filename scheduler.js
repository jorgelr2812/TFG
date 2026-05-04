import cron from 'node-cron';
import db from './db.js';
import { sendReminderEmail } from './utils/mailer.js';

/**
 * Tarea programada: Se ejecuta todos los días a las 08:00 AM
 * Busca citas para el día de hoy y envía recordatorios por email.
 */
export const initReminderScheduler = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Ejecutando tarea programada: Envío de recordatorios...');
    
    try {
      const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      const query = `
        SELECT a.servicio, a.hora, u.email 
        FROM appointments a 
        JOIN users u ON a.user_id = u.id 
        WHERE a.fecha = ? AND a.estado = 'pendiente'
      `;
      
      const [appointments] = await db.query(query, [today]);
      
      for (const app of appointments) {
        await sendReminderEmail(app.email, app);
      }
      
      console.log(`Se han enviado ${appointments.length} recordatorios.`);
    } catch (error) {
      console.error('Error en el cron de recordatorios:', error);
    }
  });
  
  console.log('Scheduler de recordatorios inicializado (8:00 AM daily).');
};
