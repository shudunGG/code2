<!-- 分屏页码模板 -->
<script type="text/x-template" id="screen-page-templ">
<a href="javascript:void(0);" data-page="{{page}}" class="page-item l mr10">
    <span>{{pageNum}}</span>
</a>
</script>

<!-- 分屏模板 -->
<script type="text/x-template" id="screen-templ">
<div class="imac-screen l" title="第{{page}}分屏"></div>
</script>

<!-- 桌面应用模板 -->
<script type="text/x-template" id="screen-app-templ">
<div class="app-item trans" title="{{name}}" style="top:{{top}}px;left:{{left}}px"
    data-id="{{id}}">

    {{#count}}
    <span class="unread">{{count}}</span>
    {{/count}}

    <img src="{{icon}}" alt="" class="app-icon">
    <p class="app-name">{{name}}</p>
</div>
</script>

<!-- 底部任务栏：任务模板 -->
<script type="text/x-template" id="task-item-templ">
<a href="javascript:void(0);" data-id="{{id}}" class="task-item l clearfix" title="{{name}}">
    <img src="{{icon}}" alt="" class="l task-icon">
    <p class="task-name l">{{name}}</p>
</a>
</script>

<!-- 工具栏：快捷应用模板 -->
<script type="text/x-template" id="dock-app-templ">
<div class="dock-app" data-id="{{id}}" title="{{name}}">
    {{#count}}
    <span class="unread">{{count}}</span>
    {{/count}}

    <img src="{{icon}}" alt="" >
    <p class="name">{{{sname}}}</p>
</div>
</script>

<!-- IMac元件模板 -->
<script type="text/x-template" id="imac-elem-templ">
<div class="epdialog imac-elem {{#noBorder}}no-border{{/noBorder}} hidden-accessible" data-id="{{id}}">
    <div class="epdialog-hd clearfix">
        <h4 class="epdialog-title l">{{name}}</h4>
        <div class="epdialog-hd-btns clearfix r">
            {{#btns}}
            <a href="javascript:void(0);" btn-role="{{role}}" class="epdialog-hd-btn {{role}} l" title="{{title}}"></a>
            {{/btns}}
        </div>
    </div>
    <div class="epdialog-bd">
        <iframe src="{{url}}" frameborder="0" scrolling="no" width="100%" height="100%"></iframe>
    </div>
</div>
</script>
