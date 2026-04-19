const inyectarComponentes = () => {
    // 1. Detective de rutas
    const enVistas = window.location.pathname.includes('/vistas/');

    // 2. Definir prefijos de rutas
    const rutaRaiz = enVistas ? '../' : './';
    const rutaVistas = enVistas ? './' : 'vistas/';
    const rutaImg = enVistas ? '../recursos/img/' : 'recursos/img/';

    // 3. Molde del Header (Tu diseño original)
    const headerHTML = `
        <header class="encabezado">
            <div class="contenedor-logo">
                <img src="${rutaImg}logo_3.png" alt="Logo Tienda" class="logo" />
            </div>
            <nav class="navegacion">
                <ul class="menu">
                    <li><a href="${rutaRaiz}index.html">Inicio</a></li>
                    <li><a href="${rutaVistas}catalogo.html">Catálogo</a></li>
                    <li id="item-login"><a href="${rutaVistas}login.html">Iniciar Sesión</a></li>
                    <li id="item-logout" style="display: none"><a href="#" id="btn-cerrar-sesion">Cerrar Sesión</a></li>
                    <li>
                        <a href="${rutaVistas}carrito.html" class="enlace-carrito">
                        🛒 Carrito <span id="contador-carrito" class="insignia">0</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    `;

    // 4. Molde del Footer
    const footerHTML = `
        <footer class="pie-pagina">
            <p>&copy; 2026 Tienda de Dulces y Regalos. Todos los derechos reservados.</p>
        </footer>
    `;

    // 5. Inyectar en los contenedores
    const cHeader = document.getElementById('contenedor-header');
    const cFooter = document.getElementById('contenedor-footer');

    if (cHeader) cHeader.innerHTML = headerHTML;
    if (cFooter) cFooter.innerHTML = footerHTML;

    // Ejecutar lógica de sesión y carrito que ya tenías en main.js
    if (typeof verificarSesionMenu === 'function') verificarSesionMenu();
    if (typeof actualizarContadorCarrito === 'function') actualizarContadorCarrito();
};

document.addEventListener('DOMContentLoaded', inyectarComponentes);