<?php

namespace App\Laravue\Models;

use Illuminate\Database\Eloquent\Model;

class UserDeviceKeys extends Model
{
    protected $fillable = [
        'token',
        'user_id',
    ];

    public $timestamps = false;
}
