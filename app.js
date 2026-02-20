// app.js

// ===============================
// GUARDAR SUGERENCIA
// ===============================
const formSugerencias = document.getElementById("form-sugerencias");
if (formSugerencias) {
    formSugerencias.addEventListener("submit", async (e) => {
        e.preventDefault();
        const texto = document.getElementById("sugerencia-texto").value.trim();
        
        // Obtenemos el usuario actual
        const { data: { user } } = await supabaseClient.auth.getUser();

        // Comprobamos si hay sesión iniciada
        if (!user) {
            alert("Debes iniciar sesión para enviar una sugerencia.");
            return;
        }

        // Insertamos en la tabla usando tus columnas exactas (usuario_id, mensaje)
        const { error } = await supabaseClient
            .from('sugerencias')
            .insert([{ usuario_id: user.id, mensaje: texto }]);

        if (!error) {
            alert("¡Sugerencia enviada correctamente!");
            formSugerencias.reset();
        } else {
            alert("Error al enviar: " + error.message);
        }
    });
}

// ===============================
// GUARDAR CITA
// ===============================
const formCitas = document.getElementById("form-citas");
if (formCitas) {
    formCitas.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Recogemos los datos (incluyendo la nueva hora)
        const servicio = document.getElementById("cita-servicio").value;
        const fecha = document.getElementById("cita-fecha").value;
        const hora = document.getElementById("cita-hora").value;

        // Obtenemos el usuario actual
        const { data: { user } } = await supabaseClient.auth.getUser();

        // Comprobamos si hay sesión iniciada
        if (!user) {
            alert("Debes iniciar sesión para pedir una cita.");
            return;
        }

        // Insertamos usando LOS NOMBRES EXACTOS de tus columnas (user_id, fecha, hora, servicio, estado)
        const { error } = await supabaseClient
            .from('citas')
            .insert([{ 
                user_id: user.id, 
                servicio: servicio, 
                fecha: fecha,
                hora: hora,
                estado: 'pendiente' // El estado inicial
            }]);

        if (!error) {
            alert("¡Cita solicitada correctamente!");
            formCitas.reset();
        } else {
            alert("Error al solicitar cita: " + error.message);
        }
    });
}
