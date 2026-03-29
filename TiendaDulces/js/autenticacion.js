// 1. Importamos nuestro usuario falso desde la base de datos
import { usuario } from './db.js';
import { verificarSesionMenu } from './main.js';

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
    // IMPORTANTE: Evitamos que el formulario recargue la página al hacer clic en enviar
    evento.preventDefault();

    // Leemos lo que el usuario escribió
    const correoIngresado = inputCorreo.value;
    const contrasenaIngresada = inputContrasena.value;

    // Comparamos con nuestra base de datos simulada
    if (correoIngresado === usuario.correo && contrasenaIngresada === usuario.contrasena) {
        
        // ¡Las credenciales son correctas! Guardamos la sesión en LocalStorage
        localStorage.setItem('usuarioLogueado', 'true');
        localStorage.setItem('nombreUsuario', usuario.nombre);

        // Limpiamos cualquier error previo
        mensajeError.style.display = 'none';

        // Mostramos un mensaje de éxito rápido y redirigimos al inicio
        alert(`¡Bienvenido/a, ${usuario.nombre}!`);
        window.location.href = '../index.html'; // Lo mandamos a la página principal

    } else {
        // Las credenciales son incorrectas, mostramos el mensaje de error
        mensajeError.textContent = 'Correo o contraseña incorrectos. Intenta de nuevo.';
        mensajeError.style.display = 'block'; // Hacemos visible el texto rojo
    }
};

/* =========================================================================
   INICIALIZACIÓN
   ========================================================================= */

// Verificamos que el formulario exista antes de agregarle el evento (buena práctica)
if (formularioLogin) {
    formularioLogin.addEventListener('submit', manejarLogin);
}

document.addEventListener('DOMContentLoaded', () => {
    verificarSesionMenu();
});