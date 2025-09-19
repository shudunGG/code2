
window.epoint = (function(epoint) {
    // 用户自定义控件
    var userControlResource = {
        
    };



    // 控件的模板及默认配置
    var controlResources = {
        textbox: {
            templ: '<input id="{{fieldName}}" class="mini-textbox" bind="{{bind}}" {{#required}}required="true"{{#requiredErrorText}} requiredErrorText="{{requiredErrorText}}"{{/requiredErrorText}}{{/required}}{{#vType}} vtype="{{vType}}"{{/vType}}/>'

        },
        textarea: {
            templ: '<input id="{{fieldName}}" class="mini-textarea" bind="{{bind}}" {{#required}}required="true"{{#requiredErrorText}} requiredErrorText="{{requiredErrorText}}"{{/requiredErrorText}}{{/required}} />'

        },
        webeditor: {
            templ: '<textarea id="{{fieldName}}" editstyle="{{editstyle}}" class="mini-webeditor" bind="{{bind}}" {{#required}}required="true"{{#requiredErrorText}} requiredErrorText="{{requiredErrorText}}"{{/requiredErrorText}}{{/required}}></textarea>',
            options: {
                editstyle: 'light'
            }
        },
        datepicker: {
            templ: '<input id="{{fieldName}}" class="mini-datepicker" format="{{format}}" bind="{{bind}}" {{#required}}required="true"{{#requiredErrorText}} requiredErrorText="{{requiredErrorText}}"{{/requiredErrorText}}{{/required}}/>',
            options: {
                format: 'yyyy-MM-dd'
            }
        },
        combobox: {
            templ: '<input class="mini-combobox" id="{{fieldName}}" data="{{dataData}}" bind="{{bind}}" {{#emptyText}} emptyText="{{emptyText}}"{{/emptyText}} {{#required}}required="true"{{#requiredErrorText}} requiredErrorText="{{requiredErrorText}}"{{/requiredErrorText}}{{/required}}/>'
        },
        treeselect: {
            templ: '<input class="mini-treeselect" id="{{fieldName}}" action="{{action}}" bind="{{bind}}"{{#textField}} textField="{{textField}}"{{/textField}}{{#valueField}} valueField="{{valueField}}"{{/valueField}}{{#parentField}} parentField="{{parentField}}"{{/parentField}} multiSelect="{{multiSelect}}" showRadioButton="{{showRadioButton}}" showFolderCheckBox="{{showFolderCheckBox}}"{{#dataOptions}} data-options="{{dataOptions}}"{{/dataOptions}} {{#required}}required="true"{{#requiredErrorText}} requiredErrorText="{{requiredErrorText}}"{{/requiredErrorText}}{{/required}}/>',
            options: {
                multiSelect: false,
                showRadioButton: false,
                showFolderCheckBox: false
            }
        },
        checkbox: {
            templ: '<div id="{{fieldName}}" class="mini-checkbox" bind="{{bind}}"></div>'
        },
        checkboxlist: {
            templ: '<div id="{{fieldName}}" class="mini-checkboxlist" data="{{dataData}}" bind="{{bind}}"></div>'
        },
        radiobuttonlist: {
            templ: '<div id="{{fieldName}}" class="mini-radiobuttonlist" data="{{dataData}}" bind="{{bind}}"></div>'
        },
        webuploader: {
            templ: '<div id="{{fieldName}}" class="mini-webuploader" action="{{action}}"{{#fileNumLimit}} fileNumLimit="{{fileNumLimit}}"{{/fileNumLimit}}{{#fileSingleSizeLimit}} fileSingleSizeLimit="{{fileSingleSizeLimit}}"{{/fileSingleSizeLimit}}{{#limittype}} limitType="{{limittype}}"{{/limittype}}{{#mimeTypes}} mimeTypes="{{mimeTypes}}"{{/mimeTypes}} auto="{{auto}}"></div>',
            options: {
                auto: true
            }
        },
        outputtext: {
            templ: '<div class="mini-outputtext" bind="{{bind}}"{{#dataOptions}} data-options="{{dataOptions}}"{{/dataOptions}}></div>'
        }
    };

    jQuery.extend(controlResources, userControlResource);

    return jQuery.extend(epoint, {
        controlResources: controlResources
    });
})(epoint || {});