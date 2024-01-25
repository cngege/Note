<?php
/**
 * Created by PhpStorm
 * User: CNGEGE
 * Date: 2024/1/15
 * Time: 23:08
 * Brief:
 * docs:
 */

namespace app\controller;

use app\BaseController;
use app\model\User;
use app\model\Folder;
use think\facade\Db;

use Ramsey\Uuid\Uuid;

class Install extends BaseController
{

    public function install()
    {
        // 返回code：0 成功,msg显示提示消息，跳转主页 ，1 失败,显示msg消息, 2已安装- 不显示数据直接跳转
        $user = new User();
        if($user->count()){
            // 返回已安装
            return json(["code"=>2,"goto"=>url("/index")->build()]);
        }
        $data = input("post.");
        $salt = mt_randStr();
        if(!empty($data["adminuser"] && !empty($data["adminpasswd"]))){
            $uuid = UUID::uuid4()->toString();
            $InsData = [
                "nickname" => $data["adminuser"],
                "password" => thinkUcenterMd5($data["adminpasswd"],$salt),
                "salt"     => $salt,
                "reg_ip" => request()->ip(),
                "login_ip" => request()->ip(),
                "folder_uuid" => $uuid,
                "is_admin" => 1,
            ];
            Db::startTrans();
            try {
                if($user->save($InsData)){
                    /* 向 Folder 模型中写入默认文件夹结构 */
                    $folder = new Folder();
                    // 编写一条数据 笔记文件夹下 我的笔记 这个文件夹的uuid
                    $mynote_uuid = UUID::uuid4()->toString();
                    $folderData = [
                        "uid" => $user["id"],
                        "uuid"=> $uuid,
                        "name"=> "根目录",
                        "subfolder" => json_encode([
                            ["uuid"=>$mynote_uuid, "name"=>"我的笔记"],
                        ]),
                    ];
                    if(!$folder->save($folderData)){
                        // 创建默认笔记文件夹（保存）失败
                        Db::rollback();
                        return json(["code"=>1,"msg"=>"安装失败"]);
                    }
                    Db::commit();
                    // 创建用户和创建默认文件夹都成功
                    session('login_auth', $user->getData());
                    return json(["code"=>0,"msg"=>"安装完成","goto"=>url("/index")->build()]);
                }
            }catch (\Exception $e){
                Db::rollback();
                return json(["code"=>1,"msg"=>"安装失败","error"=>$e->getMessage()]);
            }

            return json(["code"=>1,"msg"=>"安装失败"]);
        }
        return json(["code"=>1,"msg"=>"用户名或密码不能为空"]);

    }
}