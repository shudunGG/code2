(function ($) {
    function init(ele) {
        var state = $.data(ele, 'emotion'),
            opts = state.options;
        ele.id = !ele.id ? 'emotion' + rand() : ele.id;
        if (!state.panel) {
            render();
        }
        function render() {
            var $panel = $("<div/>", { "class": "emotion-panel" }).insertAfter($(ele)),
            $faces = $("<ul/>", { "class": "face-list" }).appendTo($panel);
            var html = "";

            $.each(opts.emotions, function (i, item) {
                html += '<li><span class="face" title="' + item.phrase + '"><img src="' + (opts.path + item.icon) + '"/></span></li>';
            });
            $faces.html(html);
            state.panel = $panel;
            _bindHandler(ele);
        }
    }

    //输入框光标定位
    var savedRange, isInFocus;

    var saveSelection = function () {
        if (window.getSelection) {
            var s = window.getSelection();
            if (s.rangeCount > 0) {
                savedRange = s.getRangeAt(0);
            }
        }
        else if (document.selection) {
            savedRange = document.selection.createRange();
        }
    };

    var restoreSelection = function (ele) {
        isInFocus = true;
        ele.focus();
        if (savedRange !== null) {
            if (window.getSelection) {
                var s = window.getSelection();
                if (s.rangeCount > 0) {
                    s.removeAllRanges();
                }
                s.addRange(savedRange);
            }
            else if (document.createRange) {
                window.getSelection().addRange(savedRange);
            }
            else if (document.selection) {
                savedRange.select();
            }
        }
    };

    var resetSelection = function (ele) {
        savedRange = null;

        if (window.getSelection) {
            ele.focus();
            var s = window.getSelection();
            s.removeAllRanges();
            s.selectAllChildren(ele);
            if (s.rangeCount > 0) {
                s.collapseToEnd();
            }
        }
        else if (document.selection) {
            var range = document.selection.createRange();
            range.moveToElementText(ele);
            range.collapse(false);
            range.select();
        }
        saveSelection();
    };

    function rand() {
        return ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6).toUpperCase();
    }

    function _bindHandler(ele) {
        var state = $.data(ele, 'emotion'),
            panel = state.panel,
            opts = state.options;
        var $target = $(opts.target);
        var ns = '.emotion' + ele.id;
        panel.hover(function () {
            $(document).off(ns);
        }, function () {
            $(document).off(ns).on('mousedown' + ns, function () {
                _close(ele);
            });
        }).on("click", ".face", function (e) {
            _close(ele);
            var $img = $(this).children('img');
            _insertHtml($target[0], "<img class='eimg' src='" + $img.attr('src') + "'/>");
            e.preventDefault();
        });
        $(ele).on("click", function (e) {
            e.stopPropagation();
            if (panel.is(':visible')) {
                _close(ele);
            } else {
                _open(ele);
            }
        }).hover(function () {
            $(document).off(ns);
        }, function () {
            $(document).off(ns).on('mousedown' + ns, function () {
                _close(ele);
            });
        });

        $target.on("blur", function () {
            isInFocus = false;
        }).on("focus", function () {
            restoreSelection(this);
        }).on("mousedown click", function (e) {
            if (isInFocus === false && savedRange !== null) {
                e.stopPropagation();
                e.preventDefault();
                restoreSelection(this);
                return false;
            }
        }).on("mouseup keyup", function () {
            saveSelection();
        });
    }

    function _open(ele) {
        var state = $.data(ele, 'emotion');
        if (!state) { return; }
        var panel = state.panel;
        panel.show();
    }

    function _close(ele) {
        var state = $.data(ele, 'emotion');
        if (!state) { return; }
        var panel = state.panel;
        panel.hide();
    }

    function _insertHtml(target, html) {
        target.focus();
        var selection, range;
        if (window.getSelection) {
            selection = window.getSelection();
            range = selection.getRangeAt(0);
            range.collapse(false);
            var n = range.createContextualFragment(html);
            range.insertNode(n);
            selection.removeAllRanges();
            selection.addRange(range);
            selection.collapseToEnd();

        } else if (document.selection && document.selection.createRange) {
            selection = document.selection;
            range = selection.createRange();
            range.pasteHTML(html);
            range.collapse(false);
            range.select();
        }
        saveSelection();
        target.focus();
    }

    $.fn.emotion = function (options, param) {
        if (typeof options === 'string') {
            var method = $.fn.emotion.methods[options];
            if (method) {
                return method(this, param);
            }
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'emotion');
            if (state) {
                return;
            } else {
                $.data(this, 'emotion', {
                    options: $.extend({}, $.fn.emotion.defaults, options)
                });
                init(this);
            }
        });
    };
    $.fn.emotion.methods = {
        resetCursor: function (jq) {
            return jq.each(function () {
                resetSelection(this);
            });
        },
        insertHtml: function (jq, html) {
            return jq.each(function () {
                _insertHtml(this, html);
            });
        }
    };

    $.fn.emotion.defaults = {
        path: "image/",
        emotions: [{ "phrase": "[微笑]", "icon": "huanglianwx_thumb.gif" }, { "phrase": "[嘻嘻]", "icon": "tootha_thumb.gif" }, { "phrase": "[哈哈]", "icon": "laugh.gif" },
    { "phrase": "[可爱]", "icon": "tza_thumb.gif" }, { "phrase": "[可怜]", "icon": "kl_thumb.gif" }, { "phrase": "[挖鼻]", "icon": "wabi_thumb.gif" },
    { "phrase": "[吃惊]", "icon": "cj_thumb.gif" }, { "phrase": "[害羞]", "icon": "shamea_thumb.gif" }, { "phrase": "[挤眼]", "icon": "zy_thumb.gif" },
    { "phrase": "[闭嘴]", "icon": "bz_thumb.gif" }, { "phrase": "[鄙视]", "icon": "bs2_thumb.gif" }, { "phrase": "[爱你]", "icon": "lovea_thumb.gif" },
    { "phrase": "[泪]", "icon": "sada_thumb.gif" }, { "phrase": "[偷笑]", "icon": "heia_thumb.gif" }, { "phrase": "[亲亲]", "icon": "qq_thumb.gif" },
    { "phrase": "[生病]", "icon": "sb_thumb.gif" }, { "phrase": "[太开心]", "icon": "mb_thumb.gif" }, { "phrase": "[白眼]", "icon": "landeln_thumb.gif" },
    { "phrase": "[右哼哼]", "icon": "yhh_thumb.gif" }, { "phrase": "[左哼哼]", "icon": "zhh_thumb.gif" }, { "phrase": "[嘘]", "icon": "x_thumb.gif" },
    { "phrase": "[衰]", "icon": "cry.gif" }, { "phrase": "[委屈]", "icon": "wq_thumb.gif" }, { "phrase": "[吐]", "icon": "t_thumb.gif" },
    { "phrase": "[哈欠]", "icon": "haqianv2_thumb.gif" }, { "phrase": "[抱抱]", "icon": "bba_thumb.gif" }, { "phrase": "[怒]", "icon": "angrya_thumb.gif" },
    { "phrase": "[疑问]", "icon": "yw_thumb.gif" }, { "phrase": "[馋嘴]", "icon": "cza_thumb.gif" }, { "phrase": "[拜拜]", "icon": "88_thumb.gif" },
    { "phrase": "[思考]", "icon": "sk_thumb.gif" }, { "phrase": "[汗]", "icon": "sweata_thumb.gif" }, { "phrase": "[困]", "icon": "kunv2_thumb.gif" },
    { "phrase": "[睡]", "icon": "huangliansj_thumb.gif" }, { "phrase": "[钱]", "icon": "money_thumb.gif" }, { "phrase": "[失望]", "icon": "sw_thumb.gif" },
    { "phrase": "[酷]", "icon": "cool_thumb.gif" }, { "phrase": "[色]", "icon": "huanglianse_thumb.gif" }, { "phrase": "[哼]", "icon": "hatea_thumb.gif" },
    { "phrase": "[鼓掌]", "icon": "gza_thumb.gif" }, { "phrase": "[晕]", "icon": "dizzya_thumb.gif" }, { "phrase": "[悲伤]", "icon": "bs_thumb.gif" },
    { "phrase": "[抓狂]", "icon": "crazya_thumb.gif" }, { "phrase": "[黑线]", "icon": "h_thumb.gif" }, { "phrase": "[阴险]", "icon": "yx_thumb.gif" },
    { "phrase": "[怒骂]", "icon": "numav2_thumb.gif" }, { "phrase": "[互粉]", "icon": "hufen_thumb.gif" }, { "phrase": "[心]", "icon": "hearta_thumb.gif" },
    { "phrase": "[伤心]", "icon": "unheart.gif" }, { "phrase": "[猪头]", "icon": "pig.gif" }, { "phrase": "[熊猫]", "icon": "panda_thumb.gif" },
    { "phrase": "[兔子]", "icon": "rabbit_thumb.gif" }, { "phrase": "[ok]", "icon": "ok_thumb.gif" }, { "phrase": "[耶]", "icon": "ye_thumb.gif" },
    { "phrase": "[good]", "icon": "good_thumb.gif" }, { "phrase": "[NO]", "icon": "buyao_org.gif" }, { "phrase": "[赞]", "icon": "z2_thumb.gif" },
    { "phrase": "[来]", "icon": "come_thumb.gif" }, { "phrase": "[弱]", "icon": "sad_thumb.gif" }, { "phrase": "[草泥马]", "icon": "shenshou_thumb.gif" },
    { "phrase": "[神马]", "icon": "horse2_thumb.gif" }, { "phrase": "[囧]", "icon": "j_thumb.gif" }, { "phrase": "[浮云]", "icon": "fuyun_thumb.gif" },
    { "phrase": "[给力]", "icon": "geiliv2_thumb.gif" }, { "phrase": "[围观]", "icon": "wg_thumb.gif" }, { "phrase": "[威武]", "icon": "vw_thumb.gif" },
    { "phrase": "[奥特曼]", "icon": "otm_thumb.gif" }, { "phrase": "[礼物]", "icon": "liwu_thumb.gif" }, { "phrase": "[钟]", "icon": "clock_thumb.gif" },
    { "phrase": "[话筒]", "icon": "huatongv2_thumb.gif" }, { "phrase": "[蜡烛]", "icon": "lazhuv2_thumb.gif" }, { "phrase": "[蛋糕]", "icon": "cakev2_thumb.gif" }],
        target: null
    };

    if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment) {
        Range.prototype.createContextualFragment = function (html) {
            var frag = document.createDocumentFragment(),
            div = document.createElement("div");
            frag.appendChild(div);
            div.outerHTML = html;
            return frag;
        };
    }

})(jQuery);

