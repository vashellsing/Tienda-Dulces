document.addEventListener('DOMContentLoaded', () => {
    
    // 1. EL DETECTIVE: Leemos la URL para buscar el "?id="
    const parametrosURL = new URLSearchParams(window.location.search);
    const productoId = parametrosURL.get('id'); // Esto atrapa el número

    // 2. Buscamos en tu inventario (datos.js) el producto con ese ID
    // Usamos '==' en lugar de '===' por si el ID en la URL es texto y en datos.js es número
    const productoSeleccionado = productos.find(producto => producto.id == productoId);

    if (productoSeleccionado) {
        // 3. Si lo encontramos, rellenamos el "molde" HTML
        document.getElementById('detalle-nombre').textContent = productoSeleccionado.nombre;
        document.getElementById('detalle-precio').textContent = `$${productoSeleccionado.precio}`;
        
        // Si no le pusiste descripción en datos.js, mostramos un texto por defecto
        document.getElementById('detalle-descripcion').textContent = productoSeleccionado.descripcion || "Un delicioso dulce preparado con los mejores ingredientes.";
        
        // Asignamos la imagen
        document.getElementById('detalle-img').src = productoSeleccionado.imagen || "../img/default.jpg";

        // 4. Le damos vida al botón "Agregar al carrito"
        const btnAgregar = document.getElementById('detalle-btn-agregar');
        btnAgregar.addEventListener('click', () => {
            agregarAlCarritoDesdeDetalle(productoSeleccionado);
        });

    } else {
        // Qué pasa si alguien entra a un enlace con un ID que no existe
        document.getElementById('detalle-nombre').textContent = "Producto no encontrado";
        document.getElementById('detalle-descripcion').textContent = "Lo sentimos, parece que este dulce ya no está disponible.";
        document.getElementById('detalle-btn-agregar').style.display = "none"; // Ocultamos el botón
    }
});

/* =========================================================================
   FUNCIÓN PARA AGREGAR AL CARRITO DESDE ESTA PÁGINA
   ========================================================================= */
function agregarAlCarritoDesdeDetalle(producto) {
    // Abrimos la memoria del carrito
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificamos si el dulce ya está en el carrito
    const indice = carrito.findIndex(item => item.id === producto.id);
    if (indice !== -1) {
        carrito[indice].cantidad++; // Sumamos uno más
    } else {
        producto.cantidad = 1;      // Lo agregamos por primera vez
        carrito.push(producto);
    }
    
    // Guardamos la memoria actualizada
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizamos la burbuja roja del menú (usando la función de main.js)
    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }
    
    alert(`¡Agregaste ${producto.nombre} al carrito!`);
}