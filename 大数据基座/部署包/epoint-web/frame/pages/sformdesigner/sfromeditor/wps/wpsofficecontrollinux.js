 var hasloaded=false;
  var obj;

 var projectpath=Util.getRootPath();

 var doctype="doc";


function init(tagID, w, h) {
    var iframe;

    iframe = document.getElementById(tagID);
    var codes=[];
    //codes.push("");
    codes.push("<object  name='webwps' id='DocFrame1' type='application/x-wps'  data='"+projectpath+"pages/oa9/js/oaeditor/wps/Normal.dotm'  width='100%'  height='100%'> <param name='Enabled' value='1' />  </object>");
    iframe.innerHTML = codes.join("");
    obj = document.getElementById("DocFrame1");
    //console.log(obj);
    //注册打开文档事件
    //obj.Application.registerEvent("DIID_ApplicationEvents4","DocumentOpened","DocumentOpenedCallBack");
    return obj;
}

 function InitET(tagID)
 {
     if (obj != undefined)
         obj.Application.Quit();
     var iframe;
     iframe = document.getElementById(tagID);
     var codes=[];
     codes.push('<object name="rpcet" id="DocFrame1" type="application/x-et" wpsshieldbutton="false" data="'+projectpath+'pages/oa9/js/oaeditor/wps/newfile.et" width="100%" height="100%">');
     codes.push('<param name="quality" value="high" />');
     codes.push('<param name="bgcolor" value="#ffffff" />');
     codes.push('<param name="Enabled" value="1" />');
     codes.push('<param name="allowFullScreen" value="true" />');
     codes.push('</object>');
     iframe.innerHTML = codes.join("");
     obj = document.getElementById("DocFrame1");
     window.onbeforeunload = function() {
         obj.Application.Quit();
     };
 }

function InitFrame()
{
    $.ajax({
        url: Util.getRootPath()+'rest/mailofficeeditaction/getDocType?isCommondto=true&attachguid=' + Util.getUrlParams("attachguid"),
        type: 'POST', //GET
        async: true,    //或false,是否异步
        data: null,
        //dataType: "json",//返回的数据格式：json/xml/html/script/jsonp/text
        success: function (data) {

            doctype=data;
            console.log(doctype);
            if(doctype.indexOf("xls")>=0){
                InitET("officecontrol");
            }else{

                obj = init("officecontrol", "100%", "100%");
                var Interval_control = setInterval(
                    function(){
                        DocFrame = obj.Application;
                        if(DocFrame && DocFrame.IsLoad()){
                            clearInterval(Interval_control);
                            //setTimeout('DocumentOpenedCallBack()',2000);



                        }
                    },500);
            }

        }
    });




}

 InitFrame();
