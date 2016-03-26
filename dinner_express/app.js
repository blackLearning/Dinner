/**
 * =================
 *  入口文件
 * =================
 */
// 模块引入
var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var Food = require('./models/food');
var User = require('./models/user');
var Group = require('./models/group');
var Order = require('./models/order');
var _ = require('underscore');
// 静态资源路径请求
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// 搭建服务器
var app = express();
// 利用PORT=4000 node app 启动服务器可以充值端口号
var port = process.env.PORT || 3000;
app.locals.moment = require('moment');
// 链接数据库
var dbUrl = 'mongodb://localhost/Foods';
var db = mongoose.connect(dbUrl);
db.connection.on('open', function() {
	console.log('数据库连接成功');
});
// 设置视图的根目录
app.set('views', './views');
// 设置模板
app.engine('html', ejs.__express);
app.set('view engine', 'html');
// 引入静态资源路径
app.use(express.static(path.join(__dirname, '/public')));
// 表单数据格式化
app.use(bodyParser({uploadDir: './public/images'}));
app.use(cookieParser());
// 文件上传
var multer = require('multer');
var upload = multer({dest: './public/images'});
// 浏览器和服务器会话状态
app.use(session({
	secret: 'Foods',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: true
}));

app.use(function(req, res, next) {
	var _user = req.session.user;
	// 把用户状态放入本地，这样就不用在每个页面用render传进去
	app.locals.user = _user;
	return next();
});


// 设置路由
// 主页
app.get('/', function(req, res) {
	// 从数据库中拉取foods数据，并渲染到html中
	// console.log('user in session:');
	// console.log(req.session.user);
	
	var start = new Date();
	start.setHours(0, 0, 0, 0);
	Order
		.find({date: {$gt: start}})
		// 用user的chinesename代替order中的user
		.populate('user', 'chinesename')
		.exec(function(err, orders){
			Food.fetch(function(err, foods) {
				if (err) {
					console.log(err);
				}
				res.render('ordermeal', {
					title: '加班点点餐',
					foods: foods,
					orders: orders
				});
			});
		});
});
// 登录页
app.get('/login', function(req, res) {

	res.render('login', {
		title: '登陆'
	});
});
// 后台管理页
app.get('/backstage', function(req, res) {
	var user = req.session.user;
	if (user && (user.role > 10)) {
		var start = new Date();
		start.setHours(0, 0, 0, 0);
		Order
		.find({date: {$gt: start}})
		// 用user的chinesename代替order中的user
		.populate('user', 'chinesename')
		.populate('group', 'name')
		.populate('food', 'name')
		.exec(function(err, orders){
			User.find({}, function(err, users){
				Group.fetch(function(err, groups) {
					Food.fetch(function(err, foods) {
						res.render('backstage', {
							title: '后台管理',
							foods: foods,
							groups: groups,
							users: users,
							orders: orders
						});
					});
				});
			});
		});
	} else {
		res.redirect('/login');
	}
});
var type = upload.single('uploadposter');
// 逻辑控制:新增菜品
app.post('/admin/control/newfood', type, function(req, res, next) {

	var posterData = req.file;
	var filePath;
	var originalname;
	if(posterData) {
		filePath = posterData.path;
		originalname = posterData.originalname;
	}
	if (originalname) {
		fs.readFile(filePath, function(err, data) {
			var timestamp = Date.now();
			var type = posterData.mimetype.split('/')[1];
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname, '', '/public/images/' + poster);

			fs.writeFile(newPath, data, function(err) {
				req.poster = poster;
				next();
			});
		});
	}else {
		next();
	}
},function(req, res) {
	var _food;

	_food = new Food({
		name: req.body.food.name,
		desc: req.body.food.desc,
		poster: req.poster
	});

	_food.save(function(err, food) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/backstage');
		}
	});
});
// 逻辑控制:更新菜品
app.post('/admin/control/updatefood/:id', function(req, res) {
	var id = req.params.id;

	if (id) {
		Food.update({
			_id: id
		}, {
			$set: {
				name: req.body.name,
				desc: req.body.desc
			}
		}, function(err) {
			if (err) {
				console.log(err);
			} else {
				res.json({
					success: true
				});
			}
		});
	}


});

// 逻辑控制:删除菜品
app.delete('/admin/control/deletefood', function(req, res) {
	var id = req.query.id;

	if (id) {
		Food.remove({
			_id: id
		}, function(err, movie) {
			if (err) {
				console.log(err);
			} else {
				Order.remove({food: id},function(err, foods){
					res.json({
						success: true
					});
				});
			}
		});
	}
});

// 添加用户
app.post('/user/signup', function(req, res) {
	var _user = req.body.user;
	// 避免重复添加相同的用户

	User.findOne({
		name: _user.name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (user) {
			res.json({
				success: false
			});
		} else {
			var user = new User(_user);
			var groupId = _user.group;
			user.save(function(err, food) {
				if (err) {
					console.log(err);
				} else {
					console.log(user);
					// 新增用户时在对应小组中的成员中新增该用户。
					Group.findById(groupId, function(err, group) {
						console.log(group);
						group.members.push(user._id);
						group.save(function(err){});
					});

					res.json({
						success: true
					});
				}
			});
		}
	});
});

