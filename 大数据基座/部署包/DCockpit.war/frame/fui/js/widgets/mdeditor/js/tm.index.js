(function(win, $) {
  var MDEditor = function(options) {
    return new MDEditor.fn.init(options);
  };

  MDEditor.prototype = MDEditor.fn = {
    init: function(options) {
      options = options || {};
      if (!options.id || !options.clipImageUrl || !options.getReferInfoList) {
        console.log("参数 id,clipImageUrl,getReferInfoList 必传");
        return false;
      }

      this.option = {
        bookId: "1",
        articleId: "1",
        useStorage: false,
        localStorageName: "MdDataBase@",
        imgUploadSuccess: $.noop,
        imgUploadFaild: $.noop,
        imgUploadComplete: $.noop,
        onMdLoad: $.noop,
        onMdChange: $.noop
      };

      this.option           = $.extend({}, this.option, options);

      this.editor           = ""; // 编辑器实例

      this.bookId           = this.option.bookId;
      this.articleId        = this.option.articleId;
      this.useStorage       = this.option.useStorage;
      this.localStorageName = this.option.id + this.option.localStorageName;
      this.bookId           = this.option.bookId;
      this.tmStorage        = new TmStorage(this.localStorageName);
      this.imgDomain        = this.option.imgDomain || ""; // 上传图片后返回地址拼接的域名

      this.editorId         = this.option.id;
      this.clipImageUrl     = this.option.clipImageUrl; // 图片上传地址
      this.getReferInfoList = this.option.getReferInfoList; //获取文章列表

      this.imgUploadSuccess = this.option.imgUploadSuccess;
      this.imgUploadComplete = this.option.imgUploadComplete;
      this.imgUploadFaild   = this.option.imgUploadFaild;
      this.onMdLoad         = this.option.onMdLoad;
      this.onMdChange       = this.option.onMdChange;

      this.isLoaded = false;
      this.initUploadImg();
    }
  };

  // 渲染编辑器内容
  MDEditor.prototype.renderEditor = function(md) {
    var that           = this,
      articleInfo      = {},
      editorId         = that.editorId;
      
    if(md.articleId) {
        that.articleId = md.articleId;
    }
    if(md.bookId) {
        that.bookId = md.bookId;
    }

    articleInfo.content = md && md.content ? md.content : "";

    if (!that.editor) {
      that.editor = editormd(editorId, {
        width: "100%",
        height: "100%",
        path: getPath + "lib/",
        markdown: articleInfo.content || "",
        bookId: that.bookId, // 自定义添加的参数 bookId
        articleId: that.articleId, // 自定义添加的参数 articleId
        placeholder: "开始编辑…",
        codeFold: true,
        syncScrolling: true,
        saveHTMLToTextarea: true, // 保存 HTML 到 Textarea
        searchReplace: true,
        watch: true, // 关闭实时预览
        htmlDecode: "style,script,iframe|on*", // 开启 HTML 标签解析，为了安全性，默认不开启
        emoji: false,
        taskList: true,
        tocm: true, // Using [TOCM]
        tex: true, // 开启科学公式TeX语言支持，默认关闭
        flowChart: true, // 开启流程图支持，默认关闭
        sequenceDiagram: true, // 开启时序/序列图支持，默认关闭,
        referInfoUrl: that.getReferInfoList, // 文章标题查询
        useStorage: that.useStorage, // 是否启用本地存储
        imageUpload: true,
        imageList: [], // 自定义添加的参数 图片列表 imageList
        imageIndexList: [], //用于删除列表中已经上传后的图片或者文件（不会删除服务器)

        imageUploadOnShow: function() {
          // 自定义方法
          // 点击按钮拖拽上传图片
          // var imgArr = [];
          var self = this;
          self.imageList = [];
          self.imageIndexList = [];

          $("#demo").zyUpload({
            width: "650px", // 宽度
            height: "400px", // 宽度
            itemWidth: "120px", // 文件项的宽度
            itemHeight: "100px", // 文件项的高度
            url: that.clipImageUrl, // 上传文件的路径
            multiple: true, // 是否可以多个文件上传
            dragDrop: true, // 是否可以拖动上传文件
            del: true, // 是否可以删除文件
            finishDel: false, // 是否在上传文件完成后删除预览
            /* 外部获得的回调接口 */
            onSelect: function(files, allFiles) {
              // 选择文件的回调方法
            },
            onDelete: function(file, surplusFiles) {
              // 删除一个文件的回调方法

              var _index = file.index;
              site = self.imageIndexList.indexOf(_index);

              if (site > -1) {
                self.imageList.splice(site, 1);
                self.imageIndexList.splice(site, 1);
              }
            },
            onSuccess: function(file, info) {
              var resInfo;
              if(info + '' === info) {
                resInfo = JSON.parse(info) || {};
              }else{
                resInfo= info;
              }
              if(resInfo.custom) {
                resInfo = resInfo.custom;
                if(resInfo + '' === resInfo) {
                  resInfo = JSON.parse(resInfo) || {};
                }
              }
              // 文件上传成功的回调方法
              if (resInfo.error) {
                mini.showTips({
                  content: "图片或文件上传失败"
                });
              } else {
                var _type = "file",
                  _url = resInfo.imgurl;

                if (file.type.indexOf("image") == 0) {
                  _type = "image";
                } else {
                  //此处后端返回的url用了框架的方法，带上了项目地址，需要特殊处理一下
                  var _tempArr = _url.split("/");
                  _tempArr.splice(0, 2);

                  _url = "/" + _tempArr.join("/");
                }

                self.imageList.push({
                  url: _url,
                  type: _type,
                  name: file.name
                });
                self.imageIndexList.push(file.index);

                that.imgUploadSuccess(file);
              }
            },
            onFailure: function(file) {
              // 文件上传失败的回调方法
              that.imgUploadFaild(file);
            },
            onComplete: function(responseInfo) {
              // 上传完成的回调方法
              that.imgUploadComplete(responseInfo);
            }
          });
        },
        imageUploadOnClose: function() {
          //自定义方法。图片弹窗关闭时触发
          // saveToDraft();
        },
        imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL: that.clipImageUrl,
        crossDomainUpload: true,
        toolbarHandlers: {
          article: function(cm, icon, cursor, selection) {
            this.executePlugin(
              "articleLinkDialog",
              "../plugins/article-link-dialog/article-link-dialog"
            );
          }
        },
        uploadCallbackURL: "",
        sosCallback: function() {
          var articleInfo = that.tmStorage.readArticle(
            that.bookId,
            that.articleId
          );

          that.editor.setValue(articleInfo.content);
        },
        onfullscreenExit: function() {
          this.resize();
        },
        onload: function() {
          // 加载完毕
          that.onMdLoad();
          // 如果是在编辑完后再保存，万一浏览器不小心关闭，支持恢复功能，实时保存则不需要下面的代码
          that.createStorage(articleInfo);
          
          that.isLoaded = true;
        },
        onchange: function(e) {
          // 改变内容
          if(that.isLoaded) {
            that.onMdChange(that.editor);
  
            // 如果是在编辑完后再保存，万一浏览器不小心关闭，支持恢复功能，实时保存则不需要下面的代码
            if (that.useStorage && that.isLoaded) {

              that.createStorage(articleInfo);

              that.tmStorage.editArticle(
                this.settings.bookId,
                this.settings.articleId,
                this.getMarkdown()
              );
            }
          }
        }
      });

    } else {
      that.editor.setValue(articleInfo.content);
    }

    return this;
  };

  //创建本地存储
  MDEditor.prototype.createStorage = function(articleInfo) {
    var that = this;
    if (that.useStorage) {
        var serverArticleInfo = {
          bookId: that.bookId,
          articleId: that.articleId,
          content: articleInfo.content
        };

        var storageContent = that.tmStorage.readArticle(
          that.bookId,
          that.articleId
        );

        if (!storageContent) {
          that.tmStorage.saveArticle(serverArticleInfo);
        }
      }
  }

  MDEditor.prototype.initUploadImg = function() {
    // chrome下粘贴板上传图片
    var that = this;
    this.uploadImage = new UploadImage({
      id: that.editorId,
      url: that.clipImageUrl,
      callback: function(res) {
        var imgStr =
          "![](" + that.imgDomain + res.imgurl + ")\r\n\r\n";
        that.editor.replaceSelection(imgStr);
      }
    },true);
  };

  MDEditor.prototype.removeStorage = function(bookId,articleId) {
    var that = this;
    if(that.useStorage) {
        that.tmStorage.removeArticle(bookId, articleId); 
    }
  }

  MDEditor.prototype.updateImageUrl = function(opt) {
    var that = this;
    that.clipImageUrl = opt.clipImageUrl;
    that.editor.imageUploadURL = opt.clipImageUrl;
    that.uploadImage.uploadUrl({
        url: opt.clipImageUrl
    });
  };

  MDEditor.fn.init.prototype = MDEditor.fn;

  win.MDEditor = MDEditor;
})(window, jQuery);