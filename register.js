// register.js

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // El trim() evita que un espacio en blanco rompa el registro
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const mensaje = document.getElementById("mensaje");

        mensaje.textContent = "Creando cuenta...";

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            mensaje.style.color = "red";
            mensaje.textContent = error.message;
            return;
        }

        mensaje.style.color = "green";
        mensaje.textContent = "Cuenta creada correctamente. Entrando...";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });
}