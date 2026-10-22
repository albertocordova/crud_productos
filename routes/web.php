
<?php

use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;

// Página principal
Route::redirect('/', '/productos');

// Vistas Blade
Route::view('/productos', 'productos.index')
    ->name('productos.index');

Route::view('/productos/crear', 'productos.create')
    ->name('productos.create');

Route::view('/productos/{id}/editar', 'productos.edit')
    ->name('productos.edit');

// Operaciones del CRUD
Route::get('/productos/{producto}', [ProductoController::class, 'show'])
    ->name('productos.show');

Route::put('/productos/{producto}', [ProductoController::class, 'update'])
    ->name('productos.update');

Route::delete('/productos/{producto}', [ProductoController::class, 'destroy'])
    ->name('productos.destroy');

// API de productos
Route::prefix('api')->name('api.')->group(function () {
    Route::apiResource('productos', ProductoController::class)
        ->only(['index', 'store']);
});
