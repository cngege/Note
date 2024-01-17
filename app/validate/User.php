<?php
/**
 * Created by PhpStorm
 * User: Administrator  ~o( =∩ω∩= )m
 * Date: 2024/1/15
 * Time: 13:59
 * Brief:
 * docs:
 */

namespace app\validate;

use think\Validate;

class User extends Validate
{
    protected $rule = [
        'email' =>  'email',
    ];

    protected $message = [
        'email' =>  '邮箱格式错误',
    ];
}