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
    // Codificamos la contraseña ingresada a Base64
    const contrasenaCodificada = btoa(contrasenaIngresada);

    // 1. Buscamos en los usuarios nuevos registrados (LocalStorage)
    let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_tienda')) || [];
    
    // El método .find() busca a alguien que tenga el mismo correo y la misma contraseña
    let usuarioEncontrado = usuariosRegistrados.find(u => u.correo === correoIngresado && u.contrasena === contrasenaCodificada);

    // 2. Si no lo encontramos en los nuevos, verificamos si es el usuario por defecto de db.js
    if (!usuarioEncontrado) {
        if (typeof usuario !== 'undefined' && correoIngresado === usuario.correo && contrasenaCodificada === usuario.contrasena) {
            usuarioEncontrado = usuario; // Asignamos a "Juan Pérez"
        }
    }

    // 3. Comprobamos si tuvimos éxito en la búsqueda
    if (usuarioEncontrado) {
        
        // Guardamos la sesión en LocalStorage
        localStorage.setItem('usuarioLogueado', 'true');
        localStorage.setItem('nombreUsuario', usuarioEncontrado.nombre); // Guardamos el nombre del usuario real que entró

        // Limpiamos cualquier error previo
        mensajeError.style.display = 'none';

        // Usamos el modal y le pasamos la redirección
        mostrarModal(`¡Bienvenido/a, ${usuarioEncontrado.nombre}!`, () => {
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
    if (typeof verificarSesionMenu === 'function') {
        verificarSesionMenu();
    }
});