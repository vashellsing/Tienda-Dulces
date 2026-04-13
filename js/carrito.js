/* =========================================================================
   VARIABLES DEL DOM
   ========================================================================= */
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const btnComprar = document.getElementById('btn-comprar');
const mensajeAuth = document.getElementById('mensaje-auth');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

/* =========================================================================
   FUNCIONES DEL CARRITO
   ========================================================================= */

const renderizarCarrito = () => {
    if (!listaCarrito) return;

    listaCarrito.innerHTML = '';

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p style="text-align: center; font-size: 18px; padding: 40px 0;">Tu carrito está vacío en este momento.</p>';
        totalCarrito.textContent = formatearPrecio(0);
        return;
    }

    let total = 0;

    carrito.forEach((producto, indice) => {

        // 👇 Si no tiene cantidad, se la agregamos
        if (!producto.cantidad) {
            producto.cantidad = 1;
        }

        total += producto.precio * producto.cantidad;

        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '15px 0';
        item.style.borderBottom = '1px solid #eee';

        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="../recursos/img/${producto.imagen}" alt="${producto.nombre}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">
                <span style="font-size: 16px; font-weight: bold;">${producto.nombre}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">

                <!-- BOTÓN - -->
                <button class="btn-restar" data-indice="${indice}">-</button>

                <!-- CANTIDAD -->
                <span>${producto.cantidad}</span>

                <!-- BOTÓN + -->
                <button class="btn-sumar" data-indice="${indice}">+</button>

                <span style="font-size: 16px; color: var(--color-acento); font-weight: bold;">
                    ${formatearPrecio(producto.precio * producto.cantidad)}
                </span>

                <button class="btn-eliminar" data-indice="${indice}" style="background: none; border: none; color: #D9534F; cursor: pointer; font-size: 14px; text-decoration: underline;">
                    Eliminar
                </button>
            </div>
        `;

        listaCarrito.appendChild(item);
    });

    totalCarrito.textContent = formatearPrecio(total);

    // BOTONES +
    document.querySelectorAll('.btn-sumar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const i = e.target.getAttribute('data-indice');
            carrito[i].cantidad++;
            actualizarCarrito();
        });
    });

    // BOTONES -
    document.querySelectorAll('.btn-restar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const i = e.target.getAttribute('data-indice');

            if (carrito[i].cantidad > 1) {
                carrito[i].cantidad--;
            } else {
                carrito.splice(i, 1);
            }

            actualizarCarrito();
        });
    });

    // ELIMINAR
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', (evento) => {
            const indiceSeleccionado = evento.target.getAttribute('data-indice');
            eliminarDelCarrito(indiceSeleccionado);
        });
    });
};

const actualizarCarrito = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();

    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }
};

const eliminarDelCarrito = (indice) => {
    carrito.splice(indice, 1);
    actualizarCarrito();
};

/* =========================================================================
   COMPRA
   ========================================================================= */

/* =========================================================================
   COMPRA
   ========================================================================= */

const procesarCompra = () => {
    if (carrito.length === 0) {
        // CAMBIO 1: Modal en lugar de alert
        mostrarModal('Agrega algunos dulces o regalos a tu carrito primero.');
        return;
    }

    const usuarioLogueado = localStorage.getItem('usuarioLogueado');

    if (usuarioLogueado !== 'true') {
        // CAMBIO 2: Usamos el modal con redirección en lugar del setTimeout
        mostrarModal('Debes iniciar sesión para poder realizar tu compra.', () => {
            window.location.href = 'login.html';
        });
        return;
    }

    const nombre = localStorage.getItem('nombreUsuario') || 'Cliente';
    
    // CAMBIO 3: Modal de éxito de compra
    mostrarModal(`¡Gracias por tu compra, ${nombre}!`);

    carrito = [];
    localStorage.removeItem('carrito');
    renderizarCarrito();
    
    // Ya no necesitamos mostrar el mensajeAuth en texto, el modal hace el trabajo
    if (mensajeAuth) mensajeAuth.style.display = 'none';

    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }
};

/* =========================================================================
   INICIALIZACIÓN
   ========================================================================= */

if (btnComprar) {
    btnComprar.addEventListener('click', procesarCompra);
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();
    verificarSesionMenu();
});