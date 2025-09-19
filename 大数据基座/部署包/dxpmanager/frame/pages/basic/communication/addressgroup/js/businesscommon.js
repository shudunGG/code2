/*!
 * 通讯录common js
 * author: xiaolong
 * date: 20170330
 */

 (function(win){

     // 视图切换, 统一处理， 需要在[class=com-toolbar-item]的div上加上id=view-wrap
     $("#view-wrap").on('click', '.view', function(event) {

         event.preventDefault();

         var $this = $(this),
            isActive = $this.hasClass('active'),
            href = $this.attr('href');

        if(!isActive) { // 非当前视图进行视图切换
            window.location.href = href;
        }

     });

     // 分类搜索，统一处理
     function initSearch() {
         new ClassifySearch({
             "id": "com-search",
             "searchTarget": "通讯录",
             "category": [{
                 "iconCls": "icon-m",
                 "name": "姓名"
                 // "name": "(支持首字母)姓名"
             }, {
                 "iconCls": "icon-fd",
                 "name": "手机号"
             }],
             "categoryin": [{
                 "iconCls": "icon-m",
                 "name": "姓名"
                 // "name": "(支持首字母)姓名"
             }, {
                 "iconCls": "icon-fd",
                 "name": "办公号"
             }],
             "enter": clickenter, // 相应页面，需要定义对应的搜索处理函数
             "keyup": searchkeyup // 相应页面，需要定义按键后的处理
         });
     }

     win.initSearch = initSearch;

 })(this);
