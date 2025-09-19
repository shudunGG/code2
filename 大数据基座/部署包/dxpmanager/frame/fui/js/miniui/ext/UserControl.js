mini.UserControl = function () {
    mini.UserControl.superclass.constructor.call(this);
};

mini.extend(mini.UserControl, mini.Control, {
    // 如果要用commonDto则必须设置value属性
    value: "",

    // 模板的地址
    tplUrl: "",

    // css文件资源路径
    cssUrl: "",

    isUserControl: true,

    _create: function () {
        this.el = document.createElement("div");

        if (this.cssUrl && !document.getElementById(this.uiCls + '-style')) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = (_rootPath + '/' + this.cssUrl);
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.id = this.uiCls + "-style";
            head.appendChild(link);
        }
    },

    // 在该方法中进行自定义控件模板的加载解析，以及一些真正的初始化工作
    _afterApply: function () {
        this.parseTpl();

    },

    init: function () {

    },

    parseTpl: function () {
        var that = this;

        this.setTplData();

        // 通过ajax获取控件的模板
        jQuery.ajax({
            url: (_rootPath + '/' + this.getTplUrl()),
            // 必须为同步请求
            async: false,
            type: "post",
            dataType: 'html',
            success: function (text) {
                var M = Mustache,
                    templ = $.trim(text);

                // 解析模板，将模板中的id替换为以控件id为前缀，以避免页面同时有多个控件时id冲突。
                // 模板中的控件设置id是为了方便下面的获取
                // 模板中必须使用完整的html结构
                // 如<div role="control" label="标段(包)名称" starred="true"></div>这种需要通过commonjs来解析的html是不允许的，因为commonjs是不会解析的
                var html = M.render(templ, that.tplData);

                // 将解析好的html塞到页面中
                that.el.innerHTML = html;

                // 解析控件html中的miniui控件
                mini.parse(that.el);

                // 其他的一些初始化工作
                // 把后面会用到内部控件缓存起来
                that.controls = {};

                that.init();

                // 处理二次请求的控件
                if (window.DtoUtils) {
                    DtoUtils.bindBeforeLoad(that);
                }

            }
        });
    },

    getTplUrl: function(){
        var lan = mini.Cookie.get('epoint_local');

        if(typeof this.tplUrl === 'string'){
            return this.tplUrl;
        }
        
        return this.tplUrl[lan] || this.tplUrl['zh_CN'];

    },

    setTplData: function () {
        this.tplData = {
            controlId: this.id
        };
    },

    // 设置内部控件的值以及一些根据后台返回数据来控制显隐等操作
    // commonDto中初始化时会调用
    // 具体的数据结构根据控件自己的特点来确定
    // 本控件的数据结构如dbworkflow.json
    setData: function (data) {

        for (var i in data) {
            if (this.controls[i] && data[i]) {
                if (typeof data[i] != 'object' && this.controls[i].setValue) {
                    this.controls[i].setValue(data[i]);
                }
                if (data[i].value && this.controls[i].setValue) {
                    this.controls[i].setValue(data[i].value);
                }
                if (data[i].data) {
                    if (this.controls[i].loadList) {
                        this.controls[i].loadList(data[i].data);
                    } else if (this.controls[i].setData) {
                        this.controls[i].setData(data[i].data);

                        if (data[i].total && this.controls[i].setTotalCount) {
                            this.controls[i].setTotalCount(data[i].total);
                        }
                    }
                }
            }
        }
    },

    // 返回控件的数据
    // commonDto中表单提交 时会调用
    // 具体的数据结构根据控件自己的特点来确定
    getValue: function () {
        var data = {};
        for (var i in this.controls) {
            if (this.controls[i].getValue) {
                data[i] = this.controls[i].getValue();
            }
        }

        return data;
    },

    setValue: function (value) {
        this.value = value;
    }
});