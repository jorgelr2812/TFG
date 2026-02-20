// ===============================
// CONFIGURACION SUPABASE
// ===============================
const SUPABASE_URL = "https://lkxepxetmlelkjkvsoks.supabase.co";
const SUPABASE_KEY = "sb_publishable_q9el2WqRhZwtfxXtTDvjNw_-FBHcCWK";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ===============================
// REGISTRO
// ===============================

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = "Creando cuenta...";

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if(error){
        mensaje.style.color = "red";
        mensaje.textContent = error.message;
        return;
    }

    mensaje.style.color = "green";
    mensaje.textContent = "Cuenta creada correctamente. Redirigiendo...";

    setTimeout(() => {
        window.location.href = "index.html";
        
    }, 1500);
});

