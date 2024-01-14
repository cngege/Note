<?php

namespace app\controller;

use app\BaseController;
use app\model\User;

class Index extends Login
{

    public function getNoteInfo()
    {
        //检查安装状态
        $user = new User();
        if(!$user->count()){
            return json(array("code" => 2, "goto"=>url("page/install")->build()));    // 2:未安装
        }
        if(!LOGIN){
            //检查登陆状态
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        //TODO: 已登录
        $userData = $user->find(UID);
        return json(["code"=>0,"user"=>$userData,"note"=>array()]);
    }

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

    public function index()
    {
        return '<style>*{ padding: 0; margin: 0; }</style><iframe src="https://www.thinkphp.cn/welcome?version=' . \think\facade\App::version() . '" width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>';
    }

    public function hello($name = 'ThinkPHP8')
    {
        return 'hello,' . $name;
    }
}
