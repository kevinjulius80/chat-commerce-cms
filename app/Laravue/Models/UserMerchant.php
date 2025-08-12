<?php

namespace App\Laravue\Models;

use Illuminate\Database\Eloquent\Model;

class UserMerchant extends Model
{
    protected $table = 'user_merchant';

    protected $fillable = [
        'merchant_id',
        'user_id',
    ];

    public $timestamps = false;
}
