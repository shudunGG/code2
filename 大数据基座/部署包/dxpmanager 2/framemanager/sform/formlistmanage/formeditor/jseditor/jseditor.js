(function(win, $) {
	var CONTROL_TPL = '<li class="edit-control-item"><img class="control-img" src="{{src}}"/>{{name}}</li>';
	var VARIABLE_TPL = '<li class="edit-variable-item">{{name}}</li>';

	// 控件图标的路径
	var CONTROL_IMG_PATH = '../controls/';

    var jsEditor = document.getElementById('jsEditor'),

    	$editTool = $('#editTool'),

    	$controlList = $('#controlList'),

    	$variableList = $('#variableList');

    var doc;

    var init = function(data) {

        var codeMirror = CodeMirror(jsEditor, {
            value: data.js || '',
            mode: "javascript",
            lineNumbers: true,
            cursorHeight: 0.8
        });

        doc = codeMirror.doc;

        initControls(data.controls);

        initVariables(data.variables);
    };

    var initControls = function(data) {
    	var html = [],
    		item;
    	if(data) {
    		for (var i = data.length - 1; i >= 0; i--) {
    			item = data[i];

    			item.src = CONTROL_IMG_PATH + data[i].img + '.png';
    			html.push(Mustache.render(CONTROL_TPL, item));
    		}
    	}

    	$controlList.html(html.join(''));
    };

    var initVariables = function(data){
    	var html = [];
    	if(data) {
    		for (var i = data.length - 1; i >= 0; i--) {
    			
    			html.push(Mustache.render(VARIABLE_TPL, {
    				name: data[i]
    			}));
    		}
    	}

    	$variableList.html(html.join(''));

    };

    var bindEvent = function() {
    	$editTool.on('click', '.edit-control-item, .edit-variable-item', function(e) {
    		var name = $(this).text();

    		name = '[#=' + name + '=]';
    		doc.replaceSelection(name);
    	});

    };

    var getEditorValue = function() {
        return doc.getValue();
    };

    bindEvent();

    win.initPage = init;
    win.getEditorValue = getEditorValue;


}(this, jQuery));
