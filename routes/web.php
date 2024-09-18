<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UsersController;

use App\Http\Controllers\RoleController;

Route::post('/register-user', [UsersController::class, 'saveUserData']);

Route::get('/users', [UsersController::class, 'index']);

Route::get('/roles', [RoleController::class, 'index']);

Route::get('/user/{id}', [UserController::class, 'show']);

Route::get('/', function () {
    return view('userRegister');
});
