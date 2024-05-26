
function RequestAddFolder(uuid,name,success_fun){
  $.ajax({
    url: '/index/addFolder',
    type: 'POST',
    dataType: 'json',
    async: false,
    data: {uuid: uuid,name: name},
    success:success_fun,
    error: function (jqXHR) {
      console.htmldebug(jqXHR);
    }
  })
}




$(".folder1").click(function(event) {
  /* Act on the event */
  let icon = $(this).find('.selecttag i');
  if(icon.hasClass('fa-angle-down')){
    // 请求 拿到笔记文件夹列表

    // 拿到后展开
    $(this).next(".folder_body_boxs").css("height","auto");
    icon.removeClass('fa-angle-down').addClass('fa-angle-up')
  }
  else if(icon.hasClass('fa-angle-up')){
    $(this).next(".folder_body_boxs").css("height","0");
    icon.removeClass('fa-angle-up').addClass('fa-angle-down')
  }
  return false;
});

// 根文件夹 右键时显示 新建文件夹
$(".folder1").on("contextmenu", function(e){
    e.preventDefault(); // 阻止默认的右键点击行为
    $(".notedir .dirlist .folder .root-dir-popup").css('display', 'inline');
    $(".notedir .dirlist .folder .root-dir-popuplist").css({
      left : e.pageX+"px",
      top : e.pageY+"px"
    });
    window.config.rClickFolderuuid = $.User.getUuid();
});

// 根文件夹 点击新建文件夹
$(".notedir .dirlist .folder .root-dir-popuplist li.makedir").click(function(event) {
  // 首先 将弹窗关闭掉
  $(".notedir .dirlist .folder .root-dir-popup").css('display', 'none');
  // 如果没有展开 则展开
  let icon = $(".folder1").find('.selecttag i');
  if(icon.hasClass('fa-angle-down')){
    // 拿到后展开
    $(".folder1").next(".folder_body_boxs").css("height","auto");
    icon.removeClass('fa-angle-down').addClass('fa-angle-up')
  }
  // 添加一个文件夹 展开为输入框
  // 克隆模板
  let template = $(".folder .folder_body_boxs.root .folder_body.template").clone(true);
  template.removeClass('template');

  let input_box = template.find(".folder_input_box");
  input_box.removeClass('hide');

  let input = template.find(".folder_input_box input");
  let folder_name = template.find(".folder_name");
  folder_name.addClass('hide')

  // 在节点内部的开头插入
  $(".folder .folder_body_boxs.root").prepend(template);
  // 给予输入框焦点
  input.focus();
  input.data("inputype","makefolder");
  // 当输入框失去焦点
  let blur = function(event) {
    /* Act on the event */
    // 当内容为空 则取消新建文件夹
    if($(this).val() == ""){
      template.remove();
      return;
    }
    input.off("blur",blur);
    // 请求后端创建文件夹
    let folderName = $(this).val();

    RequestAddFolder(window.config.rClickFolderuuid,folderName,e=>{
      switch (e.code) {
        case 0:     //成功
          // 变为非输入模式
          input_box.addClass('hide');
          folder_name.removeClass('hide');
          // 写入uuid数据
          template.data("uuid",e.data.uuid);
          template.data("level",1);
          // 写入名称
          template.find(".folder_name span").text(e.data.name);
          break;
        case 1://未登录
          Toast.noLogin(e.goto);
          break;
        case 2://错误
          Toast.error("参数错误",e.msg);
          template.remove();
          break;
        case 3://错误
          Toast.error("错误",e.msg);
          template.remove();
          break;
      }
    })
  }
  input.on('blur',blur);
});

