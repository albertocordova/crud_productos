
document.addEventListener('DOMContentLoaded', () => {
    let paginaActual = 1;
    let busqueda = '';
    let temporizador;

    const tabla = document.getElementById('tabla-productos');
    const paginacion = document.getElementById('paginacion');

    function escapar(valor) {
        const elemento = document.createElement('span');
        elemento.textContent = valor ?? '';
        return elemento.innerHTML;
    }

    async function cargarProductos(pagina = 1) {
        paginaActual = pagina;

        const params = new URLSearchParams({
            page: pagina,
            q: busqueda
        });

        const { ok, data } = await peticion(`${API}?${params}`);

        if (!ok) {
            alertaError('No se pudieron cargar los productos');
            return;
        }

        tabla.innerHTML = data.data.length
            ? data.data.map(p => `
                <tr>
                    <td>${p.id}</td>
                    <td>${escapar(p.nombre)}</td>
                    <td>${escapar(p.descripcion)}</td>
                    <td>S/ ${Number(p.precio).toFixed(2)}</td>
                    <td>${p.stock}</td>
                    <td>
                        <a href="${WEB}/${p.id}/editar"
                           class="btn btn-warning btn-sm">Editar</a>
                        <button class="btn btn-danger btn-sm"
                                data-eliminar="${p.id}">Eliminar</button>
                    </td>
                </tr>
            `).join('')
            : '<tr><td colspan="6">No hay productos.</td></tr>';

        paginacion.innerHTML = '';

        for (let i = 1; i <= data.last_page; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === data.current_page ? 'active' : ''}`;

            const boton = document.createElement('button');
            boton.className = 'page-link';
            boton.textContent = i;
            boton.addEventListener('click', () => cargarProductos(i));

            li.appendChild(boton);
            paginacion.appendChild(li);
        }
    }

    document.getElementById('buscador').addEventListener('input', e => {
        clearTimeout(temporizador);

        temporizador = setTimeout(() => {
            busqueda = e.target.value;
            cargarProductos(1);
        }, 300);
    });

    tabla.addEventListener('click', async e => {
        const boton = e.target.closest('[data-eliminar]');
        if (!boton) return;

        const id = boton.dataset.eliminar;

        let confirmar = true;

        if (window.Swal) {
            const resultado = await Swal.fire({
                title: '¿Eliminar producto?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            confirmar = resultado.isConfirmed;
        } else {
            confirmar = confirm('¿Deseas eliminar este producto?');
        }

        if (!confirmar) return;

        const resultado = await peticion(`${WEB}/${id}`, 'DELETE');

        if (resultado.ok) {
            await alertaExito(resultado.data.message || 'Producto eliminado');
            cargarProductos(paginaActual);
        } else {
            alertaError(resultado.data.message || 'No se pudo eliminar');
        }
    });

    cargarProductos();
});
