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
// LOGIN
// ===============================
const form = document.getElementById("loginForm");

if(form){
    form.addEventListener("submit", async function(e){
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorP = document.getElementById("error");

        errorP.style.color = "blue";
        errorP.textContent = "Iniciando sesión...";

        // CONEXIÓN REAL A SUPABASE PARA EL LOGIN
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        // Si hay un error (contraseña mal, no existe, etc)
        if (error) {
            errorP.style.color = "red";
            errorP.textContent = "Credenciales incorrectas";
            return;
        }

        // Si el login es correcto:
        // Guardamos la sesión en el navegador como lo tenías pensado
        sessionStorage.setItem("user", "logged"); 
        
        // Redirigimos a la página de inicio
        window.location.href = "index.html";
    });
}

// ===============================
// PROTEGER PÁGINAS
// ===============================
// Si estamos en cualquier página que no sea el login (o registro)
if(!document.getElementById("loginForm") && !document.getElementById("registerForm")){
    const user = sessionStorage.getItem("user");
    if(!user){
        window.location.href = "login.html";
    }
}
