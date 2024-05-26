//HTML富文本编辑区脚本

//实现textarea 随行数自动调整高度
$('.notetext .notetextbody .remark .remark-inputbox .remark-input .textinput textarea').on('input', function(){
    let _inputbox = $(".notetext .notetextbody .remark .remark-inputbox .remark-input .textinput");
    _inputbox[0].style.height = 'auto';
		_inputbox[0].style.height = this.scrollHeight + "px";
});

$(window).resize(function(event) {
  /* Act on the event */
  $(".notetextbody0").css("height",$(window).height() - $("header")[0].clientHeight -20)


});


//点击编辑按钮
$(".notetext header .titlebtn .notecontrolbtn .editbtn button").click(function(event) {
  /* Act on the event */

  if(!config.iseditor){             //如果不是编辑模式
    config.iseditor = true;         //标识改为编辑模式
    $(this).find(".btn-label span").text('保存');     //改内文字为：保存
    $(this).css({"background-color":"#E6E9ED","color":"#000"});       //按钮默认背景颜色
    $(".notetext header .addtagbox").hide();                          //隐藏添加标签部分
    $(".notetext header .editbtnbox").css("display","flex");          //显示编辑区功能按钮

    $(".notetext .notetextbody .remark").hide();                      //隐藏添加备注部分
    $(".notetext .notetextbody .editor-iframe").attr("contenteditable","true");
  }else{  //后面将这里做请求，请求成功才执行
    let btn = $(this);
    let htmlStr = window.btoa(unescape(encodeURIComponent($(".notetext .notetextbody .editor-iframe").html())));
    let safeHtmlStr = DOMPurify.sanitize(htmlStr);

    let des = $(".notetext .notetextbody .editor-iframe").text().substring(0,50);

    $.ajax({
      url: '/index/updateNoteData',
      type: 'POST',
      dataType: 'json',
      async: false,
      data: {uuid: window.config.noteuuid,noteData: safeHtmlStr,noteDescription:des},
      success:function(e){
        switch (e.code) {
          case 0:     //成功
            config.iseditor = false;
            btn.find(".btn-label span").text('编辑');
            btn.css({"background-color":"#448aff","color":"#fff"});
            $(".notetext header .addtagbox").show();
            $(".notetext header .editbtnbox").css("display","none");
            $(".notetext .notetextbody .remark").show();
            $(".notetext .notetextbody .editor-iframe").attr("contenteditable","false");

            if(window.config.noteItem){
              window.config.noteItem.find(".noteTitleBox .PreviewinfoBox .PreviewinfoBox2 .Previewinfo p").text(e.description.substring(0,50));
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
    });

  }

  //Height:刷新可滑动页区域的高度
  $(".notetextbody0").css("height",$(window).height() - $("header")[0].clientHeight - 20)

});

// 点击标题变为输入框 可进行修改标题
$(".notetext .titlebtn .title_box > p").click(function(event) {
  let text = $(this).text();
  $(".notetext .titlebtn .title_box > p").addClass('hide');
  let input = $(".notetext header .titlebtn .title_box .title_editor_box input");
  input.parent().show();
  input.val(text);
  input.focus();
});


// 标题输入框 失去焦点时的事件
$(".notetext header .titlebtn .title_box .title_editor_box input").blur(function(event) {
  let uuid = window.config.noteuuid;
  let input = $(this);
  if(input.val() == $(".notetext .titlebtn .title_box > p").text() ||
     input.val() == "" ||
     !uuid){
    $(".notetext .titlebtn .title_box > p").removeClass('hide');
    input.parent().hide();
    return;
  }
  $.ajax({
    url: '/index/renameNote',
    type: 'POST',
    dataType: 'json',
    async: false,
    data: {uuid: uuid,name:input.val()},
    success:function(e){
      switch (e.code) {
        case 0:     //成功
          // 将输入框改回p标签
          $(".notetext .titlebtn .title_box > p").removeClass('hide');
          $(".notetext .titlebtn .title_box > p").text(e.name);
          input.parent().hide();

          if(window.config.noteItem){
            window.config.noteItem.find(".noteTitleText > p").text(e.name);
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
  });
});
