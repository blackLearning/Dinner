/**
 * Created by ch on 2016/1/28.
 */
(function(window, $) {
	$(function() {
		$('#login').click(function(e) {
			e.preventDefault();
			var userVal = $('#userName').val();
			var passVal = $('#password').val();
			if (!$.trim(userVal) || !$.trim(passVal)) {
				alert('请输入用户名和密码！');
				return false;
			} else {
				$.ajax({
					type: 'POST',
					cache: false,
					url: '/home/login/login',
					data: $('#loginForm').serialize(),
					error: function() {
						alert('登陆失败，请重试！');
					}
				}).done(function(results) {
					if (results.errno ==0) {
						location.href = '/';
						return;
					}else {
						alert('用户名或密码错误');
					}
				});
			}
		})
	})
})(window, jQuery);