<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    private function reglas(): array
    {
        return [
            'nombre'      => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio'      => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
        ];
    }

    // LISTAR (con búsqueda y paginación)
    public function index(Request $request): JsonResponse
    {
        $productos = Producto::query()
            ->when($request->q, fn ($query, $texto) =>
                $query->where('nombre', 'like', "%{$texto}%"))
            ->latest()
            ->paginate(10);

        return response()->json($productos);
    }

    // VER UNO (para llenar el formulario de editar)
    public function show(Producto $producto): JsonResponse
    {
        return response()->json($producto);
    }

    // GUARDAR
    public function store(Request $request): JsonResponse
    {
        $producto = Producto::create($request->validate($this->reglas()));

        return response()->json([
            'message'  => 'Producto creado correctamente.',
            'producto' => $producto,
        ], 201);
    }

    // ACTUALIZAR
    public function update(Request $request, Producto $producto): JsonResponse
    {
        $producto->update($request->validate($this->reglas()));

        return response()->json([
            'message'  => 'Producto actualizado correctamente.',
            'producto' => $producto,
        ]);
    }

    // ELIMINAR
    public function destroy(Producto $producto): JsonResponse
    {
        $producto->delete();

        return response()->json(['message' => 'Producto eliminado correctamente.']);
    }
}