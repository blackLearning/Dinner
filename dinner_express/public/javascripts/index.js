!(function(exports, Vue) {
	// 极简的markdown的编辑器
	exports.app = new Vue({
		el: '#markdown',

		data: {
			input: '# hello'
		}
	});

	Vue.filter('marked', function(value) {
		return value.trim();
	});


	/**
	 * ====================
	 * 表格渲染
	 * ====================
	 */

	// 全局注册组件(注册语法糖)
	Vue.component('child-table', {
		// 模版在Html中声明，利用id传递
		template: '#table-template',
		// 可以使用 props 传递父实例的模块的数据。
		props: {
			tableHead: Array,
			tableBody: Array
		}

	});


	var table = new Vue({
		el: '#table',

		data: {
			tableHead: ['name', 'age'],

			tableBody: [{
				name: '张三',
				age: 21
			}, {
				name: '李四',
				age: 22
			}, {
				name: '王五',
				age: 23
			}, {
				name: '二蛋',
				age: 24
			}]
		},
		created: function() {
			console.log(this.$children)
		}
	});

	/**
	 * =====================
	 * 树状图
	 * desc: (主要展示如何使用嵌套递归组件)
	 * =====================
	 */

	// 树状图数据
	var datas = {
		name: 'My Tree',
		children: [{
			name: 'hello'
		}, {
			name: 'wat'
		}, {
			name: 'child folder',
			children: [{
				name: 'child folder',
				children: [{
					name: 'hello'
				}, {
					name: 'wat'
				}]
			}, {
				name: 'hello'
			}, {
				name: 'wat'
			}, {
				name: 'child folder',
				children: [{
					name: 'hello'
				}, {
					name: 'wat'
				}]
			}]
		}]
	};
	// 定义组件
	Vue.component('item', {
		template: '#item-template',

		props: {
			model: Object
		},
		data: function() {
			return {
				open: false
			};
		},
		computed: {
			// 判断是否是文件
			isFolder: function() {
				return (this.model.children && this.model.children.length);
			}
		},
		methods: {
			// 切换展开状态
			toggle: function() {
				if (this.isFolder) {
					this.open = !this.open;
				}
			},
			changeType: function() {
				if (!this.isFolder) {
					Vue.set(this.model, 'children', []);
					this.addChild();
					this.open = true;
				}
			},
			// 新增子内容
			addChild: function() {
				this.model.children.push({
					name: 'new item'
				});
			}
		}
	});
	// 实例化父组件
	var treeList = new Vue({
		el: "#treeList",

		data: {
			treeData: datas
		}
	});

	/**
	 * ===================
	 * 	模态弹出层组件
	 * ===================
	 */
	
	// 注册模态组件
	Vue.component('modal', {
	 	template: '#modal-template',

	 	props: {
	 		show: {
	 			type: Boolean,
	 			twoWay: true,
	 			required: true
	 		} // 定义Props必须规定其属性。
	 	},
	 	methods: {
	 		hide: function() {
	 			this.show = false;
	 		}
	 	}
	});

	// 实例化父组件
	var modal = new Vue({
		el: '#modal',

		data: {
			showModal: false
		}
	});
})(window, Vue);