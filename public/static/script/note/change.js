
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
  $(".bardoing .Username .setupselect").css('display', 'none');
  $("div.account_setup_box").css("display","inline");
});

//退出登录按钮被点击
$(".bardoing .Username .setupselect ul #Logout").click(function(event) {
  /* Act on the event */
  //alert("退出登录");
  $(".bardoing .Username .setupselect").css('display', 'none');
  $.post('/Index/logout',{}, function(data, textStatus, xhr) {
    /*optional stuff to do after success */
    if(data.code == 0){
      goto(data.goto);
    }
  });
});

// 账号设置 -昵称 里面的对勾和叉在输入框获取失去焦点时显示隐藏
$(".body_account_setup .account_setup_box .setup_nickname_box .check_input_box .input_text_box input").focus(function(event) {
  /* Act on the event */
  $(".body_account_setup .account_setup_box .setup_nickname_box .check_input_box .input_yesorno_box").show();
});
$(".body_account_setup .account_setup_box .setup_nickname_box .check_input_box .input_text_box input").blur(function(event) {
  /* Act on the event */
  setTimeout(()=>{
    $(".body_account_setup .account_setup_box .setup_nickname_box .check_input_box .input_yesorno_box").hide();
  },100)

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


/* 账号设置区域 */
// 点击按钮 切换到当前页
$("div.account_setup_box .optionbar .optionbar_padd ul .select_account_setup").click(function(event) {
  /* Act on the event */
  if(!$(this).hasClass('selected')){
    $(this).addClass('selected');
    $("div.account_setup_box .optionbar .optionbar_padd ul .select_account_setup").removeClass('selected')



  }
});

/* 账号设置 切换 */
$("div.account_setup_box .optionbar .optionbar_padd ul div.List").click(function(event) {
  /* 先将右边的内容全都隐藏 */
  $("div.account_setup_box .account_setup .bodybar").children("div").each(function(index, el) {
    if(!$(el).hasClass('hide')){
      $(el).addClass('hide');
    }
  });
  /* 将左边的列表都取消选择 */
  var current = this;
  $("div.account_setup_box .optionbar .optionbar_padd ul div.List").each(function(index, el) {
    if($(el).hasClass('selected')){
      $(el).removeClass('selected');
    }
    if(el == current){
      $($("div.account_setup_box .account_setup .bodybar").children("div")[index]).removeClass('hide')
    }
  });
  /* 选择当前的选项 */
  $(this).addClass('selected');
});

// 和 账户设置窗口有关的动态交互
$("#account_close").click(function(event) {
  /* 关闭 */
  $("div.account_setup_box").css("display","none");
});


// 点击上传头像部分时，将点击传递到 input中
$("div.account_setup_box .account_setup .bodybar .body_account_setup .editface .uploadface").click(function(event) {
  /* Act on the event */
  $("div.account_setup_box .account_setup .bodybar .body_account_setup .editface input").click();
});

// 用户选择了头像文件之后
$("div.account_setup_box .account_setup .bodybar .body_account_setup .editface input").change(function(event) {
  /* Act on the event */
  /* Act on the event */
  var formData = new FormData();
  formData.append("userface",$(this)[0].files[0]);
  $.ajax({
    url: "/User/updateFace",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      // 在这里处理上传成功后的逻辑，例如显示成功消息等。
      console.httpdebug(response);
      if(response.code == 0){
        if(response.updataUrl){
          $(".bardoing .logo .logoimgbox img").attr("src",response.updataUrl);
          $(".notetext .notetextbody .remark .remark-inputbox .remark-userimg img").attr("src",response.updataUrl);
          $("div.account_setup_box .account_setup .bodybar .body_account_setup .editface img").attr("src",response.updataUrl);
        }
        Toast.success("成功",response.msg);
      }
      else if(response.code == 1){
        Toast.noLogin(response.goto);
      }
      else if(response.code == 2){
        Toast.error("错误",response.msg);
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      // 在这里处理上传失败的情况。
      Toast.error("上传失败","服务器网络不可达");
    }
  })
});
