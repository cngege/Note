
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
  $.ajax({  //告诉服务器离线下载
    url: "install",
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
        case code.Install.AlreadyInstalled:     //已经安装过了
          $(".install_box .callmsg p").html(ve.msg);
          $(".install_box .installbtnbox .installbtn").attr("disabled","");
          setTimeout(function () {
            // TODO: 跳转到登录后页面(主页)
            window.location.href = "index.html";
          }, 2000);
          break;
        case code.Install.Success:              //请求任务成功 这里指安装成功
          $(".install_box .callmsg p").html(ve.msg);
          $(".install_box .installbtnbox .installbtn").attr("disabled","");
          setTimeout(function () {
            // TODO: 跳转到登录后页面
            window.location.href = "login.html";
          }, 2000);
          break;
        case code.Install.ConnectSqlError:
          $(".install_box .callmsg p").html("连接数据库出错:"+ve.msg);
          $(".install_box .installbtnbox .installbtn").attr("disabled","");
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
0. 未知错误
1. 成功
2. 参数不全
3. 已安装过了
4. 错误 某扩展未安装
*/
