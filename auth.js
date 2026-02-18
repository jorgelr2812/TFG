// LOGIN SIMPLE (SIN SUPABASE AÚN)
// Luego lo conectaremos con Supabase

const form = document.getElementById("loginForm");

if(form){
    form.addEventListener("submit", function(e){
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // LOGIN FAKE SOLO PARA PROBAR
        if(email === "admin@test.com" && password === "1234"){
            sessionStorage.setItem("user","logged");
            window.location.href = "index.html";
        }else{
            document.getElementById("error").textContent = "Credenciales incorrectas";
        }
    });
}

// PROTEGER PÁGINAS
if(!document.getElementById("loginForm")){
    const user = sessionStorage.getItem("user");
    if(!user){
        window.location.href = "login.html";
    }
}
