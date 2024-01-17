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
use think\facade\Filesystem;

/**
 * 用户数据更新相关的方法,比如上传头像,修改邮箱
 */
class User extends Login
{

    public function updateFace(){
        if(!LOGIN){
            return json(["code"=>1,"msg"=>"用户没有登陆","goto"=>url("/page/login")->build()]);
        }
        $file = $this->request->file("userface");
        // TODO: 检查上传的文件是否违规
        $info = Filesystem::putFile("topic",$file);
        // TODO: 移动上传的文件到用户文件夹
        // 检查目标文件夹是否存在，如果不存在则创建
        if (!Filesystem::disk('userData')->fileExists("/1/userFace")) {
            Filesystem::disk('userData')->createDirectory("/1/userFace");
        }
        //Filesystem::disk("local")->move($info, "userData/1/userFace/userface.png");
        //Filesystem::disk("userData")->move("../".$info, "1/userFace/userface.png");
        rename(Filesystem::disk("local")->path($info),Filesystem::disk("userData")->path("1/userFace/userface.".$file->extension()));
        return json(["code"=>0,"msg"=>Filesystem::disk("userData")->path("1/userFace/userface.png")]);
        /* 在数据库中添加字段记录头像位置 */
    }
}