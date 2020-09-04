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
