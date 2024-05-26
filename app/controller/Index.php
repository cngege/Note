<?php

namespace app\controller;

use app\BaseController;
use app\model\User;
use app\Model\Folder;
use app\Model\Notes;
use League\Flysystem\FilesystemException;
use Ramsey\Uuid\Uuid;
use think\db\exception\DbException;
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
        try {
            if (!$user->count()) {
                return json(array("code" => 2, "goto" => url("page/install")->build()));    // 2:未安装
            }
        } catch (DbException $e) {
            return json(["code"=>3,"msg"=>"异常:".$e->getMessage()]);
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
     * @input uuid 获取子文件夹的当前文件夹的uuid
     *
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
     * @input uuid 要在此文件夹下添加文件夹的uuid
     * @input name 添加文件夹的名称
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
                    throw new \Exception("失败, 新建文件夹数据时保存失败");
                }

                $subfolder = $folders->subfolder;
                array_unshift($subfolder, array("uuid"=>$makeuuid));// 在数组头部添加
                $folders->subfolder = $subfolder;

                if(!$folders->save()){
                    throw new \Exception("失败, 添加到父文件夹失败");
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
     * @input uuid 要删除文件夹的uuid
     *
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
     * @input uuid 要获取该文件夹下的所有笔记的该文件夹的uuid
     *
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
            ->where(["parent_uuid" => $uuid, "recovered" => 0])
            ->field("parent_uuid,uuid,title,description,img,create_time")
            ->select();

        return json(["code"=>0,"note"=>(count($notes))? $notes : array()]);
    }


    public function newNote() : \think\response\Json
    {
        //检查登陆状态
        if(!LOGIN){
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        $uuid = input("post.uuid");
        if(!$uuid){
            return json(["code"=>2,"msg"=>"参数错误，uuid不能为空"]);
        }
        Db::startTrans();
        try {
            $makeuuid = UUID::uuid4()->toString();
            // 数据库中检索文件夹是否存在
            $user = User::find(UID);
            $folders = $user
                ->Folder()
                ->where("uuid", $uuid)
                ->find();
            if(!$folders){
                throw new Exception("当前文件夹不存在,建议刷新后尝试");
            }
            // 在Note数据表中新建一条数据
            $note = new Notes();
            $issave = $note->save([
               "uid" => $user->id,
               "parent_uuid" => $folders->uuid,
               "uuid" => $makeuuid,
               "title" => "无标题",
               "filename" => UID . "/" .$makeuuid. "/",
            ]);
            if(!$issave){
                throw new Exception("新建笔记保存数据库失败");
            }

            // 新建笔记文件 的文件夹
            Filesystem::disk("noteData")->createDirectory($note->filename);
            Db::commit();
            $retData = [
                "uuid" => $makeuuid,
                "title" => $note->title,
                "create_time" => $note->create_time,
            ];
            return json(["code"=>0,"data"=>$retData]);
        }catch (\Exception $e){
            Db::rollback();
            return json(array("code" => 3, "msg"=>"发生异常:".$e->getMessage()));
        }
    }

    /**
     * Desc: 删除笔记  将笔记移动至回收站
     * @return \think\response\Json
     */
    public function RecyclingNote() : \think\response\Json
    {
        //检查登陆状态
        if(!LOGIN){
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        $uuid = input("post.uuid");
        if(!$uuid){
            return json(["code"=>2,"msg"=>"参数错误，uuid不能为空"]);
        }
        try {
            $user = User::find(UID);
            $notes = $user
                ->Notes()
                ->where("uuid", $uuid)
                ->find();
            if(!$notes){
                // 本不存在
                throw new Exception("数据库中未找到此笔记信息");
            }
            if($notes->recovered){
                // 已经在回收站中的笔记不应该使用此方法删除
                throw new Exception("回收站中的笔记无法再次移动到回收站");
            }
            $notes->recovered = 1;  // 移动到回收站
            $notes->parent_uuid = NULL;
            // 资源不删除
            if(!$notes->save()){
                throw new Exception("回收笔记失败,数据库信息修改失败");
            }
            return json(["code"=>0]);
        }catch (\Exception $e){
            return json(array("code" => 3, "msg"=>"发生异常:".$e->getMessage()));
        }
    }


    public function getNoteData() : \think\response\Json
    {
        //检查登陆状态
        if(!LOGIN){
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        $uuid = input("post.uuid");
        if(!$uuid){
            return json(["code"=>2,"msg"=>"参数错误，uuid不能为空"]);
        }
        try {
            $user = User::find(UID);
            $notes = $user->Notes()->where("uuid", $uuid)->find();
            if(!$notes){
                // 本不存在
                throw new Exception("数据库中未找到此笔记信息");
            }
            if($notes->recovered){
                // 回收站中的笔记不准看详情
                throw new Exception("回收站中的笔记不支持查看数据");
            }
            // 读取本在数据库中的数据
            $headerData = [
                "uuid" => $uuid,                        // 笔记UUID
                "title" => $notes->title,               // 笔记标题
                "description" => $notes->description,   // 笔记简要描述
                "remark" => $notes->remark,             // 笔记备注
                "create_time" => $notes->create_time,   // 笔记创建时间
            ];
            // 读取文件中的数据
            $hasfile = Filesystem::disk("noteData")->fileExists($notes->filename . "main.note");
            if(!$hasfile){
                Filesystem::disk("noteData")->write($notes->filename . "main.note","\n");
            }
            $noteStr = Filesystem::disk("noteData")->read($notes->filename . "main.note");
            // TODO: 读取标签数据
            // ...
            // TODO: 读取附件数据
            // ...


            return json([
                "code"=>0,
                "headerData"=>$headerData,
                "noteData"=>$noteStr,
            ]);
        }catch (\Exception $e){
            return json(array("code" => 3, "msg"=>"发生异常:".$e->getMessage()));
        }
    }


    public function updateNoteData()
    {
        // 不包括标题 仅数据
        //检查登陆状态
        if(!LOGIN){
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        $uuid = input("post.uuid");
        if(!$uuid){
            return json(["code"=>2,"msg"=>"参数错误，uuid不能为空"]);
        }
        $noteData = input("post.noteData");
        if(!$noteData){
            return json(["code"=>2,"msg"=>"参数错误，noteData不能为空"]);
        }
        $noteDescription = input("post.noteDescription");
        if(!$noteDescription){
            return json(["code"=>2,"msg"=>"参数错误，noteDescription不能为空"]);
        }
        try {
            $user = User::find(UID);
            $notes = $user->Notes()->where("uuid", $uuid)->find();
            if(!$notes){
                // 本不存在
                throw new Exception("数据库中未找到此笔记信息");
            }
            if($notes->recovered){
                // 回收站中的笔记不准看详情
                throw new Exception("请先从回收站中恢复");
            }
            // 更新数据库中 笔记描述
            //$a = rawurldecode($noteData);
            //$b = base64_decode($a);
            if(!extension_loaded('mbstring')){
                throw new Exception("php环境没有启用 'mbstring' 扩展");
            }
            $notes->description = mb_substr($noteDescription,0,50,'UTF-8');
            Filesystem::disk("noteData")->write($notes->filename . "main.note",$noteData);
            $notes->save(); // 这里有没有保存成功无所谓
            return json([
                "code"=>0,
                "description"=>$notes->description,
            ]);
        }catch (\Exception $e){
            return json(array("code" => 3, "msg"=>"发生异常:".$e->getMessage()));
        }
    }


    public function renameNote()
    {
        //检查登陆状态
        if(!LOGIN){
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        $uuid = input("post.uuid");
        if(!$uuid){
            return json(["code"=>2,"msg"=>"参数错误，uuid不能为空"]);
        }
        $notename = input("post.name");
        if(!$notename){
            return json(["code"=>2,"msg"=>"参数错误，name不能为空"]);
        }
        try {
            $user = User::find(UID);
            $notes = $user->Notes()->where("uuid", $uuid)->find();
            if(!$notes){
                // 本不存在
                throw new Exception("数据库中未找到此笔记信息");
            }
            if($notes->recovered){
                // 回收站中的笔记不准看详情
                throw new Exception("请先从回收站中恢复");
            }
            $notes->title = $notename;
            if(!$notes->save()){
                throw new Exception("标题保存失败");
            }
            return json([
                "code"=>0,
                "name"=>$notes->title,
            ]);
        }catch (\Exception $e){
            return json(array("code" => 3, "msg"=>"发生异常:".$e->getMessage()));
        }
    }


    public function getTrashNote(){
        //检查登陆状态
        if(!LOGIN){
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        try {
            $user = User::find(UID);
            $notes = $user->Notes()->where("recovered", 1)->field("uuid,title,description,recovered,img,create_time")->select();
            if(!$notes){
                // 本不存在
                throw new Exception("查询时发生错误");
            }
            return json(["code"=>0,"notes"=>$notes]);
        }catch (\Exception $e){
            return json(array("code" => 3, "msg"=>"发生异常:".$e->getMessage()));
        }
    }

    public function deleteTrashNote(){
        //检查登陆状态
        if(!LOGIN){
            return json(array("code" => 1, "goto"=>url("page/login")->build()));    // 1:未登录
        }
        $uuid = input("post.uuid");
        if(!$uuid){
            return json(["code"=>2,"msg"=>"参数错误，uuid不能为空"]);
        }
        Db::startTrans();
        try {
            $user = User::find(UID);
            $note = $user->Notes()->where(["uuid"=>$uuid,"recovered"=>1])->find();
            if(!$note){
                throw new Exception("未在数据库中找到此笔记");
            }
            $file = $note->filename;
            if(!$note->delete()){
                throw new Exception("在数据库中删除此笔记失败");
            }
            // 删除附带文件夹
            Filesystem::disk("noteData")->deleteDirectory($file);
            Db::commit();
            return json(["code"=>0]);
        }catch (\Exception $e){
            Db::rollback();
            return json(array("code" => 3, "msg"=>"发生异常:".$e->getMessage()));
        }
    }
}
