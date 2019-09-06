var count = 0 ; //定义全局变量count来表示当前图片
function run(){
count++;
count = count ==5?0:count;
$('#flash img').eq(count).fadeIn(300).siblings('img').fadeOut(300); //利用eq来遍历img，并将count位图片显示，其他兄弟元素隐藏，fadeIN位淡入显示，fadeOut为淡出
$('#flash ul li').eq(count).css('background','#f40').siblings('li').css('background','#fff'); //同样利用遍历改变圆点的背景色
}
function reverserun(){
count--;
count = count == -1?4:count;
$('#flash img').eq(count).fadeIn(300).siblings('img').fadeOut(300);
$('#flash ul li').eq(count).css('background','#f40').siblings('li').css('background','#fff');
}
var timer = setInterval(run,4000); //设置定时器
$('#flash').hover(function(){ //设置鼠标移入移出事件
clearInterval(timer);
},function(){
timer = setInterval(run,4000);
})
$('#flash ul li').mouseenter(function(){ //设置移入圆点事件
count = $(this).index();
count = count ==5?0:count;
$('#flash img').eq(count).fadeIn(300).siblings('img').fadeOut(300);
$('#flash ul li').eq(count).css('background','#f40').siblings('li').css('background','#fff');
})
$('#flash .right').click(function(){ //设置右键按钮点击事件
run();
})
$('#flash .left').click(function(){ //设置左键按钮点击事件
reverserun();
})