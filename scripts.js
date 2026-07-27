
// declaracion y captura de elementos del DOM

const tarjetaAcceso = document.getElementById('tarjeta-acceso');
const btnLoginCabecera = document.getElementById('btn-login-header');
const fichaAdultos = document.querySelectorAll('.filter-plus16'); // creamos una nodelist para poder recorrer las fichas q sean mayores de 16

// Captura del diseño limpio inicial del formulario con sesion no iniciada
const formularioOriginalHTML = tarjetaAcceso.innerHTML;
let sesionIniciada = false;

// Memoria para comparar los campos

let ultimoUsuario = "";
let ultimaEdad = null;

// Acumuladores del Carrito

let acumuladorArticulos = 0;
let acumuladorSubtotal = 0;
let acumuladorDescuento = 0;
let acumuladorEnvio = 0;

// Objeto datosProducto que incluye precios, descuentos y envios

const datosProductos = {
    'figura-1': {
        precio: 289.00,
        descuento: 28.90,
        envio: 15.00
    },
    'figura-2': {
        precio: 195.50,
        descuento: 5.00,
        envio: 12.00
    },
    'figura-3': {
        precio: 149.99,
        descuento: 15.00,
        envio: 0
    }
};

// ACTIVAR EL BOTÓN DE LA CABECERA (INICIAR / CERRAR SESIÓN)
btnLoginCabecera.addEventListener('click', function () {

    if (sesionIniciada === true) {
        sesionIniciada = false;
        btnLoginCabecera.innerHTML = "Iniciar Sesión";
        btnLoginCabecera.style.backgroundColor = "#ff6600";
        btnLoginCabecera.style.color = "#000000";

        for (let i = 0; i < fichaAdultos.length; i++) { // volvemos a mostrar las fichas por si habia una sesion de un menor abierta
            fichaAdultos[i].style.display = 'grid';
        }


        tarjetaAcceso.innerHTML = formularioOriginalHTML;
       
        activarEscuchaFormulario();



    } else {
        tarjetaAcceso.scrollIntoView({ behavior: 'smooth' }); // Si no hay sesion iniciada leve escroll al la tarjeta del Formulario
    }

});

// FUNCIÓN PARA ASIGNAR EL EVENTO AL FORMULARIO

function activarEscuchaFormulario() {
    const btnValidar = document.getElementById('btn-validar');
    if (btnValidar) {
        btnValidar.addEventListener('click', function (e) {
            e.preventDefault(); // Evita cualquier comportamiento raro del navegador
            validarFormulario();
        });
    }
}

// Activamos la escucha por primera vez al cargar la página
activarEscuchaFormulario();



// LA FUNCIÓN QUE COMPRUEBA EL FORMULARIO



function validarFormulario() {
    let inputUsuario = document.getElementById('input-usuario');
    let inputEdad = document.getElementById('input-edad');
    let mensajeValidacion = document.getElementById('alertas-validacion');



    if (!inputUsuario || !inputEdad) {
        tarjetaAcceso.innerHTML = formularioOriginalHTML;
        activarEscuchaFormulario();
        inputUsuario = document.getElementById('input-usuario');
        inputEdad = document.getElementById('input-edad');
    }

    // Limpiamos mensajes previos antes de validar

    mensajeValidacion.innerHTML = "";
    mensajeValidacion.style.color = "#ff4757";


    const nombre = inputUsuario.value.trim(); // Extraccion de nombre del campo usuario limpiando espacios
    const edad = parseInt(inputEdad.value, 10); // Extracción y Conversión de edad a numero entero

    if (nombre === '') {
        mensajeValidacion.innerHTML = "Por favor introduce algun nombre";
        return;

    } else if (isNaN(edad)) {
        mensajeValidacion.innerHTML = "Edad necesaria para el acceso a todos los contenidos";
        return;

    } else if (edad < 0) {
        mensajeValidacion.innerHTML = "¡ERROR! Comprueba de nuevo los datos introducidos de tu edad";
        return;

    } else if (edad < 7) {
        mensajeValidacion.innerHTML = "Si tienes menos de 7 años, no puedes acceder a OtakuVault";
        return;

    }
    if (nombre !== ultimoUsuario || edad !== ultimaEdad) {
        vaciarCarrito();
        ultimoUsuario = nombre;
        ultimaEdad = edad;
    }

    if (edad < 16) {
        btnLoginCabecera.innerHTML = `CERRAR TU SESION ${nombre}`;
        sesionIniciada = true;
        for (let i = 0; i < fichaAdultos.length; i++) {
            fichaAdultos[i].style.display = 'none'; // Recorrido por las fichas que tienen el id del catalogo +16
        }
        btnLoginCabecera.style.backgroundColor = "#1d2026";
        btnLoginCabecera.style.color = "#ffffff";
        tarjetaAcceso.innerHTML = "<h2>¡Acceso limitado!</h2><p class='mensaje-alerta-menor'>Acceso concedido para menores de 16 años. Se ha ocultado el contenido no apto (Gore/+16).</p>";


    } else { // si la edad es mayor o igual que 16 muestra todas las fichas
        for (let i = 0; i < fichaAdultos.length; i++) {
            fichaAdultos[i].style.display = 'grid';
        }
        sesionIniciada = true;

        btnLoginCabecera.innerHTML = `CERRAR TU SESION ${nombre}`;
        btnLoginCabecera.style.backgroundColor = "#1d2026";
        btnLoginCabecera.style.color = "#ffffff";
        tarjetaAcceso.innerHTML = "<h2>¡ACCESO COMPLETADO!</h2><p class='mensaje-alerta-menor'>Distruta de todo nuestro contenido</p>";


    }
}





