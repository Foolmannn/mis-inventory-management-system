<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $query = Category::query();

        // Search by category name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $allowedSorts = [
            'name',
            'products_count',
        ];

        $sortField = $request->input('sort', 'name');
        $sortField = in_array($sortField, $allowedSorts)
            ? $sortField
            : 'name';

        $sortDirection = $request->input('direction', 'asc');
        $sortDirection = $sortDirection === 'desc'
            ? 'desc'
            : 'asc';

        $categories = $query
            ->select('id', 'name', 'description')
            ->withCount('products')
            ->orderBy($sortField, $sortDirection)
            ->paginate(20)
            ->withQueryString();
// updated to retain the filter values
        return inertia('Category/Index', [
            'categories' => $categories,
            'filters' => [
                'search' => $request->input('search', ''),
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
        return inertia('Category/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //validate the request data 
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string|max:1000',
        ]);

        //save the category to the database
        $category = Category::create($validatedData);

        return redirect()->route('category.index')->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        return Inertia::render('Category/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        //validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string|max:1000',
        ]);

        //find the category by id and update it
        $category = Category::findOrFail($category->id);
        $category->update($validatedData);

        return redirect()->route('category.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // find the category by id and delete it
        $category = Category::findOrFail($category->id);
        $category->delete();

        return redirect()->route('category.index')->with('success', 'Category deleted successfully.');
    }
}
