'use strict';

var fs = require('fs');
var path = require('path');

import Base from './base.js';

export default class extends Base {
	/**
	 * index action
	 * @return {Promise} []
	 */
	async indexAction() {

		var start = new Date();
		start.setHours(0, 0, 0, 0);
		start = think.datetime(start);

		
		let foods = this.model('foods').select();
		let orders = this.model('orders').where({date:{'>': start}}).select();
		let users = this.model('users').select();
		let groups = this.model('groups').select();
		let user = await this.session('userInfo');

		this.assign({
			foods: foods,
			orders: orders,
			users: users,
			groups: groups,
			user: user
		});

		if(user && user.role > 10){
			return this.display('backstage');
		} else {
			this.redirect('/login');
		}
	}


	/**
	 * 新增菜品
	 * @return {[type]} [description]
	 */
	async addfoodAction() {
		let param = this.post();
		let name = param['food[name]'];
		let desc = param['food[desc]'];
		let file = this.file('uploadposter');
		var foodModel = this.model('foods');
		let newPoster;

		if(file) {
			var filePath = file.path;
			var originalname = file.originalFilename;
		}
		if (originalname) {
			// function getPoster(){
				fs.readFile(filePath, function(err, data) {
					var timestamp = Date.now();
					var type = originalname.split('.')[1];
					var poster = timestamp + '.' + type;
					var newPath = path.join(__dirname, '../../../', 'www/static/upload/' + poster);
					fs.writeFile(newPath, data, function(err) {
						newPoster = poster;
						foodModel.add({name: name,desc: desc,pic: newPoster}).then(function(data){
							console.log(data)
						});
					});
				});
			// 	return newPoster;
			// }
			// var p = await getPoster();
		}else {
			// function addfood(newPoster) {
				foodModel.add({name: name,desc: desc,pic: newPoster}).then(function(data){
					console.log(data)
				});
			// }
		}
		// await addfood(p);
		return this.redirect("/backstage");
	}



	/**
	 * 删除菜品
	 * @return {[type]} [description]
	 */
	async deletefoodAction() {
		let param = this.get();
		let foodId = parseInt(param.id);

		var foodModel = this.model('foods');
		let data = await foodModel.where({id: foodId}).delete();
		if(data) {
			return this.success({'success': true});
		}
	}



	/**
	 * 修改菜品
	 * @return {[type]} [description]
	 */
	async editfoodAction() {
		let param = this.post();
		let foodId = parseInt(param.id);
		let name = param.name;
		let desc = param.desc;

		var foodModel = this.model('foods');
		foodModel.where({id: foodId}).update({name: name,desc: desc}).then(function(data){
			if(data){
				console.log(data)
			}
		});
		return this.success();
	}



	/**
	 * 新增小组
	 * @return {[type]} [description]
	 */
	async addgroupAction() {
		let param = this.post();
		let name = param['group[name]'];

		var groupModel = this.model('groups');
		let data = await groupModel.thenAdd({name: name},{name: name});
		if(data){
			return this.success();
		}
		
	}

	/**
	 * 删除小组
	 * @return {[type]} [description]
	 */
	async deletegroupAction() {
		let param = this.get();
		let groupId = parseInt(param.id);

		var groupModel = this.model('groups');
		groupModel.where({id: groupId}).delete().then(function(data){
			if(data){
				console.log(data)
			}
		});
		return this.success({'success': true});
	}


	/**
	 * 修改小组
	 * @return {[type]} [description]
	 */
	async editgroupAction() {
		let param = this.post();
		let groupId = parseInt(param.id);
		let name = param.name;

		var groupModel = this.model('groups');
		groupModel.where({id: groupId}).update({name: name}).then(function(data){
			if(data){
				console.log(data)
			}
		});
		return this.success();
	}


	/**
	 * 添加用户
	 * @return {[type]} [description]
	 */
	
	async adduserAction() {
		let param = this.post();
		let name = param.name;
		param.role = 0;
		var userModel = this.model('users');
		// var groupModel = this.model('groups');

		let data = await userModel.thenAdd(param, {name: name});

		if(data.type === 'add') {
			this.success();
		} else if(data.type === 'exist'){
			this.fail(100, '用户添加重复！');
		}
	}


	/**
	 * 删除用户
	 * @return {[type]} [description]
	 */
	async deleteuserAction() {
		let param = this.get();
		let userName = param.name;
		let userGroup = param.group;

		var userModel = this.model('users');
		let data = await userModel.where({name: userName}).delete();


		if(data) {
			return this.success({'success': true});
		} else {
			return this.success({'success': false});
		}
	}


	/**
	 * 修改密码
	 * @return {[type]} [description]
	 */
	async editpwdAction() {
		let param = this.post();
		let name = param.name;
		let pwd = param.password;

		var userModel = this.model('users');
		let data = await userModel.where({name: name}).update({password: pwd});

		if(data) {
			return this.success();
		} else {
			return this.fail(100,'wrong');
		}
	}


	/**
	 * 修改分组
	 * @return {[type]} [description]
	 */
	async editusergroupAction() {
		let param = this.post();
		let name = param.username;
		let groupId = param.usergroup;

		var userModel = this.model('users');
		let data = await userModel.where({name: name}).update({group: groupId});

		if(data) {
			return this.success();
		} else {
			return this.fail(100,'wrong');
		}
	}

	/**
	 * 退出登录
	 * @return {[type]} [description]
	 */
	async logoutAction() {
		this.session();
	 	return this.success();
	}

}