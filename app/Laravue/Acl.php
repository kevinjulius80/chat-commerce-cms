<?php
/**
 * File Acl.php
 *
 * @author Tuan Duong <bacduong@gmail.com>
 * @package Laravue
 * @version 1.0
 */
namespace App\Laravue;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * Class Acl
 *
 * @package App\Laravue
 */
final class Acl
{
    const ROLE_ADMIN = 'admin';
    const ROLE_MERCHANT_ADMINISTRATOR = 'Merchant Administrator';
    const ROLE_STORE_SPV = 'Store Spv';
    const ROLE_STORE_STAFF = 'Store Staff';

    const PERMISSION_VIEW_MENU_ELEMENT_UI = 'view menu element ui';
    const PERMISSION_VIEW_MENU_PERMISSION = 'view menu permission';
    const PERMISSION_VIEW_DASHBOARD = 'view dashboard';
    const PERMISSION_VIEW_MENU_ADMINISTRATOR = 'view menu administrator';
    const PERMISSION_VIEW_MENU_CRUD_STORE = 'view menu crud store';
    const PERMISSION_VIEW_MENU_FAQ = 'view menu faq';
    const PERMISSION_VIEW_MENU_FEE = 'view menu fee';
    const PERMISSION_VIEW_MENU_FOOD = 'view menu food';
    const PERMISSION_VIEW_MENU_ORDER = 'view menu order';
    const PERMISSION_VIEW_MENU_REPORT = 'view menu report';
    const PERMISSION_VIEW_MENU_STOCK = 'view menu stock';
    const PERMISSION_VIEW_MENU_STORE = 'view menu store';
    const PERMISSION_VIEW_MENU_USER = 'view menu user';
    const PERMISSION_VIEW_MENU_SERVICE = 'view menu service';
    const PERMISSION_VIEW_MENU_MERCHANT = 'view menu merchant';

    const PERMISSION_USER_MANAGE = 'manage user';
    const PERMISSION_PERMISSION_MANAGE = 'manage permission';
    const PERMISSION_ORDERS = 'manage order';
    const PERMISSION_FOOD = 'manage food';
    const PERMISSION_STORE = 'manage store';
    const PERMISSION_MERCHANT = 'manage merchant';
    const PERMISSION_DASHBOARD = 'view dashboard';
    const PERMISSION_FAQ = 'manage faq';
    const PERMISSION_SERVICE = 'manage service';
    const PERMISSION_FEE = 'manage fee';
    const PERMISSION_REFUND = 'view refund';
    const PERMISSION_DELIVERY = 'manage delivery';
    const PERMISSION_REPORT = 'manage report';
    const PERMISSION_MANAGE_STOCK = 'manage stock';
    const PERMISSION_AUDIT_TRAIL = 'view audit trail';

    /**
     * @param array $exclusives Exclude some permissions from the list
     * @return array
     */
    public static function permissions(array $exclusives = []): array
    {
        try {
            $class = new \ReflectionClass(__CLASS__);
            $constants = $class->getConstants();
            $permissions = Arr::where($constants, function($value, $key) use ($exclusives) {
                return !in_array($value, $exclusives) && Str::startsWith($key, 'PERMISSION_');
            });

            return array_values($permissions);
        } catch (\ReflectionException $exception) {
            return [];
        }
    }

    public static function menuPermissions(): array
    {
        try {
            $class = new \ReflectionClass(__CLASS__);
            $constants = $class->getConstants();
            $permissions = Arr::where($constants, function($value, $key) {
                return Str::startsWith($key, 'PERMISSION_VIEW_MENU_');
            });

            return array_values($permissions);
        } catch (\ReflectionException $exception) {
            return [];
        }
    }

    /**
     * @return array
     */
    public static function roles(): array
    {
        try {
            $class = new \ReflectionClass(__CLASS__);
            $constants = $class->getConstants();
            $roles =  Arr::where($constants, function($value, $key) {
                return Str::startsWith($key, 'ROLE_');
            });

            return array_values($roles);
        } catch (\ReflectionException $exception) {
            return [];
        }
    }
}
