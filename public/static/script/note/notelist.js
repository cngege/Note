

// 笔记删除 - 移动至回收站
$(".notetitlelist .noteTitleText .shareanddel .deleteicon").click(function(event) {
  // 获取此笔记的uuid
  let uuid = $(this).parents('li').data('uuid');
  let noteItem = $(this).parents('li');
  if(!uuid) return false;
  // 网络请求进行删除
  $.ajax({
    url: '/index/RecyclingNote',
    type: 'POST',
    dataType: 'json',
    async: false,
    data: {uuid: uuid},
    success:function(e){
      switch (e.code) {
        case 0:     //成功
          // 写入公共信息
          window.config.noteItem = null;
          window.config.noteuuid = null;

          // 将笔记从列表中移除掉
          noteItem.remove();
          // 将N篇笔记-1
          // 设置 N篇笔记
          let count = $(".notelist .notezap").children('p').data("noteCount");
          count--;
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
  });
  return false;
});

// 点击笔记
$(".notelist .notetitlelist li").click(function(event) {
  // 判断当前笔记是否是已选中的笔记
  if($(this).hasClass('focus')){
    return;
  }

  $(".notelist .notetitlelist li").removeClass('focus');
  $(this).addClass('focus');

  // 写入公共信息
  window.config.noteItem = $(this);
  window.config.noteuuid = $(this).data('uuid');

  // 网络请求笔记信息
  $.ajax({
    url: '/index/getNoteData',
    type: 'POST',
    dataType: 'json',
    async: false,
    data: {uuid: window.config.noteuuid},
    success:function(e){
      switch (e.code) {
        case 0:     //成功
          // 写入笔记区标题
          $(".notetext .titlebtn .title_box > p").text(e.headerData.title);
          // 写入笔记区内容 // 这里切记要进行js过滤
          // 编码: window.btoa(unescape(encodeURIComponent(data))
          // 解码
          let htmlStr = decodeURIComponent(escape(window.atob(e.noteData)));
          let safeHtmlStr = DOMPurify.sanitize(htmlStr);
          $(".notetext .notetextbody0 .notetextbody .editor-iframe").html(safeHtmlStr);
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