if(isAtom()){
  // 克隆模板
  let template = $(".folder .folder_body_boxs.root .folder_body.template").clone(true);
  template.removeClass('template');
  template.find(".folder_name span").text("测试Atom");
  $(".folder .folder_body_boxs.root").append(template);

  let template2 = $(".folder .folder_body_boxs.root .folder_body.template").clone(true);
  template2.removeClass('template');
  template2.find(".folder_name span").text("测试Atom2");
  template2.data("level",2);
  template2.find(".folder_tag_box").css("margin-left",30 + template2.data('level')*10 + "px");
  template.children('.folder_body_boxs').css('height', 'auto');
  template.children('.folder_body_boxs').append(template2);

  let template3 = $(".folder .folder_body_boxs.root .folder_body.template").clone(true);
  template3.removeClass('template');
  template3.find(".folder_name span").text("测试Atom3");
  template3.data("level",3);
  template3.find(".folder_tag_box").css("margin-left",30 + template3.data('level')*10 + "px");
  template2.children('.folder_body_boxs').css('height', 'auto');
  template2.children('.folder_body_boxs').append(template3);

  template3.find(".folder_name_box").addClass('focus')
}

// 当子文件夹菜单点击新建子文件夹
$(".notedir .dirlist .folder .child-dir-popuplist li.makedir").click(function(event) {
  /* Act on the event */
  // 首先 将弹窗关闭掉
  $(".notedir .dirlist .folder .child-dir-popup").css('display', 'none');

  // 将文件夹的容器高度变为auto
  window.config.rClickFolder.children('.folder_body_boxs').css('height', 'auto');

  // 克隆模板
  let template = $(".folder .folder_body_boxs.root .folder_body.template").clone(true);
  template.removeClass('template');

  let input_box = template.find(".folder_input_box");
  input_box.removeClass('hide');

  let input = template.find(".folder_input_box input");

  let folder_name = template.find(".folder_name");
  folder_name.addClass('hide')

  let thisItem = $(".notedir .dirlist .folder_body_boxs .folder_body .folder_name_box.focus");
  thisItem.parent().children('.folder_body_boxs').prepend(template);
  let level =window.config.rClickFolder.data('level');
  template.find(".folder_tag_box").css("margin-left",30 + (level + 1)*10 + "px");
  // 优化当层级过高的情况下 输入框错位的问题
  template.find(".folder_input_box").css("width",'calc(100% - 40px - 40px - '+ (level + 1)*10 +'px)')
  input.focus();
  let blur = function(event) {
    // 当内容为空 则取消新建文件夹
    if($(this).val() == ""){
      template.remove();
      return;
    }
    input.off("blur",blur);
    // 请求后端创建文件夹
    let folderName = $(this).val();

    RequestAddFolder(window.config.rClickFolderuuid,folderName,e=>{
      switch (e.code) {
        case 0:     //成功
          // 变为非输入模式
          input_box.addClass('hide');
          folder_name.removeClass('hide');
          // 写入uuid数据
          template.data("uuid",e.data.uuid);
          template.data("level",level + 1);
          // 写入名称
          template.find(".folder_name span").text(e.data.name);

          // 父文件夹的点要变成>
          let tag = window.config.rClickFolder.children('.folder_name_box').find(".folder_tag i");
          if(tag.hasClass('fa-circle')){
            tag.removeClass('fa-circle').addClass('fa-angle-down');
          }

          break;
        case 1://未登录
          Toast.noLogin(e.goto);
          break;
        case 2://错误
          Toast.error("参数错误",e.msg);
          template.remove();
          break;
        case 3://错误
          Toast.error("错误",e.msg);
          template.remove();
          break;
      }
    })
  }
  input.on("blur",blur);

});

