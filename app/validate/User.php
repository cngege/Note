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
        'regEmail' =>  'email',
        'regUsername' => 'require|max:25',
        'regPassword' => 'require|max:50',
    ];

    protected $message = [
        'regEmail' =>  '邮箱格式错误',
        'regUsername.require' => "用户名不能为空",
        'regUsername.max' => "用户名不能大于25字符",
        'regPassword.require' => "密码不能为空",
        'regPassword.max' => "密码不能大于50字符",
    ];
}