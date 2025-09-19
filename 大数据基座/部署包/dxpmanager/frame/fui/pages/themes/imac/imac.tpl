<!-- 分屏页码模板 -->
<script type="text/x-template" id="screen-page-templ">
    <a href="javascript:void(0);" data-page="{{page}}" class="page-item l mr10">
        <span>{{pageNum}}</span>
    </a>
</script>

<!-- 分屏模板 -->
<script type="text/x-template" id="screen-templ">
    <div class="imac-screen l" data-title="第{{page}}分屏"></div>
</script>

<!-- 桌面应用模板 -->
<script type="text/x-template" id="screen-app-templ">
    <div class="app-item trans" title="{{name}}" style="top:{{top}}px;left:{{left}}px" data-id="{{id}}">


        <span class="unread {{^count}}hidden{{/count}}">{{count}}</span>


        <img src="{{icon}}" alt="" class="app-icon">
        <p class="app-name">{{name}}</p>
    </div>
</script>

<!-- 底部任务栏：任务模板 -->
<script type="text/x-template" id="task-item-templ">
    <a href="javascript:void(0);" id="{{id}}-task" data-id="{{id}}" class="task-item l clearfix" title="{{name}}">
        <!--<img src="{{icon}}" alt="" class="l task-icon">-->
        <p class="task-name l">{{name}}</p>
    </a>
</script>

<!-- 底部下拉框中的任务模板 -->
<script type="text/x-template" id="task-drop-item-templ">
    <li id="{{id}}-drop" data-id="{{id}}" class="drop-item" title="{{name}}">
        {{name}}
    </li>
</script>

<!-- 工具栏：快捷应用模板 -->
<script type="text/x-template" id="dock-app-templ">
    <div class="dock-app" data-id="{{id}}" title="{{name}}">
        {{#count}}
        <span class="unread">{{count}}</span> {{/count}}

        <img src="{{icon}}" alt="">
        <p class="name">{{{sname}}}</p>
    </div>
</script>

<!-- 搜索面板应用模板 -->
<script type="text/x-template" id="search-app-templ">
    <div class="app-item trans in-panel l" title="{{name}}" id="{{id}}-search" data-id="{{id}}">
        <img src="{{icon}}" alt="" class="app-icon">
        <p class="app-name">{{name}}</p>
    </div>
</script>

<!-- 我的看板内容模板 -->
<script type="text/x-template" id="board-c-templ">
    <iframe src="{{url}}" class="tab-content hidden" id="board-content-{{id}}" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>
</script>