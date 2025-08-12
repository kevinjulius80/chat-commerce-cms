<?php
/**
 * File UserController.php
 *
 * @author Tuan Duong <bacduong@gmail.com>
 * @package Laravue
 * @version 1.0
 */

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Http;
// use Illuminate\Support\Facades\Log;

/**
 * Class UserController
 *
 * @package App\Http\Controllers\Api
 */
class OrdersController extends BaseController
{
    /**
     * Display a listing of the user resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|ResourceCollection
     */
    public function index(Request $request)
    {
        $url = config('api.url_order') . '/a/orders';
        $api_key = config('api.key');

        $queryString = $request->getQueryString();

        $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url . "?" . $queryString);

        // Log::info($url . "?" . $queryString);
        // Log::info($response->getBody());

        return $response;
    }

    public function get(Request $request, $reference_id)
    {
        $url = config('api.url_order') . '/a/order/' . $reference_id;
        $api_key = config('api.key');

        $queryString = $request->getQueryString();

        $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url . "?" . $queryString);

        return $response;
    }

    public function createPayment(Request $request, $reference_id)
    {
        $url = config('api.url_order') . '/a/order/' . $reference_id . '/payment';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }

    public function createDelivery(Request $request, $reference_id)
    {
        $url = config('api.url_order') . '/a/order/' . $reference_id . '/delivery';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }

    public function createDeliveries(Request $request)
    {
        $url = config('api.url_order') . '/a/order/createdeliveries';
        $api_key = config('api.key');

        $request_content = $request->all();
        $value = array_values($request_content)[0];
        
        $curl = curl_init();
        
        curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => $value,
        CURLOPT_HTTPHEADER => array(
            "x-api-key: $api_key",
            'Content-Type: application/x-www-form-urlencoded'
        ),
        ));
        
        $response = curl_exec($curl);
        
        curl_close($curl);
        return $response;
    }

    public function acceptOrder(Request $request, $reference_id)
    {
        $url = config('api.url_order') . '/a/order/' . $reference_id . '/accept';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }

    public function acceptOrders(Request $request)
    {
        $url = config('api.url_order') . '/a/order/acceptorders';
        $api_key = config('api.key');
        
        $request_content = $request->all();
        $value = array_values($request_content)[0];
        
        $curl = curl_init();
        
        curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => $value,
        CURLOPT_HTTPHEADER => array(
            "x-api-key: $api_key",
            'Content-Type: application/x-www-form-urlencoded'
        ),
        ));
        
        $response = curl_exec($curl);
        
        curl_close($curl);
        return $response;
    }

    public function rejectOrder(Request $request, $reference_id)
    {
        $url = config('api.url_order') . '/a/order/' . $reference_id . '/reject';
        $api_key = config('api.key');

        $request_content = $request->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }

    public function rejectOrders(Request $request)
    {
        $url = config('api.url_order') . '/a/order/rejectorders';
        $api_key = config('api.key');

        $request_content = $request->all();
        $value = array_values($request_content)[0];
        
        $curl = curl_init();
        
        curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => $value,
        CURLOPT_HTTPHEADER => array(
            "x-api-key: $api_key",
            'Content-Type: application/x-www-form-urlencoded'
        ),
        ));
        
        $response = curl_exec($curl);
        
        curl_close($curl);
        return $response;
    }

    public function updateStatus(Request $request, $reference_id)
    {
        $url = config('api.url_order') . '/a/order/' . $reference_id . '/status';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }
}
