var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	// role==0 normal user
	// role>10 admin
	role: {
		type: Number,
		default: 0
	},
	// 组别和用户双向映射
	group: {
		type: ObjectId,
		ref: 'Group'
	},
	chinesename: String,
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
// 实例方法,
// 检查加强密码是否正确密码
UserSchema.methods.comparePassword = function(_password, cb){
	bcrypt.compare(_password, this.password, function(err, isMatch){
		if(err) return cb(err);
		cb(null, isMatch);
	});
};


UserSchema.pre('save', function(next) {
	var user = this;
	if (this.isNew) {
		this.meta.createAt = this.meta.updataAt = Date.now();
	} else {
		this.meta.updataAt = Date.now();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, null, null, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

// 静态方法,静态方法在Model层就能使用
UserSchema.statics = {
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

module.exports = UserSchema;