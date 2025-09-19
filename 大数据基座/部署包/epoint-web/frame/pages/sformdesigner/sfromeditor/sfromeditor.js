/**
 * Created by panking1989 on 2018/12/5.
 */
// 请勿修改，否则可能出错
var userAgent = navigator.userAgent,
    rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
    rFirefox = /(firefox)\/([\w.]+)/,
    rOpera = /(opera).+version\/([\w.]+)/,
    rChrome = /(chrome)\/([\w.]+)/,
    rSafari = /version\/([\w.]+).*(safari)/;
var browser;
var version;
var ua = userAgent.toLowerCase();
function uaMatch(ua) {
    var match = rMsie.exec(ua);
    if (match != null) {
        return {browser: "IE", version: match[2] || "0"};
    }
    var match = rFirefox.exec(ua);
    if (match != null) {
        return {browser: match[1] || "", version: match[2] || "0"};
    }
    var match = rOpera.exec(ua);
    if (match != null) {
        return {browser: match[1] || "", version: match[2] || "0"};
    }
    var match = rChrome.exec(ua);
    if (match != null) {
        return {browser: match[1] || "", version: match[2] || "0"};
    }
    var match = rSafari.exec(ua);
    if (match != null) {
        return {browser: match[2] || "", version: match[1] || "0"};
    }
    if (match != null) {
        return {browser: "", version: "0"};
    }
}
var browserMatch = uaMatch(userAgent.toLowerCase());
if (browserMatch.browser) {
    browser = browserMatch.browser;
    version = browserMatch.version;
}

(function (win) {
    if (!win.oaeditor)
        win.oaeditor = new Object();
    var oaeditor = win.oaeditor;
    oaeditor.onloaded;//定义一个加载后事件

    /**初始化方法  获取后台配置的参数 根据系统设置来确定使用哪种组件**/
    oaeditor.initall = function () {
        var editorMode = "";
        if (win.Util)
            editorMode = win.Util.getFrameSysParam("oaEditorMode");
        if (editorMode == ""||editorMode ==undefined) {
            editorMode = "ntko";
        }
        oaeditor.editorMode = editorMode;
        oaeditor.clientOs = ClientOs();
    }
    oaeditor.initall();

    //加载控件js文件
    oaeditor.loadcontroljs = function (url) {
        if (oaeditor.clientOs == "Linux") {
             //linux国产化环境目前只支持wps和yozo
            if (oaeditor.editorMode == "yozo") {
                document.write('<script language="javascript" type="text/javascript" src="'+win.Util.getRootPath()+'frame/pages/sformdesigner/sfromeditor/yozo/yozoofficecontrol.js"></script> ');
            }else{
                document.write('<script language="javascript" type="text/javascript" src="'+win.Util.getRootPath()+'frame/pages/sformdesigner/sfromeditor/wps/wpsofficecontrollinux.js"></script> ');
            }
        }
        else if (oaeditor.clientOs == "Win") {
            if (oaeditor.editorMode != "wps") {
                document.write('<script language="javascript" type="text/javascript" src="'+win.Util.getRootPath()+'frame/pages/sformdesigner/sfromeditor/ntko/ntkoofficecontrol.js"></script> ');
            }else{
                document.write('<script language="javascript" type="text/javascript" src="'+win.Util.getRootPath()+'frame/pages/sformdesigner/sfromeditor/wps/wpsofficecontrolwindows.js"></script> ');
            }
        }
        else {
            alert("oaeditor 不支持当前操作系统，加载组件js失败");
        }
    }

    //加载控件方法库js
    oaeditor.loadfunctionjs = function (url) {
        if (oaeditor.clientOs == "Linux") {
            if (oaeditor.editorMode == "yozo") {
                document.write('<script src="'+win.Util.getRootPath()+'frame/pages/sformdesigner/sfromeditor/yozo/yozo.js"></script> ');
            }else{
                document.write('<script src="'+win.Util.getRootPath()+'frame/pages/sformdesigner/sfromeditor/wps/wps.js"></script> ');
            }
            //linux国产化环境目前只支持wps和yozo
        }
        else if (oaeditor.clientOs == "Win") {
            if (oaeditor.editorMode != "wps") {
                document.write('<script src="'+win.Util.getRootPath()+'frame/pages/sformdesigner/sfromeditor/ntko/ntko.js"></script> ');
            }else{
                document.write('<script src="'+win.Util.getRootPath()+'frame/pages/sformdesigner/sfromeditor/ntko/ntko.js"></script> ');
            }
        }
        else {
            alert("oaeditor 不支持当前操作系统，加载方法库js失败");
        }
    }

    oaeditor.OpenEditOffice=function(url, newofficetype, username){
        OpenEditOffice(url, newofficetype, username);
    }

    oaeditor.save=function (urlForSave,cmd) {
        saveFileToUrl(urlForSave,cmd);
    }

    //设置是否显示痕迹
    oaeditor.setShowRevisions=function(boolvalue){
        setShowRevisions(boolvalue);
    }

    /**获得操作系统***/
    function ClientOs() {
        var platform = win.navigator.platform;
        var isWin = (platform == "Win32") || (platform == "Windows");
        var isMac = (platform == "Mac68K") || (platform == "MacPPC") || (platform == "Macintosh") || (platform == "MacIntel");
        if (isMac)
            return "Mac";
        var isUnix = (platform == "X11") && !isWin && !isMac;
        if (isUnix)
            return "Unix";
        var isLinux = (String(platform).indexOf("Linux") > -1);
        if (isLinux)
            return "Linux";
        if (isWin) {
            return "Win";
        }
        return "other";
    }

})(window);