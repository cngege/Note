<?php
/**
 * Created by PhpStorm
 * User: Administrator  ~o( =∩ω∩= )m
 * Date: 2024/1/13
 * Time: 12:46
 * Brief:
 * docs:
 */

namespace app\controller;

use app\BaseController;
use app\model\user;
use think\facade\Db;

class Login extends BaseController
{
    public function __construct()
    {
        $user0 = new User();
        session('login_auth', $user0->find(0));
        // 登陆检查,登陆成功拿到UID
        if(session('?login_auth')){
            /** @var boolean $isLogin 登陆状态是否有效 */
            $isLogin = false;
            /** @var Mixed $login 该会话的登陆信息 */
            $login = session('login_auth');
            if(!defined("UID")){
                define("UID",$login["id"]);
            }
            /**
             * 检查是否登陆失效
             */
            if(!empty($login('end_time'))){
                if($login["end_time"] < time()){
                    $isLogin = false;
                }
            }

            $user = new User();
            $status = $user->findOne(['id'=>UID],'status');
            if(!defined("STATUS")){
                define("STATUS",$status);
            }
            $isLogin = STATUS == 0;

            if(!defined("LOGIN")){
                define("LOGIN",$isLogin);
            }
        }

    }


    public function register()
    {

    }

    /**
     * 登陆状态检查
     *
     * @return \think\response\Json
     * @Json{}
     * code: 0 已登陆,也没过期
     * code: 1 未登录,或者过期
     */
    public function check()
    {

        return json(["code"=>1,"goto"=>url("\static\page\login.html")]);
    }
}