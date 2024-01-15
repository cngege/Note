//除了输入框 其他的一律禁止右键事件
oncontextmenu=(e)=>{
  //参数传进来的是鼠标位置 e.x
  //console.log(window.event.explicitOriginalTarget);
  let id = window.event.explicitOriginalTarget.id;
  let classname = window.event.explicitOriginalTarget.className;
  let localname = window.event.explicitOriginalTarget.localName;
  if(localname != "input"){
    window.event.returnValue=false;
    return false;
  }
}

//点击登录按钮
$(".loginbtnbox .loginbtn").click(function(event) {
  /* Act on the event */
  $.ajax({
    url: '/Login/login',
    type: 'POST',
    dataType: 'json',
    data: {
      username: $("#username").val(),
      password: $("#password").val(),
      autologin: $("#autologin").is(":checked")
    },
    success:function(e){
      switch (e.code) {
        case 0://登录成功
          if(e.msg) alert(e.msg);
          e.goto && goto(e.goto);
          break;
        case 1://已登录
          e.goto && goto(e.goto);
          break;
        case 2:
          alert(e.msg);
          break;
        default:
          alert("错误:["+ e.msg +"]");
      }
    },
    error: function (textStatus) {
      alert("错误["+textStatus.status+"]:"+textStatus.statusText);
    }
  })
});

/* 点击 去创建 创建账号 */
$(".regtitle a").click(function(event) {
  /* Act on the event */
  $(".login").hide();
  $(".register").show();
  return false;
});



$(".register .register2 .registerbtnbox .regbtn").click(function(event) {
  /* Act on the event */
  //注册按钮
  let email = $("#regusername").val();
  let password = $("#regpassword").val();
  if(!email){
    return Toast.error("邮箱不能为空");
  }
  if(!password){
    return Toast.error("密码不能为空");
  }
  $.post('/Login/registeremail', {
    regEmail: email,
    regPassword: password
  }, function(data, textStatus, xhr) {
    /*optional stuff to do after success */
    if(data.code == 0){
      Toast.success("成功",data.msg || "完成",function(){
        data.goto && goto(data.goto);
      })
    }
    else if(data.code == 1){
      Toast.error("失败",data.msg || "错误");
    }
  });
});
