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
					url: '/user/signin',
					data: $('#loginForm').serialize(),
					error: function() {
						alert('登陆失败，请重试！');
					}
				}).done(function(results) {
					if (results.success) {
						location.href = '/';
						return;
					}
					var failType = results.failType;
					if (failType === 'noUser') {
						alert('用户名不存在!');
					} else if (failType === 'wrongPassword') {
						alert('登陆密码错误，请重新输入！');
					}
				});
			}
		})
	})
})(window, jQuery);