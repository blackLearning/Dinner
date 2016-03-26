'use strict';

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
		//auto render template file index_index.html
		//
		//this.model('orders').where({date: {$gt: start}}).select()
		let foods = this.model('foods').select();
		let orders = this.model('orders').where({date:{'>': start}}).select();
		let users = this.model('users').select();
		let user = this.session('userInfo');

		this.assign({
			foods: foods,
			orders: orders,
			users: users,
			user: user
		});
		return this.display();
	}

	/**
	 * 点餐
	 * @return {[type]} [description]
	 */
	async orderAction() {
		let param = this.post();

		var date = think.datetime(param.date);

		// 检测登录状态
		let user = await this.session('userInfo');
		if(!user){
			return this.fail(200,'未登录！');
		}
		// 每人每天只能点一次
		var start = new Date();
		start.setHours(0, 0, 0, 0);
		start = think.datetime(start);

		let orderModel = this.model('orders');
		let repeatOrder = await orderModel.where({user_id: user.id, date: {'>': start}}).count();
		if(repeatOrder > 0){
			return this.fail(100,'重复点餐！');
		}
		let data = orderModel.add({user_id: user.id,group_id: user.group,food_id: param.food,date: date});

		if(data ){
			return this.success();
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