let productos = JSON.parse(localStorage.getItem("productos")) || [

    { nombre: "PC Gamer 132",marca: "Scentey", categoria: "PC", precio: "1000" },
    { nombre: "Impresora Epson",marca: "Hp", categoria: "Impresoras", precio: "32300" },
    { nombre: "Netbook HP",marca: "Redragon", categoria: "Netbooks", precio: "53200" },
    { nombre: "Cable HDMI",marca: "....", categoria: "Cables", precio: "22320" },
 
];
let tasaDolar = 1;
let dolarBlue = 1000;
function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos));
}
async function obtenerDolar() {
    try {
        let response = await fetch("https://api.bluelytics.com.ar/v2/latest");
        let data = await response.json();
        dolarBlue = data.blue.value_sell;
        mostrarProductos();
    } catch (error) {
    }
}


function mostrarProductos() { 
    let tbody = document.getElementById("tablaProductos");
    tbody.innerHTML = "";
    let filtro = document.getElementById("filtroCategoria").value;
    const isAdmin = localStorage.getItem("usuario") == "admin";
    ordenaNombres(productos);

    productos.forEach((producto, index) => {
        if (producto.categoria === filtro) {
            let precioARS = (producto.precio * dolarBlue).toFixed(1);
            const button = isAdmin
                ? `<button class='jomhuria-regular tablaprod button_prod' onclick='eliminarProducto(${index})'>Eliminar</button>`
                : `<a class="btn jomhuria-regular tablaprod button_prod" href="https://wa.me/5492644364260">Consultar</a>`;
            const buttonStock = isAdmin 
                ?`  <button class='jomhuria-regular' onclick='subirStock(${index})'>+1</button>
                    <button class='jomhuria-regular' onclick='bajarStock(${index})'>-1</button>`
                : ``;
            const fila = `<tr class="producto">
                          <td class="jomhuria-regular tablaprod name-prod">${producto.nombre}</td>
                          <td class="jomhuria-regular tablaprod">${producto.marca}</td>
                          <td class="jomhuria-regular tablaprod precio_usd">$${producto.precio}</td>
                          <td class="jomhuria-regular tablaprod">$${precioARS}</td>

                         <td class="jomhuria-regular tablaprod">${producto.stock} ${buttonStock}</td>

                          <td class="jomhuria-regular tablaprod">${button}</td>
                      </tr>`;
            tbody.innerHTML += fila;
        }
    });
}

