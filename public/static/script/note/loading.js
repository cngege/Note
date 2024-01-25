let loading = $(".loading");



//cookie set get
//$.cookie('a','b');
//alert($.cookie('a'));

//请求 key:type
//GetNoteData 进入网页的时候调用的  获取笔记数据，返回所有的笔记的分类和文件夹，
//每个文件夹下的分类 分类下的笔记列表，以及第一个文件夹下 第一个笔记的内容
//user
//返回用户名 用户头像链接（服务器中每个用户都有一个单独的文件夹），是否是管理员(不一定会做)
//


//如果加载动画没有消失
if(loading.css('display') != "none"){
  if(isAtom() || document.URL.indexOf("file://")==0){
    loading.css('display', 'none');
  }
}

$(document).ready(function () {
  //向服务器请求用户和笔记的数据，如果登录信息不对 则跳转到登录页面
  $.ajax({
    url: '/index/getUserInfo',
    type: 'POST',
    dataType: 'json',
    data: {},
    success:function(e){
      switch (e.code) {
        case 0:     //登录成功
          // 向一个公共变量存储我这个用户的数据
          $.User(e.user);

          // 函数1 将用户信息写入外部页面
          updateUserData();
          // 函数2 拿到uuid读取文件夹结构
          getNoteFolder($.User.getUuid());
          // TODO 获取笔记信息 并关掉加载div
          loading.css('display', 'none');
          break;
        case 1://未登录
          Toast.noLogin(e.goto);
          break;
        case 2://没有安装
          e.goto && goto(e.goto);
          break;
        default:
          Toast.error("错误",e.msg);
      }
    },
    error: function (jqXHR) {
      console.htmldebug(jqXHR);
    }
  })
});


function getNoteFolder($uuid){
  $.ajax({
    url: '/index/getNoteInfo',
    type: 'POST',
    dataType: 'json',
    data: {uuid: $uuid},
    success:function(e){
      switch (e.code) {
        case 0:     //成功
          break;
        case 1://未登录
          Toast.noLogin(e.goto);
          break;
        case 2://错误
          Toast.error("错误",e.msg);
          break;
      }
    },
    error: function (jqXHR) {
      console.htmldebug(jqXHR);
    }
  })
}



// 在表层更新用户信息到页面
function updateUserData(){

  $(".bardoing .logo .logoinside .Username span").text($.User.getName());
  $(".notetext .notetextbody .remark .remark-inputbox .remark-userimg img").attr("title",$.User.getName());
  // 设置头像
  $(".bardoing .logo .logoimgbox img").attr("src",$.User.getUserFace());
  $(".notetext .notetextbody .remark .remark-inputbox .remark-userimg img").attr("src",$.User.getUserFace());

  if($.User.getIsadmin()){
    $("#WebSetup").css('display','');
  }

  // 向账户管理处写入用户信息(这里本来不用的（应该在打开账户管理的时候写入）)，在开发阶段，先写进入// 或者就在这里写入
  //在账号设置里显示用户头像
  $("div.account_setup_box .account_setup .bodybar .body_account_setup .editface img").attr("src",$.User.getUserFace());
  //在账号设置里面填上邮箱
  $(".body_account_setup .account_setup_box .setup_email_box .emailtext").text($.User.getEmail() || "未设置")
  //在昵称输入框里填上昵称
  $(".body_account_setup .account_setup_box .setup_nickname_box .check_input_box .input_text_box input").val($.User.getName());
  $(".body_account_setup .account_setup_box .setup_nickname_box .check_input_box .input_text_box input").data("username", $.User.getName());
  //填充手机信息
  $(".body_account_setup .account_setup_box .setup_phone_box .phonetext").text($.User.getPhone() || "未设置");
  //设置注册时间文字
  let regtimeDate = (new Date($.User.getCreateTime()));
  let regtime = regtimeDate.getFullYear() + "/" + (regtimeDate.getMonth() + 1) + "/" + regtimeDate.getDate();
  $(".body_account_setup .account_setup_box .setup_regtime_box .regtimetext").text(regtime);


}
