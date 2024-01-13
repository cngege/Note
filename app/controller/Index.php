<?php

namespace app\controller;

use app\BaseController;

class Index extends Login
{

    public function getNoteInfo()
    {
        //检查登陆状态
        return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录


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
