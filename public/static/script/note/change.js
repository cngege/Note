
//头像旁用户名下拉箭头被点击 显示菜单
$(".bardoing .Username i").click(function(event) {
  /* Act on the event */
  $(".bardoing .Username .setupselect").css('display', 'inline');
  $(".note .bar .bardoing").addClass('hover');
});


//账户设置按钮被点击
$(".bardoing .Username .setupselect ul #UserSetup").click(function(event) {
  /* Act on the event */
  //alert("账户设置");
  $(".bardoing .Username .setupselect").css('display', 'none');
  $("div.account_setup_box").css("display","inline");
  $(".note .bar .bardoing").removeClass('hover');
});

//退出登录按钮被点击
$(".bardoing .Username .setupselect ul #Logout").click(function(event) {
  /* Act on the event */
  //alert("退出登录");
  $(".bardoing .Username .setupselect").css('display', 'none');
  $.post('/Index/logout',{}, function(data, textStatus, xhr) {
    /*optional stuff to do after success */
    if(data.code == 0){
      goto(data.goto);
    }
  });
});

// 账号设置 -昵称 里面的对勾和叉在输入框获取失去焦点时显示隐藏
$(".body_account_setup .account_setup_box .setup_nickname_box .check_input_box .input_text_box input").focus(function(event) {
  /* Act on the event */
  $(".body_account_setup .account_setup_box .setup_nickname_box .check_input_box .input_yesorno_box").show();
});
$(".body_account_setup .account_setup_box .setup_nickname_box .check_input_box .input_text_box input").blur(function(event) {
  /* Act on the event */
  setTimeout(()=>{
    $(".body_account_setup .account_setup_box .setup_nickname_box .check_input_box .input_yesorno_box").hide();
  },100)

});



//笔记详情页
//搜索框 获取焦点时修改样式效果
$(".notelist .search .search2 .inputbox input").focus(function(){
    $(".notelist .search .search2").css('background-color','white');
}).blur(function(){
    $(".notelist .search .search2").css('background-color','transparent');
});

//鼠标悬浮时 修改样式效果
$(".notelist .search .search2 .inputbox input").hover(function(){
    $(".notelist .search .search2").css('background-color','white');
},function(){
    if(!$(this).is(":focus")) //该输入框是否获取到了焦点
      $(".notelist .search .search2").css('background-color','transparent');
});

//鼠标悬浮到标题列表时 显示分享和删除按钮
$(".notelist ul li .noteTitleBox").hover(function(){
    $(this).find(".shareanddel").css("display","flex");
    $(this).find(".noteTitleText p").css("width","70%");
},function(){
    $(this).find(".shareanddel").css("display","none");
    $(this).find(".noteTitleText p").css("width","100%");
});

//笔记内容可编辑页
//笔记设置下拉框点击弹出菜单
$(".notetext header .titlebtn .notecontrolbtn .notemorebtn button").click(function(event) {
  /* Act on the event */
  //1. 弹出菜单
  $('.notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfoform').show();//那么就显示div
  //$(".notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfoform").css("display","inline");
  //2. 重新修改下拉菜单的位置
$(".notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfosetup").css("top",$(this).offset().top+$(this).outerHeight()+"px")

});

//笔记设置下拉框点击外围消失
$(".notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfoform .close").click(function(event) {
  /* Act on the event */
  $('.notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfoform').hide();//就隐藏div
  //$(".notetext header .titlebtn .notecontrolbtn .notemorebtn .noteinfoform").css("display","none");
});


/* 账号设置区域 */
// 点击按钮 切换到当前页
$("div.account_setup_box .optionbar .optionbar_padd ul .select_account_setup").click(function(event) {
  /* Act on the event */
  if(!$(this).hasClass('selected')){
    $(this).addClass('selected');
    $("div.account_setup_box .optionbar .optionbar_padd ul .select_account_setup").removeClass('selected')



  }
});

