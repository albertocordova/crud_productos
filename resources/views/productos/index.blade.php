
@extends('layouts.app')

@section('titulo', 'Lista de productos')

@section('contenido')
<div class="container">
    <div class="d-flex justify-content-between mb-3">
        <h4>Productos</h4>
        <a href="{{ url('/productos/crear') }}"
           class="btn btn-primary">+ Nuevo producto</a>
    </div>

    <input type="text" id="buscador" class="form-control mb-3"
           placeholder="Buscar por nombre...">

    <div class="table-responsive">
        <table class="table table-bordered table-striped">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-productos">
                <tr>
                    <td colspan="6">Cargando productos...</td>
                </tr>
            </tbody>
        </table>
    </div>

    <ul id="paginacion" class="pagination"></ul>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/productos.js') }}"></script>
    <script src="{{ asset('js/index.js') }}"></script>
@endpush
