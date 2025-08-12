<?php
/**
 * File AuthController.php
 *
 * @author Tuan Duong <bacduong@gmail.com>
 * @package Laravue
 * @version 1.0
 */
namespace App\Http\Controllers\Api;

use App\Http\Resources\UserResource;
use App\Laravue\JsonResponse;
use App\Laravue\Models\User;
use App\Mail\ResetPasswordMail;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

/**
 * Class AuthController
 *
 * @package App\Http\Controllers\Api
 */
class AuthController extends BaseController
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $username = request()->input('username');
        $field = 'email';

        if (is_numeric($username)) {
            $field = 'phone_number';
        }

        request()->merge([$field => $username]);

        $credentials = $request->only($field, 'password');
       
        if (!Auth::attempt($credentials)) {
            return response()->json(new JsonResponse([], 'username dan password tidak cocok'), Response::HTTP_UNAUTHORIZED);
        }

        $user = $request->user();

        if (!$user->status) {
            Auth::logout();
            return response()->json(new JsonResponse([], 'error, user di nonaktifkan'), Response::HTTP_UNAUTHORIZED);
        }

        $userResponse = new UserResource($user);
        return response()->json(new JsonResponse($userResponse), Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        return response()->json((new JsonResponse())->success([]), Response::HTTP_OK);
    }

    public function changePassword(Request $request)
    {
        $params = $request->all();
        $currentUser = Auth::user();
        $currentUser->password = Hash::make($params['password']);
        $currentUser->save();

        return response()->json((new JsonResponse())->success([]), Response::HTTP_OK);
    }

    public function resetPassword(Request $request)
    {
        $params = $request->all();
        $user = User::where('email', $params['email'])->first();

        if (!$user) {
            return response()->json(new JsonResponse([], 'Email tidak ditemukan'), Response::HTTP_NOT_FOUND);
        }

        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => STR::random(60),
            'created_at' => Carbon::now()
        ]);

        $tokenData = DB::table('password_resets')->where('email', $request->email)->orderBy('created_at', 'desc')->first();

        if ($this->sendResetEmail($user->email, $tokenData->token)) {
            return response()->json((new JsonResponse([])), Response::HTTP_OK);
        } else {
            return response()->json((new JsonResponse([], 'Kesalahan pada server. Silahkan coba lagi')), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function changeResetPassword(Request $request)
    {
        $params = $request->all();
        $token = $params['token'];
        $tokenQuery = DB::table('password_resets')->where('token', $token)->orderBy('created_at', 'desc');
        $tokenData = $tokenQuery->first();

        if (!$tokenData) {
            return response()->json(new JsonResponse([], 'Token tidak ditemukan'), Response::HTTP_NOT_FOUND);
        }

        $user = User::where('email', $tokenData->email)->first();
        $user->password = Hash::make($params['password']);
        $user->save();
        $tokenQuery->delete();

        return response()->json((new JsonResponse()), Response::HTTP_OK);
    }

    private function sendResetEmail($email, $token)
    {
        $user = DB::table('users')->where('email', $email)->select('name', 'email')->first();
        $link = config('app.url') . '#/do-reset-password?token=' . $token . '&email=' . urlencode($user->email);

        try {
            Mail::to($email)->send(new ResetPasswordMail($link));
            return true;
        } catch (\Exception $e) {
            Log::error($e->__toString());
            return false;
        }
    }
}
