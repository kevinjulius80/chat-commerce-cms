<?php

use App\Laravue\Acl;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::namespace('Api')->group(function () {
    Route::get('/metrics', '\App\Http\Controllers\PrometheusController@metrics');
    Route::post('push-notification', 'UserController@pushNotification');

    Route::post('auth-service/login', 'AuthServiceController@login');
    Route::post('auth/login', 'AuthController@login');
    Route::post('auth/reset-password', 'AuthController@resetPassword');
    Route::post('auth/change-reset-password', 'AuthController@changeResetPassword');
    Route::group(['middleware' => 'auth:sanctum'], function () {
        // Auth routes
        Route::get('auth/user', 'AuthController@user');
        Route::post('auth/logout', 'AuthController@logout');

        Route::get('/user', 'UserResController@index');

        // Api resource routes
        Route::apiResource('roles', 'RoleController')->middleware('permission:' . Acl::PERMISSION_PERMISSION_MANAGE);
        Route::apiResource('users', 'UserController')->middleware('permission:' . Acl::PERMISSION_USER_MANAGE);
        Route::apiResource('permissions', 'PermissionController')->middleware('permission:' . Acl::PERMISSION_PERMISSION_MANAGE);
        Route::post('change-password', 'AuthController@changePassword')->middleware('permission:' . Acl::PERMISSION_DASHBOARD);

        // Custom routes
        Route::put('users/{user}', 'UserController@update')->middleware('permission:' . Acl::PERMISSION_USER_MANAGE);
        Route::put('users/{user}/change-status', 'UserController@changestatus')->middleware('permission:' . Acl::PERMISSION_USER_MANAGE);
        Route::get('users/{user}/permissions', 'UserController@permissions')->middleware('permission:' . Acl::PERMISSION_PERMISSION_MANAGE);
        Route::put('users/{user}/permissions', 'UserController@updatePermissions')->middleware('permission:' . Acl::PERMISSION_PERMISSION_MANAGE);
        Route::get('roles/{role}/permissions', 'RoleController@permissions')->middleware('permission:' . Acl::PERMISSION_PERMISSION_MANAGE);
        // auto assign permission to admin
        Route::put('users/assign-merchant-permission/{merchant_id}', 'UserController@assignMerchantPermission')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::delete('users/revoke-merchant-permission/{merchant_id}', 'UserController@revokeMerchantPermission')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::put('users/assign-store-permission/{store_id}', 'UserController@assignStorePermission')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::delete('users/revoke-store-permission/{store_id}', 'UserController@revokeStorePermission')->middleware('permission:' . Acl::PERMISSION_STORE);


        Route::post('assets', 'AssetsController@save')->middleware('permission:' . Acl::PERMISSION_DASHBOARD);

        Route::get('dashboard/{store_id}', 'DashboardController@index')->middleware('permission:' . Acl::PERMISSION_DASHBOARD);
        Route::get('stock/countempty', 'DashboardController@countEmptyStock')->middleware('permission:' . Acl::PERMISSION_DASHBOARD);
        Route::get('stock/countthreshold', 'DashboardController@countLowStock')->middleware('permission:' . Acl::PERMISSION_DASHBOARD);
        Route::get('stock/countnosales', 'DashboardController@countNoSalesStock')->middleware('permission:' . Acl::PERMISSION_DASHBOARD);
        Route::get('orders/countstatus/{store_id}', 'DashboardController@countOrderStatus')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::get('orders', 'OrdersController@index')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::get('order/{reference_id}', 'OrdersController@get')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::post('order/{reference_id}/payment', 'OrdersController@createPayment')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::post('order/{reference_id}/delivery', 'OrdersController@createDelivery')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::post('order/createdeliveries', 'OrdersController@createDeliveries')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::post('order/confirm-courier', 'DeliveryController@confirmCourier')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::post('order/cancel-courier', 'DeliveryController@cancelCourier')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::post('order/{reference_id}/accept', 'OrdersController@acceptOrder')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::post('order/acceptorders', 'OrdersController@acceptOrders')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::post('order/{reference_id}/reject', 'OrdersController@rejectOrder')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::post('order/rejectorders', 'OrdersController@rejectOrders')->middleware('permission:' . Acl::PERMISSION_ORDERS);
        Route::post('order/{reference_id}/status', 'OrdersController@updateStatus')->middleware('permission:' . Acl::PERMISSION_ORDERS);

        Route::get('category', 'CategoryController@list')->middleware('permission:' . Acl::PERMISSION_FOOD . '|' . Acl::PERMISSION_MANAGE_STOCK);
        Route::post('category', 'CategoryController@create')->middleware('permission:' . Acl::PERMISSION_FOOD);
        Route::put('category', 'CategoryController@update')->middleware('permission:' . Acl::PERMISSION_FOOD);
        Route::delete('category/{id}', 'CategoryController@delete')->middleware('permission:' . Acl::PERMISSION_FOOD);

        Route::get('delivery', 'DeliveryController@list')->middleware('permission:' . Acl::PERMISSION_DELIVERY);
        Route::post('delivery', 'DeliveryController@create')->middleware('permission:' . Acl::PERMISSION_DELIVERY);
        Route::put('delivery', 'DeliveryController@update')->middleware('permission:' . Acl::PERMISSION_DELIVERY);
        Route::delete('delivery/{id}', 'DeliveryController@delete')->middleware('permission:' . Acl::PERMISSION_DELIVERY);

        Route::get('menu', 'MenuController@list')->middleware('permission:' . Acl::PERMISSION_FOOD);
        Route::post('menu', 'MenuController@create')->middleware('permission:' . Acl::PERMISSION_FOOD);
        Route::put('menu', 'MenuController@update')->middleware('permission:' . Acl::PERMISSION_FOOD . '|' . Acl::PERMISSION_MANAGE_STOCK);

        Route::put('menu/pricestock', 'MenuController@pricestock')->middleware('permission:' . Acl::PERMISSION_FOOD);
        Route::delete('menu/{id}', 'MenuController@delete')->middleware('permission:' . Acl::PERMISSION_FOOD);
        Route::get('template-menu/{storeId}', 'MenuController@templateMenu')->middleware('permission:' . Acl::PERMISSION_FOOD);
        Route::post('upload/{storeId}', 'MenuController@upload')->middleware('permission:' . Acl::PERMISSION_FOOD);
        Route::post('menu/multipleDelete', 'MenuController@deleteMultiple')->middleware('permission:' . Acl::PERMISSION_FOOD);

        Route::get('store/category', 'StoreCategoryController@list')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::post('store/category', 'StoreCategoryController@create')->middleware('permission:' . Acl::PERMISSION_STORE);

        Route::get('store', 'StoreController@index')->middleware('permission:' . Acl::PERMISSION_DASHBOARD);
        Route::get('stores', 'StoreController@list')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::post('store', 'StoreController@create')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::put('store', 'StoreController@update')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::get('store/{id}', 'StoreController@getReference')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::delete('store/{id}', 'StoreController@delete')->middleware('permission:' . Acl::PERMISSION_STORE);

        Route::get('merchants', 'MerchantController@list')->middleware('permission:' . Acl::PERMISSION_MERCHANT);
        Route::post('merchant', 'MerchantController@create')->middleware('permission:' . Acl::PERMISSION_MERCHANT);
        Route::put('merchant', 'MerchantController@update')->middleware('permission:' . Acl::PERMISSION_MERCHANT);
        Route::get('merchant/{id}', 'MerchantController@index')->middleware('permission:' . Acl::PERMISSION_DASHBOARD);
        Route::patch('merchant/{id}/refresh-webhook', 'MerchantController@refreshWebhook')->middleware('permission:' . Acl::PERMISSION_MERCHANT);
        Route::delete('merchant/{id}', 'MerchantController@delete')->middleware('permission:' . Acl::PERMISSION_MERCHANT);

        Route::get('customer', 'CustomerController@list')->middleware('permission:' . Acl::PERMISSION_MERCHANT);
        Route::get('customer/{id}', 'CustomerController@index')->middleware('permission:' . Acl::PERMISSION_MERCHANT);

        Route::get('setting/faq', 'SettingController@listFaq')->middleware('permission:' . Acl::PERMISSION_FAQ);
        Route::post('setting/faq', 'SettingController@updateFaq')->middleware('permission:' . Acl::PERMISSION_FAQ);
        Route::get('setting/service/{store_id}', 'SettingController@listOpsHour')->middleware('permission:' . Acl::PERMISSION_SERVICE);
        Route::post('setting/service/{store_id}', 'SettingController@updateOpsHour')->middleware('permission:' . Acl::PERMISSION_SERVICE);
        Route::get('setting/fee/{store_id}', 'SettingController@listFee')->middleware('permission:' . Acl::PERMISSION_FEE);
        Route::post('setting/fee/{store_id}', 'SettingController@updateFee')->middleware('permission:' . Acl::PERMISSION_FEE);
        Route::get('setting/payment-options', 'SettingController@listPaymentOptions')->middleware('permission:' . Acl::PERMISSION_MERCHANT);
        Route::get('setting/payments/{merchant_id}', 'SettingController@listPayment')->middleware('permission:' . Acl::PERMISSION_MERCHANT);
        Route::put('setting/payments', 'SettingController@updatePayment')->middleware('permission:' . Acl::PERMISSION_MERCHANT);
        Route::delete('setting/payments/{merchant_id}/{code}', 'SettingController@deletePayment')->middleware('permission:' . Acl::PERMISSION_MERCHANT);
        Route::get('setting/store-payments/{store_id}', 'SettingController@listStorePayment')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::put('setting/store-payments', 'SettingController@updateStorePayment')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::delete('setting/store-payments/{store_id}/{code}', 'SettingController@deleteStorePayment')->middleware('permission:' . Acl::PERMISSION_STORE);

        Route::get('setting/store-payments/{store_id}', 'SettingController@listStorePayment')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::put('setting/store-payments', 'SettingController@updateStorePayment')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::delete('setting/store-payments/{store_id}/{code}', 'SettingController@deleteStorePayment')->middleware('permission:' . Acl::PERMISSION_STORE);

        Route::get('refund-va', 'RefundController@refundVA')->middleware('permission:' . Acl::PERMISSION_REFUND);
        Route::get('refund-ew', 'RefundController@refundEW')->middleware('permission:' . Acl::PERMISSION_REFUND);
        Route::post('refund/{reference_id}', 'RefundController@approve')->middleware('permission:' . Acl::PERMISSION_REFUND);

        Route::get('report', 'ReportController@index')->middleware('permission:' . Acl::PERMISSION_REPORT);
        Route::get('store_user', 'ReportController@admin_user')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::get('setting/store-payments/{store_id}', 'SettingController@listStorePayment')->middleware('permission:' . Acl::PERMISSION_STORE);
        Route::post('store-token', 'UserController@storeToken')->name('store.token');

        Route::get('stock/setting', 'StockController@getSettingStock')->middleware('permission:' . Acl::PERMISSION_VIEW_MENU_STOCK);
        Route::post('stock/setting', 'StockController@setSettingStock')->middleware('permission:' . Acl::PERMISSION_MANAGE_STOCK);
        Route::get('stock/empty', 'StockController@listEmptyStock')->middleware('permission:' . Acl::PERMISSION_MANAGE_STOCK);
        Route::get('stock/threshold', 'StockController@listLowStock')->middleware('permission:' . Acl::PERMISSION_MANAGE_STOCK);
        Route::get('stock/nosales', 'StockController@listNoSalesStock')->middleware('permission:' . Acl::PERMISSION_MANAGE_STOCK);

        Route::get('audit-trail', 'AuditTrailController@index')->middleware('permission:' . Acl::PERMISSION_AUDIT_TRAIL);
    });
});
