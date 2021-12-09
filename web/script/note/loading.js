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
  if(isAtom()){
    loading.css('display', 'none');
  }


 //没有登录信息 直接跳转到登录页面
 if($.cookie("Userkeys") == undefined && !isAtom()){
   goto("login.html");
 }else{
   //向服务器请求笔记和用户数据
   GetNoteData();
 }




}

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

//向服务器请求用户和笔记的数据，如果登录信息不对 则跳转到登录页面
function GetNoteData(){
  $.post('/path/to/file', {"type":"GetNoteData"}, function(data) {
    /*optional stuff to do after success */
  });
}
