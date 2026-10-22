
@extends('layouts.app')

@section('titulo', 'Editar producto')

@section('contenido')
<div class="container">
    <div class="card mx-auto shadow-sm" style="max-width: 600px;">
        <div class="card-header">
            <h4>Editar producto</h4>
        </div>

        <div class="card-body">
            <form id="form-producto">
                @csrf

                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input type="text" id="nombre" name="nombre"
                           class="form-control" required>
                    <div class="invalid-feedback" data-error="nombre"></div>
                </div>

                <div class="mb-3">
                    <label for="descripcion" class="form-label">Descripción</label>
                    <textarea id="descripcion" name="descripcion"
                              class="form-control" rows="3"></textarea>
                    <div class="invalid-feedback" data-error="descripcion"></div>
                </div>

                <div class="mb-3">
                    <label for="precio" class="form-label">Precio</label>
                    <input type="number" id="precio" name="precio"
                           class="form-control" min="0" step="0.01" required>
                    <div class="invalid-feedback" data-error="precio"></div>
                </div>

                <div class="mb-3">
                    <label for="stock" class="form-label">Stock</label>
                    <input type="number" id="stock" name="stock"
                           class="form-control" min="0" step="1" required>
                    <div class="invalid-feedback" data-error="stock"></div>
                </div>

                <a href="{{ url('/productos') }}"
                   class="btn btn-secondary">Cancelar</a>

                <button type="submit" class="btn btn-primary">
                    Actualizar producto
                </button>
            </form>
        </div>
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/productos.js') }}"></script>
    <script src="{{ asset('js/edit.js') }}"></script>
@endpush
