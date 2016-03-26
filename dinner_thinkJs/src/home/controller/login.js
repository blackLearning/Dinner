'use strict';

import Base from './base.js';

export default class extends Base {
	/**
	 * index action
	 * @return {Promise} []
	 */
	async indexAction() {
		return this.display('login');
	}


	/**
	 * 登录
	 * @return {[type]} [description]
	 */
	async loginAction() {
		let param = this.post();
		var userModel = this.model('users');
		let user = await userModel.where({ name: param.name, _complex:{password: param.password}}).find();

		if(!think.isEmpty(user)) {
			await this.session("userInfo", user);
			return this.success();
		} else {
			return this.fail(100,'wrong');
		}
	}


	
}