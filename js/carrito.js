/* =========================================================================
   VARIABLES DEL DOM
   ========================================================================= */
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const btnComprar = document.getElementById('btn-comprar');
const mensajeAuth = document.getElementById('mensaje-auth');

// Leemos el carrito de la memoria del navegador. Si no hay nada, creamos un arreglo vacío []
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

/* =========================================================================
   FUNCIONES DEL CARRITO
   ========================================================================= */

const renderizarCarrito = () => {
    // Si no estamos en la página del carrito, detenemos la función para evitar errores
    if (!listaCarrito) return;

    // Limpiamos la lista visual
    listaCarrito.innerHTML = '';

    // Si el carrito está vacío, mostramos el mensaje
    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p style="text-align: center; font-size: 18px; padding: 40px 0;">Tu carrito está vacío en este momento.</p>';
        totalCarrito.textContent = formatearPrecio(0);
        return;
    }

    let total = 0;

    // Dibujamos cada producto que esté guardado en el carrito
    carrito.forEach((producto, indice) => {
        total += producto.precio;

        // Creamos la fila del producto (usamos estilos en línea por simplicidad para esta estructura específica)
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
            <div style="display: flex; align-items: center; gap: 20px;">
                <span style="font-size: 16px; color: var(--color-acento); font-weight: bold;">${formatearPrecio(producto.precio)}</span>
                <button class="btn-eliminar" data-indice="${indice}" style="background: none; border: none; color: #D9534F; cursor: pointer; font-size: 14px; text-decoration: underline;">Eliminar</button>
            </div>
        `;

        listaCarrito.appendChild(item);
    });

    // Actualizamos el total a pagar
    totalCarrito.textContent = formatearPrecio(total);

    // Le damos vida a los botones de "Eliminar" que acabamos de crear
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', (evento) => {
            const indiceSeleccionado = evento.target.getAttribute('data-indice');
            eliminarDelCarrito(indiceSeleccionado);
        });
    });
};

const eliminarDelCarrito = (indice) => {
    carrito.splice(indice, 1); // Quitamos el producto del arreglo
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardamos el carrito actualizado
    renderizarCarrito(); // Volvemos a dibujar la pantalla
    
    // Actualizamos el contador del menú al eliminar un producto
    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }
};

/* =========================================================================
   LÓGICA DE COMPRA Y SEGURIDAD (LA REGLA DE ORO)
   ========================================================================= */

const procesarCompra = () => {
    // 1. Verificamos si hay productos para comprar
    if (carrito.length === 0) {
        alert('Agrega algunos dulces o regalos a tu carrito primero.');
        return;
    }

    // 2. VERIFICACIÓN DE SEGURIDAD: Buscamos la llave de inicio de sesión
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');

    if (usuarioLogueado !== 'true') {
        // ❌ NO TIENE PERMISO: Mostramos error en pantalla
        mensajeAuth.textContent = 'Debes iniciar sesión para poder comprar.';
        mensajeAuth.style.display = 'block';
        
        // Lo redirigimos amablemente a la página de login después de 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // 3. ✅ TIENE PERMISO: Compra exitosa
    const nombre = localStorage.getItem('nombreUsuario') || 'Cliente';
    alert(`¡Gracias por tu compra, ${nombre}! Tu pedido está en camino a prepararse.`);
    
    // Vaciamos el carrito tras la compra exitosa
    carrito = [];
    localStorage.removeItem('carrito');
    renderizarCarrito();
    mensajeAuth.style.display = 'none';
    
    // Actualizamos el contador del menú para que vuelva a cero
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
    verificarSesionMenu(); // Mantiene el botón de cerrar sesión sincronizado
});