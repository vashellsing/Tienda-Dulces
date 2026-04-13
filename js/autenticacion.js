/* =========================================================================
   VARIABLES DEL DOM
   ========================================================================= */
const formularioLogin = document.getElementById('formulario-login');
const inputCorreo = document.getElementById('correo');
const inputContrasena = document.getElementById('contrasena');
const mensajeError = document.getElementById('mensaje-error');

/* =========================================================================
   LÓGICA DE INICIO DE SESIÓN
   ========================================================================= */

const manejarLogin = (evento) => {
    // Evitamos que el formulario recargue la página al hacer clic en enviar
    evento.preventDefault();

    // Leemos lo que el usuario escribió
    const correoIngresado = inputCorreo.value;
    const contrasenaIngresada = inputContrasena.value;

    // --- CAMBIO DE SEGURIDAD ---
    // Codificamos la contraseña ingresada a Base64 para que coincida con db.js
    const contrasenaCodificada = btoa(contrasenaIngresada);

    // Comparamos con nuestra base de datos simulada (usando la versión codificada)
    if (correoIngresado === usuario.correo && contrasenaCodificada === usuario.contrasena) {
        
        // Guardamos la sesión en LocalStorage si todo ok
        localStorage.setItem('usuarioLogueado', 'true');
        localStorage.setItem('nombreUsuario', usuario.nombre);

        // Limpiamos cualquier error previo
        mensajeError.style.display = 'none';

        // NUEVO: Usamos el modal y le pasamos la redirección como segunda instrucción
        mostrarModal(`¡Bienvenido/a, ${usuario.nombre}!`, () => {
            window.location.href = '../index.html'; // Lo mandamos a la página principal
        });

    } else {
        // Las credenciales son incorrectas
        mensajeError.textContent = 'Correo o contraseña incorrectos. Intenta de nuevo.';
        mensajeError.style.display = 'block'; 
    }
};

/* =========================================================================
   INICIALIZACIÓN
   ========================================================================= */

if (formularioLogin) {
    formularioLogin.addEventListener('submit', manejarLogin);
}

document.addEventListener('DOMContentLoaded', () => {
    verificarSesionMenu();
});