// 当子文件夹菜单点击重命名
$(".notedir .dirlist .folder .child-dir-popuplist li.rename").click(function(event) {
  /* Act on the event */
  // 首先 将弹窗关闭掉
  $(".notedir .dirlist .folder .child-dir-popup").css('display', 'none');

  let input_box = window.config.rClickFolder.find(".folder_input_box");
  input_box.removeClass('hide');

  let folder_name_box = window.config.rClickFolder.children('.folder_name_box');

  let folder_input_box = folder_name_box.find(".folder_input_box");
  folder_input_box.removeClass('hide');

  let folder_name = folder_name_box.find(".folder_name");
  folder_name.addClass('hide');
  // 拿到input
  let input = folder_input_box.find('input');
  // 写入type为 rename
  input.focus();
  input.data("inputype","renamefolder");
  // 写入input内容
  input.val(folder_name.find('span').text());

  let blur = function(event){
    if($(this).val() == ""){
      folder_input_box.addClass('hide');
      folder_name.removeClass('hide');
      return;
    }
    input.off("blur",blur);

    // 网络请求
    $.ajax({
      url: '/index/renameFolder',
      type: 'POST',
      dataType: 'json',
      async: false,
      data: {uuid: window.config.rClickFolderuuid,name: input.val()},
      success:function(e){
        folder_input_box.addClass('hide');
        folder_name.removeClass('hide');
        switch (e.code) {
          case 0:     //成功
            folder_name.find('span').text(e.data.name);
            break;
          case 1://未登录
            Toast.noLogin(e.goto);
            break;
          case 2://错误
            Toast.error("参数错误",e.msg);
            break;
          case 3://错误
            Toast.error("错误",e.msg);
            break;
        }
      },
      error: function (jqXHR) {
        console.htmldebug(jqXHR);
      }
    })
  }
  input.on("blur",blur);

});

// 当子文件夹菜单点击删除
$(".notedir .dirlist .folder .child-dir-popuplist li.delete").click(function(event) {
  /* Act on the event */
  // 首先 将弹窗关闭掉
  $(".notedir .dirlist .folder .child-dir-popup").css('display', 'none');
  // 然后是网络请求 看结果
  $.ajax({
    url: '/index/deleteFolder',
    type: 'POST',
    dataType: 'json',
    async: false,
    data: {uuid: window.config.rClickFolderuuid},
    success:function(e){
      switch (e.code) {
        case 0:     //成功
          // 在父文件夹的容器中移除 这个文件夹节点
          let parentDiv = window.config.rClickFolder.parent();
          window.config.rClickFolder.remove();
          let count = parentDiv.children('.folder_body').length;
          if(count == 0 && !parentDiv.hasClass('root')){
            // 将父文件夹的箭头变为点
            parentDiv.parent().children('.folder_name_box').find("i").removeClass('fa-angle-down').addClass('fa-circle')
          }
          // 由于笔记均移动到回收站中 所有笔记列表也应清空
          // 设置 N篇笔记
          $(".notelist .notezap").children('p').text(0 + " 篇笔记");
          // 将列表中清空
          $(".notelist .notetitlelist ul li:not(.template)").remove();


          break;
        case 1://未登录
          Toast.noLogin(e.goto);
          break;
        case 2://错误
          Toast.error("参数错误",e.msg);
          template.remove();
          break;
        case 3://错误
          Toast.error("错误",e.msg);
          template.remove();
          break;
      }
    },
    error: function (jqXHR) {
      console.htmldebug(jqXHR);
    }
  })

});


// 子文件夹右键
$(".notedir .dirlist .folder_body_boxs .folder_body .folder_name_box").on("contextmenu", function(e){
    e.preventDefault(); // 阻止默认的右键点击行为
    if(!$(this).hasClass('focus')){
      $(this).click();
    }

    $(".notedir .dirlist .folder .child-dir-popup").css('display', 'inline');
    $(".notedir .dirlist .folder .child-dir-popuplist").css({
      left : e.pageX+"px",
      top : e.pageY+"px"
    });
    window.config.rClickFolderuuid = $(this).parent().data("uuid");
    window.config.rClickFolder = $(this).parent();
});



// 子文件夹展开
$(".folder .folder_body_boxs .folder_tag").click(function(event) {
  /* Act on the event */
  let icon = $(this).children('i');
  if(icon.hasClass('fa-angle-right')){
    // 请求 拿到笔记文件夹列表

    // 拿到后展开
    $(this).parent().parent().next(".folder_body_boxs").css("height","auto");
    icon.removeClass('fa-angle-right').addClass('fa-angle-down')
  }
  else if(icon.hasClass('fa-angle-down')){
    $(this).parent().parent().next(".folder_body_boxs").css("height","0");
    icon.removeClass('fa-angle-down').addClass('fa-angle-right')
  }
  return false;
});

