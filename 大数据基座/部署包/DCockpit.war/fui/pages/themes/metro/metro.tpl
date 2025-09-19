    <!-- 应用模板 -->
    <script type="text/x-template" id="metro-app-templ">
    <div class="metro-app"
        data-id="{{id}}"
        title="{{name}}"
        style="top:{{top}}px;left:{{left}}px;width:{{width}}px;height:{{height}}px;">

        <div class="app-inner" style="background-color:{{bgcolor}}">
            {{#innerUrl}}
            <iframe src="{{innerUrl}}" frameborder="0" width="{{ifrWidth}}" height="{{ifrHeight}}" allowtransparency="true" class="app-iframe" scrolling="no"></iframe>
            {{/innerUrl}}

            {{#icon}}
            <img src="{{icon}}" class="app-icon" alt="">
            {{/icon}}
            <p class="app-name">{{name}}</p>

            {{#count}}
            <span class="unread">{{count}}</span>
            {{/count}}
        </div>
    </div>
    </script>

    <!-- 屏幕模板 -->
    <script type="text/x-template" id="metro-screen-templ">
    <div class="screen-item l">
        <div class="apps-wrap"></div>
    </div>
    </script>

    <!--  左侧导航模板 相当于之前的页码 -->
    <script type="text/x-template" id="metro-leftnav-templ">
        <li class="left-nav-item page-item">
            <a href="javascript:void(0);" class="left-nav-link " data-page="{{page}}" title="{{name}}">
                {{#icon}}
                <i  class="left-nav-icon {{icon}}"  title="{{name}"}></i>
                {{/icon}}
                <span class="left-nav-text">{{name}}</span>

            </a>
        </li>
    </script>

    <!-- 快捷菜单模板 -->
    <script type="text/x-template" id="metro-quick-menu-item-templ">
    <li>
        <a href="javascript:void(0);" url="{{url}}" index="{{index}}">
            <i class="{{icon}}"></i>{{name}}
        </a>
    </li>
    </script>

    <!-- 底部任务项模板 -->
    <script type="text/x-template" id="metro-task-templ">
    <a href="javascript:void(0);" data-id="{{id}}" class="task-item l clearfix" title="{{name}}">
        <p class="task-name">{{name}}</p>
    </a>
    </script>
