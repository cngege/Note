<?php

namespace app\controller;

use app\BaseController;
use app\model\User;
use app\Model\Folder;
use app\Model\Notes;
use think\db\Where;
use think\facade\Filesystem;

class Index extends Login
{
    public function getUserInfo()
    {
        // 判断安装状态
        $user = new User();
        if(!$user->count()){
            return json(array("code" => 2, "goto"=>url("page/install")->build()));    // 2:未安装
        }
        // 判断登录状态
        if(!LOGIN){
            //检查登陆状态
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        return json(["code"=>0,"user"=>getUser(UID)]);
    }

    /**
     * Desc: 取某个文件夹下的下一级所有文件夹
     * @return \think\response\Json 接口回传消息
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public function getFolderInfo()   // 获取某个层级文件夹下的子级文件夹 1 没有登录 2 出错
    {
        if(!LOGIN){
            //检查登陆状态
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        $uuid = input("post.uuid");
        if(!$uuid){
            return json(["code"=>2,"msg"=>"参数错误", "folder" => []]);
        }
        $user = User::find(UID);
        $folders = $user
            ->Folder()
            ->where("uuid", $uuid)
            ->field("parent_uuid,uuid,name,subfolder")
            ->find();// 理论只有一条数据，所有这里用find，否则用select

        return json(["code"=>0,"folder"=>$folders]);
    }

    /**
     * Desc: 获取某个文件夹下的下一级所有笔记文件
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public function getNoteInfo()   // 获取某个层级文件夹下的子级文件夹和笔记id 1 没有登录 2 出错
    {
        if(!LOGIN){
            //检查登陆状态
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        $uuid = input("post.uuid");
        if(!$uuid){
            return json(["code"=>2,"msg"=>"参数错误", "note"=>[]]);
        }
        $user = User::find(UID);
        $notes = $user
            ->Notes()
            ->where("parent_uuid", $uuid)
            ->field("parent_uuid,uuid,title")
            ->select();

        return json(["code"=>0,"note"=>(count($notes))? array($notes) : array()]);
    }

}