// 文件夹点击 获取当前文件夹下的所有笔记，并显示笔记列表
$(".folder .folder_body_boxs .folder_name_box").click(function(event) {
  /* Act on the event */
  if($(this).hasClass('focus')){
    return;
  }

  // 请求当前文件夹的笔记信息列表
  let uuid = $(this).parent().data('uuid');
  if(!uuid){
    return;
  }
  window.config.noteItem = null;
  window.config.rClickFolderuuid = uuid;
  window.config.rClickFolder = $(this).parent();
  // 笔记的夫文件夹名称 也就是当前文件夹名字
  let parentDirName = $(this).children('.folder_name').children("span").text();
  // TODO: 文件夹设置 hover效果
  // focus // 点TODO: 点击近期笔记 - 我的分享时也要运行下面的取消 focus
  $(".folder .folder_body_boxs .folder_name_box").removeClass('focus');
  $(this).addClass('focus');
  // 将回收站中的focus也都取消
  // 把回收站中的focus全取消
  $(".notedir .dirlist .trashlist_box .trashlist_item").removeClass('focus');

  $.ajax({
    url: '/index/getNoteInfo',
    type: 'POST',
    dataType: 'json',
    async: false,
    data: {uuid: uuid},
    success:function(e){
      switch (e.code) {
        case 0:     //成功
          //将拿到的数据写入
          // 克隆
          if(e.note == null) return;
          // 设置 N篇笔记
          $(".notelist .notezap").children('p').data("noteCount",e.note.length);
          $(".notelist .notezap").children('p').text(e.note.length + " 篇笔记");
          // 将列表中清空
          $(".notelist .notetitlelist ul li:not(.template)").remove();
          // 笔记添加到列表中
          if(e.note.length){
            $.each(e.note,(index,value)=>{
              let template = $(".notelist .notetitlelist li.template").clone(true);
              template.removeClass('template');
              template.find(".noteTitleText p").text(value.title);
              let timeDate = (new Date(value.create_time));
              let time = timeDate.getFullYear() + "/" + (timeDate.getMonth() + 1) + "/" + timeDate.getDate();
              template.find(".timedirinfo p.note_time").text(time).data('time', value.create_time)
              // 添加内容描述
              template.find(".Previewinfo p").text(value.description);
              template.find(".timedirinfo p.note_sort").text(parentDirName);

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
              template.data("isTrash",false);

              //template.find(".folder_tag_box").css("margin-left",30 + level*10 + "px");
              $(".notelist .notetitlelist ul").append(template);
            })
          }

          break;
        case 1://未登录
          Toast.noLogin(e.goto);
          break;
        case 2://错误
          Toast.error("错误",e.msg);
          break;
      }
    },
    error: function (jqXHR) {
      console.htmldebug(jqXHR);
    }
  })

  return false;
});


// 点击新建笔记
$(".notedir .newnotebox .literal").click(function(event) {
  // 首先判断当前是否选中了文件夹 是否存在uuid
  let folder_uuid = window.config.rClickFolderuuid;
  if(!folder_uuid) return;
  $.ajax({
    url: '/index/newNote',
    type: 'POST',
    dataType: 'json',
    async: false,
    data: {uuid: folder_uuid},
    success:function(e){
      switch (e.code) {
        case 0:     //成功
          //将拿到的数据写入
          // 克隆
          let template = $(".notelist .notetitlelist li.template").clone(true);
          template.removeClass('template');
          // 设置显示笔记标题
          template.find(".noteTitleText p").text(e.data.title);
          // 设置显示笔记创建时间
          let timeDate = (new Date(e.data.create_time));
          let time = timeDate.getFullYear() + "/" + (timeDate.getMonth() + 1) + "/" + timeDate.getDate();
          template.find(".timedirinfo p.note_time").text(time).data('time', e.data.create_time)
          // 添加内容描述
          template.find(".Previewinfo p").text("简述...");
          // 获取添加父文件夹名称
          let parentDirName = window.config.rClickFolder.children('.folder_name_box').find(".folder_name span").text();
          template.find(".timedirinfo p.note_sort").text(parentDirName);
          // 保存数据 笔记uuid 父文件夹uuid
          template.data("uuid",e.data.uuid);
          template.data("parent_uuid",folder_uuid);

          $(".notelist .notetitlelist ul").append(template);

          // 设置 N篇笔记
          let count = $(".notelist .notezap").children('p').data("noteCount");
          count++;
          $(".notelist .notezap").children('p').data("noteCount",count);
          $(".notelist .notezap").children('p').text(count + " 篇笔记");

          break;
        case 1://未登录
          Toast.noLogin(e.goto);
          break;
        case 2://错误
          Toast.error("参数错误",e.msg);
          break;
        case 3://错误
          Toast.error("异常错误",e.msg);
          break;
      }
    },
    error: function (jqXHR) {
      console.htmldebug(jqXHR);
    }
  })
});

