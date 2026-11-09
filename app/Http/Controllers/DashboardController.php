<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Overall product and inventory statistics
        $productStats = Product::selectRaw("
            COUNT(*) as total_products,

            COALESCE(SUM(quantity), 0) as total_stock,

            COALESCE(SUM(
                CASE
                    WHEN quantity > minimum_stock THEN 1
                    ELSE 0
                END
            ), 0) as in_stock_count,

            COALESCE(SUM(
                CASE
                    WHEN quantity > 0 AND quantity <= minimum_stock THEN 1
                    ELSE 0
                END
            ), 0) as low_stock_count,

            COALESCE(SUM(
                CASE
                    WHEN quantity = 0 THEN 1
                    ELSE 0
                END
            ), 0) as out_of_stock_count,

            COALESCE(SUM(quantity * purchase_price), 0) as inventory_value
        ")->first();

        // 2. Total categories
        $totalCategories = Category::count();

        // 3. Stock quantities grouped by category
        $stockByCategory = Category::query()
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->select(
                'categories.id',
                'categories.name',
                DB::raw('COALESCE(SUM(products.quantity), 0) as stock')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('stock')
            ->get();

        // 4. Recently added products
        $recentProducts = Product::with('category:id,name')
            ->select(
                'id',
                'name',
                'category_id',
                'quantity',
                'selling_price',
                'created_at'
            )
            ->latest()
            ->take(5)
            ->get();

        // 5. Products that need stock attention
        $lowStockProducts = Product::with('category:id,name')
            ->select(
                'id',
                'name',
                'category_id',
                'quantity',
                'minimum_stock'
            )
            ->where('quantity', '>', 0)
            ->whereColumn('quantity', '<=', 'minimum_stock')
            ->orderBy('quantity')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'total_products' => $productStats->total_products,
            'total_categories' => $totalCategories,
            'total_stock' => $productStats->total_stock,

            'in_stock_count' => $productStats->in_stock_count,
            'low_stock_count' => $productStats->low_stock_count,
            'out_of_stock_count' => $productStats->out_of_stock_count,

            'inventory_value' => number_format(
                $productStats->inventory_value,
                2
            ),

            'stock_by_category' => $stockByCategory,
            'recent_products' => $recentProducts,
            'low_stock_products' => $lowStockProducts,
        ]);
    }
}