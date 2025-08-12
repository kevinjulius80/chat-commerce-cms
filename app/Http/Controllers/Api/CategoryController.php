<?php
/**
 * File UserController.php
 *
 * @author Tuan Duong <bacduong@gmail.com>
 * @package Laravue
 * @version 1.0
 */

namespace App\Http\Controllers\Api;

use App\Laravue\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Response;
// use Illuminate\Support\Facades\Log;

/**
 * Class UserController
 *
 * @package App\Http\Controllers\Api
 */
class CategoryController extends BaseController
{
    /**
     * Display a listing of the user resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|ResourceCollection
     */
    public function list(Request $request)
    {
        $url = config('api.url') . '/a/category';
        $api_key = config('api.key');

        $queryString = $request->getQueryString();

        $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url . "?" . $queryString);

        $statusCode = $response->getStatusCode();

        if ($statusCode == 200) {
            return $response;
        } else {
            return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function create(Request $request)
    {
        $url = config('api.url') . '/a/category';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);

        $statusCode = $response->getStatusCode();

        if ($statusCode == 200) {
            return $response;
        } else {
            switch ($statusCode) {
                case 400:
                    $message = $response->json()['message'] ?? 'Bad Request';
                    return response()->json(new JsonResponse([], $message), Response::HTTP_BAD_REQUEST);
                case 500:
                    return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
                default:
                    return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
    }

    public function update(Request $request)
    {
        $url = config('api.url') . '/a/category';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->put($url, $request_content);

        $statusCode = $response->getStatusCode();

        if ($statusCode == 200) {
            return $response;
        } else {
            switch ($statusCode) {
                case 400:
                    $message = $response->json()['message'] ?? 'Bad Request';
                    return response()->json(new JsonResponse([], $message), Response::HTTP_BAD_REQUEST);
                case 500:
                    return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
                default:
                    return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
    }

    public function delete(Request $request, $id)
    {
        $url = config('api.url') . '/a/category/' . $id;
        $api_key = config('api.key');

        $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->delete($url);

        $statusCode = $response->getStatusCode();

        if ($statusCode == 200) {
            return $response;
        } else {
            return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
