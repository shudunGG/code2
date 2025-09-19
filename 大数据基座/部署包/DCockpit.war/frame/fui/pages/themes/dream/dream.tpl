<!-- 主菜单的顶级菜单模板 -->
<script type="text/x-template" id="nav-templ">
{{^isOverall}}
	<li class="fui-nav-item top">
		<a href="javascript:void(0);" class="fui-nav-link"
		data-url="{{url}}"
		data-rowkey="{{rowkey}}"
		data-code="{{code}}"
		title="{{name}}"
		data-opentype="{{openType}}">
		<i class="fui-nav-icon {{icon}}"></i>
		<span class="fui-nav-text">{{name}}</span>
		</a>{{/isOverall}}
{{#hasSub}}
	<div class="fui-nav second">
	<h4 class="fui-nav-title" title="{{name}}" data-rowkey="{{rowkey}}">{{name}}</h4>
	{{^isOverall}}
		<div class="ajax-loading" ></div>
	{{/isOverall}}
		<ul class="fui-nav-items">{{{subItem}}}</ul>
	</div>
{{/hasSub}}
{{^isOverall}}
	</li>
{{/isOverall}}
</script>
<!-- 主菜单的子菜单模板 -->
<script type="text/x-template" id="subnav-templ">
<li class="fui-nav-item">
	<a href="javascript:void(0);" class="fui-nav-link"
		{{#indent}}
		style="padding-left: {{indent}}px"
		{{/indent}}
		data-url="{{url}}"
		data-code="{{code}}"
		data-rowkey="{{rowkey}}"
		title="{{name}}"
		data-opentype="{{openType}}">

		<span class="fui-nav-text">{{name}}</span>
		{{#hasSub}}
		<i class="fui-nav-trigger"></i>
		{{/hasSub}}
	</a>

	{{#hasSub}}
	<ul class="fui-nav sub">
		{{{subItem}}}
	</ul>
	{{/hasSub}}
</li>
</script>

<!-- 快捷菜单模板 -->
<script type="text/x-template" id="quicknav-templ">
<li class="fui-nav-item top">
	<a href="javascript:void(0);" class="fui-nav-link" title="{{name}}">
		<i class="fui-nav-icon modicon-1"></i>
		<span class="fui-nav-text">{{name}}</span>
	</a>

	<div class="fui-nav second">
		<h4 class="fui-nav-title">
			<span class="fui-quicknav-text">{{name}}</span>
			<i data-url="{{editUrl}}" title="编辑自定义菜单" class="fui-nav-edit modicon-64"></i>
		</h4>
		<ul class="fui-nav-items">
			{{#quickNav}}
			<li class="fui-nav-item">
		   		<a href="javascript:void(0);" class="fui-nav-link"
		   			style="padding-left: 20px"
		   			data-url="{{url}}"
   					data-code="{{code}}"
   					title="{{name}}"
					data-opentype="{{openType}}">
					<span class="fui-nav-text">{{name}}</span>
				</a>
			</li>
			{{/quickNav}}
		</ul>
	</div>
</li>
</script>

<!-- 全局导航中搜索结果模板 -->
<script type="text/x-template" id="resultnav-templ">
<li class="fui-nav-item">
	<a href="javascript:void(0);" class="fui-nav-link"
		style="padding-left: 20px"
		data-url="{{url}}"
		data-code="{{code}}"
		title="{{name}}"
		data-opentype="{{openType}}">
		<span class="fui-nav-text">{{{resultName}}}</span>
	</a>
</li>
</script>

<!-- tab项模板 -->
<script type="text/x-template" id="tab-nav-item-templ">
<li id="tab-{{id}}"
	class="fui-main-tab"
	ref="tab-content-{{id}}"
	title="{{name}}">
    <span class="fui-tab-text">{{name}}</span>
    {{#closeIcon}}<i class="fui-tab-close" title="关闭"></i>{{/closeIcon}}
    {{^closeIcon}}<i class="fui-tab-refresh" title="刷新"></i>{{/closeIcon}}
</li>
</script>

<!-- tab项内容页模板 -->
<script type="text/x-template" id="tab-nav-content-templ">
<div class="fui-tab-content" id="tab-content-{{id}}">
    <iframe src="{{url}}" allowTransparency="true" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>
</div>
</script>

<!-- 最近关闭tab模板 -->
<script type="text/x-template" id="tab-history-templ">
<li class="fui-history-item"
	data-url="{{url}}"
	data-tabId="tab-{{id}}"
	title="{{name}}">
    <span class="fui-history-text">{{name}}</span>
    <i class="fui-history-backicon"></i>
</li>
</script>

<!-- 已打开tab模板 -->
<script type="text/x-template" id="tab-current-templ">
<li class="fui-current-item {{#isActive}}active{{/isActive}}" data-tabId="tab-{{id}}" title="{{name}}">
    <span class="fui-current-text">{{name}}</span>
    {{#isFixed}}<i class="fui-current-fixed"></i>{{/isFixed}}
</li>
</script>

<!-- 消息列表模板 -->
<script type="text/x-template" id="msg-info-templ">
{{^hasHead}}
<div class="msg-category" data-code="{{code}}">
	<h3 class="msg-category-head"
		data-url="{{url}}"
		data-title="{{name}}">
		<span class="msg-category-title" title="{{name}}">
			{{{name}}} (<span class="msg-category-num">{{num}}</span>)
		</span>
		<i class="msg-category-remove" title="忽略全部"></i>
	</h3>
	<ul class="msg-list">
{{/hasHead}}
	{{#items}}
		<li class="msg-list-item {{#hasNew}}newmsg{{/hasNew}}" data-url="{{url}}" data-guid="{{guid}}" data-title="{{title}}" data-opentype="{{openType}}">
		    <span class="msg-item-text" title="{{title}}">{{{name}}}</span>
		    <span class="msg-item-date">{{date}}</span>
		    <i class="msg-item-ignore" title="忽略"></i>
		</li>
	{{/items}}
{{^hasHead}}
	</ul>
</div>
{{/hasHead}}
</script>

<!-- 消息搜索结果模板 -->
<script type="text/x-template" id="msg-info-srh-templ">
<div class="msg-srh-category">
	<h4 class="msg-srh-head" data-code="{{code}}">
		<span class="msg-head-text">{{{name}}}</span>
	</h4>
	<ul class="msg-srh-list">
	{{#items}}
		<li class="msg-srh-item" data-url="{{url}}" data-guid="{{guid}}" data-title="{{title}}" data-opentype="{{openType}}">
		    <span class="msg-item-text" title="{{title}}">{{{resultName}}}</span>
		    <span class="msg-item-date">{{date}}</span>
		</li>
	{{/items}}
	</ul>
	{{#hasMore}}
	<p class="msg-srh-more">
		<a class="msg-shr-morelink" href="javascript:void(0);" data-url="{{moreUrl}}">查看更多&gt;</a>
	</p>
	{{/hasMore}}
</div>
</script>

<!-- 消息搜索历史记录模板 -->
<script type="text/x-template" id="msg-info-history-templ">
	<li class="msg-srh-item history" data-title="{{name}}">
	    <span class="msg-item-text" title="{{name}}">{{name}}</span>
	    <i class="msg-item-remove" title="删除记录"></i>
	</li>
</script>

<!-- 组织搜索结果模板 -->
<script type="text/x-template" id="msg-org-srh-templ">
<div class="msg-srh-category">
	<h4 class="msg-srh-head" data-code="{{code}}">
		<span class="msg-head-text">{{name}}</span>
	</h4>
	<ul class="msg-srh-list">
	{{#items}}
		<li class="msg-srh-item" data-guid="{{guid}}" data-title="{{name}}">
			<i class="msg-org-people"></i>
		    <span class="msg-item-text msg-org" title="{{name}}">{{{resultName}}}</span>
		    <i class="msg-org-email" title="发送邮件"></i>
		    <i class="msg-org-emsg" title="发送消息"></i>
		</li>
	{{/items}}
	</ul>
</div>
</script>

<!-- 组织搜索历史记录模板 -->
<script type="text/x-template" id="msg-org-history-templ">
	<li class="msg-srh-item history" data-title="{{name}}">
		<i class="msg-org-people"></i>
	    <span class="msg-item-text" title="{{name}}">{{name}}</span>
	    <i class="msg-item-remove" title="删除记录"></i>
	</li>
</script>

<!--Emsg最近聊天会话模板-->
<script type="text/x-template" id="emsg-recent-templ">
  {{#items}}
  <li class="emsg-recent-item {{^hasRead}}newmsg{{/hasRead}}" data-sessionid="{{sessionId}}" data-uid="{{uid}}" data-type="{{type}}">
    <div class="emsg-user-img">
      <img src="{{imgUrl}}" onerror="this.onerror='';this.src='../../emsg/images/emsg-user-error.jpg';" />
    </div>
    <div class="emsg-recent-record">
      <h2>
        <span class="emsg-user-name" title="{{name}}">{{name}}</span>{{^hasRead}}<i class="emsg-not-read"></i>{{/hasRead}}<span class="emsg-recent-date">{{date}}</span>
      </h2>
      <p class="emsg-recent-message">
        {{message}}
      </p>
      {{^hasRead}} <span class="emsg-ignore-icon">忽略</span>{{/hasRead}}
    </div>
  </li>
  {{/items}}
</script>
