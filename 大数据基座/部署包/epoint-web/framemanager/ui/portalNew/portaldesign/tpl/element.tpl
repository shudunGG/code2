<!-- 右侧移动的元件 -->
<script type="x-tmpl-mustache" id="element-tpl">
    <li id="element-{{id}}" class="widget elem-item element-item {{#showHeader}} showHeader{{/showHeader}} showToolbar" 
        {{^themeCheck}}
        style="{{#borderColor}}border-color: {{borderColor}};{{/borderColor}}
            {{#border}}border-width: {{border}}px;{{/border}}
            {{#bg}}background-color: {{bg}};{{/bg}} 
            border-style: solid;
            {{#shadow}}box-shadow: 0 0 6px 2px {{shadow}};{{/shadow}}
            {{#radius}}border-radius: {{radius}}px;{{/radius}}
        " 
        {{/themeCheck}}
        data-id="{{id}}" 
        data-max-start="{{maxStart}}"
        data-max-end="{{maxEnd}}"
        data-min-start="{{minStart}}"
        data-min-end="{{minEnd}}"
        data-link-open-type="{{linkOpenType}}"
        data-theme-check="{{themeCheck}}"
        data-border="{{border}}"
        data-border-color="{{borderColor}}"
        data-bg="{{bg}}"
        data-component-type="{{componentType}}"
        data-shadow="{{shadow}}"
        data-radius="{{radius}}"
        data-show-header="{{showHeader}}" 
        data-title="{{title}}" 
        data-title-color="{{titleColor}}" 
        data-title-bg-color="{{titleBgColor}}" 
        data-title-count="{{titleCount}}" 
        data-show-title-count="{{showTitleCount}}" 
        data-icon="{{icon}}" 
        data-icon-color="{{iconColor}}"
        data-show-more-btn="{{showMoreBtn}}" 
        data-more-url="{{moreOpenUrl}}" 
        data-show-refresh-btn="{{showRefreshBtn}}" 
        data-show-add-btn="{{showAddBtn}}" 
        data-has-child-column="{{hasChildColumn}}" 
        data-add-url="{{addUrl}}"
        data-url="{{url}}" 
        {{#desk}}data-count-url="{{countUrl}}"{{/desk}}
        data-manage-url="{{manageUrl}}" 
        data-item-num="{{itemNum}}"
    >
        {{#showHeader}}
        <div class="element-header"
            style ="
            {{^themeCheck}}{{#titleColor}}color:{{titleColor}};{{/titleColor}}
            {{#titleBgColor}}background:{{titleBgColor}};{{/titleBgColor}}{{/themeCheck}}
            ">
            <!-- {{#icon}}<i style="color: {{iconColor}}" class="title-icon modicon-{{icon}}"></i>{{/icon}} -->
            {{#isfonticon}}{{#icon}}<div class="l title-icon mr-5 modicon-{{icon}}" {{^themeCheck}}style="color: {{iconColor}}"{{/themeCheck}} id="icon-set"></div>{{/icon}}{{/isfonticon}}
            {{^isfonticon}}{{#icon}}<div class="l title-icon mr-5" id="icon-set" style="background: url({{titleIcon}}) no-repeat;"></div>{{/icon}}{{/isfonticon}}
            <span style="{{#icon}}padding-left: 0;{{/icon}}" class="name">{{title}}{{#showTitleCount}}({{titleCount}}){{/showTitleCount}}</span>
            <div class="header-operations">
                <span {{#desk}}title="新增"{{/desk}} data-url="{{addUrl}}" class="icon add action-icon icon-addcircle {{^showAddBtn}}hidden{{/showAddBtn}}"></span>
                <span {{#desk}}title="更多"{{/desk}} data-url="{{moreUrl}}" class="icon open action-icon icon-omit {{^showMoreBtn}}hidden{{/showMoreBtn}}"></span>
                <span {{#desk}}title="刷新"{{/desk}} class="icon refresh action-icon icon-refresh {{^showRefreshBtn}}hidden{{/showRefreshBtn}}"></span>
            </div>
        </div>
        {{/showHeader}}
        
        {{#hasChildColumn}}
            {{#column}}
            <div class="element-columns {{^showHeader}}columns-no-head{{/showHeader}}">
                {{#desk}}
                <div class="scroll-left scroll-btn"></div>
                <div class="scroll-wrap">
                {{/desk}}
                    <ul {{#desk}}class="clearfix column-box"{{/desk}}>
                        {{#columnItems}}
                            <li class="column-item-{{id}} element-column-item{{#default}} active{{/default}}" data-id="{{id}}" data-is-diy="{{isDiy}}"  data-name="{{name}}" title="{{name}}" data-url="{{url}}" data-default="{{default}}" data-show-add-btn="{{showAddBtn}}" data-add-url="{{addUrl}}" data-more-url="{{moreUrl}}" data-show-more-btn="{{showMoreBtn}}" data-show-refresh-btn="{{showRefreshBtn}}" data-show-num="{{showNum}}">{{name}}</li>
                        {{/columnItems}}
                    </ul>
                </div>
            {{#desk}}
                <div class="scroll-right scroll-btn"></div>
            </div>
            {{/desk}}
            {{^showHeader}}
            <div class="header-operations column-operations">
                <span {{#desk}}title="新增"{{/desk}} data-url="{{addUrl}}" class="icon add action-icon icon-addcircle"></span>
                <span {{#desk}}title="更多"{{/desk}} data-url="{{moreUrl}}" class="icon open action-icon icon-omit"></span>
                <span {{#desk}}title="刷新"{{/desk}} class="icon refresh action-icon icon-refresh"></span>
            </div>
            {{/showHeader}}
        {{/column}}
        {{/hasChildColumn}}
        <div class="element-toolbar">
            <span class="split"></span>
            {{^desk}}<span class="icon elem-icon setting" data-ref="set"></span>{{/desk}}
            <span class="icon elem-icon delete" data-ref="delete"></span>
        </div>
        <div class="element-body" id="element-body-{{id}}" style="{{^showHeader}}height: calc(100% - 20px);  {{/showHeader}}  {{#hasChildColumn}}height: calc(100% - 90px); {{/hasChildColumn}}">
        </div>
        <span class="spots spot-lt"></span>
        <span class="spots spot-lb"></span>
        <span class="spots spot-rt"></span>
        <span class="spots spot-rb"></span>
    </li>
</script>