<!-- 消息列表模板 -->
<script type="text/x-template" id="msg-info-templ">
    <div class="msg-category" data-code="{{remindType}}">
        <h3 class="msg-category-head" data-url="{{url}}" data-title="{{name}}" data-opentype="{{openType}}">
            <span class="msg-category-title" title="{{name}}">
			{{{name}}} (<span class="msg-category-num">{{num}}</span>)
            </span>
            <i class="msg-category-remove" title="忽略全部"></i>
        </h3>
        <ul class="msg-list">
        {{#items}}
            <li class="msg-list-item {{#hasNew}}newmsg{{/hasNew}}" data-url="{{url}}" data-guid="{{guid}}" data-title="{{name}}" data-opentype="{{openType}}">
                <span class="msg-item-text" title="{{name}}">{{{name}}}</span>
                <span class="msg-item-date">{{date}}</span>
                <i class="msg-item-ignore" title="忽略"></i>
            </li>
        {{/items}}
        </ul>
    </div>
</script>