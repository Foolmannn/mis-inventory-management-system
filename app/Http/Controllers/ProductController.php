<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::select(
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
            ->orderBy('name')
            ->paginate(20);


        $products->getCollection()->each(function ($product) {
            if ($product->quantity == 0) {
                $product->status = 'out_of_stock';
            } elseif ($product->quantity <= $product->minimum_stock) {
                $product->status = 'low_stock';
            } else {
                $product->status = 'in_stock';
            }
        });

        // Remove minimum stock from the product object before sending it to the frontend
        // $products->getCollection()->each(function ($product) {
        //     unset($product->minimum_stock);
        // });

        // dd($products[0]->toArray()); // show the first product data only

        return inertia('Product/Index', [
            'products' => $products,
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
