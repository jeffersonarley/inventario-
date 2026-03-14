const { json } = require("express");

const fromProducto = document.getElementById("formProducto");
const Nombre = document.getElementById("nombre");
const categoria = document.getElementById("categoria");
const precio = document.getElementById("precio");
const stock = document.getElementById("stock");
const filtroCategoria = document.getElementById("filtroCategoria");
const tablaProductos = document.getElementById("tablaProductos")

let ListaProductos = [];
// funcion inicial
Window.onload = function(){
    const datosDealmacenamiento = localStorage.getItem("productosTienda");

    if (datosDealmacenamiento !==null ){
        ListaProductos = JSON.parse(datosDealmacenamiento);
    } else{ ListaProductos=[];}
    actualizarTablaHTML()
};
function actualizarTablaHTML(){
    console.log("tabla aztualizada con:", ListaProductos);
}
// funcion de registrar productos
fromProducto.addEventListener("submit", function(e){
    e.preventDefault();
    if (Nombre.value === "" || categoria.value ==="" || stock.value ===""){
        alert("todos los campos son obligatorios");
        return;
    }
//crear objeto producto
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
    //aqui se guarda en el localstorage
     localStorage.setItem("productosTienda", JSON.stringify(ListaProductos));
    
     //limpiar
     fromProducto.reset()
     actualizarTablaHTML();
})
// funcion de consultar inventario
function actualizarTablaHTML(){
    tablaProductos.innerHTML="";
 //recorre cada producto 
    ListaProductos.forEach((producto)=>{

        //calcular dias de registro y dias de actualizacion
        const hoy = new Date();
        const fechaReg = new Date (producto.fechaRegistro);
        const fechaact = new(producto.fechaActualizacion);

        const diasDeRegistro = (hoy - fechaReg) / (1000*60*60*24);
        const diasDeActualizacion =(hoy - fechaact) /(1000*60*60*24);
        //definir estado por defecto(color y texto)
        let claseBage = "bg-primary";
        let textosEstado = "normal";

        //stok
        if (producto.stock < 5){
            claseBage = "db-danger";
            textosEstado ="Alerta Stock";
        } else if (diasDeRegistro < 15){
            claseBage = "bg-success";
            textosEstado = "nuevo";
        } else if (diasDeActualizacion > 30){
            claseBage = "bg-secondary";
            textosEstado = "antiguo";
        }


    //filtrar en el html se implemetan variables con el $

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

 //funcion para actualizar productos
 function prepararEdicion (idRecibido){
    //busca en el array
 }const productoEncontrado = ListaProductos.find(p => p.id === idRecibido);
//modificar precio y stok
if (productoEncontrado){
    const nuevoprecio = prompt("ingrese el nuevo precio:", productoEncontrado.precio);
    const nuevoStok = prompt("ingrese la nueva cantidad:",productoEncontrado.stock);
    //actualizar fecha
    productoEncontrado.fechaActualizacion = new Date();

    //guardar cambios y actualizacion
    localStorage.setItem("productosTienda", JSON.stringify(ListaProductos));

    //mostrar ms de exito
    alert("producto actualizado con exito");
    actualizarTablaHTML();


}
//funcion de eliminar
function eliminarProducto(idRecibido){
    confirm("¿esta seguro que quiere eliminar este producto");

    if(respuesta){
        // esto es para filtar y dejar afuera el id
        ListaProductos = ListaProductos.filter(producto => producto.id !== idRecibido);

        //ahora se actualiza en el en localsrorage

    localStorage.setItem("productosTIENDA", JSON.stringify(ListaProductos));

    //ahora se muestra el ms de la eliminacion
    alert("producto eliminado corretamente")

    actualizarTablaHTML

    }
}
} 



 
 

