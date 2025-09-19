<!-- 元件模板 -->
<script type="text/x-template" id="widget-templ">
<li class="widget gs-w" data-id="{{code}}" data-view="{{view}}">
	<iframe src="" data-src="{{url}}" frameborder="0" width="100%" height="100%" scrolling="no"></iframe>
	<div class="widget-cover trans hidden">
		<div class="widget-sz-opts">
			{{#btns}}
			<span class="widget-sz-btn {{cls}}" data-view="{{view}}" title="{{title}}"></span>
			{{/btns}}
		</div>
	</div>
</li>
</script>