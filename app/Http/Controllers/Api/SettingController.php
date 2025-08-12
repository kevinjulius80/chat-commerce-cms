<?php
/**
 * File UserController.php
 *
 * @author Tuan Duong <bacduong@gmail.com>
 * @package Laravue
 * @version 1.0
 */

namespace App\Http\Controllers\Api;

use App\Http\Resources\PermissionResource;
use App\Http\Resources\UserResource;
use App\Laravue\JsonResponse;
use App\Laravue\Models\Permission;
use App\Laravue\Models\Role;
use App\Laravue\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Validator;

/**
 * Class UserController
 *
 * @package App\Http\Controllers\Api
 */
class SettingController extends BaseController
{
    /**
     * Display a listing of the user resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|ResourceCollection
     */
    public function listFaq(Request $request)
    {
        $url = config('api.url') . '/a/setting/faq';
        $api_key = config('api.key');

        $queryString = $request->getQueryString();
        $str = $url . "?" . $queryString;
        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($str);
    }

    public function updateFaq(Request $request)
    {
        $url = config('api.url') . '/a/setting/faq';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }

    public function listOpsHour(Request $request, $store_id)
    {
        $url = config('api.url') . '/a/setting/service/' . $store_id;
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url);
    }

    public function updateOpsHour(Request $request, $store_id)
    {
        $url = config('api.url') . '/a/setting/service/' . $store_id;
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }

    public function listFee(Request $request, $store_id)
    {
        $url = config('api.url') . '/a/setting/fee/' . $store_id;
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url);
    }

    public function listPaymentOptions(Request $request)
    {
        $url = config('api.url') . '/a/setting/payment-options';
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url);
    }

    public function listPayment(Request $request, $merchant_id)
    {
        $url = config('api.url') . '/a/setting/payments/' . $merchant_id;
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url);
    }

    public function updatePayment(Request $request)
    {
        $url = config('api.url') . '/a/setting/payments';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->put($url, $request_content);
    }

    public function deletePayment(Request $request, $merchant_id, $code)
    {
        $url = config('api.url') . '/a/setting/payments/' . $merchant_id . '/' . $code;
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->delete($url);
    }

    public function listStorePayment(Request $request, $store_id)
    {
        $url = config('api.url') . '/a/setting/store-payments/' . $store_id;
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url);
    }

    public function updateStorePayment(Request $request)
    {
        $url = config('api.url') . '/a/setting/store-payments';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->put($url, $request_content);
    }

    public function deleteStorePayment(Request $request, $store_id, $code)
    {
        $url = config('api.url') . '/a/setting/store-payments/' . $store_id . '/' . $code;
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->delete($url);
    }

    public function updateFee(Request $request, $store_id)
    {
        $url = config('api.url') . '/a/setting/fee/' . $store_id;
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }
}
