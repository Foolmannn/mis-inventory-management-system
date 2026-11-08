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
        $products->getCollection()->each(function ($product) {
            unset($product->minimum_stock);
        });

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
        return inertia('Product/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
        return inertia('Product/Edit', [
            'product' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
