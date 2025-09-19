/**!
 * 卡片查看
 * date:2021-03-15
 * author: heying;
 */
'use strict';
/* global ClipboardJS */

(function(win, $) {

    var clipboard = new ClipboardJS('#applet-copybtn', {
        text: function() {
            return $('#applet-id').text();
        },
    });

    clipboard.on('success', function() {
        epoint.showTips('复制成功', {
            state: 'success', // 提示的状态，可取值为：default|success|info|warning|danger
            x: 'center', // x方向的位置，可取值为：left|center|right
            y: 'top', // y方向的位置，可取值为：top|center|bottom
            timeout: 3000 // 多长时间消失
        });
    });

    clipboard.on('error', function() {
        epoint.showTips('复制失败', {
            state: 'warning', // 提示的状态，可取值为：default|success|info|warning|danger
            x: 'center', // x方向的位置，可取值为：left|center|right
            y: 'top', // y方向的位置，可取值为：top|center|bottom
            timeout: 3000 // 多长时间消失
        });
    });

    // 编辑按钮点击事件
    var $sortbtns = $('.sort-btns .mini-button'),
        sortnum = mini.get('sortnum'),
        $editsort = $('#edit-sort'),
        $savesort = $('#save-sort'),
        sortnumval;

    $('#sortitem').on('click', '#edit-sort', function() {
        sortnumval = sortnum.getValue();
        $sortbtns.addClass('hidden');
        $savesort.removeClass('hidden');
        sortnum.setAllowInput(true);
        sortnum.focus();

    }).on('click', '#save-sort', function() {
        $sortbtns.addClass('hidden');
        $editsort.removeClass('hidden');
        sortnum.setAllowInput(false);
    });

    // 点击空白处取消编辑
    $(document).on('click', function(e) {
        var $tar = $(e.target),
            $parents = $tar.parents();

        if (!$editsort.hasClass('hidden')) {
            return;
        }

        if (!$tar.hasClass('sort-btn') && !$parents.hasClass('sort-btn') && !$tar.hasClass('sort-input') && !$parents.hasClass('sort-input')) {
        sortnum.setValue(sortnumval);
        $sortbtns.addClass('hidden');
        $editsort.removeClass('hidden');
        sortnum.setAllowInput(false);
        }
    });

    win.closeDialog = function(){
        epoint.closeDialog('');
    };


})(this, jQuery);