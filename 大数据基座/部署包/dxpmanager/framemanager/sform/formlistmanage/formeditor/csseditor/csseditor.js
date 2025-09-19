(function(win, $) {

    var cssEditor = document.getElementById('cssEditor');
    	
    var doc;

    var init = function(data) {

        var codeMirror = CodeMirror(cssEditor, {
            value: data.css || '',
            mode: "css",
            lineNumbers: true,
            cursorHeight: 0.8
        });

        doc = codeMirror.doc;

    };

    var getEditorValue = function() {
        return doc.getValue();
    };

    win.initPage = init;
    win.getEditorValue = getEditorValue;


}(this, jQuery));
