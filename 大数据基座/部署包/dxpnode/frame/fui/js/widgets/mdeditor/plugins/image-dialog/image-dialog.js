/*!
 * Image (upload) dialog plugin for Editor.md
 *
 * @file        image-dialog.js
 * @author      pandao
 * @version     1.3.4
 * @updateTime  2015-06-09
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function() {

    var factory = function (exports) {

		var pluginName   = "image-dialog";

		exports.fn.imageDialog = function() {

            var _this       = this;
            var cm          = this.cm;
            var lang        = this.lang;
            var editor      = this.editor;
            var settings    = this.settings;
            var cursor      = cm.getCursor();
            var selection   = cm.getSelection();
            var imageLang   = lang.dialog.image;
            var classPrefix = this.classPrefix;
            var iframeName  = classPrefix + "image-iframe";
			var dialogName  = classPrefix + pluginName, dialog;

			cm.focus();

            var loading = function(show) {
                var _loading = dialog.find("." + classPrefix + "dialog-mask");
                _loading[(show) ? "show" : "hide"]();
            };

            if (editor.find("." + dialogName).length < 1)
            {
                var guid   = (new Date).getTime();
                var action = settings.imageUploadURL + (settings.imageUploadURL.indexOf("?") >= 0 ? "&" : "?") + "guid=" + guid;

                if (settings.crossDomainUpload)
                {
                    action += "&callback=" + settings.uploadCallbackURL + "&dialog_id=editormd-image-dialog-" + guid;
                }

                var dialogContent = ( (settings.imageUpload) ? "<div id='demo' class='demo'></div>" : "</div>");

                //var imageFooterHTML = "<button class=\"" + classPrefix + "btn " + classPrefix + "image-manager-btn\" style=\"float:left;\">" + imageLang.managerButton + "</button>";

                dialog = this.createDialog({
                    title      : imageLang.title,
                    width      : (settings.imageUpload) ? 690 : 400,
                    height     : 530,
                    name       : dialogName,
                    content    : dialogContent,
                    mask       : settings.dialogShowMask,
                    drag       : settings.dialogDraggable,
                    closed     : false,
                    lockScreen : settings.dialogLockScreen,
                    maskStyle  : {
                        opacity         : settings.dialogMaskOpacity,
                        backgroundColor : settings.dialogMaskBgColor
                    },
                    buttons : {
                        enter : [lang.buttons.enter, function() {
                            // console.log('确定')
                            // console.log(settings.imageList);

                            var _imageList = settings.imageList;

                            for (var i = _imageList.length - 1; i >= 0; i--) {
                            //   console.log(_imageList[i].url);
                                var imgObj = _imageList[i],
                                    _type = imgObj.type,
                                    _str = _type == 'image' ? ("!["+imgObj.name+"](" + imgObj.url) : ("["+imgObj.name+"](" + imgObj.url);

                                cm.replaceSelection(_str + ")\r\n\r\n");
                            }

                            this.hide().lockScreen(false).hideMask();
                            $('#demo').html('');
                            if(typeof settings.imageUploadOnClose == 'function') {
                              settings.imageUploadOnClose();
                            }
                            return false;
                        }],

                        cancel : [lang.buttons.cancel, function() {
                            //取消时清空数据
                            settings.imageList = [];
                            settings.imageIndexList = [];
                            ZYFILE.uploadFile = [];
                            ZYFILE.lastUploadFile = [];
                            ZYFILE.perUploadFile = [];
                            ZYFILE.fileNum = 0;
                            this.hide().lockScreen(false).hideMask();
                            $('#demo').html('');
                            if(typeof settings.imageUploadOnClose == 'function') {
                              settings.imageUploadOnClose();
                            }
                            return false;
                        }]
                    }
                });

                dialog.attr("id", classPrefix + "image-dialog-" + guid);

				if (!settings.imageUpload) {
                    return ;
                }

				var fileInput  = dialog.find("[name=\"" + classPrefix + "image-file\"]");

				fileInput.bind("change", function() {
					var fileName  = fileInput.val();
					var isImage   = new RegExp("(\\.(" + settings.imageFormats.join("|") + "))$"); // /(\.(webp|jpg|jpeg|gif|bmp|png))$/

					if (fileName === "")
					{
						alert(imageLang.uploadFileEmpty);

                        return false;
					}

                    if (!isImage.test(fileName))
					{
						alert(imageLang.formatNotAllowed + settings.imageFormats.join(", "));

                        return false;
					}

                    loading(true);

                    var submitHandler = function() {

                        var uploadIframe = document.getElementById(iframeName);

                        uploadIframe.onload = function() {

                            loading(false);

                            var body = (uploadIframe.contentWindow ? uploadIframe.contentWindow : uploadIframe.contentDocument).document.body;
                            var json = (body.innerText) ? body.innerText : ( (body.textContent) ? body.textContent : null);

                            json = (typeof JSON.parse !== "undefined") ? JSON.parse(json) : eval("(" + json + ")");

                            if(!settings.crossDomainUpload)
                            {
                              if (json.success === 1)
                              {
                                  dialog.find("[data-url]").val(json.url);
                              }
                              else
                              {
                                  alert(json.message);
                              }
                            }

                            return false;
                        };
                    };

                    dialog.find("[type=\"submit\"]").bind("click", submitHandler).trigger("click");
				});
            }

			dialog = editor.find("." + dialogName);
			dialog.find("[type=\"text\"]").val("");
			dialog.find("[type=\"file\"]").val("");
			dialog.find("[data-link]").val("http://");

			this.dialogShowMask(dialog);
			this.dialogLockScreen();
            this.settings.imageUploadOnShow();
            
			dialog.show();

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
