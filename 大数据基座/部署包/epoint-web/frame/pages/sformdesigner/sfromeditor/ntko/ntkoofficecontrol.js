﻿
//document.write(browser);
/*
 谷歌浏览器事件接管
 */
function OnComplete2(type, code, html) {
    //alert(type);
    //alert(code);
    //alert(html);
    //alert("SaveToURL成功回调");
}
function OnComplete(type, code, html) {
    //alert(type);
    //alert(code);
    //alert(html);
    //alert("BeginOpenFromURL成功回调");
}
function OnComplete3(str, doc) {
    TANGER_OCX_OBJ.activeDocument.saved = true;//saved属性用来判断文档是否被修改过,文档打开的时候设置成ture,当文档被修改,自动被设置为false,该属性由office提供.
    //	TANGER_OCX_OBJ.SetReadOnly(true,"");
    //TANGER_OCX_OBJ.ActiveDocument.Protect(1,true,"123");
    //获取文档控件中打开的文档的文档类型
    switch (TANGER_OCX_OBJ.doctype) {
        case 1:
            fileType = "Word.Document";
            fileTypeSimple = "wrod";
            break;
        case 2:
            fileType = "Excel.Sheet";
            fileTypeSimple = "excel";
            break;
        case 3:
            fileType = "PowerPoint.Show";
            fileTypeSimple = "ppt";
            break;
        case 4:
            fileType = "Visio.Drawing";
            break;
        case 5:
            fileType = "MSProject.Project";
            break;
        case 6:
            fileType = "WPS Doc";
            fileTypeSimple = "wps";
            break;
        case 7:
            fileType = "Kingsoft Sheet";
            fileTypeSimple = "et";
            break;
        default :
            fileType = "unkownfiletype";
            fileTypeSimple = "unkownfiletype";
    }

    //alert("ondocumentopened成功回调");
}
function publishashtml(type, code, html) {
    //alert(html);
    //alert("Onpublishashtmltourl成功回调");
}
function publishaspdf(type, code, html) {
//alert(html);
//alert("Onpublishaspdftourl成功回调");
}
function saveasotherurl(type, code, html) {
//alert(html);
//alert("SaveAsOtherformattourl成功回调");
}
function dowebget(type, code, html) {
//alert(html);
//alert("OnDoWebGet成功回调");
}
function webExecute(type, code, html) {
//alert(html);
//alert("OnDoWebExecute成功回调");
}
function webExecute2(type, code, html) {
//alert(html);
//alert("OnDoWebExecute2成功回调");
}
function FileCommand(TANGER_OCX_str, TANGER_OCX_obj) {
    if (TANGER_OCX_str == 3) {
        //alert("不能保存！");
        TANGER_OCX_OBJ.CancelLastCommand = true;
    }
}
function CustomMenuCmd(menuPos, submenuPos, subsubmenuPos, menuCaption, menuID) {
//alert("第" + menuPos +","+ submenuPos +","+ subsubmenuPos +"个菜单项,menuID="+menuID+",菜单标题为\""+menuCaption+"\"的命令被执行.");
}
var classidx64 = "A64E3073-2016-4baf-A89D-FFE1FAA10EE0";

var classid = "A64E3073-2016-4baf-A89D-FFE1FAA10EC2";


var strFullPath = window.document.location.href;
var strPath = window.document.location.pathname.replace("//", "/");
var pos = strFullPath.indexOf(strPath);
var prePath = strFullPath.substring(0, pos);
var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
var RootPah = (prePath + postPath + "/");

var codebase = RootPah + "oa9/archive/forms/officeedit/OfficeControl/ofctnewclsid.cab#version=6,0,1,0";

