-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        8.0.31 - MySQL Community Server - GPL
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 导出  表 note.note_folder 结构
DROP TABLE IF EXISTS `note_folder`;
CREATE TABLE IF NOT EXISTS `note_folder` (
  `uid` int unsigned NOT NULL COMMENT '所属用户id',
  `parent_uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '父文件的uuid（当前文件夹为根文件夹时，父文件夹uuid为null）',
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '当前文件夹的uuid',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '当前文件夹名称',
  `subfolder` json NOT NULL COMMENT '所有下一级子文件夹',
  UNIQUE KEY `uuid` (`uuid`),
  KEY `FK_note_folder_note_user` (`uid`),
  CONSTRAINT `FK_note_folder_note_user` FOREIGN KEY (`uid`) REFERENCES `note_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='笔记文件夹结构表';

-- 数据导出被取消选择。

-- 导出  表 note.note_notes 结构
DROP TABLE IF EXISTS `note_notes`;
CREATE TABLE IF NOT EXISTS `note_notes` (
  `uid` int unsigned NOT NULL COMMENT '所属用户id',
  `parent_uuid` varchar(40) COLLATE utf8mb4_general_ci NOT NULL COMMENT '父文件夹uuid',
  `uuid` varchar(40) COLLATE utf8mb4_general_ci NOT NULL COMMENT '笔记uuid',
  `title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '未命名' COMMENT '笔记标题',
  `filename` varchar(40) COLLATE utf8mb4_general_ci NOT NULL COMMENT '笔记文件名称',
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '笔记内容的前50个字',
  `img` json DEFAULT NULL COMMENT '笔记当中的图片资源',
  `remark` json DEFAULT NULL COMMENT '备注',
  `attachment` json DEFAULT NULL COMMENT '附件名单',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '笔记创建时间',
  UNIQUE KEY `uuid` (`uuid`),
  KEY `FK_note_notes_note_user` (`uid`),
  CONSTRAINT `FK_note_notes_note_user` FOREIGN KEY (`uid`) REFERENCES `note_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='笔记文件存储信息表';

-- 数据导出被取消选择。

-- 导出  表 note.note_user 结构
DROP TABLE IF EXISTS `note_user`;
CREATE TABLE IF NOT EXISTS `note_user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `nickname` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名称',
  `email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '邮箱',
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'sha256密码字段',
  `salt` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '000000' COMMENT '密码随机加盐',
  `phone` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '手机号码',
  `userface` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '头像URL',
  `reg_ip` varchar(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '创建账号时的IP',
  `login_ip` varchar(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '最新一次登陆的IP',
  `folder_uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '笔记根文件夹的uuid',
  `is_admin` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0普通用户,1管理员',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0正常,1禁用2拉黑',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '用户创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新信息的更新时间',
  `delete_time` timestamp NULL DEFAULT NULL COMMENT '软删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='基础用户账号信息表';

-- 数据导出被取消选择。

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
