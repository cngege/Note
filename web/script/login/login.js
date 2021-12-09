var code = {};
$.get("code.json",function(data,status){
  code = data;
})

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
    url: 'login',
    type: 'POST',
    dataType: 'json',
    data: {
      username: $("#username").val(),
      password: $("#password").val(),
      autologin: $("#autologin").is(":checked");
    },
    success:function(e){
      switch (e.code) {
        case expression:

          break;
        default:

      }
    },
    error: function (textStatus) {
      alert("错误["+textStatus.status+"]:"+textStatus.statusText);
    }
  })
});
