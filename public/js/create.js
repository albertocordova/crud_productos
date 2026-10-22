
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-producto');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        limpiarErrores(form);

        const { ok, status, data } = await peticion(
            API,
            'POST',
            leerFormulario(form)
        );

        if (ok) {
            await alertaExito(data.message || 'Producto registrado');
            window.location.href = WEB;
        } else if (status === 422) {
            mostrarErrores(form, data.errors);
        } else {
            alertaError(data.message || 'No se pudo registrar el producto');
        }
    });
});
