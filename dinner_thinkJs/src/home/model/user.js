'use strict';
/**
 * model
 */
export default class extends think.model.mongo {
	init(...args){
	    super.init(...args);
	    //设置字段
	    this.schema = {
	      	name: {
	        	type: "string"
	      	},
	      	password: {
	        	type: "string"
	      	},
	      	role: {
	      		type: "number"
	      	}
	    };
	}
}