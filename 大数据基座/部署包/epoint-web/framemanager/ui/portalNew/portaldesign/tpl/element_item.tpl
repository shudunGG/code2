<!-- 元件（模板） -->
<script type="x-tmpl-mustache" id="element-item-tpl">
    <ul>
        {{#list}}
        <li class="template-lists">
            <div class="template-title" data-id="{{id}}">{{name}}</div>
            <ul class="clearfix element-list">
                {{#items}}
                <li class="l el-item drag-item w-full" 
                    data-sizex="{{sizex}}" 
                    data-sizey="{{sizey}}" 
                    data-id="{{id}}" 
                    data-name="{{name}}" 
                    data-count-url="{{countUrl}}" 
                    data-column-url="{{columnUrl}}" 
                    data-component-type="{{componenttype}}">
                    <i class="element-icon {{icon}} l"></i>
                    <div class="element-content l">{{{name}}}</div>
                </li>
                {{/items}}
            </ul>
        </li>
        {{/list}}
    </ul>
</script>