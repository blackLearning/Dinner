
/**
 * 弹出层
 * @param {string} maskId 遮罩层ID
 * @param {string} boxId  弹出层ID
 */
function Login(maskId, boxId) {

	this.login = document.getElementById(boxId);
	this.mask = document.getElementById(maskId);
	this.close = document.getElementById("close");
	this.info = document.getElementById('info');
	this.button();

}
Login.prototype = {



	//登录框和弹出层的位置
	autoCenter: function() {

		//弹出层
		this.mask.style.width = parseInt(document.documentElement.clientWidth) + "px";
		this.mask.style.height = parseInt(document.documentElement.clientHeight) + "px";

		//登录框
		var w = this.login.offsetWidth;
		var h = this.login.offsetHeight;
		this.login.style.left = parseInt((document.documentElement.clientWidth - w) / 2) + "px";
		this.login.style.top = parseInt((document.documentElement.clientHeight - h) / 2) + "px";

	},

	// 按钮事件
	button: function() {
		var that = this;
		this.close.onclick = function() {
			that.login.style.display = "none";
			that.mask.style.display = "none";
		}
		window.onresize = function() {
			that.autoCenter();
		}
	},
	show: function(text) {
		this.info.innerHTML = text;
		this.login.style.display = "block";
		this.mask.style.display = "block";
		this.autoCenter();
	}
};