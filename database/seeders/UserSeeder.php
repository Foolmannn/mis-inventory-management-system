<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'ram@example.com'],
            [
                'name' => 'Ram',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'hari@example.com'],
            [
                'name' => 'Hari',
                'password' => Hash::make('password'),
                'role' => 'staff',
            ]
        );

        User::updateOrCreate(
            ['email' => 'sita@example.com'],
            [
                'name' => 'Sita',
                'password' => Hash::make('password'),
                'role' => 'staff',
            ]
        );
    }
}
