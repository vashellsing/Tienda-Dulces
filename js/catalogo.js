
/* =========================================================================
   VARIABLES GLOBALES DEL CATÁLOGO
   ========================================================================= */
const contenedorCatalogo = document.getElementById('contenedor-catalogo');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

/* =========================================================================
   FUNCIONES DEL CARRITO
   ========================================================================= */
/* =========================================================================
   FUNCIONES PRINCIPALES
   ========================================================================= */

// Función para dibujar las tarjetas en pantalla
const renderizarCatalogo = (productosAMostrar) => {
    // Limpiamos el contenedor antes de dibujar para no duplicar
    contenedorCatalogo.innerHTML = '';

    // Si por alguna razón la categoría no tiene productos, mostramos un mensaje
    if (productosAMostrar.length === 0) {
        contenedorCatalogo.innerHTML = '<p style="text-align: center; font-size: 18px; width: 100%;">Aún no hay productos en esta categoría.</p>';
        return;
    }

    // Recorremos el arreglo filtrado y creamos las tarjetas
    productosAMostrar.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto');

        tarjeta.innerHTML = `
            <img src="../recursos/img/${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">${formatearPrecio(producto.precio)}</p>
            <button class="btn btn-primario btn-agregar" data-id="${producto.id}">
                Agregar al Carrito
            </button>
            <a href="producto.html?id=${producto.id}" class="btn-detalles">Ver detalles</a>
        `;

        // ==========================================
        // ¡AQUÍ ESTÁ LA LÓGICA CORREGIDA DEL CARRITO!
        // ==========================================
        const botonAgregar = tarjeta.querySelector('.btn-agregar');
        botonAgregar.addEventListener('click', () => {
            // 1. Traemos el carrito actual de la memoria
            const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
            
            // 2. Buscamos si el producto ya está en el carrito
            const indice = carritoActual.findIndex(item => item.id === producto.id);
            
            if (indice !== -1) {
                // Si ya existe, solo aumentamos su cantidad
                carritoActual[indice].cantidad = (carritoActual[indice].cantidad || 1) + 1;
            } else {
                // Si es nuevo, le ponemos cantidad 1 y lo metemos al carrito
                producto.cantidad = 1;
                carritoActual.push(producto);
            }
            
            // 3. Volvemos a guardar el arreglo actualizado
            localStorage.setItem('carrito', JSON.stringify(carritoActual));
            
            // 4. Actualizamos el número rojo del menú
            actualizarContadorCarrito();
            
            // 5. Pequeño aviso al usuario con nuestro nuevo modal
            mostrarModal(`¡${producto.nombre} añadido al carrito!`);
        });

        contenedorCatalogo.appendChild(tarjeta);
    });
};

// Función para darle vida a los botones de filtro
const configurarFiltros = () => {
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            
            const botonClickeado = evento.target;
            botonClickeado.classList.add('activo');

            const categoriaFiltro = botonClickeado.getAttribute('data-categoria');

            if (categoriaFiltro === 'Todos') {
                renderizarCatalogo(productos); 
            } else {
                const productosFiltrados = productos.filter(producto => producto.categoria === categoriaFiltro);
                renderizarCatalogo(productosFiltrados); 
            }
        });
    });
};

/* =========================================================================
   INICIALIZACIÓN
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    if (contenedorCatalogo) {
        renderizarCatalogo(productos); 
        configurarFiltros();           
    }
    
    // Ejecutamos las utilidades visuales al cargar la página
    actualizarContadorCarrito(); 
    verificarSesionMenu();
});