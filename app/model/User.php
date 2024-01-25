<?php
/**
 * Created by PhpStorm
 * User: Administrator  ~o( =∩ω∩= )m
 * Date: 2024/1/13
 * Time: 16:05
 * Brief:
 * docs:
 */

namespace app\model;

use think\Model;

class User extends Model
{
    public function Folder()
    {
        return $this->hasMany(Folder::class,"uid", 'id');
    }

    public function Notes()
    {
        return $this->hasMany(Notes::class,"uid", 'id');
    }
}