// Importamos nuestra base de datos simulada
import { productos } from './db.js';

/* =========================================================================
   FUNCIONES DE UTILIDAD
   ========================================================================= */

// Exportamos esta función por si la necesitamos en catalogo.js o carrito.js
export const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP', 
        minimumFractionDigits: 0
    }).format(precio);
};

// NUEVO: Función para actualizar el contador del carrito en el menú de Inicio
const actualizarContadorCarrito = () => {
    const contadorElemento = document.getElementById('contador-carrito');
    if (contadorElemento) {
        const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
        contadorElemento.textContent = carritoActual.length;
    }
};

/* =========================================================================
   LÓGICA DE LA PÁGINA PRINCIPAL
   ========================================================================= */

const renderizarDestacados = () => {
    const contenedor = document.getElementById('contenedor-destacados');
    if (!contenedor) return; 

    contenedor.innerHTML = '';

    // Tomamos solo los primeros 4 productos para que sean los "Destacados"
    const productosDestacados = productos.slice(0, 3);

    productosDestacados.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto');

        // Ruta de imagen sin ../ porque estamos en el index.html
        tarjeta.innerHTML = `
            <img src="recursos/img/${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">${formatearPrecio(producto.precio)}</p>
            <button class="btn btn-primario btn-agregar" data-id="${producto.id}">
                Agregar al Carrito
            </button>
        `;

        const botonAgregar = tarjeta.querySelector('.btn-agregar');
        botonAgregar.addEventListener('click', () => {
            // Lógica idéntica a la del catálogo
            const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
            carritoActual.push(producto);
            localStorage.setItem('carrito', JSON.stringify(carritoActual));
            
            actualizarContadorCarrito();
            alert(`¡${producto.nombre} añadido al carrito!`);
        });

        contenedor.appendChild(tarjeta);
    });
};

/* =========================================================================
   INICIALIZACIÓN
   ========================================================================= */
/* =========================================================================
   LÓGICA DEL MENÚ DE NAVEGACIÓN (SESIÓN)
   ========================================================================= */

export const verificarSesionMenu = () => {
    const itemLogin = document.getElementById('item-login');
    const itemLogout = document.getElementById('item-logout');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

    // Revisamos si la llave existe en la memoria
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');

    if (usuarioLogueado === 'true') {
        // Si hay sesión: Ocultamos Login, Mostramos Logout
        if (itemLogin) itemLogin.style.display = 'none';
        if (itemLogout) itemLogout.style.display = 'block';
    } else {
        // Si no hay sesión: Mostramos Login, Ocultamos Logout
        if (itemLogin) itemLogin.style.display = 'block';
        if (itemLogout) itemLogout.style.display = 'none';
    }

    // Le damos vida al botón de cerrar sesión
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (evento) => {
            evento.preventDefault(); // Evita que la página salte hacia arriba
            
            // Borramos los permisos de la memoria
            localStorage.removeItem('usuarioLogueado');
            localStorage.removeItem('nombreUsuario');
            
            alert('Has cerrado sesión exitosamente.');
            
            // Recargamos la página o mandamos al inicio para que el menú se actualice
            window.location.href = '../index.html'; 
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderizarDestacados();
    actualizarContadorCarrito(); // Actualizamos el globito rojo al entrar a la página
    verificarSesionMenu();
});