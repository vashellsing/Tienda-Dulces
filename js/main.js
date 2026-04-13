/* =========================================================================
   FUNCIONES DE UTILIDAD Y MODALES
   ========================================================================= */ 

const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP', 
        minimumFractionDigits: 0
    }).format(precio);
};

const actualizarContadorCarrito = () => {
    const contadorElemento = document.getElementById('contador-carrito');
    if (contadorElemento) {
        const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
        contadorElemento.textContent = carritoActual.length;
    }
};

// Función para crear modales dinámicos (Movida arriba para mayor seguridad)
const mostrarModal = (mensaje, accionAlCerrar = null) => {
    const overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');

    const caja = document.createElement('div');
    caja.classList.add('modal-caja');

    caja.innerHTML = `
        <p>${mensaje}</p>
        <button class="btn btn-primario btn-cerrar-modal">Aceptar</button>
    `;

    overlay.appendChild(caja);
    document.body.appendChild(overlay);

    const btnCerrar = caja.querySelector('.btn-cerrar-modal');
    btnCerrar.addEventListener('click', () => {
        overlay.remove(); 
        if (accionAlCerrar) {
            accionAlCerrar();
        }
    });
};

/* =========================================================================
   LÓGICA DE LA PÁGINA PRINCIPAL
   ========================================================================= */ 

const renderizarDestacados = () => {
    const contenedor = document.getElementById('contenedor-destacados');
    if (!contenedor) return; 

    contenedor.innerHTML = '';

    const productosDestacados = productos.slice(0, 3);

    productosDestacados.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto');

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
            const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
            carritoActual.push(producto);
            localStorage.setItem('carrito', JSON.stringify(carritoActual));
            
            actualizarContadorCarrito();
            mostrarModal(`¡${producto.nombre} añadido al carrito!`);
        });

        contenedor.appendChild(tarjeta);
    });
};

/* =========================================================================
   LÓGICA DEL MENÚ DE NAVEGACIÓN (SESIÓN)
   ========================================================================= */

const verificarSesionMenu = () => {
    const itemLogin = document.getElementById('item-login');
    const itemLogout = document.getElementById('item-logout');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

    const usuarioLogueado = localStorage.getItem('usuarioLogueado');

    if (usuarioLogueado === 'true') {
        if (itemLogin) itemLogin.style.display = 'none';
        if (itemLogout) itemLogout.style.display = 'block';
    } else {
        if (itemLogin) itemLogin.style.display = 'block';
        if (itemLogout) itemLogout.style.display = 'none';
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (evento) => {
            evento.preventDefault(); 
            
            localStorage.removeItem('usuarioLogueado');
            localStorage.removeItem('nombreUsuario');
            
            mostrarModal('Has cerrado sesión exitosamente.', () => {
                window.location.href = '../index.html';
            });
            // ⚠️ AQUÍ ESTABA EL ERROR: Se borró la línea que forzaba la recarga inmediata
        });
    }
};

/* =========================================================================
   INICIALIZACIÓN
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    renderizarDestacados();
    actualizarContadorCarrito(); 
    verificarSesionMenu();
});