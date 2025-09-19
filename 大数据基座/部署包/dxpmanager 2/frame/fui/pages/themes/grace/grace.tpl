<!-- 一级菜单模板 -->
<script type="text/x-template" id="firstmenu-templ">
	<ul class="first-menu l clearfix" id="firstmenu">
		{{#items}}
		<li class="item-first l {{#selected}}select{{/selected}}" data-id="{{code}}" data-url="{{url}}" data-openType="{{openType}}" data-hassub="{{hasSub}}">{{name}}</li>
		{{/items}}
	</ul>
	<a href="javascript:void(0)" class="menu-down {{#hideTrigger}}hidden{{/hideTrigger}} l"></a>
</script>

<!-- 门户名称模板 -->
<script type="text/x-template" id="door-templ">
	<a href="javascript:void(0);" class="first-name r" data-url="" data-id="" data-openType=""> </a>
	<a href="javascript:void(0);" class="change-door"> </a>
	<ul class="name-box" id="namebox">
		{{#list}}
		<li class="name-item" data-id="{{code}}" data-url="{{url}}" data-openType="{{openType}}">{{name}}</li>{{/list}}
	</ul>
</script>

<!-- 消息列表模板 -->
<script type="text/x-template" id="news-templ">
	{{^hasHead}}
	<div class="msg-category" data-remindtype="{{remindType}}">
		<h3 class="msg-category-head" data-url="{{url}}" data-title="{{name}}">
			<span class="msg-category-title" title="{{name}}">{{{name}}} (<span class="msg-category-num">{{num}}</span>)</span>
			<i class="msg-category-remove" title="忽略全部"></i>
		</h3>
		<ul class="msg-list">
			{{/hasHead}}{{#items}}
			<li class="msg-list-item {{#hasNew}}newmsg{{/hasNew}}" data-url="{{url}}" data-guid="{{guid}}" data-title="{{title}}" data-opentype="{{openType}}">
				<span class="msg-item-text {{status}}" title="{{title}}">{{{name}}}</span>
				<span class="msg-item-date">{{date}}</span>
				<i class="msg-item-ignore" title="忽略"></i>
			</li>
			{{/items}}{{^hasHead}}
		</ul>
	</div>{{/hasHead}}
</script>

<!-- Emsg最近聊天会话模板 -->

<script type="text/x-template" id="chart-templ">
	<li class="left-menu-item {{#isTop}}top-item{{/isTop}} {{#isSub}}sub-item{{/isSub}} {{level}}">
		<a href="javascript:void(0);" data-url="{{url}}" data-id="{{code}}" title="{{name}}" data-openType="{{openType}}" class="item-link {{levellink}}">
		{{#isTop}}<span class="left-menu-icon {{icon}} "></span>
		{{/isTop}}<span class="item-link-text" style="padding-left: {{indent}}px;">{{name}}</span>
		{{#hasSub}}<i class="menu-trigger">&nbsp;</i>{{/hasSub}}
		</a> {{#hasSub}}
		<div class="slide-second-menu">
			<span class="slide-second-span">{{name}}</span>
		</div>
		<ul class="left-menu-sub"> {{{subMenu}}}</ul>
		{{/hasSub}}
	</li>
</script>

<!-- 底部Tab模板 -->
<script type="text/x-template" id="tab-templ">
	<li class="tabs-nav-item" id="tab-{{id}}" data-id="tab-{{uid}}" data-target="tab-content-{{id}}" >
		<span class="tabs-nav-name" title="{{name}}">{{name}}</span> 
		{{#refresh}}<span class="tabs-nav-item-refresh"></span>{{/refresh}} 
		{{#closeIcon}}<i class="tabs-nav-item-close"></i>{{/closeIcon}}
	</li>
</script>
<!-- tab的内容模板 -->
<script type="text/x-template" id="rightContent-templ">
	<iframe class="tab-content hidden" id="tab-content-{{id}}" src="{{url}}" height="100%" width="100%" frameborder="0" scrolling="no">
	</iframe>
</script>

<!-- 左侧菜单模板 -->
<script type="text/x-template" id="leftMenu-templ">
	<li class="left-menu-item {{#isTop}}top-item{{/isTop}} {{#hasSub}}sub-item{{/hasSub}}">
		<a href="javascript:void(0);" data-url="{{url}}" data-id="{{code}}" title="{{name}}" data-openType="{{openType}}" class="item-link"  style="padding-left: {{indent}}px;">
			{{#isTop}}
				<span class="left-menu-icon {{icon}} "></span>
			{{/isTop}}
			{{^isTop}}<i class="left-menu-dot"></i>{{/isTop}}
			<span class="item-link-text">{{name}}</span>
			{{#hasSub}}<i class="menu-trigger"></i>{{/hasSub}}
		</a> 

		{{#hasSub}}
			<div class="slide-second-menu">
				<span class="slide-second-span">{{name}}</span>
			</div>
			<ul class="left-menu-sub"> {{{subMenu}}}</ul>
		{{/hasSub}}
	</li>
</script>

<!-- 底部tab列表模板 -->
<script type="text/x-template" id="tab-slide-templ">
	<li class="slide-list" data-id="tab-{{uid}}">{{name}}</li>
</script>


<!-- 底部右键模板 -->
<script type="text/x-template" id="rightClick-templ">
	<div class="context-menu hidden" id="{{id}}">
		<ul>
			{{#items}} 
				{{#text}}
					<li>
						<a class="menu-item" role="{{role}}" href="javascript:void(0);">
							<span class="item-txt">{{text}}</span>
						</a>
					</li>
				{{/text}} 
				{{^text}}
				<li class="sep"></li>
				{{/text}} 
			{{/items}}
		</ul>
	</div>
</script>

<!-- 皮肤模板 -->
<script type="text/x-template" id="skin-templ">
	{{#items}}
	<div class="skin-choose" style="background-color:{{color}}">
		<i class="choose-skin"></i>
	</div>
	{{/items}}
</script>

<!-- 快捷菜单列表模板 -->
<script type="text/x-template" id="quick-menu-templ">
	<li class="quick-menu-item" data-code="{{code}}" data-url="{{url}}" data-opentype="{{openType}}">{{name}}</li>
</script>

<!-- 菜单搜索列表模板 -->
<script type="text/x-template" id="search-menu-templ">
	<li class="menu-search-item" data-code="{{code}}" data-url="{{url}}" data-opentype="{{openType}}">{{{name}}}</li>
</script>