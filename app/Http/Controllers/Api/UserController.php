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
use App\Laravue\Acl;
use App\Laravue\JsonResponse;
use App\Laravue\Models\Permission;
use App\Laravue\Models\Role;
use App\Laravue\Models\User;
use App\Laravue\Models\UserStores;
use App\Laravue\Models\UserMerchant;
use App\Laravue\Models\UserDeviceKeys;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

use Validator;

/**
 * Class UserController
 *
 * @package App\Http\Controllers\Api
 */
class UserController extends BaseController
{
    const ITEM_PER_PAGE = 15;

    /**
     * Display a listing of the user resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|ResourceCollection
     */
    public function index(Request $request)
    {
        $searchParams = $request->all();
        $userQuery = User::query();
        $limit = Arr::get($searchParams, 'limit', static::ITEM_PER_PAGE);
        $role = Arr::get($searchParams, 'role', '');
        $name = Arr::get($searchParams, 'name', '');
        $email = Arr::get($searchParams, 'email', '');
        $status = Arr::get($searchParams, 'status', '');
        $isAdmin = Arr::get($searchParams, 'is_admin', false) === 'true' ? true : false;
        $merchantId = Arr::get($searchParams, 'merchant_id', '0');

        if (!empty($role)) {
            $userQuery->whereHas('roles', function($q) use ($role) { $q->where('name', $role); });
        } else {
            if (!$isAdmin) { 
                $userQuery->whereHas('roles', function($q) { $q->where('name', '!=', 'admin'); });
            }
        }

        if (!empty($name)) {
            $userQuery->where('name', 'ILIKE', '%' . $name . '%');
        }

        if (!empty($email)) {
            $userQuery->where('email', 'ILIKE', '%' . $email . '%');
        }

        if (!empty($status)) {
            $userQuery->where('status', '=', $status);
        }

        if (!$isAdmin && $merchantId != '0') { 
            $allowedUsers = UserMerchant::where('merchant_id', $merchantId)->pluck('user_id')->toArray();
            $userQuery->whereIn('id', $allowedUsers);
        }

        return UserResource::collection($userQuery->paginate($limit));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array_merge(
                $this->getValidationRules(),
                [
                    'password' => ['required', 'min:6'],
                    'confirmPassword' => 'same:password',
                ]
            )
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 403);
        } else {
            $params = $request->all();
            $user = User::create([
                'name' => $params['name'],
                'email' => $params['email'],
                'phone_number' => $params['phone_number'],
                'password' => Hash::make($params['password']),
                'store_id' => $params['storeId'],
            ]);
            $role = Role::findByName($params['role']);
            $user->syncRoles($role);

            foreach ($params['store'] as $store) {
                UserStores::create([
                    'store_id' => $store,
                    'user_id' => $user->id,
                ]);
            }

            foreach ($params['merchant'] as $merchant) {
                UserMerchant::create([
                    'merchant_id' => $merchant,
                    'user_id' => $user->id,
                ]);
            }

            return new UserResource($user);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  User $user
     * @return UserResource|\Illuminate\Http\JsonResponse
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param User    $user
     * @return UserResource|\Illuminate\Http\JsonResponse
     */
    public function update(Request $request, User $user)
    {
        if ($user === null) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $currentUser = Auth::user();
        if (!$currentUser->isAdmin()
            && $currentUser->id !== $user->id
            && !$currentUser->hasPermission(\App\Laravue\Acl::PERMISSION_USER_MANAGE)
        ) {
            return response()->json(['error' => 'Permission denied'], 403);
        }

        $validator = Validator::make($request->all(), $this->getValidationRules(false));
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 403);
        } else {
            $email = $request->get('email');
            $status = $request->get('status');
            $found = User::where('email', $email)->first();
            if ($found && $found->id !== $user->id) {
                return response()->json(['error' => 'Email sudah digunakan'], 403);
            }

            $role = $request->get('role');
            $user->name = $request->get('name');
            $user->email = $request->get('email');
            $user->phone_number = $request->get('phone_number');
            $user->status = $status;
            $user->save();

            $role = Role::findByName($role);
            $user->syncRoles($role);

            UserStores::where('user_id', $user->id)->delete();
            foreach ($request->get('store') as $store) {
                UserStores::create([
                    'store_id' => $store,
                    'user_id' => $user->id,
                ]);
            }

            UserMerchant::where('user_id', $user->id)->delete();
            foreach ($request->get('merchant') as $merchant) {
                UserMerchant::create([
                    'merchant_id' => $merchant,
                    'user_id' => $user->id,
                ]);
            }

            return new UserResource($user);
        }
    }

    public function assignStorePermission(Request $request, $id)
    {
        $modelRoles = $this->getUserAdminId();
        $storeExist = UserStores::where('store_id', $id)->exists();

        if (!$storeExist) {
            foreach ($modelRoles as $modelRole) {
                UserStores::create([
                    'store_id' => $id,
                    'user_id' => $modelRole->model_id,
                ]);
            }

            return response()->json('success assign store permission to admin', 200);
        }
    }

    public function revokeStorePermission(Request $request, $id)
    {
        UserStores::where('store_id', $id)->delete();

        return response()->json('success revoke store permission to admin', 200);
    }

    public function assignMerchantPermission(Request $request, $id)
    {
        $modelRoles = $this->getUserAdminId();
        $merchantExist = UserMerchant::where('merchant_id', $id)->exists();

        if (!$merchantExist) {
            foreach ($modelRoles as $modelRole) {
                UserMerchant::create([
                    'merchant_id' => $id,
                    'user_id' => $modelRole->model_id,
                ]);
            }

            return response()->json('success assign merchant permission to admin', 200);
        }
    }

    public function revokeMerchantPermission(Request $request, $id)
    {
        UserMerchant::where('merchant_id', $id)->delete();

        return response()->json('success revoke merchant permission to admin', 200);
    }

    public function changestatus(Request $request, User $user)
    {
        if ($user === null) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $currentUser = Auth::user();
        if (!$currentUser->isAdmin()
            && $currentUser->id !== $user->id
            && !$currentUser->hasPermission(\App\Laravue\Acl::PERMISSION_USER_MANAGE)
        ) {
            return response()->json(['error' => 'Permission denied'], 403);
        }
        $status = $request->get('status');

        $user->status = $status;
        $user->save();

        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param User    $user
     * @return UserResource|\Illuminate\Http\JsonResponse
     */
    public function updatePermissions(Request $request, User $user)
    {
        if ($user === null) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $permissionIds = $request->get('permissions', []);
        $rolePermissionIds = array_map(
            function($permission) {
                return $permission['id'];
            },

            $user->getPermissionsViaRoles()->toArray()
        );

        $newPermissionIds = array_diff($permissionIds, $rolePermissionIds);
        $permissions = Permission::whereIn('id', $newPermissionIds)->get();
        $user->syncPermissions($permissions);
        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  User $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 403);
        }

        return response()->json(null, 204);
    }

    /**
     * Get permissions from role
     *
     * @param User $user
     * @return array|\Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function permissions(User $user)
    {
        try {
            return new JsonResponse([
                'user' => PermissionResource::collection($user->getDirectPermissions()),
                'role' => PermissionResource::collection($user->getPermissionsViaRoles()),
            ]);
        } catch (\Exception $ex) {
            response()->json(['error' => $ex->getMessage()], 403);
        }
    }

    /**
     * @param bool $isNew
     * @return array
     */
    private function getValidationRules($isNew = true)
    {
        return [
            'name' => 'required',
            'email' => $isNew ? 'required|email|unique:users' : 'required|email',
            'roles' => [
                'required',
                'array'
            ],
        ];
    }

    private function getUserAdminId()
    {
        $roles = DB::select('select * from roles where name = :name', ['name' => 'admin']);
        $modelRoles = DB::select('select * from model_has_roles where role_id = :id', ['id' => $roles[0]->id]);

        return $modelRoles;
    }

    public function storeToken(Request $request)
    {
        $userDeviceKey = UserDeviceKeys::where('token', $request->token)->first();

        $currentUser = Auth::user();

        if ($userDeviceKey !== null){
            if ($userDeviceKey->user_id == $currentUser->id){
                return response()->json(['message' => 'Token already exist']);
            }
            UserDeviceKeys::where('id', $userDeviceKey->id)->update([
                'token' => $request->token,
                'user_id' => $currentUser->id,
            ]);

            return response()->json(['message' => 'Token successfully updated']);
        }

        UserDeviceKeys::create([
            'token' => $request->token,
            'user_id' => $currentUser->id,
        ]);

        return response()->json(['message' => 'Token successfully stored']);
    }

    public function pushNotification(Request $request)
    {
        $params = $request->all();
        $storeSPV = Acl::ROLE_STORE_SPV;
        $storeStaff = Acl::ROLE_STORE_STAFF;

        $user_stores = DB::table('user_stores')
            ->join('model_has_roles', 'user_stores.user_id', '=', 'model_has_roles.model_id')
            ->where('store_id', $params['store_id'])
            ->select('user_stores.store_id', 'user_stores.user_id', 'model_has_roles.role_id')
            ->get();

        $roles = DB::table('roles')
            ->where('name', $storeSPV)
            ->orWhere('name', $storeStaff)
            ->select('id')
            ->get();

        $data_users = [];
        foreach ($user_stores as $users_store) {
            foreach ($roles as $role) {
                if ($users_store->role_id == $role->id) {
                    array_push($data_users, $users_store->user_id);
                }
            }
        }

        // Log::info($data_users);

        $users = DB::table('user_device_keys')
            ->select('token');

        for ($x = 0; $x < count($data_users); $x++) {
            $users->orWhere('user_id', $data_users[$x]);
        }
        
        //Log::info($users->get());
        $registration_ids = [];
        foreach ($users->get() as $user) {
           array_push($registration_ids, $user->token);
        }

        // Log::info($registration_ids);

        $fields = [
            'registration_ids' => $registration_ids,
            'priority' => 'high',
            'notification' => [
                'title'         => 'Hi Admin!',
                'body'          => 'Kamu mendapatkan orderan baru',
                //'click_action'  => env('APP_URL').'/#/order/index',
                'click_action'  => env('APP_DOMAIN').'/#/order/index'

            ],
        ];

        // info($fields);
        return $this->sendPushNotification($fields);
    }

    private function sendPushNotification($fields) {
        $SERVER_API_KEY = env('FCM_SERVER_KEY');
        $url = env('FIREBASE_URL');
        # $SERVER_API_KEY = 'AAAAVPj5lD4:APA91bFNJOkfDLDxEEHRlyPonX_ECBDYeyfsCFxGDbzk1025Apm_ZM1koOuntkWjFvYo4CzAe6mhLD9t2SLSi6LoS0d-2JVz_zuYps7-98Hauw9RriobLNiCDY0111ImiVfC3_ivYis_';
        # $url = 'https://fcm.googleapis.com/fcm/send';
        
        $headers = [
            'Authorization: key =' . $SERVER_API_KEY,
            'Content-Type: application/json',
        ];
      
        $ch = curl_init();
        
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
                 
        $response = curl_exec($ch);

        curl_close($ch);

        $result = json_decode($response,1);
        $status[] = $result;

        // need to delete expired fcm token in db
        for ($i = 0; $i < count($status); $i++) {
            info(count($status));
           if (isset($status[$i]->error)) {
                UserDeviceKeys::where('token', $fields["registration_ids"][$i])->delete();
            }
        } 

        //Log::info(response);
        return response($response);
    }
}
