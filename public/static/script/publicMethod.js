
//跳转到其他页面
window.goto = function(html){
  if(html != null && html != "" && html != undefined){
      window.location.href=html;
  }
}

//判断是否在Atom编辑器中运行
window.isAtom = function(){
  return (navigator.userAgent.indexOf("Atom") > -1);
}


// toast

window.Toast = {
  show : function($text, $fun = null){
    $.toast({
      text: $text,
      afterHidden: $fun
    });
  },
  noLogin:function($goto,$msg = null){
    $.toast({
      text: $msg || "没有登陆,正在跳转...",
      afterHidden:function(){
        $goto && goto($goto);
      }
    });
  },
  success:function($title,$test,$fun = null){
    if(!$title) return ($fun && $fun());
    $.toast({
      heading: $title,
      text: $test,
      showHideTransition: 'slide',
      icon: 'success',
      afterHidden: $fun
    })
  },
  error:function($title,$test,$fun = null){
    if(!$title) return ($fun && $fun());
    $.toast({
        heading: $title,
        text: $test,
        showHideTransition: 'fade',
        icon: 'error',
        afterHidden: $fun
    })
  }
}

window.console.httpdebug = function($res){
  if(typeof $res === 'object' && !Array.isArray($res)){
    if($res.debug){
      console.debug($res);
    }
  }
}

window.console.htmldebug = function($data){
  if($data.getResponseHeader('Content-Type').startsWith("text/html")){
      $("html").html($data.responseText);
  }else{
    Toast.error("请求错误","["+$data.status+"]:"+$data.statusText);
  }
}

// 用户管理器
window.userData = {};
(function($){
  $.extend({
    User:function(user){
      window.userData = user;
    }
  });
  $.User.getId = function(){
    return window.userData.id;
  }
  $.User.getName = function(){
    return window.userData.nickname;
  }
  $.User.getEmail = function(){
    return window.userData.email;
  }
  $.User.getPhone = function(){
    return window.userData.phone;
  }
  $.User.getUserFace = function(){
    return window.userData.userface;
  }
  $.User.getUuid = function(){
    return window.userData.uuid;
  }
  $.User.getIsadmin = function(){
    return window.userData.is_admin;
  }
  $.User.getStatus = function(){
    return window.userData.status;
  }
  $.User.getIsBan = function(){
    return window.userData.status != 0;
  }
  $.User.getCreateTime = function(){
    return window.userData.create_time;
  }
  $.User.getUpdateTime = function(){
    return window.userData.update_time;
  }
})(jQuery)
