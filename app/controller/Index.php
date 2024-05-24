<?php

namespace app\controller;

use app\BaseController;
use app\model\User;
use app\Model\Folder;
use app\Model\Notes;
use Ramsey\Uuid\Uuid;
use think\db\Where;
use think\Exception;
use think\facade\Db;
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
     * Desc:
     * @return \think\response\Json|void
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     *
     * Code 0: 成功
     * Code 1: 未登录
     *      2: 参数错误
     *      3: 失败
     */
    public function addFolder()
    {
        // 传入信息: 文件夹名称,父文件夹uuid
        // 要回传 uuid、文件夹名称、
        if(!LOGIN){
            //检查登陆状态
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        // 父文件夹的uuid
        $uuid = input("post.uuid");
        if(!$uuid){
            return json(array("code" => 2, "msg"=>"参数错误,uuid参数不可为空"));
        }
        $name = input("post.name");
        if(!$name){
            return json(array("code" => 2, "msg"=>"参数错误,name参数不可为空"));
        }
        $user = User::find(UID);
        $folders = $user
            ->Folder()
            ->where("uuid", $uuid)
            ->find();// 理论只有一条数据，所有这里用find，否则用select
        if($folders){
            // 创建uuid
            $makeuuid = UUID::uuid4()->toString();
            // 预备回滚
            Db::startTrans();
            // 在Note_Folder中新建一条数据
            try {
                $newFolder = new Folder();
                $newFolder->uid = UID;
                $newFolder->parent_uuid = $folders->uuid;
                $newFolder->uuid = $makeuuid;
                $newFolder->name = $name;
                $newFolder->subfolder = [];
                if(!$newFolder->save()){
                    Db::rollback();
                    return json(array("code" => 3, "msg"=>"失败, 新建文件夹数据时保存失败"));
                }

                $subfolder = $folders->subfolder;
                array_unshift($subfolder, array("uuid"=>$makeuuid));// 在数组头部添加
                $folders->subfolder = $subfolder;

                if(!$folders->save()){
                    Db::rollback();
                    return json(array("code" => 3, "msg"=>"失败, 添加到父文件夹失败"));
                }
                Db::commit();
                return json(["code"=>0,"data"=>["uuid"=>$makeuuid,"name"=>$name]]);

            }catch (\Exception $e){
                Db::rollback();
                return json(array("code" => 3, "msg"=>"发生异常:".$e->getMessage()));
            }

        }

    }

    /**
     * Desc: 重命名文件夹
     * @return \think\response\Json
     * @input uuid 要重命名文件夹的uuid
     * @input name 要重命名文件夹的名称
     */
    public function renameFolder(): \think\response\Json
    {
        if(!LOGIN){
            return json(array("code" => 1, "goto"=>url("page/login")->build()));
        }
        $uuid = input("post.uuid");
        if(!$uuid){
            return json(array("code" => 2, "msg"=>"参数错误,uuid参数不可为空"));
        }
        $name = input("post.name");
        if(!$name){
            return json(array("code" => 2, "msg"=>"参数错误,name参数不可为空"));
        }
        try {
            $user = User::find(UID);
            $folders = $user
                ->Folder()
                ->where("uuid", $uuid)
                ->find();
            if(!$folders){
                throw new Exception("该文件夹不存在");
            }
            if($folders->name == $name){
                return json(array("code" => 0, "data"=>["name"=>$name]));
            }
            $folders->name = $name;
            if(!$folders->save()){
                throw new Exception("保存数据错误");
            }
            return json(array("code" => 0, "data"=>["name"=>$name]));
        }catch (\Exception $e){
            return json(array("code" => 3, "msg"=>"异常:".$e->getMessage()));
        }
    }

    /**
     * 删除笔记文件夹 支持递归
     * @access public
     * @return \think\response\Json
     */
    public function deleteFolder() : \think\response\Json
    {
        /*
         * Code 0: 成功
         * Code 1: 未登录
         *      2: 参数错误
         *      3: 失败
         */
        if(!LOGIN){
            return json(array("code" => 1, "goto"=>url("page/login")->build()));
        }

        $uuid = input("post.uuid");
        if(!$uuid){
            return json(array("code" => 2, "msg"=>"参数错误,uuid参数不可为空"));
        }
        // TODO: 要删除笔记的uuid列表

        Db::startTrans();
        try {
            $user = User::find(UID);
            // 首先在父文件夹里移除自己
            $current = $user->Folder()->where("uuid", $uuid)->find();
            if(!$current){
                throw new Exception("找不到传入文件夹的uuid");
            }
            $parentUUID = $current->parent_uuid;
            if($parentUUID){
                // 在父文件夹中移除此文件夹
                $parentFolder = $user->Folder()->where("uuid", $parentUUID)->find();
                if($parentFolder){

                    $filteredArray = array_filter($parentFolder->subfolder, function($item) use ($uuid) {
                        return $item['uuid'] !== $uuid;
                    });
                    $filteredArray = array_values($filteredArray);
                    $parentFolder->subfolder = $filteredArray;
                    if(!$parentFolder->save()){
                        throw new Exception("父文件夹中的子文件夹数据修改后保存失败");
                    }
                }
            }
            // 拿到所有子文件夹 递归删除
            $this->deleteChildFolder($uuid);
            Db::commit();
            return json(["code"=>0]);

        }catch (\Exception $e){
            Db::rollback();
            return json(array("code" => 3, "msg"=>"发生异常:".$e->getMessage()));
        }
    }

    /**
     * Desc: 递归删除笔记文件夹
     * @param string $uuid 要删除根文件夹的uuid
     * @return void
     */
    private function deleteChildFolder(string $uuid) : void
    {
        // 首先读取获取所有子文件夹的uuid
        $currDir = User::find(UID)->Folder()->where("uuid", $uuid)->find();
        if($currDir){
            //$ChildDir = json_decode($currDir->subfolder,true);
            $ChildDir = $currDir->subfolder;
            // 然后递归删除
            foreach ($ChildDir as $child) {
                $this->deleteChildFolder($child["uuid"]);
            }
            // TODO: 删除前处理文件夹下的所有笔记
            // ...
            // 最后删除自己
            $currDir->delete();
        }
    }

    /**
     * Desc: 获取某个文件夹下的下一级所有笔记文件
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public function getNoteInfo() : \think\response\Json   // 获取某个层级文件夹下的子级文件夹和笔记id 1 没有登录 2 出错
    {
        //检查登陆状态
        if(!LOGIN){
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
            ->field("parent_uuid,uuid,title,description,img,create_time")
            ->select();

        return json(["code"=>0,"note"=>(count($notes))? $notes : array()]);
    }
}
