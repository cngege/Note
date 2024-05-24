
$(function(){
// 弹窗相关JS
$(".popup-win_div").each(function(index, el) {
  let close = $("<div class=\"popup_win_close\"></div>");
  close.click(function(event) {
    $(this).parent().hide();
  });
  close.on('contextmenu',e=>e.preventDefault())
  $(el).prepend(close);

  let onClose = $(el).attr("onClose");
  if(onClose !== undefined){
    eval(onClose);
  }

});

})