// La funcion para activar el contador

function cambiarCantidad(idFigura, cambio) {
    const contadorHTML = document.getElementById('cant-' + idFigura);
    let cantidadActual = parseInt(contadorHTML.textContent, 10);
    let nuevaCantidad = cantidadActual + cambio;

    if (nuevaCantidad >= 1) {
        contadorHTML.textContent = nuevaCantidad;
        const precioHTML = document.getElementById('precio-' + idFigura);
        let nuevoPrecio = datosProductos[idFigura].precio * nuevaCantidad;
        precioHTML.textContent = nuevoPrecio.toFixed(2); // acotamos a dos decimales y a la vez lo transformamos a string
    }
}

// Buscamos cada botón de cada figura y preparamos la espera del eventlistener pasandole una funcion que sera agregar carrito

document.getElementById('btn-add-figura-1').addEventListener('click', function () {
    agregarAlCarrito('figura-1');
});

document.getElementById('btn-add-figura-2').addEventListener('click', function () {
    agregarAlCarrito('figura-2');
});

document.getElementById('btn-add-figura-3').addEventListener('click', function () {
    agregarAlCarrito('figura-3');
});





function agregarAlCarrito(idFigura) {



    const contadorHTML = document.getElementById('cant-' + idFigura);
    let unidades = parseInt(contadorHTML.textContent, 10); // convertir texto plano a entero base 10
    let producto = datosProductos[idFigura]; //busqueda dentro del objeto datosproducto

    acumuladorArticulos += unidades; // operamos sumando y multiplicando
    acumuladorSubtotal += producto.precio * unidades;
    acumuladorDescuento += producto.descuento * unidades;
    acumuladorEnvio += producto.envio * unidades;

    let totalAPagar = acumuladorSubtotal - acumuladorDescuento + acumuladorEnvio;

    // inyectamos las cantidades directas y precios formateados con dos decimales

    document.getElementById('cart-qty').textContent = acumuladorArticulos;
    document.getElementById('cart-subtotal').textContent = acumuladorSubtotal.toFixed(2) + ' €';
    document.getElementById('cart-discount').textContent = '- ' + acumuladorDescuento.toFixed(2) + ' €';
    document.getElementById('cart-shipping').textContent = acumuladorEnvio.toFixed(2) + ' €';
    document.getElementById('cart-total').textContent = totalAPagar.toFixed(2) + ' €';
}

function vaciarCarrito() {

    acumuladorArticulos = 0;
    acumuladorSubtotal = 0;
    acumuladorDescuento = 0;
    acumuladorEnvio = 0;

    //  Ponemos a 0 las etiquetas del carrito en el HTML
    document.getElementById('cart-qty').textContent = '0';
    document.getElementById('cart-subtotal').textContent = '0.00 €';
    document.getElementById('cart-discount').textContent = '- 0.00 €';
    document.getElementById('cart-shipping').textContent = '0.00 €';
    document.getElementById('cart-total').textContent = '0.00 €';

    //  Reseteamos los contadores de cada ficha de nuevo a 1
    document.getElementById('cant-figura-1').textContent = '1';
    document.getElementById('cant-figura-2').textContent = '1';
    document.getElementById('cant-figura-3').textContent = '1';

    //  Reseteamos los precios mostrados en las fichas
    document.getElementById('precio-figura-1').textContent = datosProductos['figura-1'].precio.toFixed(2);
    document.getElementById('precio-figura-2').textContent = datosProductos['figura-2'].precio.toFixed(2);
    document.getElementById('precio-figura-3').textContent = datosProductos['figura-3'].precio.toFixed(2);

}