// 删除用户
app.delete('/user/delete', function(req,res) {
	var name = req.query.name;

	if (name) {
		User.findOne({name: name}, function(err, user) {
			if (err) {
				console.log(err);
			}
			if (!user) {
				res.json({
					success: false
				});
			} else {
				var groupId = user.group;
				var userId = user._id;
				User.remove({name: name}, function(err, user) {
					if (err) {
						console.log(err);
					} else {
						// 删除用户时在对应小组中的成员中删除该用户。
						Group.findById(groupId, function(err, group) {
							console.log(group);

							var index = group.members.indexOf(userId);
							if (index > -1) {
								group.members.splice(index, 1);
								group.save(function(err){});
							}
						});


						Order.remove({user: userId},function(err, user){});
						
						res.json({
							success: true
						});
					}
				});
			}
		});
		
	}
});
// 修改分组
app.post('/user/revisegroup', function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var newGroup = _user.group;
	console.log(newGroup);
	if (name) {
		User.findOne({
			name: name
		}, function(err, user) {
			if (err) {
				console.log(err);
			}
			// 没找到该用户
			if (!user) {
				res.json({
					success: false
				});
				return;
			} else {
				
				var groupId = user.group; // 原分组_id
				// 更新分组的成员
				var groupId = user.group;
				var userId = user._id;
				// 删除原分组中的成员
				Group.findById(groupId, function(err, group) {
					var index = group.members.indexOf(userId);
					console.log(index)
					console.log(group)
					if (index > -1) {
						group.members.splice(index, 1);
						group.save(function(err){});
					}
				});
				// 在现在分组中添加成员
				Group.findById(newGroup, function(err, group) {
					group.members.push(userId);
					group.save(function(err){});
				});
				// 更新成员的分组
				user.group = newGroup;  // 现分组_id
				user.save(function(err){});
				res.json({
					success: true
				});
			}
		});
	}
})

// 修改密码
app.post('/user/updatepassword', function(req, res) {
	var name = req.body.name;
	var newPassword = req.body.password;

	if (name) {
		User.findOne({
			name: name
		}, function(err, user) {
			if (err) {
				console.log(err);
			}
			if (!user) {
				res.json({
					success: false
				});
				return;
			} else {
				user.password = newPassword;
				user.save(function(err){});
				res.json({
					success: true
				});
			}
		});
	}
});




// 登陆
app.post('/user/signin', function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({
		name: name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			res.json({
				failType: 'noUser'
			});
		} else {
			user.comparePassword(password, function(err, isMatch) {
				if (err) {
					console.log(err);
				}
				if (isMatch) {
					console.log('matched!');
					// 保存用户登陆状态到会话中
					req.session.user = user;

					res.json({
						success: true
					});
					// 服务端使用redirect('/')时，302错误不发生跳转，不知道为什么啊，使用客服端location.href跳转到点餐页
					// return res.redirect('/');
				} else {
					res.json({
						failType: 'wrongPassword'
					});
				}
			});
		}
	});
});

// 退出登录 
app.get('/user/logout', function(req, res) {
	// 删除会话中的用户状态
	delete req.session.user;
	res.json({
		logout: true
	});
});

// 新增分组

app.post('/groups/new', function(req, res) {
	var _group = req.body.group;
	var group = new Group(_group);
	group.save(function(err, group) {
		if (err) {
			console.log(err);
		}
		res.json({
			success: true
		});
	});
});

// 删除小组
app.delete('/groups/delete', function(req, res) {
	var id = req.query.id;

	if (id) {
		Group.remove({
			_id: id
		}, function(err, movie) {
			if (err) {
				console.log(err);
			} else {
				Order.remove({group: id},function(err, group){
					
				});
				res.json({
					success: true
				});
			}
		});
	}
});


// 更新小组名称
app.post('/groups/update/:id', function(req, res) {
	var id = req.params.id;

	if (id) {
		Group.update({
			_id: id
		}, {
			$set: {
				name: req.body.name
			}
		}, function(err) {
			if (err) {
				console.log(err);
			} else {
				res.json({
					success: true
				});
			}
		});
	}
});



// 点餐(添加订单)
app.post('/user/order', function(req, res) {
	var order = {};
	var user = req.session.user;

	// 未登录
	if(!user) {
		res.json({
			success: false
		});
		return;
	} 
	// 每人每天只能点一次
	var start = new Date();
	start.setHours(0, 0, 0, 0);
	Order.find({user: user._id, date: {$gt: start}}, function(err, orders){
		if(err){
			console.log(err);
		}
		if (orders.length) {
			res.json({
				success: 'repeat'
			});
		}else {
			order.user = user._id;
			order.group = user.group;
			order.food = req.body.food;
			order.date = req.body.date;

			var _order = new Order(order);
			// 点餐成功，保存订单
			_order.save(function(err, order) {
				if(err){
					console.log(err);
				}
				res.json({
					success: true
				});
			});
		}
	});
});



// 监听接口
app.listen(port);
console.log('server started on port: ' + port);