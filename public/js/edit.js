
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('form-producto');
    const partes = window.location.pathname.split('/').filter(Boolean);
    const id = partes[1];

    const { ok, data } = await peticion(`${WEB}/${id}`);

    if (!ok) {
        alertaError(data.message || 'Producto no encontrado');
        return;
    }

    form.elements.nombre.value = data.nombre ?? '';
    form.elements.descripcion.value = data.descripcion ?? '';
    form.elements.precio.value = data.precio ?? '';
    form.elements.stock.value = data.stock ?? '';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        limpiarErrores(form);

        const resultado = await peticion(
            `${WEB}/${id}`,
            'PUT',
            leerFormulario(form)
        );

        if (resultado.ok) {
            await alertaExito(
                resultado.data.message || 'Producto actualizado'
            );
            window.location.href = WEB;
        } else if (resultado.status === 422) {
            mostrarErrores(form, resultado.data.errors);
        } else {
            alertaError(
                resultado.data.message || 'No se pudo actualizar el producto'
            );
        }
    });
});
