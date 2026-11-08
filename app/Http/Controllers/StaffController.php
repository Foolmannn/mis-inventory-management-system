<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $staffMembers = User::select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->paginate(20);

        // dd($staffMembers->toArray()); 

        return inertia('Staff/Index', ['staffMembers' => $staffMembers]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Staff/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // validate the request data 
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,staff',
        ]);

        // create a new staff member
        User::create($validatedData);

        return redirect()->route('staff.index')->with('success', 'Staff member created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // redirect to edit page for the staff member with the given id
        $staffMember = User::findOrFail($id);
        return inertia('Staff/Edit', ['staffMember' => $staffMember]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'. $id,
            'password' => 'nullable|string|min:8|confirmed',  // remove nullable for security later
            'role' => 'required|in:admin,staff',
        ]);

        // find the staff member by id and update their information
        $staffMember = User::findOrFail($id);
        $staffMember->update($validatedData);

        return redirect()->route('staff.index')->with('success', 'Staff member updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // find the staff member by id and delete them
        $staffMember = User::findOrFail($id);

        // only delete if the user is not and andmin and auth user is admin
        if ($staffMember->role !== 'admin' && auth()->user()->role === 'admin') {
            $staffMember->delete();
        } else {
            return redirect()->route('staff.index')->with('error', 'You cannot delete an admin user.');
        }

        return redirect()->route('staff.index')->with('success', 'Staff member deleted successfully.');
    }
}
