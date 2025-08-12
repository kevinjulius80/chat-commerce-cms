<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Laravue\JsonResponse;
use Illuminate\Http\Response;

class StockController extends BaseController
{
    /**
     * @param Request $request
     */

    public function listEmptyStock(Request $request)
    {
        $url = config('api.url') . '/a/stock/empty';
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
    public function listLowStock(Request $request)
    {
        $url = config('api.url') . '/a/stock/threshold';
        $token = $request->header('Authorization');
        $queryString = $request->getQueryString();

        $response = Http::withHeaders([
            'Authorization' => $token,
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
    public function listNoSalesStock(Request $request)
    {
        $url = config('api.url') . '/a/stock/nosales';
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

    public function getSettingStock(Request $request) {
        $url = config('api.url') . '/a/stock/setting';
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

    public function setSettingStock(Request $request) {
        $url = config('api.url') . '/a/stock/setting';
        $token = $request->header('Authorization');
        $request_content = $request->json()->all();

        $response = Http::withHeaders([
            'Authorization' => $token
        ])->post($url, $request_content);

        $statusCode = $response->getStatusCode();

        Log::info($url);
        Log::info($request_content);
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
}
