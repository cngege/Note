
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
  show : function($text){
    $.toast($text);
  },
  "NoLogin":function($goto){
    $.toast({
      text: "没有登陆,正在跳转...",
      afterHidden:function(){
        $goto && goto($goto);
      }
    });
  },
  "success":function($title,$test,$fun = null){
    $.toast({
    heading: $title,
    text: $test,
    showHideTransition: 'slide',
    icon: 'success',
    afterHidden: $fun
    })
  },
  "error":function($title,$test,$fun = null){
    $.toast({
        heading: $title,
        text: $test,
        showHideTransition: 'fade',
        icon: 'error',
        afterHidden: $fun
    })
  }
}