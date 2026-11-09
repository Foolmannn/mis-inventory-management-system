<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use Illuminate\Http\Request;

class StockHistoryController extends Controller
{
    public function index(Request $request)
    {
        $history = StockMovement::query()
            ->select(
                'id',
                'product_id',
                'user_id',
                'action',
                'quantity',
                'reason',
                'created_at'
            )
            ->with([
                'product:id,name',
                'user:id,name',
            ])
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return inertia('StockHistory/Index', [
            'history' => $history,
        ]);
    }
}