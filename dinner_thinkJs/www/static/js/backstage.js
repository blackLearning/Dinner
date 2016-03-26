/**
 * Created by ch on 2016/1/28.
 */
(function(exports, $) {
    $(function() {
        // 导航选项卡
        $('#navBar li').click(function() {
            $(this)
                .addClass('active')
                .siblings()
                .removeClass();
            var index = $('#navBar li').index($(this));
            $('#mainRight>div')
                .eq(index)
                .show()
                .siblings()
                .hide();
        });

        // 帐号管理选项卡
        $('#accountsTitle li').click(function() {
            $(this).addClass('active').siblings().removeClass();
            var index = $('#accountsTitle li').index($(this));
            $('#accountsManage>div').eq(index).show().siblings('div').hide();
        });

        var $addNew = $('#addNew'),
            $foodName = $('#foodName'),
            $foodDesc = $('#foodDesc'),
            $newGroup = $('#newGroup'),
            $newfood = $('#newFood'),
            $newGroupName = $('#newGroupName'),
            $foodsTable = $('#foodsTable'),
            $GroupTable = $('#GroupTable');
        // 新增菜品浮层显示
        $('#addNewFood').click(function() {
            $foodName.val('');
            $foodDesc.val('');
            $addNew.show();
            $newGroup.hide();
            $newfood.show();
        });
        // 新增小组浮层显示
        $('#addNewGroup').click(function() {
            $newGroupName.val('');
            $addNew.show();
            $newGroup.show();
            $newfood.hide();
        });
        // 取消新增
        $('#closeItem').click(function() {
            $addNew.hide();
        });
        $('#closeGroupItem').click(function() {
            $addNew.hide();
        });
        
        // 删除菜品
        $foodsTable.on('click', '.deleteFood', function(e) {

            var $this = $(this);
            var target = $(e.target);
            var id = target.data('id');

            $.ajax({
                type: 'get',
                url: '/home/backstage/deletefood?id=' + id
            })
            .done(function(results) {
                console.log(results)
                if (results.data.success) {
                    $this.closest('tr').remove();
                }
            });
            
        });

        // 编辑菜品
        $foodsTable.on('click', '.editFood', function() {
            var $this = $(this);
            var foodDesc = $this.parent().prev().text();
            var foodName = $this.parent().prev().prev().text();

            var $tr = $this.closest('tr');
            $tr.addClass('editing');
            $tr.find('.foodDesc-input').val(foodDesc);
            $tr.find('.foodName-input').val(foodName);
        });

        $foodsTable.on('blur', 'input', function(e) {
            var $target = $(e.target);
            var $tr = $target.closest('tr');
            var oldName;
            var oldDesc;
            if($target.hasClass('foodName-input')){
                oldName = $target.prev().text();
            }
            if($target.hasClass('foodDesc-input')){
                oldDesc = $target.prev().text();
            }

            var NameVal = $tr.find('.foodName-input').val();
            var DescVal = $tr.find('.foodDesc-input').val();
            var id = $target.data('id');

            if(oldName === NameVal || oldDesc === DescVal){
                $target.closest('tr').removeClass('editing');
                return;
            }else {
                $.post('/home/backstage/editfood/', {
                    id: id,
                    name: NameVal,
                    desc: DescVal
                }, function() {
                    console.log('更新食物成功！');
                    $target.prev().text($target.val());
                });

                $target.closest('tr').removeClass('editing');
            }
        });


        // 新增账号
        $('#addNewAccount').click(function(e) {
            e.preventDefault();

            var newAccount = $('#newAccount').val();
            var newName = $('#newName').val();
            var newAddGroup = $('#newAddGroup').val();
            var originPassword = $('#originPassword').val();

            if (!$.trim(newAccount) || !$.trim(newName) || !$.trim(newAddGroup) || !$.trim(originPassword)) {
                alert('请填写完整信息！');
                return;
            }
            $.ajax({
                type: 'POST',
                url: '/home/backstage/adduser',
                data: $('#addNewForm').serialize(),
                error: function() {
                    alert('新增用户失败，请重试！');
                }
            }).done(function(results) {
                console.log(results)
                if (results.errno == 100) {
                    alert(results.errmsg );
                } else {
                    alert('新增用户成功！');
                }
            });
        });

        // 删除账号
        $('#deleteUser').click(function(e) {
            e.preventDefault();
            var delName = $('#deleteName').val();

            if(!$.trim(delName)) {
                alert('请输入用户名!');
                return;
            }
            $.ajax({
                type: 'get',
                url: '/home/backstage/deleteuser?name=' + delName
            })
            .done(function(results) {
                if (results.data.success) {
                    alert('删除账号成功！');
                }else if(!results.data.success){
                    alert('用户不存在！');
                }
            });
        });

        // 更新密码
        $('#updatePassword').click(function(e) {
            e.preventDefault();
            var updateName = $('#updateName').val();
            var newPassword = $('#newPassword').val();
            var newAgainPassword = $('#newAgainPassword').val();

            if (!$.trim(updateName) || !$.trim(newPassword) || !$.trim(newAgainPassword)) {
                alert('请填写完整信息！');
                return;
            } else if (newPassword !== newAgainPassword) {
                alert('两次密码输入不一致!');
                return;
            }

            $.ajax({
                type: 'POST',
                url: '/home/backstage/editpwd',
                data: {
                    name: updateName,
                    password: newPassword
                }
            })
            .done(function(results) {
                if (results.errno == 0) {
                    alert('更新密码成功!');
                } else {
                    alert('找不到该用户！');
                }
            });  
        });

        // 分组修改
        $('#reviseGroup').click(function(e) {
            e.preventDefault();

            var selectGroup = $('#selectGroup').val();
            var reviseGroupName = $('#reviseGroupName').val();

            console.log(selectGroup)
            console.log(reviseGroupName)
            if (!$.trim(reviseGroupName) || !$.trim(selectGroup) ) {
                alert('请填写完整信息！');
                return;
            }
            $.ajax({
                type: 'POST',
                data: $('#reviseGroupForm').serialize(),
                url: '/home/backstage/editusergroup'
            }).done(function(results) {
                if (results.errno == 0) {
                    alert('更改分组成功!');
                } else if(results.errno == 100){
                    alert('找不到该用户或请选择新的组别！');
                }
            });  
        });

        // 新增小组
        $('#confirmNew').click(function(ev) {
            ev.preventDefault();
            var newGroupName = $newGroupName.val();
            if (!$.trim(newGroupName)) {
                alert('请输入小组名称！');
                return;
            }
            $.ajax({
                type: 'POST',
                url: '/home/backstage/addgroup',
                data: $('#newGroupForm').serialize()
            }).done(function(results) {
                if (results) {
                    location.reload();
                }
            });
            $addNew.hide();
        });

        // 删除小组
        $GroupTable.on('click', '.delete-group', function(e) {

            var $target = $(e.target);
            var id = $target.data('id');
            if ($.trim($target.parent().prev().text())) {
                alert('不能删除仍有成员的小组！');
                return;
            } else {
                $.ajax({
                    type: 'get',
                    url: '/home/backstage/deletegroup?id=' + id
                })
                .done(function(results) {
                    if (results.data.success) {
                        $target.closest('tr').remove();
                    }
                });
            }
        });


        // 编辑小组
        $GroupTable.on('click', '.edit-group', function() {

            var $this = $(this);
            var $tr = $this.closest('tr');
            var $reviseGroup = $tr.find('.reviseGroup');
            var groupName = $reviseGroup.prev().text();

            $tr.addClass('editing');
            $reviseGroup.focus().val(groupName);
            
        });

        $GroupTable.on('blur', '.reviseGroup', function(e) {
            var $this = $(this);

            var $target = $(e.target);
            var newGroupName = $target.val();
            var oldGroupName = $target.prev().text();
            var id = $target.data('id');
            if(oldGroupName === newGroupName){
                $this.closest('tr').removeClass('editing');
                return;
            }
            $.post('/home/backstage/editgroup', {
                name: newGroupName,
                id: id
            }, function(results) {
                if(results){
                    console.log('修改小组名称成功！',results);
                    $this.prev().text(newGroupName);
                }
            });

            $this.closest('tr').removeClass('editing');
        });

        // 退出登录
        $('#exit').click(function(e) {
            e.preventDefault();
            $.get('/home/backstage/logout', function() {
                location.href = '/login';
            });
        });
    });
})(window, jQuery);