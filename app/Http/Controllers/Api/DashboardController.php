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
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;
use Validator;

/**
 * Class UserController
 *
 * @package App\Http\Controllers\Api
 */
class DashboardController extends BaseController
{
    /**
     * Display a listing of the user resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|ResourceCollection
     */
    public function index(Request $request, $store_id)
    {
        $url = config('api.url') . '/a/dashboard/' . $store_id;
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url);
    }

    public function countEmptyStock(Request $request)
    {
        $url = config('api.url') . '/a/stock/countempty';
        $token = $request->header('Authorization');
        $queryString = $request->getQueryString();

        $response = Http::withHeaders([
            'Authorization' => $token
        ])->get($url . "?" . $queryString);

        $statusCode = $response->getStatusCode();

        Log::info($url . "?" . $queryString);
        Log::info($statusCode);
        Log::info($response->getBody());

        switch ($statusCode) {
            case 400:
                return response()->json(new JsonResponse([], 'Bad Request'), Response::HTTP_BAD_REQUEST);
            case 401:
                return response()->json(new JsonResponse([], 'Unauthorized Auth Service'), Response::HTTP_UNAUTHORIZED);
            case 500:
                return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
            default:
                return $response;
        }
    }

    public function countLowStock(Request $request)
    {
        $url = config('api.url') . '/a/stock/countthreshold';
        $token = $request->header('Authorization');
        $queryString = $request->getQueryString();

        $response = Http::withHeaders([
            'Authorization' => $token
        ])->get($url . "?" . $queryString);

        $statusCode = $response->getStatusCode();

        Log::info($url . "?" . $queryString);
        Log::info($statusCode);
        Log::info($response->getBody());

        switch ($statusCode) {
            case 400:
                return response()->json(new JsonResponse([], 'Bad Request'), Response::HTTP_BAD_REQUEST);
            case 401:
                return response()->json(new JsonResponse([], 'Unauthorized Auth Service'), Response::HTTP_UNAUTHORIZED);
            case 500:
                return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
            default:
                return $response;
        }
    }

    public function countNoSalesStock(Request $request)
    {
        $url = config('api.url') . '/a/stock/countnosales';
        $token = $request->header('Authorization');
        $queryString = $request->getQueryString();

        $response = Http::withHeaders([
            'Authorization' => $token
        ])->get($url . "?" . $queryString);

        $statusCode = $response->getStatusCode();

        Log::info($url . "?" . $queryString);
        Log::info($statusCode);
        Log::info($response->getBody());

        switch ($statusCode) {
            case 400:
                return response()->json(new JsonResponse([], 'Bad Request'), Response::HTTP_BAD_REQUEST);
            case 401:
                return response()->json(new JsonResponse([], 'Unauthorized Auth Service'), Response::HTTP_UNAUTHORIZED);
            case 500:
                return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
            default:
                return $response;
        }
    }
    
    public function countOrderStatus(Request $request, $store_id)
    {
        $url = config('api.url_order') . '/a/orders/countstatus?store_id=' . $store_id;
        $api_key = config('api.key');

        $queryString = $request->getQueryString();

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url);
    }
}
