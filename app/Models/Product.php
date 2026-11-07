<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'purchase_price',
        'selling_price',
        'category_id',
        'quantity',
        'minimum_stock',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
