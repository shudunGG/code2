/**
 * version: 1.0.0
 * author: jjj
 * data: 2018-08-22
 */

(function() {
    var getPath = function() {
        var e = document.currentScript ? document.currentScript.src : function() {
            for (var e, t = document.scripts, i = t.length - 1, n = i; n > 0; n--)
                if ("interactive" === t[n].readyState) {
                    e = t[n].src;
                    break
                }
            return e || t[i].src
        }();
        return e.substring(0, e.lastIndexOf("/") + 1)
    }();
    window.getPath = getPath;
    
    // 加载css
    var _head = document.getElementsByTagName("head")[0];
    var cssUrls = [
        getPath + "css/style.css",
        getPath + "css/editormd.css",
        getPath + 'css/katex.min.css',
        getPath + "lib/uploadimage/css/zyUpload.css"
    ];
    
    for(var i = 0, len = cssUrls.length; i < len; i++) {
        var _link = document.createElement("link");
        _link.rel = "stylesheet";
        _link.href = cssUrls[i];
        _head.appendChild(_link);
    }
    
    // 加载js
    SrcBoot.output([
        getPath + "js/tm.storage.js",
        getPath + "lib/uploadimage/js/zyFile.js",
        getPath + "lib/uploadimage/js/zyUpload.js",
        getPath + "js/tm.uploadPasteImg.js",
        getPath + "js/tm.queryArticleTitle.js",
        getPath + "lib/codemirror/codemirror.min.js",
        getPath + "lib/codemirror/mode/javascript/javascript.js",
        getPath + "lib/codemirror/mode/xml/xml.js",
        getPath + "lib/codemirror/mode/css/css.js",
        getPath + "lib/codemirror/mode/htmlmixed/htmlmixed.js",
        getPath + "js/editormd.js",
        getPath + 'js/katex.min.js',
        getPath + "js/tm.index.js"
    ])
})();