// 点击回收站 展开收起
$(".notedir .dirlist .trash").click(function(event) {
  let tagSelect = $(this).find(".selecttag i");
  if(tagSelect.hasClass('fa-angle-down')){
    // 展开
    tagSelect.removeClass('fa-angle-down').addClass('fa-angle-up')
    $(".notedir .dirlist .trashlist_box").css('height', 'auto');
  }else{
    tagSelect.removeClass('fa-angle-up').addClass('fa-angle-down')
    $(".notedir .dirlist .trashlist_box").css('height', '0');
  }
});

// 点击回收站 - 笔记回收站
$(".notedir .dirlist .trashlist_box .trashlist_item.note_trash").click(function(event) {
  // 把文件夹中的 focus 全部取消
  $(".folder .folder_body_boxs .folder_name_box").removeClass('focus');
  // 把回收站中的focus全取消
  $(".notedir .dirlist .trashlist_box .trashlist_item").removeClass('focus');
  // 设置 focus
  $(this).addClass('focus')
  // 清除公共配置标记
  window.config.noteItem = null;
  window.config.rClickFolderuuid = null;
  window.config.rClickFolder = null;
  // 网络请求
  $.ajax({
    url: '/index/getTrashNote',
    type: 'POST',
    dataType: 'json',
    async: false,
    data: {},
    success:function(e){
      switch (e.code) {
        case 0:     //成功
        // 设置 N篇笔记
        $(".notelist .notezap").children('p').data("noteCount",e.notes.length);
        $(".notelist .notezap").children('p').text(e.notes.length + " 篇笔记");
        // 将列表中清空
        $(".notelist .notetitlelist ul li:not(.template)").remove();
        // 笔记添加到列表中
        if(e.notes.length){
          $.each(e.notes,(index,value)=>{
            let template = $(".notelist .notetitlelist li.template").clone(true);
            template.removeClass('template');
            template.find(".noteTitleText p").text(value.title);
            let timeDate = (new Date(value.create_time));
            let time = timeDate.getFullYear() + "/" + (timeDate.getMonth() + 1) + "/" + timeDate.getDate();
            template.find(".timedirinfo p.note_time").text(time).data('time', value.create_time)
            // 添加内容描述
            template.find(".Previewinfo p").text(value.description);
            template.find(".timedirinfo p.note_sort").text('回收站');

            let firstImg = value.img || [];
            if(firstImg.length){
              firstImg = firstImg[0];
              template.find(".PreviewImg").show();
              template.find(".PreviewImg img").attr("src",firstImg);
            }
            // 设置数据
            template.data("uuid",value.uuid);
            template.data("parent_uuid",null);
            template.data("isTrash",true);

            //template.find(".folder_tag_box").css("margin-left",30 + level*10 + "px");
            $(".notelist .notetitlelist ul").append(template);
          })
        }
          break;
        case 1://未登录
          Toast.noLogin(e.goto);
          break;
        case 2://错误
          Toast.error("参数错误",e.msg);
          break;
        case 3://错误
          Toast.error("异常错误",e.msg);
          break;
      }
    },
    error: function (jqXHR) {
      console.htmldebug(jqXHR);
    }
  })
});

// 点击回收站 - 附件回收站
$(".notedir .dirlist .trashlist_box .trashlist_item.annex_trash").click(function(event) {
  // 这个点击不设置 focus
});
