<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
// use Illuminate\Support\Facades\Log;

class RefundController extends Controller
{
    public function refundVA(Request $request)
    {
        $url = config('api.url') . '/refund-va';
        $token = $request->header('Authorization');
        $queryString = $request->getQueryString();

        $response = Http::withHeaders([
            'Authorization' => $token,
        ])->get($url . "?" . $queryString);

        // Log::info($response);
        // Log::info($url . "?" . $queryString);

        return $response;
    }

    public function refundEW(Request $request)
    {
        $url = config('api.url') . '/refund-ew';
        $token = $request->header('Authorization');
        $queryString = $request->getQueryString();

        $response = Http::withHeaders([
            'Authorization' => $token,
        ])->get($url . "?" . $queryString);

        // Log::info($response);
        // Log::info($url . "?" . $queryString);

        return $response;
    }

    public function approve(Request $request)
    {
        $url = config('api.url') . '/a/refund-va/approve/';

        $invoice = $request->reference_id;

        $api_key = config('api.key');

        $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url . $invoice);

        // Log::info($url . $invoice);

        return $response;
    }
}
