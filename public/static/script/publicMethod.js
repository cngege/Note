
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
      afterHidden: $fun,
      bgColor : '#EFFEC9',
      textColor : '#000'
    });
  },
  noLogin:function($goto,$msg = null){
    $.toast({
      text: $msg || "没有登陆,正在跳转...",
      afterHidden:function(){
        $goto && goto($goto);
      },
      bgColor : '#EFFEC9',
      textColor : '#000'
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

// 显示弹出菜单
// dom: 菜单的JQ节点 或可定位此节点的字符串
// e: [object] 右键时传入的事件消息
//    [number] x 像素坐标
// y: 可为空 [number] y 像素坐标
window.PopupShow = function(dom,e,y){
  if(typeof dom == "string") dom = $(dom);
  if(!dom || !dom.hasClass('popup-win_div')){
    console.error(dom);
    throw new Error("当前节点dom不是popup菜单节点");
  }

  dom.css('display', 'inline');
  if(e !== undefined){
    if(typeof e == 'object'){
      dom.children('.popup-win').css({
        left : e.pageX+"px",
        top : e.pageY+"px"
      });
    }else if(typeof e == 'number' && y !== undefined && typeof y == 'number'){
      dom.children('.popup-win').css({
        left : e+"px",
        top : y+"px"
      });
    }
  }
  return dom;
}

// 隐藏弹出菜单
// dom: 菜单的JQ节点 或可定位此节点的字符串
window.PopupHide = function(dom){
  // 一般情况下不需要调用 因为点击菜单外侧就会自动隐藏
  if(typeof dom == "string") dom = $(dom);
  if(!dom || !dom.hasClass('popup-win_div')){
    console.error(dom);
    throw new Error("当前节点dom不是popup菜单节点");
  }
  let closeDom = dom.children('.popup_win_close');
  closeDom && closeDom.click();
  return dom;
}

// 将文件夹信息添加到节点中
// dom: 父文件夹的JQ节点
// obj: name 要添加文件夹的名称
//      uuid 要添加文件夹的uuid
// single: 此文件夹是否是单独的一个空文件夹
// spread: 如果有子文件夹 则是否展开
window.addFolderToDom = function(dom,obj,single/*单独的一个文件夹*/,spread/*展开*/){
  // obj: name string 文件夹名称
  // obj: uuid string 文件夹uuid
  if(typeof dom != 'object'){
    console.error(dom);
    throw new Error("当前节点dom不是JQ对象节点");
  }
  let isRoot = dom.hasClass('root');  // 父文件夹是根节点 也就是说此文件夹是顶级节点

  let template = $(".folder .folder_body_boxs.root .folder_body.template").clone(true);
  template.removeClass('template');
  template.find(".folder_name span").text(obj.name);
  template.data("uuid",obj.uuid);
  template.data("level",isRoot? 0 : dom.data('level') + 1);
  template.find(".folder_tag_box").css("margin-left",30 + template.data('level')*10 + "px");
  // 设置前面的标志是点还是箭头 模板默认是fa fa-angle-right
  // 如果定义了 并且不是单独的空文件夹
  if(single !== undefined && single == false){
    let tag = template.find(".folder_tag i");
    if(spread === undefined || !spread){
      // 没定义 或者  定义了但要求不展开
      tag.removeClass('fa-circle').addClass('fa-angle-right');
      template.children(".folder_body_boxs").css("height","0");
    }else{
      tag.removeClass('fa-circle').addClass('fa-angle-down');
      template.children(".folder_body_boxs").css("height","auto");
    }
  }

  (isRoot ? dom : dom.children('.folder_body_boxs')).append(template);
  return template;
}

// 清空笔记列表
window.clearNoteList = function(){
  window.config.noteItem = null;
  // 设置 N篇笔记
  $(".notelist .notezap").children('p').data("noteCount",0);
  $(".notelist .notezap").children('p').text(0 + " 篇笔记");
  // 将列表中清空
  $(".notelist .notetitlelist ul li:not(.template)").remove();
}

// 添加笔记到笔记列表中
// note: title
//       update_time     笔记最后更新时间
//       create_time
//       description
//       parentDirName
//       img
//       uuid
window.addNoteToDom = function(note,isTop){
  let num = $(".notelist .notezap").children('p').data("noteCount");
  num++;
  $(".notelist .notezap").children('p').data("noteCount",num);

  $(".notelist .notezap").children('p').text(num + " 篇笔记");
  // dom设置
  let template = $(".notelist .notetitlelist li.template").clone(true);
  template.removeClass('template');
  template.find(".noteTitleText p").text(note.title);
  let timeDate = (new Date(note.update_time));
  let time = timeDate.getFullYear() + "/" + (timeDate.getMonth() + 1) + "/" + timeDate.getDate();
  template.find(".timedirinfo p.note_time").text(time).data('time', note.update_time)
  // 添加内容描述
  template.find(".Previewinfo p").text(note.description || "简述...");
  template.find(".timedirinfo p.note_sort").text(note.parentDirName);

  let firstImg = note.img || [];
  if(firstImg.length){
    firstImg = firstImg[0];
    template.find(".PreviewImg").show();
    template.find(".PreviewImg img").attr("src",firstImg);
  }
  // 设置数据
  template.data("uuid",note.uuid);
  template.data("parent_uuid",note.uuid);
  template.data("isTrash",false);
  if(isTop){
    $(".notelist .notetitlelist ul").prepend(template);
  }else{
    $(".notelist .notetitlelist ul").append(template);
  }
  return template;
}

//
// notes[数组]: title           笔记标题
//              update_time     笔记最后更新时间
//              create_time     笔记创建时间
//              description     笔记描述
//              parentDirName   父文件夹名字
//              img             笔记的示例（第一个）图片
//              uuid            笔记uuid
//              isTrash         是不是回收站中的笔记
window.setNodesToDom = function(notes){
  clearNoteList();

  if(notes == null) return;
  // 设置 N篇笔记
  $(".notelist .notezap").children('p').data("noteCount",notes.length);
  $(".notelist .notezap").children('p').text(notes.length + " 篇笔记");

  $.each(notes,(index,value)=>{
    let template = $(".notelist .notetitlelist li.template").clone(true);
    template.removeClass('template');
    template.find(".noteTitleText p").text(value.title);
    let timeDate = (new Date(value.update_time));
    let time = timeDate.getFullYear() + "/" + (timeDate.getMonth() + 1) + "/" + timeDate.getDate();
    template.find(".timedirinfo p.note_time").text(time).data('time', value.update_time)
    // 添加内容描述
    template.find(".Previewinfo p").text(value.description || "简述...");
    template.find(".timedirinfo p.note_sort").text(value.parentDirName);

    // TODO: 添加图片
    let firstImg = value.img || [];
    if(firstImg.length){
      firstImg = firstImg[0];
      template.find(".PreviewImg").show();
      template.find(".PreviewImg img").attr("src",firstImg);
    }
    // 设置数据
    template.data("uuid",value.uuid);
    template.data("parent_uuid",value.uuid);
    template.data("isTrash",value.isTrash);

    //template.find(".folder_tag_box").css("margin-left",30 + level*10 + "px");
    $(".notelist .notetitlelist ul").append(template);
    if(window.config.autoOpenNote > 0){
      window.config.autoOpenNote--;
      template.click();
    }
  })
}

window.recentrUnFocus = function(){
  $(".notedir .dirlist .recent").removeClass('focus');
}

// 将文件夹列表中的focus取消掉
window.folderUnFocus = function(){
  window.config.rClickFolderuuid = null;
  window.config.rClickFolder = null;
  $(".folder .folder_body_boxs .folder_name_box").removeClass('focus');
}

// 将回收站中的focus也都取消
window.trashUnFocus = function(){
  $(".notedir .dirlist .trashlist_box .trashlist_item").removeClass('focus');
}
