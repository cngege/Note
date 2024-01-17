<?php
/**
 * Created by PhpStorm
 * User: CNGEGE
 * Date: 2024/1/15
 * Time: 23:08
 * Brief:
 * docs:
 */

namespace app\controller;

use app\BaseController;
use app\model\User;

class Install extends BaseController
{

    public function install()
    {
        // 返回code：0 成功,msg显示提示消息，跳转主页 ，1 失败,显示msg消息, 2已安装- 不显示数据直接跳转
        $user = new User();
        if($user->count()){
            // 返回已安装
            return json(["code"=>2,"goto"=>url("/index")->build()]);
        }
        $data = input("post.");
        $salt = mt_randStr();
        if(!empty($data["adminuser"] && !empty($data["adminpasswd"]))){
            $InsData = [
                "nickname" => $data["adminuser"],
                "password" => thinkUcenterMd5($data["adminpasswd"],$salt),
                "salt"     => $salt,
                "reg_ip" => request()->ip(),
                "login_ip" => request()->ip(),
                "is_admin" => 1,
            ];
            if($user->save($InsData)){
                session('login_auth', $user->getData());
                return json(["code"=>0,"msg"=>"安装完成","goto"=>url("/index")->build()]);
            }
            return json(["code"=>1,"msg"=>"安装失败"]);
        }
        return json(["code"=>1,"msg"=>"用户名或密码不能为空"]);

    }
}