/* 账号设置 切换 */
$("div.account_setup_box .optionbar .optionbar_padd ul div.List").click(function(event) {
  /* 先将右边的内容全都隐藏 */
  $("div.account_setup_box .account_setup .bodybar").children("div").each(function(index, el) {
    if(!$(el).hasClass('hide')){
      $(el).addClass('hide');
    }
  });
  /* 将左边的列表都取消选择 */
  var current = this;
  $("div.account_setup_box .optionbar .optionbar_padd ul div.List").each(function(index, el) {
    if($(el).hasClass('selected')){
      $(el).removeClass('selected');
    }
    if(el == current){
      $($("div.account_setup_box .account_setup .bodybar").children("div")[index]).removeClass('hide')
    }
  });
  /* 选择当前的选项 */
  $(this).addClass('selected');
});

// 和 账户设置窗口有关的动态交互
//不需要了 集成到了popup
// $("#account_close").click(function(event) {
//   /* 关闭 */
//   $("div.account_setup_box").css("display","none");
// });


// 点击上传头像部分时，将点击传递到 input中
$("div.account_setup_box .account_setup .bodybar .body_account_setup .editface .uploadface").click(function(event) {
  /* Act on the event */
  $("div.account_setup_box .account_setup .bodybar .body_account_setup .editface input").click();
});

// 用户选择了头像文件之后
$("div.account_setup_box .account_setup .bodybar .body_account_setup .editface input").change(function(event) {
  /* Act on the event */
  /* Act on the event */
  var formData = new FormData();
  formData.append("userface",$(this)[0].files[0]);
  $.ajax({
    url: "/User/updateFace",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      // 在这里处理上传成功后的逻辑，例如显示成功消息等。
      console.httpdebug(response);
      if(response.code == 0){
        if(response.updataUrl){
          $(".bardoing .logo .logoimgbox img").attr("src",response.updataUrl);
          $(".notetext .notetextbody .remark .remark-inputbox .remark-userimg img").attr("src",response.updataUrl);
          $("div.account_setup_box .account_setup .bodybar .body_account_setup .editface img").attr("src",response.updataUrl);
        }
        Toast.success("成功",response.msg);
      }
      else if(response.code == 1){
        Toast.noLogin(response.goto);
      }
      else if(response.code == 2){
        Toast.error("错误",response.msg);
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      // 在这里处理上传失败的情况。
      console.htmldebug(jqXHR);
    }
  })
});

// 点击账号设置 - 更多按钮
$(".body_account_setup .account_setup_box .setup_deleteaccess_box .morebtn").click(function(event) {
  /* Act on the event */
  let i = $(".body_account_setup .account_setup_box .setup_deleteaccess_box .morebtn i");
  let delbtn = $(".body_account_setup .account_setup_box .setup_deleteaccess_box .deleteaccess_btn");
  if(i.hasClass('fa-angle-down')){
    i.removeClass('fa-angle-down').addClass('fa-angle-up')
    delbtn.removeClass('hide');
  }else{
    i.removeClass('fa-angle-up').addClass('fa-angle-down')
    delbtn.addClass('hide');
  }


});

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
  // 请求当前文件夹的笔记信息列表
  let uuid = $(this).parent().data('uuid');
  let parentDirName = $(this).children('.folder_name').children("span").text();
  // TODO: 文件夹设置 hover效果
  // focus // 点TODO: 点击近期笔记 - 我的分享时也要运行下面的取消 focus
  $(".folder .folder_body_boxs .folder_name_box").removeClass('focus');
  $(this).addClass('focus');

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
              let firstImg = JSON.parse(value.img);
              if(firstImg.length){
                firstImg = firstImg[0];
                template.find(".PreviewImg img").attr("src",firstImg);
              }else{
                template.find(".PreviewImg img").remove();
              }
              // 设置数据
              template.data("uuid",value.uuid);
              template.data("parent_uuid",value.uuid);

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
