<?php
// 应用公共文件

function mt_randStr()
{
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $result = '';
    for ($i = 0; $i < 6; $i++) {
        $result .= $chars[mt_rand(0, strlen($chars) - 1)];
    }
    return $result;
}


/**
 * 系统非常规MD5加密方法
 * @date 2018-11-27
 * @param string $str 要加密的字符串
 * @param string $key 加密字符
 */
function thinkUcenterMd5($str, $key = 'ThinkUCenter')
{
    return '' === $str ? '' : md5(sha1($str) . $key);
}

/**
 * Desc: 尽可能的拿到能够在前端显示的数据
 * @param int $id   主键id
 * @return array    拿到的用户信息数据
 * @throws \think\db\exception\DataNotFoundException
 * @throws \think\db\exception\DbException
 * @throws \think\db\exception\ModelNotFoundException
 */
function getUser(int $id)
{
    $user = app\Model\User::find($id);
    if(!$user){
        return array();
    }
    $ret = array();
    $ret["id"] = $user->id;
    $ret["nickname"] = $user->nickname;
    $ret["email"] = $user->email;
    $ret["phone"] = $user->phone;
    if(is_null($user["userface"])){
        $ret["userface"] = "/static/img/akari.jpg";//默认图片url
    }else{
        $ret["userface"] = think\facade\Filesystem::disk("userData")->url($user["userface"]);
    }
    $ret["uuid"] = $user->folder_uuid;
    $ret["is_admin"] = $user->is_admin;
    $ret["status"] = $user->status;
    $ret["create_time"] = $user->create_time;
    $ret["update_time"] = $user->update_time;
    return $ret;
}
