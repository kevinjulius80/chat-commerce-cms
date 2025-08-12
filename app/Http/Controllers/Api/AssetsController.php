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

/**
 * Class UserController
 *
 * @package App\Http\Controllers\Api
 */
class AssetsController extends BaseController
{
    /**
     * Display a listing of the user resource.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response|ResourceCollection
     */
    public function save(Request $request)
    {
        $url = config('api.url') . '/a/assets';
        $api_key = config('api.key');

        $file = $request->file('file');
        $path = public_path();
        $file->move($path, $file->getClientOriginalName());

        $filePath = $path . '/' . $file->getClientOriginalName();
        $fileToSent = fopen($filePath, 'r');
        $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->attach('file', $fileToSent)
            ->post($url);

        unlink($filePath);
        $statusCode = $response->getStatusCode();

        if ($statusCode == 200) {
            return $response;
        } else {
            return response()->json(new JsonResponse([], 'Internal Server Error'), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
