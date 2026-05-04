import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del transportador para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu correo personal de Gmail
    pass: process.env.EMAIL_PASS, // Las 16 letras de la contraseña de aplicación
  },
});

/**
 * Envía un correo de confirmación de cita
 * @param {string} to - Correo del cliente
 * @param {object} appointment - Datos de la cita (fecha, hora, servicio)
 */
export const sendConfirmationEmail = async (to, appointment) => {
  // Modo desarrollo: Si no hay credenciales, loguear en consola
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'tu-correo@gmail.com') {
    console.log('--- [MODO DESARROLLO] Correo de Confirmación ---');
    console.log(`Para: ${to}`);
    console.log(`Asunto: Confirmación de tu Cita - Barbería JLR`);
    console.log(`Detalles: ${appointment.servicio} el ${appointment.fecha} a las ${appointment.hora}`);
    console.log('-----------------------------------------------');
    return;
  }

  const mailOptions = {
    from: `"Barbería JLR" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Confirmación de tu Cita - Barbería JLR',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #d97706; text-align: center;">¡Cita Confirmada!</h2>
        <p>Hola,</p>
        <p>Tu cita en <strong>Barbería JLR</strong> ha sido reservada con éxito. Aquí tienes los detalles:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Servicio:</strong> ${appointment.servicio}</p>
          <p><strong>Fecha:</strong> ${appointment.fecha}</p>
          <p><strong>Hora:</strong> ${appointment.hora}</p>
        </div>
        <p>Si necesitas cancelar o modificar tu cita, por favor hazlo desde tu panel de usuario.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de confirmación enviado a:', to);
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
};

export const sendReminderEmail = async (to, appointment) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'tu-correo@gmail.com') {
    console.log('--- [MODO DESARROLLO] Recordatorio de Cita ---');
    console.log(`Para: ${to}`);
    console.log(`Detalles: Recordatorio para hoy: ${appointment.servicio} a las ${appointment.hora}`);
    console.log('---------------------------------------------');
    return;
  }

  const mailOptions = {
    from: `"Barbería JLR" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Recordatorio: Tienes una cita hoy - Barbería JLR',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #d97706; text-align: center;">¡No lo olvides!</h2>
        <p>Te recordamos que tienes una cita hoy en <strong>Barbería JLR</strong> a las ${appointment.hora}.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de recordatorio enviado a:', to);
  } catch (error) {
    console.error('Error enviando recordatorio:', error);
  }
};
