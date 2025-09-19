/*!
 * Link dialog plugin for Editor.md
 *
 * @file        article-dialog.js
 * @author      jjj
 * @version     1.2.1
 * @updateTime  2018-04-27
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function() {

    var factory = function (exports) {

		var pluginName   = "article-link-dialog";

		exports.fn.articleLinkDialog = function() {

			var _this       = this;
			var cm          = this.cm;
            var editor      = this.editor;
            var settings    = this.settings;
            var selection   = cm.getSelection();
            var lang        = this.lang;
            var linkLang    = lang.dialog.article;
            var classPrefix = this.classPrefix;
			var dialogName  = classPrefix + pluginName, dialog;

			cm.focus();

            if (editor.find("." + dialogName).length > 0)
            {
                dialog = editor.find("." + dialogName);
                // dialog.find("[data-url]").val("http://");
                // dialog.find("[data-title]").val(selection);

                this.dialogShowMask(dialog);
                this.dialogLockScreen();
                dialog.show();
            }
            else
            {
                var dialogHTML = "<div class=\"" + classPrefix + "form tm-article-dialog\">" + 
                                        "<label>" + linkLang.name + "</label>" + 
                                        "<input class='tm-article-input' type=\"text\" data-name />" +
                                        "<div class='tm-article-result'>"+
                                            "<ul class='tm-article-list'>"+

                                            "</ul>"+
                                            "<div class='tm-article-loader line-scale-party'>"+
                                              "<div></div>"+
                                              "<div></div>"+
                                              "<div></div>"+
                                              "<div></div>"+
                                            "</div>"+
                                        "</div>"+
                                        "<br/>" +
                                    "</div>";

                dialog = this.createDialog({
                    title      : linkLang.title,
                    width      : 380,
                    height     : 312,
                    content    : dialogHTML,
                    mask       : settings.dialogShowMask,
                    drag       : settings.dialogDraggable,
                    lockScreen : settings.dialogLockScreen,
                    maskStyle  : {
                        opacity         : settings.dialogMaskOpacity,
                        backgroundColor : settings.dialogMaskBgColor
                    },
                    buttons    : {
                        close : [lang.buttons.close, function() {                                   
                            this.hide().lockScreen(false).hideMask();

                            if(typeof settings.imageUploadOnClose == 'function') {
                              settings.imageUploadOnClose();
                            }
                            return false;
                        }]
                    }
                });
			}

            var timer = null,
                $loader = $('.tm-article-loader',dialog),
                $list = $('.tm-article-list',dialog);
                

            dialog.off("input propertychange",'.tm-article-input').on("input propertychange",'.tm-article-input', function() {
                if(timer) clearTimeout(timer);
                var $this = $(this);


                timer = setTimeout(function() {
                    var value = $.trim($this.val());
                    
                    if(!value) return false;

                    $loader.show();
                    $list.html('');
                    queryTitle(value, settings.referInfoUrl,function(res) {
                        var strList = '';
                        res.forEach(function(item,index) {
                            strList += '<li class="tm-artile-item" data-id="'+item.id+'">'+item.title+'</li>'
                        });
                        $loader.hide();
                        $list.html(strList);
                    });
                }, 500);

            }).off('click','.tm-artile-item').on('click','.tm-artile-item', function(){
                var $this = $(this),
                    id = $this.data('id'),
                    title = $this.text();

                cm.replaceSelection("["+title+"](@ "+id+")\r\n\r\n");
                cm.focus();
                dialog.hide().lockScreen(false).hideMask();
                
                if(typeof settings.imageUploadOnClose == 'function') {
                  settings.imageUploadOnClose();
                }
                return false;

            });


		};

	};
    
	// CommonJS/Node.js
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    { 
        module.exports = factory;
    }
	else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
		if (define.amd) { // for Require.js

			define(["editormd"], function(editormd) {
                factory(editormd);
            });

		} else { // for Sea.js
			define(function(require) {
                var editormd = require("./../../editormd");
                factory(editormd);
            });
		}
	} 
	else
	{
        factory(window.editormd);
	}

})();
