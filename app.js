// --- 1. REFERENCIAS AL DOM ---
const fromProducto = document.getElementById("formProducto");
const Nombre = document.getElementById("nombre");
const categoria = document.getElementById("categoria");
const precio = document.getElementById("precio");
const stock = document.getElementById("stock");
const filtroCategoria = document.getElementById("filtroCategoria");
const tablaProductos = document.getElementById("tablaProductos");
const buscarInput = document.getElementById("buscar");

let ListaProductos = [];

// --- 2. INICIO DEL SISTEMA (Diagrama 1) ---
window.onload = function() {
    const datosDealmacenamiento = localStorage.getItem("productosTienda");
    if (datosDealmacenamiento !== null) {
        ListaProductos = JSON.parse(datosDealmacenamiento);
    } else {
        ListaProductos = [];
    }
    actualizarTablaHTML();
};

// --- 3. CONSULTAR INVENTARIO (Diagrama 3) ---
// Agregamos (lista = ListaProductos) para que funcione con los filtros
function actualizarTablaHTML(lista = ListaProductos) {
    console.log("Actualizando tabla con", lista.length, "productos");
    tablaProductos.innerHTML = "";

    lista.forEach((producto) => {
        const hoy = new Date();
        const fechaReg = new Date(producto.fechaRegistro);
        const fechaAct = new Date(producto.fechaActualizacion);

        const diasDeRegistro = (hoy - fechaReg) / (1000 * 60 * 60 * 24);
        const diasDeActualizacion = (hoy - fechaAct) / (1000 * 60 * 60 * 24);

        let claseBadge = "bg-primary";
        let textoEstado = "Normal";

        // Lógica de colores (Semáforo)
        if (producto.stock < 5) {
            claseBadge = "bg-danger"; // Corregido db-danger a bg-danger
            textoEstado = "Alerta Stock";
        } else if (diasDeRegistro < 15) {
            claseBadge = "bg-success";
            textoEstado = "Nuevo";
        } else if (diasDeActualizacion > 30) {
            claseBadge = "bg-secondary";
            textoEstado = "Antiguo";
        }

        tablaProductos.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>$${producto.precio}</td>
                <td>${producto.stock}</td>
                <td><span class="badge ${claseBadge}">${textoEstado}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="prepararEdicion(${producto.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// --- 4. REGISTRAR PRODUCTO (Diagrama 2) ---
fromProducto.addEventListener("submit", function(e) {
    e.preventDefault();
    if (Nombre.value === "" || categoria.value === "" || stock.value === "" || precio.value === "") {
        alert("Todos los campos son obligatorios");
        return;
    }

    const nuevoProducto = {
        id: Date.now(),
        nombre: Nombre.value,
        categoria: categoria.value,
        precio: Number(precio.value),
        stock: Number(stock.value),
        fechaRegistro: new Date(),
        fechaActualizacion: new Date()
    };

    ListaProductos.push(nuevoProducto);
    localStorage.setItem("productosTienda", JSON.stringify(ListaProductos));
    console.log("Producto registrado:", nuevoProducto);
    fromProducto.reset();
    actualizarTablaHTML();
});

// --- 5. ACTUALIZAR PRODUCTO (Diagrama 4) ---
function prepararEdicion(idRecibido) {
    const productoEncontrado = ListaProductos.find(p => p.id === idRecibido);

    if (productoEncontrado) {
        const nuevoPrecio = prompt("Ingrese el nuevo precio:", productoEncontrado.precio);
        const nuevoStock = prompt("Ingrese la nueva cantidad:", productoEncontrado.stock);

        if (nuevoPrecio !== null && nuevoStock !== null) {
            productoEncontrado.precio = Number(nuevoPrecio);
            productoEncontrado.stock = Number(nuevoStock);
            productoEncontrado.fechaActualizacion = new Date();

            localStorage.setItem("productosTienda", JSON.stringify(ListaProductos));
            alert("Producto actualizado con éxito");
            actualizarTablaHTML();
        }
    }
}

// --- 6. ELIMINAR PRODUCTO (Diagrama 5) ---
function eliminarProducto(idRecibido) {
    // Corregido: guardar la respuesta del confirm
    const respuesta = confirm("¿Está seguro que quiere eliminar este producto?");

    if (respuesta) {
        ListaProductos = ListaProductos.filter(producto => producto.id !== idRecibido);
        localStorage.setItem("productosTienda", JSON.stringify(ListaProductos));
        alert("Producto eliminado correctamente");
        actualizarTablaHTML();
    } else {
        // Camino del NO: Volver al menú
        actualizarTablaHTML();
    }
}

// --- 7. FILTRAR POR CATEGORÍA (Diagrama 6) ---
filtroCategoria.addEventListener("change", function() {
    const seleccion = filtroCategoria.value;
    if (seleccion === "") {
        actualizarTablaHTML(ListaProductos);
    } else {
        const filtrados = ListaProductos.filter(p => p.categoria === seleccion);
        actualizarTablaHTML(filtrados);
    }
});

// --- 8. BUSCAR PRODUCTO (Diagrama 7) ---
buscarInput.addEventListener("input", function() {
    const textoUsuario = buscarInput.value.toLowerCase();
    const productosEncontrados = ListaProductos.filter(p => 
        p.nombre.toLowerCase().includes(textoUsuario)
    );
    actualizarTablaHTML(productosEncontrados);
});