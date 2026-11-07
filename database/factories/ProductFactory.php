<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $purchasePrice = fake()->randomFloat(2, 50, 5000);

        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),

            'purchase_price' => $purchasePrice,
            'selling_price' => $purchasePrice + fake()->randomFloat(2, 10, 1000),

            'quantity' => fake()->numberBetween(0, 200),
            'minimum_stock' => fake()->numberBetween(5, 30),

            'category_id' => Category::inRandomOrder()->value('id'),
        ];
    }
}