var codebase64 = RootPah + "oa9/archive/forms/officeedit/OfficeControl/OfficeControlx64.cab#version=5,0,2,8";
if (browser =="IE") {
   
    if (window.navigator.platform == "Win32") {
    
        document.write('<!-- 用来产生编辑状态的ActiveX控件的JS脚本-->   ');
        document.write('<!-- 因为微软的ActiveX新机制，需要一个外部引入的js-->   ');
        document.write('<object id="TANGER_OCX" classid="clsid:' + classid + '"');
        document.write('codebase="' + codebase + '" width="100%" height="100%">   ');
        document.write('<param name="IsUseUTF8URL" value="-1">   ');
        document.write('<param name="IsUseUTF8Data" value="-1">   ');
        document.write('<param name="BorderStyle" value="1">   ');
        document.write('<param name="BorderColor" value="14402205">   ');
        document.write('<param name="TitlebarColor" value="15658734">   ');
        document.write('<param name="ekeytype" value="14">   ');


        document.write('<param name="MakerCaption" value="江苏国泰新点软件有限公司"> ');
        document.write('<param name="MakerKey" value="CA84EA347907F94A0287697115D4F9309E51D16E"> ');
        document.write('<param name="ProductCaption" value="办公系统">  ');
        document.write('<param name="ProductKey" value="CDA940ACE5853C8388EC5F86CDC37BC8F6AD44FD"> ');


        document.write('<param name="TitlebarTextColor" value="0">   ');
        document.write('<param name="MenubarColor" value="14402205">   ');
        document.write('<param name="MenuButtonColor" VALUE="16180947">   ');
        document.write('<param name="MenuBarStyle" value="3">   ');
        document.write('<param name="MenuButtonStyle" value="7">   ');
        document.write('<param name="WebUserName" value="NTKO">   ');
        // document.write('<param name="Caption" value="NTKO OFFICE文档控件示例演示 http://www.ntko.com">   ');
        document.write('<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>   ');
        document.write('</object>');
    }
    if (window.navigator.platform == "Win64") {
        
        document.write('<!-- 用来产生编辑状态的ActiveX控件的JS脚本-->   ');
        document.write('<!-- 因为微软的ActiveX新机制，需要一个外部引入的js-->   ');
        document.write('<object id="TANGER_OCX" classid="clsid:' + classidx64 + '"');
        document.write('codebase="' + codebase64 + '" width="100%" height="100%">   ');
        document.write('<param name="IsUseUTF8URL" value="-1">   ');
        document.write('<param name="IsUseUTF8Data" value="-1">   ');
        document.write('<param name="BorderStyle" value="1">   ');
        document.write('<param name="BorderColor" value="14402205">   ');
        document.write('<param name="TitlebarColor" value="15658734">   ');
        document.write('<param name="isoptforopenspeed" value="0">   ');
        document.write('<param name="TitlebarTextColor" value="0">   ');


        document.write('<param name="MenubarColor" value="14402205">   ');
        document.write('<param name="MenuButtonColor" VALUE="16180947">   ');
        document.write('<param name="MenuBarStyle" value="3">   ');
        document.write('<param name="MenuButtonStyle" value="7">   ');
        document.write('<param name="WebUserName" value="NTKO">   ');
        // document.write('<param name="Caption" value="NTKO OFFICE文档控件示例演示 http://www.ntko.com">   ');
        document.write('<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>   ');
        document.write('</object>');

    }

}
else if (browser == "firefox") {
    document.write('<object id="TANGER_OCX" type="application/ntko-plug"  codebase="' + codebase + '" width="100%" height="100%" ForOnSaveToURL="OnComplete2" ForOnBeginOpenFromURL="OnComplete" ForOndocumentopened="OnComplete3"');

    document.write('ForOnpublishAshtmltourl="publishashtml"');
    document.write('ForOnpublishAspdftourl="publishaspdf"');
    document.write('ForOnSaveAsOtherFormatToUrl="saveasotherurl"');
    document.write('ForOnDoWebGet="dowebget"');
    document.write('ForOnDoWebExecute="webExecute"');
    document.write('ForOnDoWebExecute2="webExecute2"');
    document.write('ForOnFileCommand="FileCommand"');
    document.write('ForOnCustomMenuCmd2="CustomMenuCmd"');
    document.write('_IsUseUTF8URL="-1"   ');


    document.write('_MakerCaption="江苏国泰新点软件有限公司" ');
    document.write('_MakerKey="CA84EA347907F94A0287697115D4F9309E51D16E" ');
    document.write('_ProductCaption="江苏国泰新点软件有限公司"  ');
    document.write('_ProductKey="8A60C652B22CD9D67EB4BFDEC6B79E6818D6719E"');


    document.write('_IsUseUTF8Data="-1"   ');
    document.write('_BorderStyle="1"   ');
    document.write('_BorderColor="14402205"   ');
    document.write('_MenubarColor="14402205"   ');
    document.write('_MenuButtonColor="16180947"   ');
    document.write('_MenuBarStyle="3"  ');
    document.write('_MenuButtonStyle="7"   ');
    document.write('_WebUserName="NTKO"   ');
    document.write('clsid="{' + classid + '}" >');
    document.write('<SPAN STYLE="color:red">尚未安装NTKO Web FireFox跨浏览器插件。请点击<a href="' + RootPah + 'oa/epointarchive/pages/officeedit/OfficeControl/NtkoAllControlSetup.msi">安装组1件</a></SPAN>');
    document.write('</object>   ');
} else if (browser == "chrome") {
    document.write('<object id="TANGER_OCX" clsid="{' + classid + '}"  ForOnSaveToURL="OnComplete2" ForOnBeginOpenFromURL="OnComplete" ForOndocumentopened="OnComplete3"');
    document.write('ForOnpublishAshtmltourl="publishashtml"');
    document.write('ForOnpublishAspdftourl="publishaspdf"');
    document.write('ForOnSaveAsOtherFormatToUrl="saveasotherurl"');
    document.write('ForOnDoWebGet="dowebget"');
    document.write('ForOnDoWebExecute="webExecute"');
    document.write('ForOnDoWebExecute2="webExecute2"');
    document.write('ForOnFileCommand="FileCommand"');


    document.write('_MakerCaption="江苏国泰新点软件有限公司" ');
    document.write('_MakerKey="CA84EA347907F94A0287697115D4F9309E51D16E" ');
    document.write('_ProductCaption="办公系统"  ');
    document.write('_ProductKey="CDA940ACE5853C8388EC5F86CDC37BC8F6AD44FD"');


    document.write('ForOnCustomMenuCmd2="CustomMenuCmd"');
    document.write('codebase="' + codebase + '" width="100%" height="100%" type="application/ntko-plug" ');
    document.write('_IsUseUTF8URL="-1"   ');
    document.write('_IsUseUTF8Data="-1"   ');
    document.write('_BorderStyle="1"   ');
    document.write('_BorderColor="14402205"   ');
    document.write('_MenubarColor="14402205"   ');
    document.write('_MenuButtonColor="16180947"   ');
    document.write('_MenuBarStyle="3"  ');
    document.write('_MenuButtonStyle="7"   ');
    document.write('_WebUserName="NTKO"   ');
    // document.write('_Caption="NTKO OFFICE文档控件示例演示 http://www.ntko.com">    ');
    document.write('<SPAN STYLE="color:red">尚未安装NTKO Web Chrome跨浏览器插件。请点击<a href="ntkoplugins.crx">安装组件</a></SPAN>   ');
    document.write('</object>');
} else if (Sys.opera) {
    //alert("sorry,ntko web印章暂时不支持opera!");
} else if (Sys.safari) {
	
    //alert("sorry,ntko web印章暂时不支持safari!");
}