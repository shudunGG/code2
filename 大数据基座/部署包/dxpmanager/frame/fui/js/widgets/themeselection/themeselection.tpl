
<!-- 总模板 -->
<div class="theme-selection-mask">
    <div class="theme-selection-panel">
        <div class="theme-selection-panel-inner">
            
            <div class="theme-selection-theme">
                <div class="header">
                    <span class="icon"></span>
                    <span class="name"></span>
                </div>
                <div class="body theme-panel">
                    
                </div>
            </div>

            <div class="theme-selection-skin">
                <div class="header">
                    <span class="icon"></span>
                    <span class="name"></span>
                </div>
                <div class="body skin-panel">

                </div>
            </div>
            
            <div class="theme-selection-action">
                <span class="btn save"></span>
                <span class="btn cancel"></span>
            </div>
        </div>
    </div>
</div>

<!-- theme 模板 -->
<div class="theme-item {{#isCurrent}}selected{{/isCurrent}}" data-url="{{url}}">
    <div class="theme-item-inner">
        <div class="theme-item-cover"></div>
        <img src="" alt="" class="themee-item-preview">
        <span class="theme-item-name">{{name}}</span>
        <span class="theme-item-icon"></span>
    </div>
</div>

<!-- skin模板 -->
<div class="skin-item {{#isCurrent}}selected{{/isCurrent}}" data-path="{{path}}">
    <div class="skin-item-inner">
        <div class="skin-item-cover"></div>
        <span class="skin-item-preview" style="background-color:{{color}}"></span>
        <span class="skin-item-name">{{name}}</span>
        <span class="skin-item-icon"></span>
    </div>
</div>