<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | 1. Inventory Summary
        |--------------------------------------------------------------------------
        */

        $stats = Product::selectRaw("
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

            COALESCE(SUM(quantity * purchase_price), 0) as inventory_value,

            COALESCE(SUM(quantity * selling_price), 0) as potential_selling_value,
            COALESCE(SUM(quantity * (selling_price - purchase_price)), 0) as potential_profit
        ")->first();


        /*
        |--------------------------------------------------------------------------
        | 2. Stock Quantity By Category
        |--------------------------------------------------------------------------
        */

        $stockByCategory = Category::query()
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->select(
                'categories.id',
                'categories.name',
                DB::raw('COALESCE(SUM(products.quantity), 0) as stock'),
                DB::raw('COUNT(products.id) as total_products'),
                DB::raw('COALESCE(SUM(products.quantity * products.purchase_price), 0) as inventory_value')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('inventory_value')
            ->get();


        /*
        |--------------------------------------------------------------------------
        | 3. Stock Status Distribution
        |--------------------------------------------------------------------------
        */

        $stockStatus = [
            [
                'name' => 'In Stock',
                'value' => (int) $stats->in_stock_count,
            ],
            [
                'name' => 'Low Stock',
                'value' => (int) $stats->low_stock_count,
            ],
            [
                'name' => 'Out of Stock',
                'value' => (int) $stats->out_of_stock_count,
            ],
        ];


        /*
        |--------------------------------------------------------------------------
        | 4. Inventory Value By Category
        |--------------------------------------------------------------------------
        */

        $valueByCategory = Category::query()
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->select(
                'categories.id',
                'categories.name',
                DB::raw('COALESCE(SUM(products.quantity * products.purchase_price), 0) as inventory_value')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('inventory_value')
            ->get();
        $productValueRows = Product::query()
    ->select(
        'id',
        'name',
        DB::raw('COALESCE(quantity * purchase_price, 0) as total_value')
    )
    ->where('quantity', '>', 0)
    ->orderByDesc('total_value')
    ->get();

    // Keep the top 8 products in the donut chart.
    // Combine the remaining products into one segment.
    $productValueChart = $productValueRows->take(15)->values();

    $otherProductsValue = $productValueRows
        ->skip(15)
        ->sum('total_value');

    if ($otherProductsValue > 0) {
        $productValueChart->push([
            'id' => 'other',
            'name' => 'Other Products',
            'total_value' => round((float) $otherProductsValue, 2),
        ]);
    }

        /*
        |--------------------------------------------------------------------------
        | 5. Product Stock Report
        |--------------------------------------------------------------------------
        */

        $query = Product::with('category:id,name')
            ->select(
                'id',
                'name',
                'category_id',
                'quantity',
                'minimum_stock',
                'purchase_price',
                'selling_price',
                'created_at'
            );


        // Search by product name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }


        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }


        // Filter by stock status
        if ($request->filled('stock_status')) {

            switch ($request->stock_status) {

                case 'in_stock':
                    $query->whereColumn('quantity', '>', 'minimum_stock');
                    break;

                case 'low_stock':
                    $query->where('quantity', '>', 0)
                        ->whereColumn('quantity', '<=', 'minimum_stock');
                    break;

                case 'out_of_stock':
                    $query->where('quantity', 0);
                    break;
            }
        }


        // Sorting
        $allowedSorts = [
            'name',
            'quantity',
            'purchase_price',
            'selling_price',
            'created_at',
        ];

        $sortField = in_array($request->input('sort'), $allowedSorts)
            ? $request->input('sort')
            : 'name';

        $sortDirection = $request->input('direction') === 'desc'
            ? 'desc'
            : 'asc';

        $query->orderBy($sortField, $sortDirection);


        // Pagination
        $products = $query->paginate(15)->withQueryString();


        /*
        |--------------------------------------------------------------------------
        | 6. Categories For Filter Dropdown
        |--------------------------------------------------------------------------
        */

        $categories = Category::select('id', 'name')
            ->orderBy('name')
            ->get();


        /*
        |--------------------------------------------------------------------------
        | 7. Return Data To React
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Reports/Index', [

            // Summary
            'stats' => [
                'total_products' => (int) $stats->total_products,
                'total_stock' => (int) $stats->total_stock,
                'in_stock_count' => (int) $stats->in_stock_count,
                'low_stock_count' => (int) $stats->low_stock_count,
                'out_of_stock_count' => (int) $stats->out_of_stock_count,
                'inventory_value' => round((float) $stats->inventory_value, 2),
                'potential_selling_value' => round((float) $stats->potential_selling_value, 2),
                'potential_profit' => round((float) $stats->potential_profit,2),
            ],

            // Charts
            'stock_by_category' => $stockByCategory,
            'stock_status' => $stockStatus,
            'value_by_category' => $valueByCategory,

            // Product table
            'products' => $products,

            // Dropdown options
            'categories' => $categories,

            // Current filters
            'filters' => [
                'search' => $request->input('search', ''),
                'category_id' => $request->input('category_id', ''),
                'stock_status' => $request->input('stock_status', ''),
                'sort' => $sortField,
                'direction' => $sortDirection,
            ],
            'product_value_chart' => $productValueChart,
        ]);
    }

public function pdfData()
{
    // 1. Company-wide inventory statistics
    $stats = Product::selectRaw('
        COUNT(*) as total_products,
        COALESCE(SUM(quantity), 0) as total_stock,

        SUM(CASE
            WHEN quantity > minimum_stock THEN 1
            ELSE 0
        END) as in_stock_count,

        SUM(CASE
            WHEN quantity > 0 AND quantity <= minimum_stock THEN 1
            ELSE 0
        END) as low_stock_count,

        SUM(CASE
            WHEN quantity = 0 THEN 1
            ELSE 0
        END) as out_of_stock_count,

        COALESCE(SUM(quantity * purchase_price), 0) as inventory_value,

        COALESCE(SUM(quantity * selling_price), 0) as potential_selling_value,

        COALESCE(SUM(quantity * (selling_price - purchase_price)), 0) as potential_profit
    ')->first();

    // 2. Stock status chart data
    $stockStatus = [
        [
            'name' => 'In Stock',
            'value' => (int) $stats->in_stock_count,
        ],
        [
            'name' => 'Low Stock',
            'value' => (int) $stats->low_stock_count,
        ],
        [
            'name' => 'Out of Stock',
            'value' => (int) $stats->out_of_stock_count,
        ],
    ];

    // 3. Stock and inventory value by category
    $stockByCategory = Category::leftJoin(
        'products',
        'categories.id',
        '=',
        'products.category_id'
    )
        ->select(
            'categories.id',
            'categories.name'
        )
        ->selectRaw('
            COALESCE(SUM(products.quantity), 0) as stock_quantity,
            COUNT(products.id) as products_count,
            COALESCE(SUM(products.quantity * products.purchase_price), 0) as inventory_value
        ')
        ->groupBy('categories.id', 'categories.name')
        ->orderByDesc('inventory_value')
        ->get();

    // 4. Product-wise inventory value
    $productValueRows = Product::where('quantity', '>', 0)
        ->select('id', 'name')
        ->selectRaw('(quantity * purchase_price) as total_value')
        ->orderByDesc('total_value')
        ->get();

    $topProducts = $productValueRows->take(15)->values();

    $otherProductsValue = $productValueRows
        ->skip(15)
        ->sum('total_value');

    $productValueChart = $topProducts->map(function ($product) {
        return [
            'name' => $product->name,
            'value' => (float) $product->total_value,
        ];
    })->values();

    if ($otherProductsValue > 0) {
        $productValueChart->push([
            'name' => 'Other Products',
            'value' => (float) $otherProductsValue,
        ]);
    }

    // 5. Retrieve EVERY product (no pagination or filters)
    $products = Product::with('category:id,name')
        ->select(
            'id',
            'name',
            'category_id',
            'quantity',
            'minimum_stock',
            'purchase_price',
            'selling_price',
            'created_at'
        )
        ->orderBy('name')
        ->get()
        ->map(function ($product) {
            $product->inventory_value =
                $product->quantity * $product->purchase_price;

            if ($product->quantity == 0) {
                $product->stock_status = 'Out of Stock';
            } elseif ($product->quantity <= $product->minimum_stock) {
                $product->stock_status = 'Low Stock';
            } else {
                $product->stock_status = 'In Stock';
            }

            return $product;
        });

    // 6. Return complete report data
    return response()->json([
        'generated_at' => now()->format('d M Y, h:i A'),
        'stats' => $stats,
        'stock_status' => $stockStatus,
        'stock_by_category' => $stockByCategory,
        'product_value_chart' => $productValueChart,
        'products' => $products,
        'total_products' => $products->count(),
    ]);
}

}