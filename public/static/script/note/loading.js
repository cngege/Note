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
}


 //没有登录信息 直接跳转到登录页面
 // if($.cookie("Userkeys") == undefined && !isAtom()){
 //   goto("login.html");
 // }else{
 //   //向服务器请求笔记和用户数据
 //   GetNoteData();
 // }

 //向服务器请求用户和笔记的数据，如果登录信息不对 则跳转到登录页面
 $.ajax({
   url: '/index/getNoteInfo',
   type: 'POST',
   dataType: 'json',
   data: {},
   success:function(e){
     switch (e.code) {
       case 0:     //登录成功
         $(".bardoing .logo .logoinside .Username span").text(e.user.nickname);
         if(e.user.is_admin){
           $("#WebSetup").css('display','');
         }
         // TODO 获取笔记信息 并关掉加载div
         loading.css('display', 'none');
         break;
       case 1:
         e.goto && goto(e.goto);
         break;
       case 2://没有安装
         e.goto && goto(e.goto);
         break;
       default:
         alert("错误:["+ e.msg +"]");
         console.log(code);
     }
   },
   error: function (textStatus) {
     if(!isAtom)
        alert("错误["+textStatus.status+"]:"+textStatus.statusText);
   }
 })
