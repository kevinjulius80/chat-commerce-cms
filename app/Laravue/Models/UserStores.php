<?php

namespace App\Laravue\Models;

use Illuminate\Database\Eloquent\Model;

class UserStores extends Model
{
    protected $fillable = [
        'store_id',
        'user_id',
    ];

    public $timestamps = false;
}
