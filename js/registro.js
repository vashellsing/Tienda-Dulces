document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formulario-registro');
    const mensajeError = document.getElementById('mensaje-error-reg');

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitamos que la página recargue
            
            const nombre = document.getElementById('nombre-reg').value;
            const correo = document.getElementById('correo-reg').value;
            const contrasena = document.getElementById('contrasena-reg').value;

            // 1. Traer la "base de datos" del LocalStorage (si no hay, creamos un array vacío)
            let usuariosGuardados = JSON.parse(localStorage.getItem('usuarios_tienda')) || [];

            // 2. Verificar que el correo no esté repetido
            const existeEnLocal = usuariosGuardados.some(u => u.correo === correo);
            const existeEnDB = (typeof usuario !== 'undefined' && usuario.correo === correo); // Verifica el de db.js

            if (existeEnLocal || existeEnDB) {
                mensajeError.textContent = "Este correo ya está registrado. Intenta iniciar sesión.";
                return;
            }

            // 3. Crear el nuevo usuario encriptando su contraseña
            const nuevoUsuario = {
                nombre: nombre,
                correo: correo,
                contrasena: btoa(contrasena) // Convertimos la contraseña a Base64
            };

            // 4. Guardarlo en la lista y actualizar el LocalStorage
            usuariosGuardados.push(nuevoUsuario);
            localStorage.setItem('usuarios_tienda', JSON.stringify(usuariosGuardados));

            // 5. Avisar y redirigir al login
            alert("¡Cuenta creada con éxito! Por favor inicia sesión.");
            window.location.href = "login.html";
        });
    }
});