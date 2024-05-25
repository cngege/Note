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

class Notes extends Model
{
    // 设置字段信息
    protected $schema = [
        'uid'          => 'int',
        'parent_uuid'  => 'string',
        'uuid'         => 'string',
        'title'        => 'string',
        'filename'     => 'string',
        'description'  => 'string',
        'recovered'    => 'tinyint:1',
        'img'          => 'json',
        'remark'       => 'json',
        'attachment'   => 'json',
        'create_time'  => 'datetime',
    ];


    // 设置json类型字段
    protected $json = ['img','remark','attachment'];
    // 该json字段输出为数组
    protected $jsonAssoc = true;
}