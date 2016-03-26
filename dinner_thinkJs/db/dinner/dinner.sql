/*
Navicat MySQL Data Transfer

Source Server         : dinner
Source Server Version : 50624
Source Host           : localhost:3306
Source Database       : dinner

Target Server Type    : MYSQL
Target Server Version : 50624
File Encoding         : 65001

Date: 2016-03-06 22:03:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for foods
-- ----------------------------
DROP TABLE IF EXISTS `foods`;
CREATE TABLE `foods` (
  `name` char(255) NOT NULL,
  `desc` text NOT NULL,
  `pic` varchar(255) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of foods
-- ----------------------------
INSERT INTO `foods` VALUES ('干锅', '好吃的干锅啊', '', '4');
INSERT INTO `foods` VALUES ('冒菜', '好吃的冒菜啊', '1457259157410.jpg', '6');
INSERT INTO `foods` VALUES ('中餐', '好吃的中餐啊', '1457259286124.jpg', '7');

-- ----------------------------
-- Table structure for groups
-- ----------------------------
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `name` varchar(255) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of groups
-- ----------------------------
INSERT INTO `groups` VALUES ('前端开发组', '1');
INSERT INTO `groups` VALUES ('后台开发', '3');

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `date` datetime NOT NULL,
  `food_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `group_id` varchar(255) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES ('2016-03-05 19:10:10', '7', '2', '1', '2');
INSERT INTO `orders` VALUES ('2016-03-06 19:17:10', '6', '2', '1', '3');
INSERT INTO `orders` VALUES ('2016-03-06 21:55:25', '7', '5', '1', '5');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `name` varchar(255) NOT NULL,
  `group` char(255) NOT NULL,
  `chinesename` char(255) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT '',
  `role` int(11) NOT NULL DEFAULT '0',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('chenxy@huizhuang.com', '1', '陈星宇', '123456', '11', '2');
INSERT INTO `users` VALUES ('caoyan@huizhuang.com', '1', '曹燕', '123456', '0', '5');
INSERT INTO `users` VALUES ('gaot@huizhuang.com', '1', '高田', '123456', '11', '6');
INSERT INTO `users` VALUES ('licj@huizhuang.com', '1', '李超军', '123456', '11', '7');
INSERT INTO `users` VALUES ('jiangy@huizhuang.com', '1', '姜印', '123456', '11', '8');
INSERT INTO `users` VALUES ('liupan@huizhuang.com', '1', '刘攀', '123456', '11', '9');
INSERT INTO `users` VALUES ('xiel@huizhuang.com', '1', '谢磊', '123456', '11', '10');
