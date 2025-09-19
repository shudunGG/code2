/*!
 * fui-toolbar 分类搜索
 * author: xiaolong
 */

(function($, win) {

    function ClassifySearch(opts) {
        var defaultSettings = {
            "id": "search",
            "top": 28,
            "left": 0,
            "searchTarget": "邮件",
            "category": [{
                "iconCls": "icon-m",
                "name": "标题"
            }],
            "maxShowCharacter": 5,
            "keyup": null,
            "enter": null,
            "up": null,
            "down": null
        };

        this.opts = $.extend({}, defaultSettings, opts);

        this._initSearch();
        this._initEvent();

    }

    $.extend(ClassifySearch.prototype, {
        _initSearch: function() {
        	  var $smartSearch = $("#" + this.opts.id),
                isRelative = $smartSearch.css("position");

            var tmpl = '{{#items}}<div class="autocomplete-suggestion"><span class="suggestion-icon {{iconCls}}"></span>{{name}}包含<span class="suggestion-key"></span>的' +
                this.opts.searchTarget + '</div>{{/items}}';

            if (isRelative !== 'relative') {
                $smartSearch.css({
                    "position": "relative",
                    "z-index": 10
                });
            }

            var $searchSuggestions = $('<div class="autocomplete-suggestions hidden"></div>');

            $smartSearch.append($searchSuggestions);

           $searchSuggestions.html(Mustache.render(tmpl, {
                items: this.opts.categoryin
            }));

            // TODO position设置

        },

        _initEvent: function() {

            var $smartSearch = $("#" + this.opts.id),
                $searchInput = $("input", $smartSearch),
                $searchBtn = $("button", $smartSearch),
                $smartSuggestion = $('.autocomplete-suggestions', $smartSearch),
                $smartSuggestionItems = $smartSuggestion.find('.autocomplete-suggestion'),
                $smartKeys = $smartSuggestion.find('.suggestion-key'),
                suggestionTypeNum = $smartSuggestionItems.length;

            var that = this;

            var selectIndex = -1;

            $searchInput.on('keyup', function(event) {
                var $this = $(this),
                    key = $.trim($this.val());

                if (key.length === 0) { // 无文字输入时，隐藏情况下拉分类

                    that.hideDropSuggestion();
                    return false;
                }

                if (key && key.length) { // 输入文字时显示搜索分类
                    that.showDropSuggestion();

                    if (key.length >= that.opts.maxShowCharacter) {
                        $smartKeys.text(key.substring(0, 6) + '...');
                    } else {
                        $smartKeys.text(key);
                    }
                }

                if (event.which === 27) { //esc

                    $this.val('');
                    that.hideDropSuggestion();
                    return false;
                }

                if (event.which === 13) { //回车事件

                    // $searchbtnsearch.click();
                    that.hideDropSuggestion();

                    if(that.opts.enter) {
                        that.opts.enter(selectIndex);
                    }

                }

                if (event.which === 38) { //上键事件

                    selectIndex -= 1;

                    if( selectIndex <  0 ) {
                        selectIndex = suggestionTypeNum - 1;
                    }

                    $smartSuggestionItems.eq(selectIndex).addClass('autocomplete-selected')
                        .siblings().removeClass('autocomplete-selected');

                    if(that.opts.up) {
                        that.opts.up(selectIndex);
                    }
                }

                if (event.which === 40) { //下键事件

                    selectIndex += 1;
                    if( selectIndex >=  suggestionTypeNum ) {
                        selectIndex = 0;
                    }

                    $smartSuggestionItems.eq(selectIndex).addClass('autocomplete-selected')
                        .siblings().removeClass('autocomplete-selected');

                    if(that.opts.down) {
                        that.opts.down(selectIndex);
                    }
                }
            });

            $searchInput.on('focusin', function(event) {
                $(this).trigger('keyup');

            });

            $searchInput.on('focusout', function(event) { // 失去光标，隐藏下拉搜索选
                that.hideDropSuggestion();
            });

            // 搜索按钮点击
            $searchBtn.on('click', function(event) {
                var key = $.trim($searchInput.val());

                if (key && key.length) {

                    that.hideDropSuggestion();

                    if(that.opts.enter) {
                        that.opts.enter();
                    }
                }
            });

            // 点击搜索分类
            $smartSearch.on('mousedown', '.autocomplete-suggestion', function(event) {
                if(that.opts.enter) {
                    var index = $(this).index();
                    that.opts.enter(index);
                }

            });

        },

        hideDropSuggestion: function() {
            var $smartSearch = $("#" + this.opts.id),
                $smartSuggestion = $('.autocomplete-suggestions', $smartSearch),
                $smartSuggestionItems = $smartSuggestion.find('.autocomplete-suggestion'),
                $smartKeys = $smartSuggestion.find('.suggestion-key');

            $smartSuggestion.addClass('hidden');
            $smartSuggestionItems.removeClass('autocomplete-selected');
            $smartKeys.text('');


        },

        showDropSuggestion: function() {
            var $smartSearch = $("#" + this.opts.id),
                $searchInput = $("input", $smartSearch),
                $searchBtn = $("button", $smartSearch),
                $smartSuggestion = $('.autocomplete-suggestions', $smartSearch);

            $smartSuggestion.removeClass('hidden');
        },

        setDropSelect: function(index) {
            var $smartSearch = $("#" + this.opts.id),
                $searchInput = $("input", $smartSearch),
                $searchBtn = $("button", $smartSearch),
                $smartSuggestion = $('.autocomplete-suggestions', $smartSearch),
                $smartSuggestionItems = $smartSuggestion.find('.autocomplete-suggestion'),
                $smartKeys = $smartSuggestion.find('.suggestion-key'),
                suggestionTypeNum = $smartSuggestionItems.length;

            selectIndex = index;

            $smartSuggestionItems.eq(selectIndex).addClass('autocomplete-selected')
                .siblings().removeClass('autocomplete-selected');
        }

    });


    win.ClassifySearch = ClassifySearch;

})(jQuery, window);
