



let productos = [];

function obtenerProductos() {
    return fetch("https://fakestoreapi.com/products?limit=10")
        .then(response => response.json())
        .then(data => {
            productos = data.map(item => ({
                nombre: item.title,
                precio: item.price
            }));
        })
        .catch(error => console.error("Error al obtener productos:", error));
}



let carrito = [];

const CLAVE_CARRITO = "carrito";


function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}


function cargarCarrito() {
    let guardado = localStorage.getItem(CLAVE_CARRITO);

    if (guardado) {
        carrito = JSON.parse(guardado);
    }
}

function agregarProducto(producto) {
    carrito.push(producto);
    console.log(producto.nombre + " agregado al carrito");

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

    let botones = document.querySelectorAll(".btn-agregar");

    for (let boton of botones) {
        boton.addEventListener("click", function () {
            let indice = boton.getAttribute("data-indice");
            agregarProducto(productos[indice]);
        });
    }
}

function quitarProducto(indice) {
    let producto = carrito[indice];
    carrito.splice(indice, 1);
    console.log(producto.nombre + " quitado del carrito");

    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    console.log("Carrito vaciado");

    actualizarCarrito();
}

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

    guardarCarrito();

    mostrarCarrito();
}



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



document.addEventListener("DOMContentLoaded", function () {
    cargarCarrito();

    obtenerProductos().then(function () {
        mostrarProductos();
        actualizarCarrito();
    });

    let botonVaciar = document.getElementById("btn-vaciar");
    let botonPagar = document.getElementById("btn-pagar");

    botonVaciar.addEventListener("click", vaciarCarrito);
    botonPagar.addEventListener("click", finalizarCompra);
});
