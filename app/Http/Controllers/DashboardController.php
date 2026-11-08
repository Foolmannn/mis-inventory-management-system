<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $productStats = Product::selectRaw("
        COUNT(*) as total_products,
        SUM(quantity) as total_stock,
        SUM(CASE WHEN quantity <= minimum_stock THEN 1 ELSE 0 END) as low_stock_count,
        SUM(quantity * purchase_price) as inventory_value
        ")->first();
        // dd($productStats->toArray());
        $categoryStatus = Category::query()
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->select(
                'categories.name',
                DB::raw('COALESCE(SUM(products.quantity), 0) as total_stocks')
            )
            ->groupBy('categories.id', 'categories.name')
            ->get();

        $total_categories = Category::count();

        $total_products = $productStats->total_products;
        $total_stock = $productStats->total_stock ?? 0;
        $low_stock_count = $productStats->low_stock_count;
        $inventory_value = $productStats->inventory_value ?? 0;

        // convert $inventory_value to a formatted string with 2 decimal places
        $inventory_value = number_format($inventory_value, 2);

        // dd($total_products, $total_categories, $total_stock, $low_stock_count, $inventory_value, $categoryStatus->toArray());

        return Inertia::render('Dashboard', [
            'total_products' => $total_products,
            'total_categories' => $total_categories,
            'total_stock' => $total_stock,
            'low_stock_count' => $low_stock_count,
            'inventory_value' => $inventory_value,
            'category_status' => $categoryStatus,
        ]);
    }
}
