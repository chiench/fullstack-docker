<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoodController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('goods', GoodController::class);
});
