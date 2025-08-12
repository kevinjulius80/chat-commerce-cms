<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AuthServiceController extends BaseController
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */

     public function login(Request $request)
    {
        $url = config('api.auth_url') . '/user/login';
        $user = config('api.auth_user');
        $pass = config('api.auth_pass');
        $auth = 'Basic ' . base64_encode("$user:$pass");

        return $response = Http::withHeaders([
            'Authorization' => $auth
        ])->post($url)->json();
    }
}
