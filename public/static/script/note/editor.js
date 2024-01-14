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
    config.iseditor = false;
    $(this).find(".btn-label span").text('编辑');
    $(this).css({"background-color":"#448aff","color":"#fff"});
    $(".notetext header .addtagbox").show();
    $(".notetext header .editbtnbox").css("display","none");
    $(".notetext .notetextbody .remark").show();
    $(".notetext .notetextbody .editor-iframe").attr("contenteditable","false");
  }

  //Height:刷新可滑动页区域的高度
  $(".notetextbody0").css("height",$(window).height() - $("header")[0].clientHeight - 20)

});
