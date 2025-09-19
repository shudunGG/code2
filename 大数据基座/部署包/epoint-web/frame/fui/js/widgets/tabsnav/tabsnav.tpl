<!-- tabs 容器结构 -->
<div class="tabsnav-wrapper l clearfix">
    <div class="tabsnav-fixed l">
        <ul class="tabsnav-tabs-list clearfix"></ul>
    </div>
    <div class="tabsnav-variable l">
        <ul class="tabsnav-tabs-list clearfix"></ul>
    </div>
</div>

<!-- tabs 快捷导航触发按钮结构 -->
<span class="tabsnav-quicknav-trigger"></span>

<!-- tabs 快捷导航列表结构 -->
<div class="tabsnav-quicknav-box">
    <ul class="tabsnav-quicknav-list"></ul>
</div>

<!-- tabs tab项模板 -->
<li class="tabsnav-tabs-item{{^closeIcon}} fixed{{/closeIcon}}" id="tab-{{id}}" data-id="tab-{{uid}}" data-target="tab-content-{{id}}" >
    <span class="tabsnav-tabs-name" title="{{name}}">{{name}}</span> 
    {{#refresh}}<i class="tabsnav-tabs-refresh"></i>{{/refresh}} 
    {{#closeIcon}}<i class="tabsnav-tabs-close"></i>{{/closeIcon}}
</li>

<!-- tabs 内容模板 -->
<iframe class="tab-content hidden" id="tab-content-{{id}}" src="{{url}}" height="100%" width="100%" frameborder="0" scrolling="no">
</iframe>

<!-- tabs 快捷导航项模板 -->
<li class="tabsnav-quicknav-item" id="tab-{{id}}" data-id="tab-{{uid}}">{{name}}</li>

<!-- 左右滚动按钮模板 -->
<span class="tabsnav-scroll-btn {{position}}"></span>

<!-- 右键菜单模板 -->
<div class="tabsnav-contextmenu hidden" id="{{id}}">
    <ul>
    {{#items}}
        {{#text}}
        <li class="tabsnav-contextmenu-item" role="{{role}}">
            <a href="javascript:void(0);">{{text}}</a>
        </li>
        {{/text}}
        {{^text}}
        <li class="tabsnav-contextmenu-item sep"></li>
        {{/text}}
    {{/items}}
    </ul>
</div>