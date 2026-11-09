<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // adding filtering option for porducts based on category, stock status and serch query in ascending and descending order
public function index(Request $request)
{
    $query = Product::query();

    // Filter by category
    if ($request->filled('category_id')) {
        $query->where('category_id', $request->category_id);
    }

    // Filter by stock status
    if ($request->filled('stock_status')) {
        switch ($request->stock_status) {
            case 'in_stock':
                $query->whereColumn('quantity', '>', 0);
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

    // Search by product name,id,description
if ($request->filled('search')) {
    $search = $request->search;

    $query->where(function ($q) use ($search) {
        $q->where('name', 'like', "%{$search}%")
            ->orWhere('description', 'like', "%{$search}%")
            ->orWhere('id', 'like', "%{$search}%");
    });
}

    // Allowed sorting columns
    $allowedSorts = [
        'name',
        'purchase_price',
        'selling_price',
        'quantity',
        'created_at',
    ];

    $sortField = in_array($request->input('sort'), $allowedSorts)
        ? $request->input('sort')
        : 'name';

    $sortDirection = $request->input('direction') === 'desc'
        ? 'desc'
        : 'asc';

    // Fetch products
    $products = $query
        ->select(
            'id',
            'name',
            'description',
            'purchase_price',
            'selling_price',
            'quantity',
            'minimum_stock',
            'category_id'
        )
        ->with('category:id,name')
        ->orderBy($sortField, $sortDirection)
        ->paginate(20)
        ->withQueryString();

    // Add computed stock status
    $products->getCollection()->each(function ($product) {
        if ($product->quantity == 0) {
            $product->status = 'out_of_stock';
        } elseif ($product->quantity <= $product->minimum_stock) {
            $product->status = 'low_stock';
        } else {
            $product->status = 'in_stock';
        }
    });

    // Fetch categories for the category dropdown
    $categories = Category::select('id', 'name')
        ->orderBy('name')
        ->get();

    return inertia('Product/Index', [
        'products' => $products,
        'categories' => $categories,

        // Send current filters to React
        'filters' => [
            'search' => $request->input('search', ''),
            'category_id' => $request->input('category_id', 'all'),
            'stock_status' => $request->input('stock_status', 'all'),
            'sort' => $sortField,
            'direction' => $sortDirection,
        ],
    ]);
}
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = \App\Models\Category::select('id', 'name')->orderBy('name')->get();
        return inertia('Product/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Product $product)
    {
        //validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);

        //create a new product
        $product = Product::create($validatedData);

        return redirect()->route('product.index')->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = \App\Models\Category::select('id', 'name')->orderBy('name')->get();
        return inertia('Product/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);

        // find the product by id and update it with the validated data
        $product = Product::findOrFail($product->id);
        $product->update($validatedData);

        return redirect()->route('product.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // find the product by id and delete it
        $product = Product::findOrFail($product->id);
        $product->delete();

        return redirect()->route('product.index')->with('success', 'Product deleted successfully.');
    }
}
