<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Events\NewChatMessage;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/messages', function (Request $request) {

    // Disparamos el evento que creará el mensaje y hará que se refresque el websocket.
    event(new NewChatMessage($request->input('message'),$request->input('author')));

    // Solo a modo de prueba devolveremos el mensaje que nos han enviado en el formulario.
    return response()->json([
        'message' => $request->input('message'),
        'author' => $request->input('author')
    ]);
});
