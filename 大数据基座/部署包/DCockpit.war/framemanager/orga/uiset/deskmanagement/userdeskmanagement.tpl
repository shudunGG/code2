<script type="text/x-tpl">
    <div class="elem-item l {{#isDisable}}disabled{{/isDisable}}" style="width:{{width}};height:{{height}};" data-url="{{url}}" data-id="{{code}}" data-name="{{name}}">
        <div class="elem-inner" style="top:{{updown}}px;right:{{leftright}}px;bottom:{{updown}}px;left:{{leftright}}px;">     
            <p class="elem-item-name">{{name}}</p>
            <span class="elem-item-btn " title="{{#isDisable}}启用{{/isDisable}}{{^isDisable}}禁用{{/isDisable}}"></span>     
        </div>        
    </div>
</script>