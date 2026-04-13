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

    // Tomamos los primeros 3 productos de la lista
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
            <a href="vistas/producto.html?id=${producto.id}" class="btn-detalles">Ver detalles</a>
        `;

        const botonAgregar = tarjeta.querySelector('.btn-agregar');
        botonAgregar.addEventListener('click', () => {
            // 1. Traemos el carrito actual
            const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
            
            // 2. Lógica de Cantidad: Buscamos si el producto ya existe
            const indice = carritoActual.findIndex(item => item.id === producto.id);
            
            if (indice !== -1) {
                // Si ya existe, sumamos a la cantidad
                carritoActual[indice].cantidad = (carritoActual[indice].cantidad || 1) + 1;
            } else {
                // Si es nuevo, inicializamos cantidad en 1 y lo agregamos
                producto.cantidad = 1;
                carritoActual.push(producto);
            }
            
            // 3. Guardamos y actualizamos
            localStorage.setItem('carrito', JSON.stringify(carritoActual));
            actualizarContadorCarrito();
            
            // 4. Feedback visual con tu modal
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