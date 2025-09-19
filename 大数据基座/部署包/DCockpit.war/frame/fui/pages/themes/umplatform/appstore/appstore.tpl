<script type="text/x-tpl" id="apps-tpl">
    {{#list}}
    <div class="apps-catalogue" data-catalogue="{{name}}" id="catalogue-{{index}}" >
        <h2 class="catalogue-name">{{name}}</h2>
        <ul class="apps-wrap clearfix">
            {{#apps}}
            <li class="app-item l" id="app-{{id}}" data-id="{{id}}" tittle="{{name}}" data-catalogue="{{index}}">
                <img src="{{icon}}" alt="" class="app-icon">
                <span class="app-install">安 装</span>
                <p class="app-name">{{name}}</p>
            </li>
            {{/apps}}
        </ul>
    </div>
    {{/list}}    
</script>