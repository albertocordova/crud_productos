
const API = '/api/productos';
const WEB = '/productos';

/* =====================================
   1. OBTENER TOKEN CSRF
===================================== */

function obtenerTokenCSRF() {
    return document.querySelector(
        'meta[name="csrf-token"]'
    )?.getAttribute('content') || '';
}

/* =====================================
   2. PETICIONES A LA API
===================================== */

async function peticion(url, metodo = 'GET', cuerpo = null) {
    const opciones = {
        method: metodo,
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': obtenerTokenCSRF()
        },
        credentials: 'same-origin'
    };

    if (cuerpo !== null) {
        opciones.headers['Content-Type'] = 'application/json';
        opciones.body = JSON.stringify(cuerpo);
    }

    const respuesta = await fetch(url, opciones);
    const data = await respuesta.json().catch(() => ({}));

    return {
        ok: respuesta.ok,
        status: respuesta.status,
        data
    };
}

/* =====================================
   3. LEER FORMULARIO
===================================== */

function leerFormulario(form) {
    return Object.fromEntries(
        new FormData(form).entries()
    );
}

/* =====================================
   4. LIMPIAR ERRORES
===================================== */

function limpiarErrores(form) {
    form.querySelectorAll('.is-invalid').forEach(campo => {
        campo.classList.remove('is-invalid');
    });

    form.querySelectorAll('[data-error]').forEach(aviso => {
        aviso.textContent = '';
    });
}

/* =====================================
   5. MOSTRAR ERRORES
===================================== */

function mostrarErrores(form, errores = {}) {
    Object.entries(errores).forEach(([campo, mensajes]) => {
        const input = form.querySelector(`[name="${campo}"]`);
        const aviso = form.querySelector(`[data-error="${campo}"]`);

        if (input) {
            input.classList.add('is-invalid');
        }

        if (aviso) {
            aviso.textContent = mensajes[0];
        }
    });
}

/* =====================================
   6. ALERTA DE ERROR
===================================== */

function alertaError(mensaje) {
    if (window.Swal) {
        Swal.fire('Error', mensaje, 'error');
    } else {
        alert(mensaje);
    }
}

/* =====================================
   7. ALERTA DE ÉXITO
===================================== */

async function alertaExito(mensaje) {
    if (window.Swal) {
        await Swal.fire({
            icon: 'success',
            title: 'Correcto',
            text: mensaje || 'Operación realizada correctamente'
        });
    } else {
        alert(mensaje || 'Operación realizada correctamente');
    }
}

/* =====================================
   8. ELIMINAR PRODUCTO
===================================== */

async function eliminarProducto(id) {
    const confirmado = window.Swal
        ? await Swal.fire({
            title: '¿Eliminar producto?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(resultado => resultado.isConfirmed)
        : confirm('¿Estás seguro de eliminar este producto?');

    if (!confirmado) {
        return;
    }

    try {
        // La ruta DELETE está definida en web.php.
        const respuesta = await peticion(
            `${WEB}/${id}`,
            'DELETE'
        );

        if (!respuesta.ok) {
            const mensaje = respuesta.data.message
                || `Error HTTP ${respuesta.status}`;

            throw new Error(mensaje);
        }

        await alertaExito(
            respuesta.data.message
                || 'Producto eliminado correctamente.'
        );

        if (typeof cargarProductos === 'function') {
            await cargarProductos();
        } else {
            window.location.href = WEB;
        }

    } catch (error) {
        console.error('Error al eliminar:', error);
        alertaError(
            error.message || 'No se pudo eliminar el producto.'
        );
    }
}
