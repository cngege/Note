
//头像旁用户名下拉箭头被点击 显示菜单
$(".bardoing .Username i").click(function(event) {
  /* Act on the event */
  $(".bardoing .Username .setupselect").css('display', 'inline');
});

//USER SETUP页面其他地方被点击 则关闭显示
$(".bardoing .Username .setupselect .selectback").click(function(event) {
  /* Act on the event */
  $(".bardoing .Username .setupselect").css('display', 'none');
});

//账户设置按钮被点击
$(".bardoing .Username .setupselect ul #UserSetup").click(function(event) {
  /* Act on the event */
  //alert("账户设置");
});

//退出登录按钮被点击
$(".bardoing .Username .setupselect ul #Logout").click(function(event) {
  /* Act on the event */
  //alert("退出登录");
});


//笔记详情页
//搜索框 获取焦点时修改样式效果
$(".notelist .search .search2 .inputbox input").focus(function(){
    $(".notelist .search .search2").css('background-color','white');
}).blur(function(){
    $(".notelist .search .search2").css('background-color','transparent');
});

//鼠标悬浮时 修改样式效果
$(".notelist .search .search2 .inputbox input").hover(function(){
    $(".notelist .search .search2").css('background-color','white');
},function(){
    if(!$(this).is(":focus")) //该输入框是否获取到了焦点
      $(".notelist .search .search2").css('background-color','transparent');
});

//鼠标悬浮到标题列表时 显示分享和删除按钮
$(".notelist ul li .noteTitleBox").hover(function(){
    $(this).find(".shareanddel").css("display","flex");
    $(this).find(".noteTitleText p").css("width","70%");
},function(){
    $(this).find(".shareanddel").css("display","none");
    $(this).find(".noteTitleText p").css("width","100%");
});

//笔记内容可编辑页
//笔记设置下拉框点击弹出菜单
$(".notetext header .titlebtn .notecontrolbtn .notemorebtn button").click(function(event) {
  /* Act on the event */
  //1. 弹出菜单
  $('.notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfoform').show();//那么就显示div
  //$(".notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfoform").css("display","inline");
  //2. 重新修改下拉菜单的位置
$(".notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfosetup").css("top",$(this).offset().top+$(this).outerHeight()+"px")

});

//笔记设置下拉框点击外围消失
$(".notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfoform .close").click(function(event) {
  /* Act on the event */
  $('.notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfoform').hide();//就隐藏div
  //$(".notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfoform").css("display","none");
});
