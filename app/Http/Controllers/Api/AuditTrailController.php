<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Laravue\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
// use Illuminate\Support\Facades\Log;

class AuditTrailController extends Controller
{
    public function index(Request $request)
    {
        $url = config('api.url_audit_trail') . '/audittrail/search';
        $queryString = $request->getQueryString();
        $token = $request->header("Authorization");

        $response = Http::withHeaders([
            'Authorization' => $token
        ])->get($url . "?" . $queryString);

        $statusCode = $response->getStatusCode();

        // Log::info($url . "?" . $queryString);
        // Log::info($statusCode);
        // Log::info($response->getBody());

        if ($statusCode == 200) {
            return $response;
        } else {
            switch ($statusCode) {
                case 400:
                    return response()->json(new JsonResponse([], 'Bad Request'), Response::HTTP_BAD_REQUEST);
                case 401:
                    return response()->json(new JsonResponse([], 'Unauthorized Auth Service'), Response::HTTP_UNAUTHORIZED);
                case 500:
                    return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
                default:
                    return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
    }
}
