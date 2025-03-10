document.addEventListener("DOMContentLoaded", function () {
    verificarSesion();
});

function iniciarSesion() {
    let usuario = document.getElementById("usuario").value;
    let pass = document.getElementById("contraseña").value;

    if (usuario === "admin" && pass === "apolo2025") {
        localStorage.setItem("usuario", "admin")
        alert("Bienvenido, Admin");
        verificarSesion();
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

function verificarSesion() {
    let usuarioGuardado = localStorage.getItem("usuario");
    console.log(usuarioGuardado)
    if (usuarioGuardado === "admin") {
        document.querySelector(".adminSection").style.display = "block";
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.reload();
}
