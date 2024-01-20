<?php

namespace app\controller;

use app\BaseController;
use app\model\User;
use think\facade\Filesystem;

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
        if(is_null($userData["userface"])){
            $userData["userface"] = "/static/img/akari.jpg";//默认图片url
        }else{
            $userData["userface"] = Filesystem::disk("userData")->url($userData["userface"]);
        }

        return json(["code"=>0,"user"=>$userData,"note"=>array()]);
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
