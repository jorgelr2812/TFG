// auth.js

// ===============================
// PROTECCIÓN DE RUTAS Y SESIÓN REAL
// ===============================
async function checkSession() {
    // Le preguntamos a Supabase si el usuario tiene una sesión activa válida
    const { data, error } = await supabaseClient.auth.getSession();
    const session = data.session;

    const isLoginPage = document.getElementById("loginForm");
    const isRegisterPage = document.getElementById("registerForm");

    if (!session && !isLoginPage && !isRegisterPage) {
        // Si NO hay sesión y NO está en login/registro, expulsar al login
        window.location.href = "login.html";
    } else if (session && (isLoginPage || isRegisterPage)) {
        // Si SÍ hay sesión y está intentando entrar al login/registro, llevarlo al inicio
        window.location.href = "index.html";
    }
}

// Ejecutamos la comprobación nada más cargar el script
checkSession();

// ===============================
// LOGIN
// ===============================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorP = document.getElementById("error");

        errorP.style.color = "blue";
        errorP.textContent = "Iniciando sesión...";

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            errorP.style.color = "red";
            errorP.textContent = "Credenciales incorrectas o usuario no encontrado";
            return;
        }

        window.location.href = "index.html";
    });
}

// ===============================
// CERRAR SESIÓN (LOGOUT)
// ===============================
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", async (e) => {
        e.preventDefault();
        // Le decimos a Supabase que cierre la sesión
        await supabaseClient.auth.signOut();
        // Redirigimos al login
        window.location.href = "login.html";
    });
}