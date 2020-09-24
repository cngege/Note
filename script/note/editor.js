//HTML富文本编辑区脚本

//实现textarea 随行数自动调整高度
$('.notetext .notetextbody .remark .remark-inputbox .remark-input .textinput textarea').on('input', function(){
    let _inputbox = $(".notetext .notetextbody .remark .remark-inputbox .remark-input .textinput");
    _inputbox[0].style.height = 'auto';
		_inputbox[0].style.height = this.scrollHeight + "px";
});
