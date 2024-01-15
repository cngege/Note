
// 点击安装按钮
$(".install_box .installbtnbox .installbtn").click(function(event) {
  /* Act on the event */
  if($(".install .must").css("display") != "none"){
    $(".install .must").css("display","none");
    $(".install .unmust").show();
    return;
  }

  $(".install_box .callmsg p").html("");
  $(".install_box .installbtnbox .installbtn").attr("disabled","disabled");
  $.ajax({
    url: "/Install/install",
    type: 'POST',
    data: {
      sqladdr:$("#sqladdr").val(),
      sqlport:$("#sqlport").val(),
      sqluser:$("#sqlusername").val(),
      sqlpasswd:$("#sqlpassword").val(),
      sqldb:$("#sqldb").val(),
      datasave:$("#datasave").val(),
      adminuser:$("#username").val(),
      adminpasswd:$("#password").val()
    },
    //timeout: 500,
    success:function(ve){
      switch (ve.code) {
        case 2:     //已经安装过了
          $(".install_box .callmsg p").html(ve.msg);
          $(".install_box .installbtnbox .installbtn").attr("disabled","");
          setTimeout(function () {
            // TODO: 跳转到登录后页面(主页)
            goto(ve.goto);
          }, 2000);
          break;
        case 0:              //请求任务成功 这里指安装成功
          $(".install_box .callmsg p").html(ve.msg);
          $(".install_box .installbtnbox .installbtn").attr("disabled","");
          setTimeout(function () {
            // TODO: 跳转到登录后页面
            goto(ve.goto);
          }, 2000);
          break;
        case 1:
          $(".install_box .callmsg p").html("错误:"+ve.msg);
          $(".install_box .installbtnbox .installbtn").attr("disabled","");
          setTimeout(function(){
              $(".install_box .installbtnbox .installbtn").removeAttr("disabled");
          },2000);
          break;
        default:
          $(".install_box .installbtnbox .installbtn").removeAttr("disabled");
          $(".install_box .callmsg p").html(ve.msg);
          $(".install .must").show();
          $(".install .unmust").hide();
      }
    },
    error: function (textStatus) {
      $(".install_box .installbtnbox .installbtn").removeAttr("disabled");
      $(".install_box .callmsg p").html("错误["+textStatus.status+"]:"+textStatus.statusText);
    },
  })
});

/*
code:
0. 成功
1. 失败
2. 已安装
*/
