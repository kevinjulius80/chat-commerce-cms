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
class StoreController extends BaseController
{
    /**
     * Display a listing of the user resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|ResourceCollection
     */
    public function index(Request $request)
    {
        $url = config('api.url') . '/a/store';
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url);
    }

    public function list(Request $request)
    {
        $url = config('api.url') . '/a/stores';
        $api_key = config('api.key');

        $queryString = $request->getQueryString();

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url . "?" . $queryString);
    }

    public function create(Request $request)
    {
        $url = config('api.url') . '/a/store';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->post($url, $request_content);
    }

    public function update(Request $request)
    {
        $url = config('api.url') . '/a/store';
        $api_key = config('api.key');

        $request_content = $request->json()->all();
        return Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->put($url, $request_content);
    }

    public function delete(Request $request, $id)
    {
        $url = config('api.url') . '/a/store/' . $id;
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->delete($url);
    }

    public function getReference(Request $request, $id)
    {
        $url = config('api.url') . '/a/store/' . $id;
        $api_key = config('api.key');

        return $response = Http::withHeaders([
            'X-API-KEY' => $api_key
        ])->get($url);
    }
}
