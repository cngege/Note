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

    /**
     * 上传更新头像
     *
     * @return \think\response\Json
     * @throws \League\Flysystem\FilesystemException
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     * @Json 0 更新头像成功
     * @Json 1 没有登陆
     * @Json 2 出现错误
     * @Debug return json(["code"=>0,"debug"=>"debug","data"=>$file]);
     */
    public function updateFace(){
        if(!LOGIN){
            return json(["code"=>1,"msg"=>"用户没有登陆","goto"=>url("/page/login")->build()]);
        }
        $file = $this->request->file("userface");
        //return json(["code"=>0,"debug"=>"debug","data"=>$file->getMime()]);
        // 检查上传的文件是否违规
        if(is_array($file)){
            return json(["code"=>2,"msg"=>"仅上传单个文件"]);
        }
        if(!in_array(strtolower($file->extension()), array("jpg","png","gif","jpeg"))){
            return json(["code"=>2,"msg"=>"只允许上传图片"]);
        }
        // 不能 > 10MB
        if($file->getSize() !== false && $file->getSize() > 1024 * 1024 * 10){
            return json(["code"=>2,"msg"=>"图片不能大于 10Mb"]);
        }

        // 要不要将已有的图片删掉

        $user = \app\model\User::find(UID);
        if(!is_null($user["userface"])){
            Filesystem::disk("userData")->delete($user["userface"]);
        }

        $info = Filesystem::disk('userData')->putFile(strval(UID),$file);
        //$info = Filesystem::putFile("topic",$file);
        // 移动上传的文件到用户文件夹
        // 检查目标文件夹是否存在，如果不存在则创建
//        if (!Filesystem::disk('userData')->fileExists(UID."/userFace")) {
//            Filesystem::disk('userData')->createDirectory(UID."/userFace");
//        }
        // 移动文件
        //$move = rename(Filesystem::disk("local")->path($info),Filesystem::disk("userData")->path(UID."/userFace/userface.".$file->extension()));
        //if($move){
            /* 在数据库中添加字段记录头像位置 */

        //}
        //Filesystem::disk("local")->delete($info);

        $user["userface"] = $info; //Filesystem::disk("userData")->url($info);
        $user->save();
        return json(["code"=>0,"msg"=>"完成","updataUrl"=>Filesystem::disk("userData")->url($info)]);
        //return json(["code"=>2,"msg"=>"上传错误,移动文件错误"]);
    }
}