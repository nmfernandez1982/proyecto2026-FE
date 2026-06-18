

/* ----------- 1) Lista de productos disponibles ----------- */
/* Cada producto es un objeto con nombre y precio (productos inventados). */

let productos = [
    { nombre: "Cubre volante deportivo", precio: 12000 },
    { nombre: "Juego de alfombras de goma", precio: 18500 },
    { nombre: "Soporte para celular magnético", precio: 9500 },
    { nombre: "Cargador USB doble para auto", precio: 7800 },
    { nombre: "Kit de luces LED interiores", precio: 22000 },
    { nombre: "Funda para asiento (par)", precio: 31000 },
    { nombre: "Perfume de auto aroma vainilla", precio: 4200 },
    { nombre: "Aspiradora portátil 12V", precio: 27500 }
];


/* ----------- 2) El módulo del carrito (visto en clase) ----------- */

let carrito = [];

// Nombre de la "caja" donde guardamos el carrito en el navegador.
const CLAVE_CARRITO = "carrito";

// Guarda el carrito en el localStorage del navegador.
// Como localStorage solo guarda texto, convertimos el array a JSON.
function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Lee el carrito guardado (si existe) y lo vuelve a cargar en memoria.
function cargarCarrito() {
    let guardado = localStorage.getItem(CLAVE_CARRITO);

    if (guardado) {
        // JSON.parse convierte el texto de vuelta a un array de objetos.
        carrito = JSON.parse(guardado);
    }
}

function agregarProducto(producto) {
    carrito.push(producto);
    console.log(producto.nombre + " agregado al carrito");

    // Cada vez que agregamos algo, actualizamos lo que se ve en pantalla.
    actualizarCarrito();
}

function calcularTotal() {
    let total = 0;

    for (let producto of carrito) {
        total += producto.precio;
    }

    return total;
}

function mostrarCarrito() {
    console.log("Productos del carrito:");

    for (let producto of carrito) {
        console.log(producto.nombre + " - $" + producto.precio);
    }
}


/* ----------- 3) Funciones para mostrar todo en la página ----------- */

// Dibuja la lista de productos disponibles con su botón "Agregar".
function mostrarProductos() {
    let lista = document.getElementById("lista-productos");
    lista.innerHTML = "";

    for (let i = 0; i < productos.length; i++) {
        let producto = productos[i];

        let item = document.createElement("li");
        item.className = "producto-item";

        item.innerHTML =
            "<span class='producto-nombre'>" + producto.nombre + "</span>" +
            "<span class='producto-precio'>$" + producto.precio + "</span>" +
            "<button class='btn-agregar' data-indice='" + i + "'>Agregar</button>";

        lista.appendChild(item);
    }

    // Le ponemos el evento click a cada botón "Agregar".
    let botones = document.querySelectorAll(".btn-agregar");

    for (let boton of botones) {
        boton.addEventListener("click", function () {
            let indice = boton.getAttribute("data-indice");
            agregarProducto(productos[indice]);
        });
    }
}

// Saca un producto del carrito según su posición.
function quitarProducto(indice) {
    let producto = carrito[indice];
    carrito.splice(indice, 1);
    console.log(producto.nombre + " quitado del carrito");

    actualizarCarrito();
}

// Vacía el carrito completo.
function vaciarCarrito() {
    carrito = [];
    console.log("Carrito vaciado");

    actualizarCarrito();
}

// Refresca lo que se ve del carrito: items, total y cantidad.
function actualizarCarrito() {
    let listaCarrito = document.getElementById("items-carrito");
    let totalTexto = document.getElementById("total-carrito");
    let cantidadTexto = document.getElementById("cantidad-carrito");

    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<li class='carrito-vacio'>Tu carrito está vacío.</li>";
    } else {
        for (let i = 0; i < carrito.length; i++) {
            let producto = carrito[i];

            let item = document.createElement("li");
            item.className = "carrito-item";

            item.innerHTML =
                "<span>" + producto.nombre + "</span>" +
                "<span class='carrito-precio'>$" + producto.precio + "</span>" +
                "<button class='btn-quitar' data-indice='" + i + "'>✕</button>";

            listaCarrito.appendChild(item);
        }

        // Evento para los botones de quitar.
        let botonesQuitar = document.querySelectorAll(".btn-quitar");

        for (let boton of botonesQuitar) {
            boton.addEventListener("click", function () {
                let indice = boton.getAttribute("data-indice");
                quitarProducto(indice);
            });
        }
    }

    totalTexto.textContent = "$" + calcularTotal();
    cantidadTexto.textContent = carrito.length;

    // Guardamos el estado actual del carrito para no perderlo al recargar.
    guardarCarrito();

    // También lo mostramos en la consola, como en el ejemplo de clase.
    mostrarCarrito();
}


/* ----------- 4) Pago (solo maquetado, sin funcionalidad real) ----------- */

function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: "info",
            title: "Tu carrito está vacío",
            text: "Agregá productos antes de pagar.",
            confirmButtonColor: "#ff9900"
        });
        return;
    }

    // Esta parte está SOLO maquetada: no procesa ningún pago real.
    Swal.fire({
        icon: "success",
        title: "¡Gracias por tu compra!",
        html:
            "Total a pagar: <strong>$" + calcularTotal() + "</strong><br><br>" +
            "<small>El pago es solo una demostración, no se procesa ningún cobro.</small>",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#ff9900"
    });
}


/* ----------- 5) Arranque: cuando carga la página ----------- */

document.addEventListener("DOMContentLoaded", function () {
    // Primero recuperamos el carrito que el usuario tenía guardado.
    cargarCarrito();

    mostrarProductos();
    actualizarCarrito();

    let botonVaciar = document.getElementById("btn-vaciar");
    let botonPagar = document.getElementById("btn-pagar");

    botonVaciar.addEventListener("click", vaciarCarrito);
    botonPagar.addEventListener("click", finalizarCompra);
});
