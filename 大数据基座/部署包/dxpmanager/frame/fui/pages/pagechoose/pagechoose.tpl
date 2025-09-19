<script type="text/x-tpl" id="themeItem-tpl">
    <div class="theme-item l {{#inUse}}js-inuse{{/inUse}} {{#isDefault}}js-isdefault{{/isDefault}}" data-pageId="{{pageId}}" data-themeid="{{themeId}}" data-url="{{url}}">
        <div class="theme-preview"><img src="{{preview}}" alt=""></div>
        <div class="theme-btns">
            <span class="btn js-default {{#isDefault}}hidden{{/isDefault}}">设为默认</span>
            <span class="btn js-change  {{#inUse}}hidden{{/inUse}}">立即切换</span>
        </div>
        <p class="theme-name">{{name}}</p>
    </div>
</script>