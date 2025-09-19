 var hasloaded=false;
  var obj;

var doctype="doc";
 $.ajax({
     url: Util.getRootPath()+'rest/mailofficeeditaction/getDocType?isCommondto=true&attachguid=' + Util.getUrlParams("attachguid"),
     type: 'POST', //GET
     async: true,    //或false,是否异步
     data: null,
     //dataType: "json",//返回的数据格式：json/xml/html/script/jsonp/text
     success: function (data) {

         doctype=data;
     }
 });



if (oaeditor.clientOs =="Win") {

    var MenuItems = {FILE:1<<0, EDIT:1<<1, VIEW:1<<2, INSERT:1<<3, FORMAT:1<<4, TOOL:1<<5, CHART:1<<6, HELP:1<<7};
    var FileSubmenuItems = {NEW:1<<0, OPEN:1<<1, CLOSE:1<<2, SAVE:1<<3, SAVEAS:1<<4, PAGESETUP:1<<5, PRINT:1<<6, PROPERTY:1<<7};
    //初始化插件
    document.write('<object id=DocFrame1 height= 100% width=100% ');
    document.write('data=data:application/x-oleobject;base64,7Kd9juwHQ0OBQYiirbY6XwEABAA7DwMAAgAEAB0AAAADAAQAgICAAAQABAD///8ABQBcAFgAAABLAGkAbgBnAHMAbwBmAHQAIABBAGMAdABpAHYAZQBYACAARABvAGMAdQBtAGUAbgB0ACAARgByAGEAbQBlACAAQwBvAG4AdAByAG8AbAAgADEALgAwAAAA ');
    document.write('classid=clsid:8E7DA7EC-07EC-4343-8141-88A2ADB63A5F viewastext=VIEWASTEXT></object> ');
    obj = document.getElementById("DocFrame1");
    //添加事件方法
    try{
         var fn = function(){
             function obj::OnRequireSave(){
             // alert("用户请求保存文档");
             }
             function obj::OnDocumentOpened(){
             //设置文档状态值

             }
             function obj::OnDocumentCopy(){
             //alert("用户复制");
             }
             function obj::OnDocumentBeforePrint(){
             //alert("用户打印");

             }
             function obj::OnDocumentBeforeSave(){
             //alert("用户保存");
             }
             };
             fn();
    }catch(err){

    }
    setTimeout(function(){

        if(doctype.indexOf("xls")>=0){
            obj.AppModeType="et";
        }
    }, 1);


}
