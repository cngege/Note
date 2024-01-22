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
use app\validate\ValidateRegUser;

class Login extends BaseController
{
    public function initialize(): void
    {
        // 登陆检查,登陆成功拿到UID
        if(session('?login_auth')){
            /** @var boolean $isLogin 登陆状态是否有效 */
            $isLogin = false;
            /** @var Mixed $login 该会话的登陆信息 */
            $login = session('login_auth');
            if(!defined("UID")){
                define("UID",$login["id"]);
                $isLogin = true;
            }
            /**
             * 检查是否登陆失效
             */
            if(!empty($login['end_time'])){
                if($login["end_time"] < time()){
                    $isLogin = false;
                }
            }

            $status = User::find(UID)->value("status");
            if(!defined("STATUS")){
                define("STATUS",$status);
                if($status != 0){
                    $isLogin = false;
                }
            }
            if(!defined("LOGIN")){
                define("LOGIN",$isLogin);
            }
        }
        if(!defined("LOGIN")){
            define("LOGIN",false);
        }
    }


    /**
     * 注册用户
     *
     * @return \think\response\Json
     * @throws \think\db\exception\DbException
     * @Json:
     * 0 成功,goto跳转主页
     * 1 失败
     */
    public function register(){
        //拿到邮箱密码
        $data = input("post.");
        if(!empty($data["regUsername"]) && !empty($data["regEmail"]) && !empty($data["regPassword"])){
            // 验证邮箱格式
            $validate = new ValidateRegUser();
            if(!$validate->check($data)){
                return json(["code"=>1,"msg"=>$validate->getError()]);
            }

            // 验证用户是否存在
            $user = new User();
            /*如果将要注册的用户已存在*/
            if($user->where("nickname" , $data["regUsername"])->count()){
                return json(["code"=>1,"msg"=>"注册的用户已存在"]);
            }
            /*如果将要注册的邮箱已存在*/
            if($user->where("email" , $data["regEmail"])->count()){
                return json(["code"=>1,"msg"=>"注册的用户已存在"]);
            }
            /*插入数据*/
            $salt = mt_randStr();
            $regData = [
                "nickname" => $data["regUsername"],
                "email"    => $data["regEmail"],
                "password" => thinkUcenterMd5($data["regPassword"],$salt),
                "salt"     => $salt,
                "reg_ip" => request()->ip(),
                "login_ip" => request()->ip(),
            ];
            if($user->save($regData)){
                session('login_auth', $user);
                return json(["code"=>0,"msg"=>"注册成功","goto"=>url("/index")->build()]);
            }
            return json(["code"=>1,"msg"=>"注册失败"]);
        }
        return json(["code"=>1,"msg"=>"用户名、邮箱或密码不能为空"]);
    }

    /**
     * 登陆
     *
     * @return \think\response\Json
     * @json: 0 登陆成功
     * @json: 1 已登录 直接跳转
     * @json: 2 登陆失败
     */
    public function login()
    {
        if(LOGIN){
            return json(["code" => 1, "goto"=>url("/index")->build()]);
        }
        $data = input("post.");
        $username = $data["username"];

        $userdata = User::getByNickname($username);
        if(!$userdata){
           return json(["code"=>2,"msg"=>"用户不存在"]);
        }

        $password = thinkUcenterMd5($data["password"], $userdata["salt"]);
        if($password == $userdata["password"]){
            session('login_auth', $userdata);
            // 修改保存最新登录ip
            $userdata->login_ip = request()->ip();
            $userdata->save();
            return json(["code"=>0,"msg"=>"","goto"=>url("/index")->build()]);
        }
        //密码不对
        return json(["code"=>2,"msg"=>"密码不正确"]);
    }

    public function logout()
    {
        if(LOGIN){
            session("login_auth",null);
        }
        return json(["code"=>0,"goto"=>url("/page/login")->build()]);
    }
}