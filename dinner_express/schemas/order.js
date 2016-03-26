var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var OrderSchema = new Schema({
	date: {
		type: Date,
		default: new Date()
	},
	food: {
		type: ObjectId,
		ref: 'Food'
	},
	user: {
		type: ObjectId,
		ref: 'User'
	},
	group: {
		type: ObjectId,
		ref: 'Group'
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updataAt: {
			type: Date,
			default: Date.now()
		}
	}
});

OrderSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updataAt = Date.now();
	} else {
		this.meta.updataAt = Date.now();
	}
	next();
});

// 静态方法,静态方法在Model层就能使用
OrderSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},

	findById: function(id, cb) {
		return this
			.findOne({
				_id: id
			})
			.exec(cb);
	}
};

module.exports = OrderSchema;