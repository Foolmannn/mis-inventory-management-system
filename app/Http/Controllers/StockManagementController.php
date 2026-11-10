<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockManagementController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::select('id', 'name')
            ->orderBy('name')
            ->get();

        $query = Product::query();

        // Category filter
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Stock status filter
        if ($request->filled('stock_status')) {
            switch ($request->stock_status) {
                case 'in_stock':
                    $query->where('quantity', '>', 0);
                    break;

                case 'low_stock':
                    $query->whereColumn('quantity', '<=', 'minimum_stock')
                        ->where('quantity', '>', 0);
                    break;

                case 'out_of_stock':
                    $query->where('quantity', 0);
                    break;
            }
        }

        // Search
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $allowedSorts = [
            'name',
            'quantity',
        ];

        $sortField = $request->input('sort', 'name');
        $sortField = in_array($sortField, $allowedSorts)
            ? $sortField
            : 'name';

        $sortDirection = $request->input('direction', 'asc');
        $sortDirection = $sortDirection === 'desc'
            ? 'desc'
            : 'asc';

        // Get products
        $products = $query
            ->select(
                'id',
                'name',
                'quantity',
                'minimum_stock',
                'category_id'
            )
            ->with('category:id,name')
            ->orderBy($sortField, $sortDirection)
            ->paginate(20)
            ->withQueryString();

        // Add computed status
        $products->getCollection()->each(function ($product) {
            if ($product->quantity == 0) {
                $product->status = 'out_of_stock';
            } elseif ($product->quantity <= $product->minimum_stock) {
                $product->status = 'low_stock';
            } else {
                $product->status = 'in_stock';
            }
        });

        $productId = $request->integer('product');

        $selectedProduct = null;
        $stockHistory = collect();

        if ($productId) {
            $selectedProduct = Product::select(
                'id',
                'name',
                'quantity',
                'minimum_stock',
                'category_id'
            )
                ->with('category:id,name')
                ->findOrFail($productId);

            if ($selectedProduct->quantity == 0) {
                $selectedProduct->status = 'out_of_stock';
            } elseif ($selectedProduct->quantity <= $selectedProduct->minimum_stock) {
                $selectedProduct->status = 'low_stock';
            } else {
                $selectedProduct->status = 'in_stock';
            }

            $stockHistory = StockMovement::select(
                'id',
                'product_id',
                'user_id',
                'action',
                'quantity',
                'reason',
                'created_at'
            )
                ->with('user:id,name')
                ->where('product_id', $productId)
                ->latest()
                ->paginate(10, ['*'], 'history_page')
                ->withQueryString();
        }

        return inertia('StockManagement/Index', [
            'products' => $products,
            'filters' => [
                'search' => $request->search,
                'category_id' => $request->category_id,
                'stock_status' => $request->stock_status,
                'sort' => $request->sort,
                'direction' => $request->direction,
            ],
            'selectedProduct' => $selectedProduct,
            'stockHistory' => $stockHistory,
            'categories' => $categories,
        ]);
    }

    public function addStock(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        DB::transaction(function () use ($validated, $request) {

            $product = Product::findOrFail($validated['product_id']);

            // Increase stock
            $product->increment('quantity', $validated['quantity']);

            // Record history
            StockMovement::create([
                'product_id' => $product->id,
                'user_id' => $request->user()->id,
                'action' => 'add',
                'quantity' => $validated['quantity'],
                'reason' => $validated['reason'],
            ]);
        });

        return back()->with('success', 'Stock added successfully.');
    }

    public function removeStock(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        DB::transaction(function () use ($validated, $request) {

            $product = Product::findOrFail($validated['product_id']);

            if ($validated['quantity'] > $product->quantity) {
                throw ValidationException::withMessages([
                    'quantity' => 'Cannot remove more stock than is available.',
                ]);
            }

            // Decrease stock
            $product->decrement('quantity', $validated['quantity']);

            // Record history
            StockMovement::create([
                'product_id' => $product->id,
                'user_id' => $request->user()->id,
                'action' => 'remove',
                'quantity' => $validated['quantity'],
                'reason' => $validated['reason'],
            ]);
        });

        return back()->with('success', 'Stock removed successfully.');
    }
}
