(function() {
    "use strict";

    Util.loadJs('js/widgets/pulltorefresh/pulltorefresh.skin.default.js',
        'js/widgets/pulltorefresh/pulltorefresh.bizlogic.impl.js',
        function() {
            initPage();
        });

    function initPage() {
        var pullToRefreshObj = null,
            searchValue = '';

        pullToRefreshObj = new PullToRefreshTools.bizlogic({
            url: '//115.29.151.25:8012/request.php?action=testV7List',
            dataRequest: function(currPage) {
                return JSON.stringify({
                    token: 'RXBvaW50X1dlYlNlcml2Y2VfKiojIzA2MDE=',
                    params: {
                        pageindex: currPage,
                        pagesize: 10,
                        keyword: searchValue
                    }
                });
            },
            itemClick: function(e) {
                console.log("点击item");
            }
        });

        document.getElementById('srh-input').addEventListener('change', function() {
            searchValue = this.value;
            this.value = '';
            pullToRefreshObj.refresh();

            // 失去焦点，否则ios键盘无法自动关闭
            this.blur();
        });
    }
})();