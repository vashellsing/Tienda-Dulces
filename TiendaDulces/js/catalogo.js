// 1. Importamos los datos y las funciones compartidas
import { productos } from './db.js';
import { formatearPrecio, verificarSesionMenu } from './main.js';

/* =========================================================================
   VARIABLES GLOBALES DEL CATÁLOGO
   ========================================================================= */
const contenedorCatalogo = document.getElementById('contenedor-catalogo');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

/* =========================================================================
   FUNCIONES DEL CARRITO
   ========================================================================= */

// Función para actualizar el globito rojo del carrito en el menú
const actualizarContadorCarrito = () => {
    const contadorElemento = document.getElementById('contador-carrito');
    if (contadorElemento) {
        // Leemos cuántos productos hay en la memoria
        const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
        // Actualizamos el texto del HTML con esa cantidad
        contadorElemento.textContent = carritoActual.length;
    }
};

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
        `;

        // ==========================================
        // ¡AQUÍ ESTÁ LA LÓGICA CORREGIDA DEL CARRITO!
        // ==========================================
        const botonAgregar = tarjeta.querySelector('.btn-agregar');
        botonAgregar.addEventListener('click', () => {
            // 1. Traemos el carrito actual de la memoria (o creamos un arreglo vacío si no hay nada)
            const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
            
            // 2. Metemos el producto que el usuario eligió al arreglo
            carritoActual.push(producto);
            
            // 3. Volvemos a guardar el arreglo actualizado en la memoria del navegador
            localStorage.setItem('carrito', JSON.stringify(carritoActual));
            
            // 4. Actualizamos el número rojo del menú para dar retroalimentación visual
            actualizarContadorCarrito();
            
            // 5. Pequeño aviso al usuario
            alert(`¡${producto.nombre} añadido al carrito!`);
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