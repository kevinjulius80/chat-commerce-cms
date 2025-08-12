<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DeliveryController extends Controller
{
    public function list(Request $request)
    {
        $url = config('api.url') . '/a/deliveries';
        $api_key = config('api.key');

        $queryString = $request->getQueryString();

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url . "?" . $queryString);
    }

    public function create(Request $request)
    {
        $url = config('api.url') . '/a/delivery';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }

    public function update(Request $request)
    {
        $url = config('api.url') . '/a/deliveries/activate';
        $api_key = config('api.key');

        $request_content = $request->json()->all();


        $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);

        Log::info(config('api.url') . '/a/deliveries/activate');
        Log::info($response);

        return $response;
    }

    public function delete(Request $request, $id)
    {
        $url = config('api.url') . '/a/delivery/' . $id;
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->delete($url);
    }

    public function confirmCourier(Request $request)
    {
        $url = config('api.url') . '/a/deliveries/confirm';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }

    public function cancelCourier(Request $request)
    {
        $url = config('api.url') . '/a/deliveries/cancel';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }
}
