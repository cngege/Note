
//跳转到其他页面
function goto(html){
  if(html != null && html != "" && html != undefined){
      window.location.href=html;
  }
}

//判断是否在Atom编辑器中运行
function isAtom(){
  return (navigator.userAgent.indexOf("Atom") > -1);
}
