<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class StoreCategoryController extends Controller
{
    public function list(Request $request)
    {
        $url = config('api.url') . '/a/store/categories';
        $api_key = config('api.key');

        $queryString = $request->getQueryString();

        Log::info(json_encode($queryString));
        Log::info($url);
        Log::info($api_key);

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url . "?" . $queryString);
    }

    public function create(Request $request)
    {
        $url = config('api.url') . '/a/store/category ';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }
}
