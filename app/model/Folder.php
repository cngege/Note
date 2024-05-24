<?php
/**
 * Created by PhpStorm
 * User: CNGEGE
 * Date: 2024/1/25
 * Time: 16:53
 * Brief:
 * docs:
 */

namespace app\model;

use think\Model;

class Folder extends Model
{
    // 设置json类型字段
    protected $json = ['subfolder'];
    // 该json字段输出为数组
    protected $jsonAssoc = true;
}