function ordenaNombres(productos) { 
    if (!Array.isArray(productos) || productos.length < 2) {
        return;
    }
    let auxi = [...productos]; 
    let n = auxi.length;
    let i, cota, k;
    cota = n - 1;
    k = 1;

    while (k !== -1) { 
        k = -1;
        for (i = 0; i < cota; i++) {
            let obj1 = auxi[i];
            let obj2 = auxi[i + 1];

            if (!obj1 || !obj2 || typeof obj1.nombre !== "string" || typeof obj2.nombre !== "string") {
                continue;
            }
            let nombre1 = obj1.nombre.trim();
            let nombre2 = obj2.nombre.trim();
            let esNumero1 = !isNaN(nombre1.charAt(0));
            let esNumero2 = !isNaN(nombre2.charAt(0));
            if ((!esNumero1 && esNumero2) || (esNumero1 === esNumero2 && nombre1.localeCompare(nombre2) > 0)) {
                let temp = auxi[i];
                auxi[i] = auxi[i + 1];
                auxi[i + 1] = temp;
                k = i;
            }
        }
        cota = k;
    }
    for (let j = 0; j < n; j++) {
        productos[j] = auxi[j];
    }
}
function buscarProducto() { 

    let filtro = document.getElementById("filtroMarca").value.toLowerCase();
    let tbody = document.getElementById("tablaProductos");
    let filtroCat = document.getElementById("filtroCategoria").value;
    tbody.innerHTML = "";

    const isAdmin = localStorage.getItem("usuario") == "admin";

    productos.forEach((producto, index) => {
        let nombreProducto = producto.nombre.toLowerCase();
        if (producto.categoria === filtroCat) {
            if (nombreProducto.startsWith(filtro)) { 
                let precioARS = (producto.precio * dolarBlue).toFixed(1);
                const button = isAdmin
                ? `<button class='jomhuria-regular tablaprod button_prod' onclick='eliminarProducto(${index})'>Eliminar</button>`
                : `<a class="btn jomhuria-regular tablaprod button_prod" href="https://wa.me/5492644364260">Consultar</a>`;
            const buttonStock = isAdmin 
                ?`  <button class='jomhuria-regular' onclick='subirStock(${index})'>+1</button>
                    <button class='jomhuria-regular' onclick='bajarStock(${index})'>-1</button>`
                : ``;
            const fila = `<tr class="producto">
                          <td class="jomhuria-regular tablaprod name-prod">${producto.nombre}</td>
                          <td class="jomhuria-regular tablaprod">${producto.marca}</td>
                          <td class="jomhuria-regular tablaprod precio_usd">$${producto.precio}</td>
                          <td class="jomhuria-regular tablaprod">$${precioARS}</td>

                         <td class="jomhuria-regular tablaprod">${producto.stock} ${buttonStock}</td>

                          <td class="jomhuria-regular tablaprod">${button}</td>
                      </tr>`;
            tbody.innerHTML += fila;
        }
        }
    });
}
function filtrarPrecios() {
    let filtro = document.getElementById("filtroPrecio").value;
    let filtroCat = document.getElementById("filtroCategoria").value;
    let tbody = document.getElementById("tablaProductos");
    const isAdmin = localStorage.getItem("usuario") == "admin";
    let productosFiltrados = productos.filter(producto => producto.categoria === filtroCat);
    if (filtro === "Mayor") {  
        ordenaPrecioDescendente(productosFiltrados);
    } else if (filtro === "Menor") {
        ordenaPrecioAscendente(productosFiltrados);
    }
    tbody.innerHTML = "";
    productosFiltrados.forEach((producto, index) => {
        let precioARS = (producto.precio * dolarBlue).toFixed(1);
        const button = isAdmin
        ? `<button class='jomhuria-regular tablaprod button_prod' onclick='eliminarProducto(${index})'>Eliminar</button>`
        : `<a class="btn jomhuria-regular tablaprod button_prod" href="https://wa.me/5492644364260">Consultar</a>`;
    const buttonStock = isAdmin 
        ?`  <button class='jomhuria-regular' onclick='subirStock(${index})'>+1</button>
            <button class='jomhuria-regular' onclick='bajarStock(${index})'>-1</button>`
        : ``;
    const fila = `<tr class="producto">
                  <td class="jomhuria-regular tablaprod name-prod">${producto.nombre}</td>
                  <td class="jomhuria-regular tablaprod">${producto.marca}</td>
                  <td class="jomhuria-regular tablaprod precio_usd">$${producto.precio}</td>
                  <td class="jomhuria-regular tablaprod">$${precioARS}</td>

                 <td class="jomhuria-regular tablaprod">${producto.stock} ${buttonStock}</td>

                  <td class="jomhuria-regular tablaprod">${button}</td>
              </tr>`;
    tbody.innerHTML += fila;
    });
}
function ordenaPrecioAscendente(productos) { 
    if (!Array.isArray(productos) || productos.length < 2) {
        return;
    }
    
    let auxi = [...productos]; 
    let n = auxi.length;
    let i, cota, k;
    cota = n - 1;
    k = 1;

    while (k !== -1) { 
        k = -1;
        for (i = 0; i < cota; i++) {
            let obj1 = auxi[i];
            let obj2 = auxi[i + 1];

            if (!obj1 || !obj2 || isNaN(obj1.precio) || isNaN(obj2.precio)) {
                continue; // Saltar si no hay precios válidos
            }

            if (Number(obj1.precio) > Number(obj2.precio)) { // Menor a mayor
                let temp = auxi[i];
                auxi[i] = auxi[i + 1];
                auxi[i + 1] = temp;
                k = i;
            }
        }
        cota = k;
    }

    for (let j = 0; j < n; j++) {
        productos[j] = auxi[j];
    }
}
function ordenaPrecioDescendente(productos) { 
    if (!Array.isArray(productos) || productos.length < 2) {
        return;
    }
    
    let auxi = [...productos]; 
    let n = auxi.length;
    let i, cota, k;
    cota = n - 1;
    k = 1;

    while (k !== -1) { 
        k = -1;
        for (i = 0; i < cota; i++) {
            let obj1 = auxi[i];
            let obj2 = auxi[i + 1];

            if (!obj1 || !obj2 || isNaN(obj1.precio) || isNaN(obj2.precio)) {
                continue;
            }

            if (Number(obj1.precio) < Number(obj2.precio)) {
                let temp = auxi[i];
                auxi[i] = auxi[i + 1];
                auxi[i + 1] = temp;
                k = i;
            }
        }
        cota = k;
    }

    for (let j = 0; j < n; j++) {
        productos[j] = auxi[j];
    }
}
function filtrarProductos() {
    mostrarProductos();

}
function agregarProducto() {
    let categoria = prompt("0 = Ofertas, 1 = PC, 2 = Impresoras, 3 = Netbooks, 4 = Cables, 5 = Repuestos, 6 = Routers, 7= Accesorios, 8=Toners ,9=Tintas,10=Cartuchos,11=De Segunda Mano");
    
    let categorias = ["Ofertas", "PC", "Impresoras", "Netbooks", "Cables", "Repuestos", "Routers","Accesorios", "Toners", "Tintas","Cartuchos","Mano"];
    categoria = categorias[categoria] || "";

    let nombre = prompt("Ingrese el nombre del producto:");

    let marca = prompt("Ingrese la marca del producto:");
    let stock =0
    stock = parseFloat(prompt("Ingrese el Stock del producto:"));

    let precio = parseFloat(prompt("Ingrese el precio en USD:"));

    if (nombre && marca && categoria&& stock && precio) {
        productos.push({ nombre,marca, categoria,stock, precio });
        guardarProductos();  
        mostrarProductos();
    } else {
        alert("Debe ingresar todos los datos correctamente.");
    }
}
function eliminarProducto(index) {
    productos.splice(index, 1);
    guardarProductos();  
    mostrarProductos();
}
function subirStock(index) {
    productos[index].stock += 1;
    guardarProductos();  
    mostrarProductos();
}

function bajarStock(index) {
    if (productos[index].stock > 0) {
        productos[index].stock -= 1;
        guardarProductos();  
        mostrarProductos();
    }
}


obtenerDolar();
mostrarProductos();  

function toggleMenu() {
    document.querySelector(".menu").classList.toggle("active");
}