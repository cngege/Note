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