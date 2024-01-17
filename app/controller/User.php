<?php
/**
 * Created by PhpStorm
 * User: Administrator  ~o( =∩ω∩= )m
 * Date: 2024/1/17
 * Time: 13:07
 * Brief:
 * docs:
 */

namespace app\controller;

use app\controller\Login;

/**
 * 用户数据更新相关的方法,比如上传头像,修改邮箱
 */
class User extends Login
{

    public function updateFace(){
        if(!LOGIN){
            return json(["code"=>1,"msg"=>"用户没有登陆","goto"=>url("/page/login")->build()]);
        }

    }
}