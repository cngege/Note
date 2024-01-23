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
        $userData = getUser(UID);
        return json(["code"=>0,"user"=>$userData,"note"=>array()]);
    }

}
