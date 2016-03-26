/**
 * Created by ch on 2016/1/28.
 */
(function(window, $){
    $(function(){

        var food = '',
            $foodPic = $('.food-pic'),
            alertInfo = new Login('mask', 'alert');

        // 点餐浮层的显示
        $foodPic.click(function(){
            $foodPic.find('i').hide();
            $(this).find('i').show();
            food = $(this).next().data('id');
        });

        
        // 点餐条件的判断
        $('#submit').click(function() {
            // 是否选择加班餐判断
            if(!food){
                alertInfo.show('请选择加班餐种类！');
                return;
            }
            // 点餐时间判断
            var date = new Date();
            if(date.getHours() > 23){
                alertInfo.show('点餐时间已过，下次请在下午6点之前点餐哦！');
                return;
            }
            $.post('/home/index/order', {food: food, date: new Date()}, function(results) {
                if(results.errno === 0) {
                    alertInfo.show('点餐成功,请耐心等待吧！'); 
                } else if( results.errno === 100){
                    // 每天只能点一次
                    alertInfo.show('每人每天只能点一次哦！');
                }else if( results.errno === 200){
                    // 未登录
                    location.href = '/login';
                }    
            });
            
        });

        // 退出登录
        $('#exit').click(function(e) {
            e.preventDefault();
            $.get('home/index/logout', function() {
                location.reload();
            });
        });
    });
})(window, jQuery);