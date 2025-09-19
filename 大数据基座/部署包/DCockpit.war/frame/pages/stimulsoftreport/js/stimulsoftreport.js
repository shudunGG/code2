/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
var hexcase=0;function hex_md5(a){return rstr2hex(rstr_md5(str2rstr_utf8(a)))}function hex_hmac_md5(a,b){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a),str2rstr_utf8(b)))}function md5_vm_test(){return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72"}function rstr_md5(a){return binl2rstr(binl_md5(rstr2binl(a),a.length*8))}function rstr_hmac_md5(c,f){var e=rstr2binl(c);if(e.length>16){e=binl_md5(e,c.length*8)}var a=Array(16),d=Array(16);for(var b=0;b<16;b++){a[b]=e[b]^909522486;d[b]=e[b]^1549556828}var g=binl_md5(a.concat(rstr2binl(f)),512+f.length*8);return binl2rstr(binl_md5(d.concat(g),512+128))}function rstr2hex(c){try{hexcase}catch(g){hexcase=0}var f=hexcase?"0123456789ABCDEF":"0123456789abcdef";var b="";var a;for(var d=0;d<c.length;d++){a=c.charCodeAt(d);b+=f.charAt((a>>>4)&15)+f.charAt(a&15)}return b}function str2rstr_utf8(c){var b="";var d=-1;var a,e;while(++d<c.length){a=c.charCodeAt(d);e=d+1<c.length?c.charCodeAt(d+1):0;if(55296<=a&&a<=56319&&56320<=e&&e<=57343){a=65536+((a&1023)<<10)+(e&1023);d++}if(a<=127){b+=String.fromCharCode(a)}else{if(a<=2047){b+=String.fromCharCode(192|((a>>>6)&31),128|(a&63))}else{if(a<=65535){b+=String.fromCharCode(224|((a>>>12)&15),128|((a>>>6)&63),128|(a&63))}else{if(a<=2097151){b+=String.fromCharCode(240|((a>>>18)&7),128|((a>>>12)&63),128|((a>>>6)&63),128|(a&63))}}}}}return b}function rstr2binl(b){var a=Array(b.length>>2);for(var c=0;c<a.length;c++){a[c]=0}for(var c=0;c<b.length*8;c+=8){a[c>>5]|=(b.charCodeAt(c/8)&255)<<(c%32)}return a}function binl2rstr(b){var a="";for(var c=0;c<b.length*32;c+=8){a+=String.fromCharCode((b[c>>5]>>>(c%32))&255)}return a}function binl_md5(p,k){p[k>>5]|=128<<((k)%32);p[(((k+64)>>>9)<<4)+14]=k;var o=1732584193;var n=-271733879;var m=-1732584194;var l=271733878;for(var g=0;g<p.length;g+=16){var j=o;var h=n;var f=m;var e=l;o=md5_ff(o,n,m,l,p[g+0],7,-680876936);l=md5_ff(l,o,n,m,p[g+1],12,-389564586);m=md5_ff(m,l,o,n,p[g+2],17,606105819);n=md5_ff(n,m,l,o,p[g+3],22,-1044525330);o=md5_ff(o,n,m,l,p[g+4],7,-176418897);l=md5_ff(l,o,n,m,p[g+5],12,1200080426);m=md5_ff(m,l,o,n,p[g+6],17,-1473231341);n=md5_ff(n,m,l,o,p[g+7],22,-45705983);o=md5_ff(o,n,m,l,p[g+8],7,1770035416);l=md5_ff(l,o,n,m,p[g+9],12,-1958414417);m=md5_ff(m,l,o,n,p[g+10],17,-42063);n=md5_ff(n,m,l,o,p[g+11],22,-1990404162);o=md5_ff(o,n,m,l,p[g+12],7,1804603682);l=md5_ff(l,o,n,m,p[g+13],12,-40341101);m=md5_ff(m,l,o,n,p[g+14],17,-1502002290);n=md5_ff(n,m,l,o,p[g+15],22,1236535329);o=md5_gg(o,n,m,l,p[g+1],5,-165796510);l=md5_gg(l,o,n,m,p[g+6],9,-1069501632);m=md5_gg(m,l,o,n,p[g+11],14,643717713);n=md5_gg(n,m,l,o,p[g+0],20,-373897302);o=md5_gg(o,n,m,l,p[g+5],5,-701558691);l=md5_gg(l,o,n,m,p[g+10],9,38016083);m=md5_gg(m,l,o,n,p[g+15],14,-660478335);n=md5_gg(n,m,l,o,p[g+4],20,-405537848);o=md5_gg(o,n,m,l,p[g+9],5,568446438);l=md5_gg(l,o,n,m,p[g+14],9,-1019803690);m=md5_gg(m,l,o,n,p[g+3],14,-187363961);n=md5_gg(n,m,l,o,p[g+8],20,1163531501);o=md5_gg(o,n,m,l,p[g+13],5,-1444681467);l=md5_gg(l,o,n,m,p[g+2],9,-51403784);m=md5_gg(m,l,o,n,p[g+7],14,1735328473);n=md5_gg(n,m,l,o,p[g+12],20,-1926607734);o=md5_hh(o,n,m,l,p[g+5],4,-378558);l=md5_hh(l,o,n,m,p[g+8],11,-2022574463);m=md5_hh(m,l,o,n,p[g+11],16,1839030562);n=md5_hh(n,m,l,o,p[g+14],23,-35309556);o=md5_hh(o,n,m,l,p[g+1],4,-1530992060);l=md5_hh(l,o,n,m,p[g+4],11,1272893353);m=md5_hh(m,l,o,n,p[g+7],16,-155497632);n=md5_hh(n,m,l,o,p[g+10],23,-1094730640);o=md5_hh(o,n,m,l,p[g+13],4,681279174);l=md5_hh(l,o,n,m,p[g+0],11,-358537222);m=md5_hh(m,l,o,n,p[g+3],16,-722521979);n=md5_hh(n,m,l,o,p[g+6],23,76029189);o=md5_hh(o,n,m,l,p[g+9],4,-640364487);l=md5_hh(l,o,n,m,p[g+12],11,-421815835);m=md5_hh(m,l,o,n,p[g+15],16,530742520);n=md5_hh(n,m,l,o,p[g+2],23,-995338651);o=md5_ii(o,n,m,l,p[g+0],6,-198630844);l=md5_ii(l,o,n,m,p[g+7],10,1126891415);m=md5_ii(m,l,o,n,p[g+14],15,-1416354905);n=md5_ii(n,m,l,o,p[g+5],21,-57434055);o=md5_ii(o,n,m,l,p[g+12],6,1700485571);l=md5_ii(l,o,n,m,p[g+3],10,-1894986606);m=md5_ii(m,l,o,n,p[g+10],15,-1051523);n=md5_ii(n,m,l,o,p[g+1],21,-2054922799);o=md5_ii(o,n,m,l,p[g+8],6,1873313359);l=md5_ii(l,o,n,m,p[g+15],10,-30611744);m=md5_ii(m,l,o,n,p[g+6],15,-1560198380);n=md5_ii(n,m,l,o,p[g+13],21,1309151649);o=md5_ii(o,n,m,l,p[g+4],6,-145523070);l=md5_ii(l,o,n,m,p[g+11],10,-1120210379);m=md5_ii(m,l,o,n,p[g+2],15,718787259);n=md5_ii(n,m,l,o,p[g+9],21,-343485551);o=safe_add(o,j);n=safe_add(n,h);m=safe_add(m,f);l=safe_add(l,e)}return Array(o,n,m,l)}function md5_cmn(h,e,d,c,g,f){return safe_add(bit_rol(safe_add(safe_add(e,h),safe_add(c,f)),g),d)}function md5_ff(g,f,k,j,e,i,h){return md5_cmn((f&k)|((~f)&j),g,f,e,i,h)}function md5_gg(g,f,k,j,e,i,h){return md5_cmn((f&j)|(k&(~j)),g,f,e,i,h)}function md5_hh(g,f,k,j,e,i,h){return md5_cmn(f^k^j,g,f,e,i,h)}function md5_ii(g,f,k,j,e,i,h){return md5_cmn(k^(f|(~j)),g,f,e,i,h)}function safe_add(a,d){var c=(a&65535)+(d&65535);var b=(a>>16)+(d>>16)+(c>>16);return(b<<16)|(c&65535)}function bit_rol(a,b){return(a<<b)|(a>>>(32-b))};
var JSON = JSON || {};

JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    }
    else {
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof (v);
            if (t == "string") v = '"' + v + '"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

JSON.parse = JSON.parse || function (str) {
    if (str === "") str = '""';
    eval("var p=" + str + ";");
    return p;
};

// Document MouseUp
StiMvcViewer.prototype.DocumentMouseUp = function (event) {
    this.options.formInDrag = false;
}

// Document Mouse Move
StiMvcViewer.prototype.DocumentMouseMove = function (event) {
    if (this.options.formInDrag) this.options.formInDrag[4].move(event);
}

StiMvcViewer.prototype.InitializeParametersPanel = function () {
    if (this.controls.parametersPanel) {
        this.controls.parametersPanel.changeVisibleState(false);
        this.controls.mainPanel.removeChild(this.controls.parametersPanel);
        delete this.controls.parametersPanel;
    }
    if (this.options.toolbar.visible && this.options.toolbar.showParametersButton) {
        this.controls.toolbar.controls.Parameters.setEnabled(this.options.paramsVariables != null);
    }
    if (this.options.paramsVariables == null) return;

    var parametersPanel = document.createElement("div");
    parametersPanel.menus = {};
    this.controls.parametersPanel = parametersPanel;
    this.controls.mainPanel.appendChild(parametersPanel);
    parametersPanel.className = "stiMvcViewerParametersPanel";
    parametersPanel.id = this.controls.viewer.id + "_ParametersPanel";
    parametersPanel.style.display = "none";
    parametersPanel.visible = false;
    parametersPanel.style.fontFamily = this.options.toolbar.fontFamily;
    if (this.options.toolbar.fontColor != "") parametersPanel.style.color = this.options.toolbar.fontColor;
    parametersPanel.jsObject = this;
    parametersPanel.currentOpeningParameter = null;
    parametersPanel.dropDownButtonWasClicked = false;
    parametersPanel.dateTimeButtonWasClicked = false;

    var innerPanel = document.createElement("div");
    parametersPanel.appendChild(innerPanel);
    innerPanel.style.padding = "0 2px 2px 2px";
    parametersPanel.style.top = (this.controls.drillDownPanel.offsetHeight + (this.options.toolbar.visible ? this.controls.toolbar.offsetHeight : 0)) + "px";

    // Container
    parametersPanel.container = document.createElement("div");
    innerPanel.appendChild(parametersPanel.container);
    parametersPanel.container.className = "stiMvcViewerInnerContainerParametersPanel";
    if (this.options.toolbar.backgroundColor != "") parametersPanel.container.style.background = this.options.toolbar.backgroundColor;
    if (this.options.toolbar.borderColor != "") parametersPanel.container.style.border = "1px solid " + this.options.toolbar.borderColor;
    parametersPanel.container.id = parametersPanel.id + "Container";
    parametersPanel.container.style.maxHeight = this.options.appearance.parametersPanelMaxHeight + "px";
    parametersPanel.container.jsObject = this;

    // Buttons
    var mainButtons = this.CreateHTMLTable();
    parametersPanel.mainButtons = mainButtons;
    mainButtons.setAttribute("align", "right");
    mainButtons.style.margin = "5px 0 10px 0";
    mainButtons.ID = parametersPanel.id + "MainButtons";

    parametersPanel.mainButtons.reset = this.FormButton("Reset", this.collections.loc["Reset"], null, 80);
    parametersPanel.mainButtons.submit = this.FormButton("Submit", this.collections.loc["Submit"], null, 80);
    mainButtons.addCell(parametersPanel.mainButtons.reset);
    mainButtons.addCell(parametersPanel.mainButtons.submit).style.paddingLeft = "10px";

    if (!this.options.isTouchDevice) {
        parametersPanel.container.onscroll = function () { parametersPanel.hideAllMenus(); }
    }

    parametersPanel.changeVisibleState = function (state) {
        var options = parametersPanel.jsObject.options;
        var controls = parametersPanel.jsObject.controls;
        parametersPanel.style.display = state ? "" : "none";
        parametersPanel.visible = state;
        if (options.toolbar.visible && options.toolbar.showParametersButton) controls.toolbar.controls.Parameters.setSelected(state);
        controls.reportPanel.style.marginTop = (controls.reportPanel.style.position == "relative"
            ? parametersPanel.offsetHeight
            : (controls.drillDownPanel.offsetHeight + parametersPanel.offsetHeight)) + "px";
        if (controls.bookmarksPanel != null)
            controls.bookmarksPanel.style.top = ((options.toolbar.visible ? controls.toolbar.offsetHeight : 0) +
                controls.drillDownPanel.offsetHeight + parametersPanel.offsetHeight) + "px";
    }

    parametersPanel.addParameters = function () {
        var paramsVariables = this.jsObject.copyObject(parametersPanel.jsObject.options.paramsVariables);
        var countParameters = this.jsObject.getCountObjects(paramsVariables);
        var countColumns = (countParameters <= 5) ? 1 : parametersPanel.jsObject.options.appearance.parametersPanelColumnsCount;
        var countInColumn = parseInt(countParameters / countColumns);
        if (countInColumn * countColumns < countParameters) countInColumn++;

        var table = document.createElement("table");
        table.cellPadding = 0;
        table.cellSpacing = 0;
        table.style.border = 0;
        var tbody = document.createElement("tbody");
        table.appendChild(tbody);
        this.container.appendChild(table);

        var cellsVar = {};
        for (var indexRow = 0; indexRow < countInColumn + 1; indexRow++) {
            var row = document.createElement("tr");
            tbody.appendChild(row);

            for (indexColumn = 0; indexColumn < countColumns; indexColumn++) {
                var cellForName = document.createElement("td");
                cellForName.style.padding = "0 10px 0 " + ((indexColumn > 0) ? "30px" : 0);
                row.appendChild(cellForName);

                var cellForControls = document.createElement("td");
                cellForControls.style.padding = 0;
                row.appendChild(cellForControls);

                cellsVar[indexRow + ";" + indexColumn + "name"] = cellForName;
                cellsVar[indexRow + ";" + indexColumn + "controls"] = cellForControls;
            }
        }

        var indexColumn = 0;
        var indexRow = 0;

        for (var index = 0; index < countParameters; index++) {
            cellsVar[indexRow + ";" + indexColumn + "name"].style.whiteSpace = "nowrap";
            cellsVar[indexRow + ";" + indexColumn + "name"].innerHTML = paramsVariables[index].alias;
            cellsVar[indexRow + ";" + indexColumn + "controls"].appendChild(parametersPanel.jsObject.CreateParameter(paramsVariables[index]));
            indexRow++;
            if (index == countParameters - 1) cellsVar[indexRow + ";" + indexColumn + "controls"].appendChild(parametersPanel.mainButtons);
            if (indexRow == countInColumn) { indexRow = 0; indexColumn++; }
        }
    }

    parametersPanel.clearParameters = function () {
        while (parametersPanel.container.childNodes[0]) {
            parametersPanel.container.removeChild(parametersPanel.container.childNodes[0]);
        }
    }

    parametersPanel.getParametersValues = function () {
        parametersValues = {};

        for (var name in parametersPanel.jsObject.options.parameters) {
            var parameter = parametersPanel.jsObject.options.parameters[name];
            parametersValues[name] = parameter.getValue();
        }

        return parametersValues;
    }

    parametersPanel.hideAllMenus = function () {
        if (parametersPanel.jsObject.options.currentMenu) parametersPanel.jsObject.options.currentMenu.changeVisibleState(false);
        if (parametersPanel.jsObject.options.currentDatePicker) parametersPanel.jsObject.options.currentDatePicker.changeVisibleState(false);
    }

    this.options.parameters = {};
    parametersPanel.addParameters();
    parametersPanel.changeVisibleState(true);
}

// Button
StiMvcViewer.prototype.ParameterButton = function (buttonType, parameter) {
    var button = this.SmallButton(null, null, buttonType + ".png", null, null, "stiMvcViewerFormButton");
    button.style.height = this.options.isTouchDevice ? "26px" : "21px";
    button.style.height = this.options.isTouchDevice ? "26px" : "21px";
    button.innerTable.style.width = "100%";
    button.imageCell.style.textAlign = "center";
    button.parameter = parameter;
    button.buttonType = buttonType;

    return button;
}

// TextBox
StiMvcViewer.prototype.ParameterTextBox = function (parameter) {
    var textBox = this.TextBox(null);
    textBox.parameter = parameter;
    if (parameter.params.type == "Char") textBox.maxLength = 1;

    var width = "210px";
    if (parameter.basicType == "Range") {
        width = "140px";
        if (parameter.params.type == "Guid" || parameter.params.type == "String") width = "190px";
        if (parameter.params.type == "DateTime") width = "160px";
        if (parameter.params.type == "Char") width = "60px";
    }
    else {
        if (parameter.params.type == "Guid") width = "265px"; else width = "210px";
    }
    textBox.style.width = width;

    /*if (parameter.params.type == "DateTime") {
        textBox.onblur = function () {
            this.parameter.params.key = this.jsObject.parseStringToDateTime(this.value, this.parameter.params.dateTimeType);
            this.value = this.jsObject.dateTimeObjectToString(this.parameter.params.key, this.parameter.params.dateTimeType);
        }
    }*/

    return textBox;
}

// CheckBox
StiMvcViewer.prototype.ParameterCheckBox = function (parameter) {
    var checkBox = this.CheckBox();
    checkBox.parameter = parameter;

    return checkBox;
}

// Menu
StiMvcViewer.prototype.ParameterMenu = function (parameter) {
    var menu = this.BaseMenu(null, parameter.controls.dropDownButton, "Down", "stiMvcViewerDropdownMenu");
    menu.parameter = parameter;

    menu.changeVisibleState = function (state, parentButton) {
        var mainClassName = "stiMvcViewerMainPanel";
        if (parentButton) {
            this.parentButton = parentButton;
            parentButton.haveMenu = true;
        }
        if (state) {
            this.onshow();
            this.style.display = "";
            this.visible = true;
            this.style.overflow = "hidden";
            this.parentButton.setSelected(true);
            this.jsObject.options.currentMenu = this;
            this.style.width = this.innerContent.offsetWidth + "px";
            this.style.height = this.innerContent.offsetHeight + "px";
            this.style.left = (this.jsObject.FindPosX(parameter, mainClassName)) + "px";
            this.style.top = (this.animationDirection == "Down")
                ? (this.jsObject.FindPosY(this.parentButton, mainClassName) + this.parentButton.offsetHeight + 2) + "px"
                : (this.jsObject.FindPosY(this.parentButton, mainClassName) - this.offsetHeight) + "px";
            this.innerContent.style.top = ((this.animationDirection == "Down" ? -1 : 1) * this.innerContent.offsetHeight) + "px";
            parameter.menu = this;

            d = new Date();
            var endTime = d.getTime();
            if (this.jsObject.options.toolbar.menuAnimation) endTime += this.jsObject.options.menuAnimDuration;
            this.jsObject.ShowAnimationVerticalMenu(this, (this.animationDirection == "Down" ? 0 : -1), endTime);
        }
        else {
            this.onHide();
            clearTimeout(this.innerContent.animationTimer);
            this.visible = false;
            this.parentButton.setSelected(false);
            this.style.display = "none";
            this.jsObject.controls.mainPanel.removeChild(this);
            parameter.menu = null;
            if (this.jsObject.options.currentMenu == this) this.jsObject.options.currentMenu = null;
        }
    }

    var table = this.CreateHTMLTable();
    table.style.fontFamily = this.options.toolbar.fontFamily;
    if (this.options.toolbar.fontColor != "") table.style.color = this.options.toolbar.fontColor;
    table.style.fontSize = "12px";
    table.style.width = (parameter.offsetWidth - 5) + "px";
    table.className = "stiMvcViewerClearAllStyles stiMvcViewerParametersMenuInnerTable";
    menu.innerContent.appendChild(table);
    menu.innerTable = table;

    return menu;
}

// MenuItem
StiMvcViewer.prototype.parameterMenuItem = function (parameter) {
    var menuItem = document.createElement("div");
    menuItem.jsObject = this;
    menuItem.parameter = parameter;
    menuItem.isOver = false;
    menuItem.className = "stiMvcViewerParametersMenuItem";
    menuItem.style.height = this.options.isTouchDevice ? "30px" : "24px";

    var table = this.CreateHTMLTable();
    table.className = "stiMvcViewerClearAllStyles stiMvcViewerParametersMenuItemInnerTable";
    menuItem.appendChild(table);

    menuItem.onmouseover = function () {
        if (!this.parameter.jsObject.options.isTouchDevice) {
            this.className = "stiMvcViewerParametersMenuItemOver";
            this.isOver = true;
        }
    }
    menuItem.onmouseout = function () {
        if (!this.parameter.jsObject.options.isTouchDevice) {
            this.className = "stiMvcViewerParametersMenuItem";
            this.isOver = false;
        }
    }

    menuItem.onmousedown = function () {
        if (this.parameter.jsObject.options.isTouchDevice) return;
        this.className = "stiMvcViewerParametersMenuItemPressed";
    }

    menuItem.ontouchstart = function () {
        this.parameter.jsObject.options.fingerIsMoved = false;
    }

    menuItem.onmouseup = function () {
        if (this.parameter.jsObject.options.isTouchDevice) return;
        this.parameter.jsObject.TouchEndMenuItem(this.id, false);
    }

    menuItem.ontouchend = function () {
        this.parameter.jsObject.TouchEndMenuItem(this.id, true);
    }

    menuItem.innerContainer = table.addCell();
    menuItem.innerContainer.style.padding = "0 5px 0 5px";

    return menuItem;
}

StiMvcViewer.prototype.TouchEndMenuItem = function (menuItemId, flag) {
    var menuItem = document.getElementById(menuItemId);
    if (!menuItem || menuItem.parameter.jsObject.options.fingerIsMoved) return;

    if (flag) {
        menuItem.className = "stiMvcViewerParametersMenuItemPressed";
        if (typeof event !== "undefined" && ('preventDefault' in event)) event.preventDefault();
        setTimeout("js" + menuItem.parameter.jsObject.controls.viewer.id + ".TouchEndMenuItem('" + menuItem.id + "', false)", 200);
        return;
    }

    menuItem.className = menuItem.isOver ? "stiMvcViewerParametersMenuItemOver" : "stiMvcViewerParametersMenuItem";
    if (menuItem.action != null) menuItem.action();
}

// MenuSeparator
StiMvcViewer.prototype.parameterMenuSeparator = function () {
    var separator = document.createElement("Div");
    separator.className = "stiMvcViewerParametersMenuSeparator";

    return separator;
}

// Menu For Value
StiMvcViewer.prototype.parameterMenuForValue = function (parameter) {
    var menuParent = this.ParameterMenu(parameter);
    for (var index in parameter.params.items) {
        var cell = menuParent.innerTable.addCellInNextRow();
        var menuItem = this.parameterMenuItem(parameter);
        cell.appendChild(menuItem);

        menuItem.id = parameter.jsObject.controls.viewer.id + parameter.params.name + "Item" + index;
        menuItem.parameter = parameter;
        menuItem.key = parameter.params.items[index].key;
        menuItem.value = parameter.params.items[index].value;
        menuItem.innerContainer.innerHTML =
            (menuItem.value != "" && parameter.params.type != "DateTime" && parameter.params.type != "TimeSpan" && parameter.params.type != "Bool")
                ? menuItem.value
                : this.getStringKey(menuItem.key, menuItem.parameter);

        menuItem.action = function () {
            this.parameter.params.key = this.key;
            if (this.parameter.params.type != "Bool")
                this.parameter.controls.firstTextBox.value = (this.parameter.params.type == "DateTime" || this.parameter.params.type == "TimeSpan")
                    ? this.parameter.jsObject.getStringKey(this.key, this.parameter)
                    : (this.parameter.params.allowUserValues ? this.key : (this.value != "" ? this.value : this.key));
            else
                this.parameter.controls.boolCheckBox.setChecked(this.key == "True");
            this.parameter.changeVisibleStateMenu(false);

            if (this.parameter.params.binding) {
                var params = { action: "init-vars", variables: this.jsObject.controls.parametersPanel.getParametersValues() };
                this.jsObject.postInteraction(params);
            }
        }
    }

    return menuParent;
}

// Menu For Range
StiMvcViewer.prototype.parameterMenuForRange = function (parameter) {
    var menuParent = this.ParameterMenu(parameter);

    for (var index in parameter.params.items) {
        var cell = menuParent.innerTable.addCellInNextRow();
        var menuItem = this.parameterMenuItem(parameter);
        cell.appendChild(menuItem);

        menuItem.id = parameter.jsObject.controls.viewer.id + parameter.params.name + "Item" + index;
        menuItem.parameter = parameter;
        menuItem.value = parameter.params.items[index].value;
        menuItem.key = parameter.params.items[index].key;
        menuItem.keyTo = parameter.params.items[index].keyTo;
        menuItem.innerContainer.innerHTML = menuItem.value + " [" + this.getStringKey(menuItem.key, menuItem.parameter) +
            " - " + this.getStringKey(menuItem.keyTo, menuItem.parameter) + "]";

        menuItem.action = function () {
            this.parameter.params.key = this.key;
            this.parameter.params.keyTo = this.keyTo;
            this.parameter.controls.firstTextBox.value = this.parameter.jsObject.getStringKey(this.key, this.parameter);
            this.parameter.controls.secondTextBox.value = this.parameter.jsObject.getStringKey(this.keyTo, this.parameter);
            this.parameter.changeVisibleStateMenu(false);
        }
    }

    return menuParent;
}

// Menu For ListNotEdit
StiMvcViewer.prototype.parameterMenuForNotEditList = function (parameter) {
    var menuParent = this.ParameterMenu(parameter);
    var selectedAll = true;
    menuParent.menuItems = {};

    for (var index in parameter.params.items) {
        var cell = menuParent.innerTable.addCellInNextRow();
        menuItem = this.parameterMenuItem(parameter);
        cell.appendChild(menuItem);

        menuItem.action = null;
        menuItem.id = parameter.jsObject.controls.viewer.id + parameter.params.name + "Item" + index;
        menuItem.parameter = parameter;
        menuItem.value = parameter.params.items[index].value;
        menuItem.key = parameter.params.items[index].key;
        menuParent.menuItems[index] = menuItem;

        var innerTable = this.CreateHTMLTable();
        menuItem.innerContainer.appendChild(innerTable);
        var cellCheck = innerTable.addCell();

        var checkBox = this.ParameterCheckBox(parameter);
        checkBox.style.marginRight = "5px";
        cellCheck.appendChild(checkBox);
        checkBox.menuParent = menuParent;
        checkBox.setChecked(parameter.params.items[index].isChecked);
        menuItem.checkBox = checkBox;
        if (!checkBox.isChecked) selectedAll = false;

        checkBox.onChecked = function () {
            this.parameter.params.items = {};
            this.parameter.controls.firstTextBox.value = "";
            var selectAll = true;

            for (var index in this.menuParent.menuItems) {
                this.parameter.params.items[index] = {};
                this.parameter.params.items[index].key = this.menuParent.menuItems[index].key;
                this.parameter.params.items[index].value = this.menuParent.menuItems[index].value;
                this.parameter.params.items[index].isChecked = this.menuParent.menuItems[index].checkBox.isChecked;
                if (selectAll && !this.menuParent.menuItems[index].checkBox.isChecked) {
                    selectAll = false;
                }

                if (this.parameter.params.items[index].isChecked) {
                    if (this.parameter.controls.firstTextBox.value != "") this.parameter.controls.firstTextBox.value += ";";
                    this.parameter.controls.firstTextBox.value += this.menuParent.menuItems[index].value != "" ? this.menuParent.menuItems[index].value : this.parameter.jsObject.getStringKey(this.menuParent.menuItems[index].key, this.parameter);
                }
            }
            menuParent.checkBoxSelectAll.setChecked(selectAll);
        }

        var cellText = innerTable.addCell();
        cellText.style.whiteSpace = "nowrap";
        cellText.innerHTML = menuItem.value != "" ? menuItem.value : this.getStringKey(menuItem.key, menuItem.parameter);

        if (index == this.getCountObjects(parameter.params.items) - 1) {
            /*var closeButton = this.parameterMenuItem(parameter);
            closeButton.id = parameter.jsObject.controls.viewer.id + parameter.params.name + "ItemClose";
            closeButton.innerContainer.innerHTML = this.collections.loc["Close"];
            closeButton.innerContainer.style.paddingLeft = "13px";
            closeButton.action = function () { this.parameter.changeVisibleStateMenu(false); }
            cell.appendChild(this.parameterMenuSeparator());
            cell.appendChild(closeButton);*/
            
            var closeButton = this.parameterMenuItem(parameter);
            closeButton.id = parameter.jsObject.options.viewerId + parameter.params.name + "ItemClose";
            closeButton.innerContainer.innerHTML = this.collections.loc["Close"];
            closeButton.innerContainer.style.paddingLeft = "13px";
            closeButton.action = function () { this.parameter.changeVisibleStateMenu(false); }
            cell.appendChild(this.parameterMenuSeparator());
            var checkBoxSelectAll = this.CheckBox(null, this.collections.loc["SelectAll"].replace("&", ""));
            menuParent.checkBoxSelectAll = checkBoxSelectAll;
            checkBoxSelectAll.style.margin = "8px 7px 8px 7px";
            cell.appendChild(checkBoxSelectAll);
            cell.appendChild(this.parameterMenuSeparator());
            cell.appendChild(closeButton);
            checkBoxSelectAll.setChecked(selectedAll);
            checkBoxSelectAll.action = function () {
                var selectAll = this.isChecked;
                for (var index in parameter.params.items) {
                    menuParent.menuItems[index].checkBox.setChecked(selectAll);
                }
            }
        }
    }

    return menuParent;
}

// Menu For ListEdit
StiMvcViewer.prototype.parameterMenuForEditList = function (parameter) {
    var menuParent = this.ParameterMenu(parameter);

    // New Item Method
    menuParent.newItem = function (item, parameter) {
        var menuItem = parameter.jsObject.parameterMenuItem(parameter);
        // cell.appendChild(menuItem);
        menuItem.id = parameter.jsObject.controls.viewer.id + parameter.params.name + "Item" + parameter.jsObject.newGuid().replace(/-/g, '');
        menuItem.onmouseover = null;
        menuItem.onmousedown = null;
        menuItem.ontouchend = null;
        menuItem.action = null;
        menuItem.parameter = parameter;
        menuItem.value = item.value;
        menuItem.key = item.key;

        var innerTable = menuItem.jsObject.CreateHTMLTable();
        menuItem.innerContainer.appendChild(innerTable);

        // Text Box
        var textBox = parameter.jsObject.ParameterTextBox(parameter);
        menuItem.textBox = textBox;
        textBox.setReadOnly(parameter.params.type == "DateTime");
        textBox.value = parameter.jsObject.getStringKey(menuItem.key, menuItem.parameter);
        textBox.thisMenu = menuParent;
        innerTable.addCell(textBox).style.padding = "0 1px 0 0";

        // DateTime Button
        if (parameter.params.type == "DateTime") {
            var dateTimeButton = parameter.jsObject.ParameterButton("DateTimeButton", parameter);
            dateTimeButton.id = menuItem.id + "DateTimeButton";
            dateTimeButton.parameter = parameter;
            dateTimeButton.thisItem = menuItem;
            innerTable.addCell(dateTimeButton).style.padding = "0 1px 0 1px";

            dateTimeButton.action = function () {
                var datePicker = dateTimeButton.jsObject.controls.datePicker;
                datePicker.ownerValue = this.thisItem.key;
                datePicker.parentDataControl = this.thisItem.textBox;
                datePicker.parentButton = this;                
                datePicker.changeVisibleState(!datePicker.visible);
            }
        }

        // Guid Button
        if (parameter.params.type == "Guid") {
            var guidButton = parameter.jsObject.ParameterButton("GuidButton", parameter);
            guidButton.id = menuItem.id + "GuidButton";
            guidButton.thisItem = menuItem;
            guidButton.thisMenu = menuParent;
            innerTable.addCell(guidButton).style.padding = "0 1px 0 1px";

            guidButton.action = function () {
                this.thisItem.textBox.value = this.parameter.jsObject.newGuid();
                this.thisMenu.updateItems();
            }
        }

        // Remove Button
        var removeButton = parameter.jsObject.ParameterButton("RemoveItemButton", parameter);
        removeButton.id = menuItem.id + "RemoveButton";
        removeButton.itemsContainer = this.itemsContainer;
        removeButton.thisItem = menuItem;
        removeButton.thisMenu = menuParent;
        innerTable.addCell(removeButton).style.padding = "0 1px 0 1px";
        removeButton.action = function () {
            this.itemsContainer.removeChild(this.thisItem);
            this.thisMenu.updateItems();
        }

        return menuItem;
    }

    // Update Items
    menuParent.updateItems = function () {
        this.parameter.params.items = {};
        this.parameter.controls.firstTextBox.value = "";
        for (index = 0; index < this.itemsContainer.childNodes.length; index++) {
            itemMenu = this.itemsContainer.childNodes[index];
            this.parameter.params.items[index] = {};
            this.parameter.params.items[index].key =
                (this.parameter.params.type == "DateTime")
                ? itemMenu.key
                : itemMenu.textBox.value;
            this.parameter.params.items[index].value = itemMenu.value;
            if (this.parameter.controls.firstTextBox.value != "") this.parameter.controls.firstTextBox.value += ";";
            this.parameter.controls.firstTextBox.value += this.parameter.jsObject.getStringKey(this.parameter.params.items[index].key, this.parameter);
        }

        if (this.parameter.menu.innerTable.offsetHeight > 400) this.parameter.menu.style.height = "350px;"
        else this.parameter.menu.style.height = this.parameter.menu.innerTable.offsetHeight + "px";
    }

    // New Item Button
    var newItemButton = this.parameterMenuItem(parameter);
    menuParent.innerTable.addCell(newItemButton);
    newItemButton.id = parameter.jsObject.controls.viewer.id + parameter.params.name + "ItemNew";
    newItemButton.innerContainer.innerHTML = this.collections.loc["NewItem"];
    newItemButton.thisMenu = menuParent;
    newItemButton.action = function () {
        var item_ = {};
        if (this.parameter.params.type == "DateTime") {
            item_.key = this.parameter.jsObject.getNowDateTimeObject();
            item_.value = this.parameter.jsObject.dateTimeObjectToString(item_.key, this.parameter);
        }
        else if (this.parameter.params.type == "TimeSpan") {
                item_.key = "00:00:00";
                item_.value = "00:00:00";
            }
            else if (this.parameter.params.type == "Bool") {
                    item_.key = "False";
                    item_.value = "False";
                }
                else {
                    item_.key = "";
                    item_.value = "";
                }        
        var newItem = this.thisMenu.newItem(item_, this.parameter);
        this.thisMenu.itemsContainer.appendChild(newItem);
        if ("textBox" in newItem) newItem.textBox.focus();
        this.thisMenu.updateItems();
    }

    // Add Items
    var cellItems = menuParent.innerTable.addCellInNextRow();
    menuParent.itemsContainer = cellItems;

    for (var index in parameter.params.items) {
        cellItems.appendChild(menuParent.newItem(parameter.params.items[index], parameter));
    }

    var cellDown = menuParent.innerTable.addCellInNextRow();

    // Remove All Button
    var removeAllButton = this.parameterMenuItem(parameter);
    cellDown.appendChild(removeAllButton);
    removeAllButton.id = parameter.jsObject.controls.viewer.id + parameter.params.name + "ItemRemoveAll";
    removeAllButton.innerContainer.innerHTML = this.collections.loc["RemoveAll"];
    removeAllButton.thisMenu = menuParent;
    removeAllButton.action = function () {
        while (this.thisMenu.itemsContainer.childNodes[0]) {
            this.thisMenu.itemsContainer.removeChild(this.thisMenu.itemsContainer.childNodes[0]);
        }
        this.thisMenu.updateItems();
    }

    // Close Button
    cellDown.appendChild(this.parameterMenuSeparator());
    var closeButton = this.parameterMenuItem(parameter);
    cellDown.appendChild(closeButton);
    closeButton.id = parameter.jsObject.controls.viewer.id + parameter.params.name + "ItemClose";
    closeButton.innerContainer.innerHTML = this.collections.loc["Close"];
    closeButton.action = function () { this.parameter.changeVisibleStateMenu(false); }

    return menuParent;
}

StiMvcViewer.prototype.InitializeToolBar = function () {
    var toolbar = document.createElement("div");
    toolbar.controls = {};
    toolbar.shortType = false;
    toolbar.minWidth = 0;
    this.controls.toolbar = toolbar;
    this.controls.mainPanel.appendChild(toolbar);
    toolbar.jsObject = this;
    toolbar.className = "stiMvcViewerToolBar";
    if (!this.options.toolbar.visible) {
        toolbar.style.height = "0px";
        toolbar.style.width = "0px";
    }

    var toolbarInnerContent = document.createElement("div");
    toolbar.innerContent = toolbarInnerContent;
    toolbar.appendChild(toolbarInnerContent);
    toolbarInnerContent.style.padding = "2px";

    var toolbarTable = this.CreateHTMLTable();
    toolbarInnerContent.appendChild(toolbarTable);
    toolbarTable.className = "stiMvcViewerToolBarTable";
    toolbarTable.style.margin = 0;

    if (this.options.toolbar.backgroundColor != "") toolbarTable.style.background = this.options.toolbar.backgroundColor;
    if (this.options.toolbar.borderColor != "") toolbarTable.style.border = "1px solid " + this.options.toolbar.borderColor;
    if (this.options.toolbar.fontColor != "") toolbarTable.style.color = this.options.toolbar.fontColor;
    toolbarTable.style.fontFamily = this.options.toolbar.fontFamily;

    var cell1 = toolbarTable.addCell();
    var cell2 = toolbarTable.addCell();
    var mainCell = (!this.options.appearance.rightToLeft) ? cell1 : cell2;
    var dopCell = (!this.options.appearance.rightToLeft) ? cell2 : cell1;
    mainCell.style.width = "100%";
    var mainTable = this.CreateHTMLTable();
    var dopTable = this.CreateHTMLTable();
    mainCell.appendChild(mainTable);
    dopCell.appendChild(dopTable);
    mainTable.setAttribute("align", this.options.appearance.rightToLeft ? "right" : (this.options.toolbar.alignment == "default" ? "left" : this.options.toolbar.alignment));
    mainTable.style.margin = "1px";
    dopTable.style.margin = "1px";

    if (!this.options.exports.showExportToPowerPoint && !this.options.exports.showExportToPdf && !this.options.exports.showExportToXps &&
        !this.options.exports.showExportToOpenDocumentWriter && !this.options.exports.showExportToOpenDocumentCalc && !this.options.exports.showExportToText &&
        !this.options.exports.showExportToRtf && !this.options.exports.showExportToWord2007 && !this.options.exports.showExportToCsv &&
        !this.options.exports.showExportToDbf && !this.options.exports.showExportToXml && !this.options.exports.showExportToDif && !this.options.exports.showExportToSylk &&
        !this.options.exports.showExportToExcel && !this.options.exports.showExportToExcel2007 && !this.options.exports.showExportToExcelXml && !this.options.exports.showExportToHtml &&
        !this.options.exports.showExportToHtml5 && !this.options.exports.showExportToMht && !this.options.exports.showExportToImageBmp && !this.options.exports.showExportToImageGif &&
        !this.options.exports.showExportToImageJpeg && !this.options.exports.showExportToImageMetafile && !this.options.exports.showExportToImagePcx &&
        !this.options.exports.showExportToImagePng && !this.options.exports.showExportToImageTiff && !this.options.exports.showExportToImageSvg && !this.options.exports.showExportToImageSvgz) {
        if (!this.options.exports.showExportToDocument) this.options.toolbar.showSaveButton = false;
        this.options.toolbar.showSendEmailButton = false;
    }

    // Add Controls
    // 1 - name, 2 - caption, 3 - image, 4 - showToolTip;

    var isFirst = true;
    var controlProps = []
    if (this.options.toolbar.showAboutButton) controlProps.push(["About", null, "About.png", false]);
    if (this.options.toolbar.showAboutButton && this.options.toolbar.showDesignButton) controlProps.push(["Separator1"]);
    if (this.options.toolbar.showDesignButton) controlProps.push(["Design", this.collections.loc["Design"], "Design.png", false]);
    if (this.options.toolbar.showPrintButton) { controlProps.push(["Print", this.collections.loc["Print"], "Print.png", true]); isFirst = false; }
    if (this.options.toolbar.showSaveButton) {
        controlProps.push(["Save", this.collections.loc["Save"], "Save.png", true]);
        isFirst = false;
    }
    if (this.options.toolbar.showSendEmailButton) {
        controlProps.push(["SendEmail", this.collections.loc["SendEmail"], "SendEmail.png", true]);
        isFirst = false;
    }
    if (this.options.toolbar.showBookmarksButton || this.options.toolbar.showParametersButton || this.options.toolbar.showEditorButton) {
        if (!isFirst) controlProps.push(["Separator2"]);
        isFirst = false;
    }
    if (this.options.toolbar.showBookmarksButton) { controlProps.push(["Bookmarks", null, "Bookmarks.png", true]); isFirst = false; }
    if (this.options.toolbar.showParametersButton) { controlProps.push(["Parameters", null, "Parameters.png", true]); isFirst = false; }
    if (this.options.toolbar.showEditorButton) {
        controlProps.push(["Editor", null, "Editor.png", true]);
        isFirst = false;
    }
    if (this.options.toolbar.showFirstPageButton || this.options.toolbar.showPreviousPageButton || this.options.toolbar.showNextPageButton ||
        this.options.toolbar.showLastPageButton || this.options.toolbar.showCurrentPageControl) {
        if (!isFirst) controlProps.push(["Separator3"]);
        isFirst = false;
    }
    if (this.options.toolbar.showFirstPageButton) { controlProps.push(["FirstPage", null, this.options.appearance.rightToLeft ? "LastPage.png" : "FirstPage.png", true]); isFirst = false; }
    if (this.options.toolbar.showPreviousPageButton) { controlProps.push(["PrevPage", null, this.options.appearance.rightToLeft ? "NextPage.png" : "PrevPage.png", true]); isFirst = false; }
    if (this.options.toolbar.showCurrentPageControl) { controlProps.push(["PageControl"]); isFirst = false; }
    if (this.options.toolbar.showNextPageButton) { controlProps.push(["NextPage", null, this.options.appearance.rightToLeft ? "PrevPage.png" : "NextPage.png", true]); isFirst = false; }
    if (this.options.toolbar.showLastPageButton) { controlProps.push(["LastPage", null, this.options.appearance.rightToLeft ? "FirstPage.png" : "LastPage.png", true]); isFirst = false; }
    if (this.options.toolbar.showViewModeButton || this.options.toolbar.showZoomButton) {
        if (!isFirst) controlProps.push(["Separator4"]);
        isFirst = false;
    }
    if (this.options.toolbar.showFullScreenButton) {
        controlProps.push(["FullScreen", null, "FullScreen.png", true]);
        controlProps.push(["Separator5"]);
        isFirst = false;
    }
    if (this.options.toolbar.showZoomButton) { controlProps.push(["Zoom", "100%", "Zoom.png", true]); isFirst = false; }
    if (this.options.toolbar.showViewModeButton) { controlProps.push(["ViewMode", this.collections.loc["OnePage"], "ViewMode.png", true]); isFirst = false; }
    if (!this.options.appearance.rightToLeft && this.options.toolbar.alignment == "right" && (this.options.toolbar.showAboutButton || this.options.toolbar.showDesignButton)) {
        controlProps.push(["Separator6"]);
    }

    for (var i = 0; i < controlProps.length; i++) {
        var index = this.options.appearance.rightToLeft ? controlProps.length - 1 - i : i;
        var name = controlProps[index][0];
        var table = (name == "About" || name == "Design" || name == "Separator1") ? dopTable : mainTable;

        if (name.indexOf("Separator") == 0) {
            table.addCell(this.ToolBarSeparator());
            continue;
        }

        var buttonArrow = ((name == "Print" && this.options.toolbar.printDestination == "Default") || name == "Save" || name == "SendEmail" || name == "Zoom" || name == "ViewMode") ? "Down" : null;
        var control = (name != "PageControl")
            ? this.SmallButton(name, controlProps[index][1], controlProps[index][2],
                 (controlProps[index][3] ? [this.collections.loc[name + "ToolTip"], this.helpLinks[name]] : null), buttonArrow)
            : this.PageControl();

        if (control.caption) {
            control.caption.style.display = this.options.toolbar.showButtonCaptions ? "" : "none";
        }

        if (name == "Editor") {
            control.style.display = "none";
        }

        control.style.margin = (name == "Design") ? "1px 5px 1px 5px" : "1px";
        toolbar.controls[name] = control;
        table.addCell(control);
    }

    // Add Hover Events
    if (this.options.toolbar.showMenuMode == "Hover") {
        var buttonsWithMenu = ["Print", "Save", "SendEmail", "Zoom", "ViewMode"];
        for (var i = 0; i < buttonsWithMenu.length; i++) {
            var button = toolbar.controls[buttonsWithMenu[i]];
            if (button) {
                button.onmouseover = function () {
                    var menuName = this.jsObject.lowerFirstChar(this.name) + "Menu";
                    clearTimeout(this.jsObject.options.toolbar["hideTimer" + this.name + "Menu"]);
                    if (this.jsObject.options.isTouchDevice || !this.isEnabled || (this["haveMenu"] && this.isSelected)) return;
                    this.className = this.styleName + " " + this.styleName + "Over";
                    this.jsObject.controls.menus[menuName].changeVisibleState(true);
                }

                button.onmouseout = function () {
                    var menuName = this.jsObject.lowerFirstChar(this.name) + "Menu";
                    this.jsObject.options.toolbar["hideTimer" + this.name + "Menu"] = setTimeout(function () {
                        button.jsObject.controls.menus[menuName].changeVisibleState(false);
                    }, this.jsObject.options.menuHideDelay);
                }
            }
        }
    }

    toolbar.haveScroll = function () {
        return (toolbar.scrollWidth > toolbar.offsetWidth)
    }

    toolbar.getMinWidth = function () {
        var a = mainCell.offsetWidth;
        var b = mainTable.offsetWidth
        var c = toolbarTable.offsetWidth;

        return c - (a - b) + 50;
    }

    toolbar.minWidth = toolbar.getMinWidth();

    toolbar.changeToolBarState = function () {
        var options = toolbar.jsObject.options;
        var controls = toolbar.controls;
        var collections = toolbar.jsObject.collections;

        if (controls["FirstPage"]) controls["FirstPage"].setEnabled(options.pageNumber > 0 && options.viewMode == "OnePage");
        if (controls["PrevPage"]) controls["PrevPage"].setEnabled(options.pageNumber > 0 && options.viewMode == "OnePage");
        if (controls["NextPage"]) controls["NextPage"].setEnabled(options.pageNumber < options.pagesCount - 1 && options.viewMode == "OnePage");
        if (controls["LastPage"]) controls["LastPage"].setEnabled(options.pageNumber < options.pagesCount - 1 && options.viewMode == "OnePage");
        if (controls["ViewMode"]) controls["ViewMode"].caption.innerHTML = collections.loc[options.viewMode];
        if (controls["Zoom"]) controls["Zoom"].caption.innerHTML = options.zoom + "%";
        if (controls["PageControl"]) {
            controls["PageControl"].countLabel.innerHTML = options.pagesCount;
            controls["PageControl"].textBox.value = options.pageNumber + 1;
            controls["PageControl"].textBox.setEnabled(!(options.pagesCount <= 1 || options.viewMode == "WholeReport"));
        }

        if (toolbar.jsObject.controls.menus["zoomMenu"]) {
            var zoomItems = toolbar.jsObject.controls.menus["zoomMenu"].items;
            for (var i in zoomItems) {
                if (zoomItems[i]["image"] == null) continue;
                if (zoomItems[i].name != "ZoomOnePage" && zoomItems[i].name != "ZoomPageWidth")
                    zoomItems[i].image.style.visibility = (zoomItems[i].name == "Zoom" + options.zoom) ? "visible" : "hidden";
            }
        }
    }

    toolbar.changeShortType = function () {
        if (toolbar.shortType && toolbar.jsObject.controls.viewer.offsetWidth < toolbar.minWidth) return;
        toolbar.shortType = toolbar.jsObject.controls.viewer.offsetWidth < toolbar.minWidth;
        shortButtons = ["Print", "Save", "Zoom", "ViewMode", "Design"];
        for (var index in shortButtons) {
            button = toolbar.controls[shortButtons[index]];
            if (button && button.caption) {
                button.caption.style.display = toolbar.shortType ? "none" : "";
            }
        }
    }

    window.onresize = function () {
        // toolbar.changeShortType();
    }

    if (toolbar.controls["Bookmarks"]) toolbar.controls["Bookmarks"].setEnabled(false);
    if (toolbar.controls["Parameters"]) toolbar.controls["Parameters"].setEnabled(false);
    // toolbar.changeShortType();
}

// Separator
StiMvcViewer.prototype.ToolBarSeparator = function () {
    var separator = document.createElement("div");
    separator.style.width = "1px";
    separator.style.height = this.options.isTouchDevice ? "26px" : "21px";
    separator.className = "stiMvcViewerToolBarSeparator";

    return separator;
}

// PageControl
StiMvcViewer.prototype.PageControl = function () {
    var pageControl = this.CreateHTMLTable();    
    var text1 = pageControl.addCell();
    text1.style.padding = "0 2px 0 0";
    // text1.innerHTML = this.collections.loc["Page"];

    var textBox = this.TextBox("PageControl", 45);
    pageControl.addCell(textBox);
    pageControl.textBox = textBox;
    textBox.action = function () {
        if (textBox.jsObject.options.pageNumber != textBox.getCorrectValue() - 1)
            textBox.jsObject.postAction("GoToPage"); 
    }

    textBox.getCorrectValue = function () {
        value = parseInt(this.value);
        if (value < 1 || !value) value = 1;
        if (value > textBox.jsObject.options.pagesCount) value = textBox.jsObject.options.pagesCount;
        return value;
    }

    var text2 = pageControl.addCell();
    text2.style.padding = "0 2px 0 2px";
    text2.innerHTML = this.collections.loc["PageOf"];

    var countLabel = pageControl.addCell();
    pageControl.countLabel = countLabel;
    countLabel.style.padding = "0 2px 0 0";
    countLabel.innerHTML = "?";

    return pageControl;
}



StiMvcViewer.prototype.GetImageTypesItems = function () {
    var items = [];
    if (this.options.exports.showExportToImageBmp) items.push(this.Item("Bmp", "Bmp", null, "Bmp"));
    if (this.options.exports.showExportToImageGif) items.push(this.Item("Gif", "Gif", null, "Gif"));
    if (this.options.exports.showExportToImageJpeg) items.push(this.Item("Jpeg", "Jpeg", null, "Jpeg"));
    if (this.options.exports.showExportToImagePcx) items.push(this.Item("Pcx", "Pcx", null, "Pcx"));
    if (this.options.exports.showExportToImagePng) items.push(this.Item("Png", "Png", null, "Png"));
    if (this.options.exports.showExportToImageTiff) items.push(this.Item("Tiff", "Tiff", null, "Tiff"));
    if (this.options.exports.showExportToImageMetafile) items.push(this.Item("Emf", "Emf", null, "Emf"));
    if (this.options.exports.showExportToImageSvg) items.push(this.Item("Svg", "Svg", null, "Svg"));
    if (this.options.exports.showExportToImageSvgz) items.push(this.Item("Svgz", "Svgz", null, "Svgz"));
    
    return items;
}

StiMvcViewer.prototype.GetDataTypesItems = function () {
    var items = [];
    if (this.options.exports.showExportToCsv) items.push(this.Item("Csv", "Csv", null, "Csv"));
    if (this.options.exports.showExportToDbf) items.push(this.Item("Dbf", "Dbf", null, "Dbf"));
    if (this.options.exports.showExportToXml) items.push(this.Item("Xml", "Xml", null, "Xml"));
    if (this.options.exports.showExportToDif) items.push(this.Item("Dif", "Dif", null, "Dif"));
    if (this.options.exports.showExportToSylk) items.push(this.Item("Sylk", "Sylk", null, "Sylk"));

    return items;
}

StiMvcViewer.prototype.GetExcelTypesItems = function () {
    var items = [];
    if (this.options.exports.showExportToExcel2007) items.push(this.Item("Excel2007", "Excel", null, "Excel2007"));
    if (this.options.exports.showExportToExcel) items.push(this.Item("ExcelBinary", "Excel 97-2003", null, "ExcelBinary"));    
    if (this.options.exports.showExportToExcelXml) items.push(this.Item("ExcelXml", "Excel Xml 2003", null, "ExcelXml"));

    return items;
}

StiMvcViewer.prototype.GetHtmlTypesItems = function () {
    var items = [];
    if (this.options.exports.showExportToHtml) items.push(this.Item("Html", "Html", null, "Html"));
    if (this.options.exports.showExportToHtml5) items.push(this.Item("Html5", "Html5", null, "Html5"));
    if (this.options.exports.showExportToMht) items.push(this.Item("Mht", "Mht", null, "Mht"));

    return items;
}

StiMvcViewer.prototype.GetZoomItems = function () {
    var items = [];
    var values = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];    
    for (var i in values)
        items.push(this.Item("item" + i, (values[i] * 100) + "%", null, values[i].toString()));

    return items;
}

StiMvcViewer.prototype.GetImageFormatForHtmlItems = function () {
    var items = [];
    items.push(this.Item("item0", "Jpeg", null, "Jpeg"));
    items.push(this.Item("item1", "Gif", null, "Gif"));
    items.push(this.Item("item2", "Bmp", null, "Bmp"));
    items.push(this.Item("item3", "Png", null, "Png"));

    return items;
}

StiMvcViewer.prototype.GetExportModeItems = function () {
    var items = [];
    items.push(this.Item("item0", "Table", null, "Table"));
    items.push(this.Item("item1", "Span", null, "Span"));
    items.push(this.Item("item2", "Div", null, "Div"));

    return items;
}

StiMvcViewer.prototype.GetImageResolutionItems = function () {
    var items = [];
    var values = ["10", "25", "50", "75", "100", "200", "300", "400", "500"];
    for (var i in values)
        items.push(this.Item("item" + i, values[i], null, values[i]));

    return items;
}

StiMvcViewer.prototype.GetImageCompressionMethodItems = function () {
    var items = [];
    items.push(this.Item("item0", "Jpeg", null, "Jpeg"));
    items.push(this.Item("item1", "Flate", null, "Flate"));

    return items;
}

StiMvcViewer.prototype.GetImageQualityItems = function () {
    var items = [];
    var values = [0.25, 0.5, 0.75, 0.85, 0.9, 0.95, 1];
    for (var i in values)
        items.push(this.Item("item" + i, (values[i] * 100) + "%", null, values[i].toString()));

    return items;
}

StiMvcViewer.prototype.GetBorderTypeItems = function () {
    var items = [];
    items.push(this.Item("item0", this.collections.loc["BorderTypeSimple"], null, "Simple"));
    items.push(this.Item("item1", this.collections.loc["BorderTypeSingle"], null, "UnicodeSingle"));
    items.push(this.Item("item2", this.collections.loc["BorderTypeDouble"], null, "UnicodeDouble"));

    return items;
}

StiMvcViewer.prototype.GetEncodingDataItems = function () {
    var items = [];
    for (var i in this.collections.encodingData) {
        var item = this.collections.encodingData[i];
        items.push(this.Item("item" + i, item.value, null, item.key));
    }

    return items;
}

StiMvcViewer.prototype.GetImageFormatItems = function (withoutMonochrome) {
    var items = [];
    items.push(this.Item("item0", this.collections.loc["ImageFormatColor"], null, "Color"));
    items.push(this.Item("item1", this.collections.loc["ImageFormatGrayscale"], null, "Grayscale"));
    if (!withoutMonochrome) items.push(this.Item("item2", this.collections.loc["ImageFormatMonochrome"], null, "Monochrome"));

    return items;
}

StiMvcViewer.prototype.GetMonochromeDitheringTypeItems = function () {
    var items = [];
    items.push(this.Item("item0", "None", null, "None"));
    items.push(this.Item("item1", "FloydSteinberg", null, "FloydSteinberg"));
    items.push(this.Item("item2", "Ordered", null, "Ordered"));

    return items;
}

StiMvcViewer.prototype.GetTiffCompressionSchemeItems = function () {
    var items = [];
    items.push(this.Item("item0", "Default", null, "Default"));
    items.push(this.Item("item1", "CCITT3", null, "CCITT3"));
    items.push(this.Item("item2", "CCITT4", null, "CCITT4"));
    items.push(this.Item("item3", "LZW", null, "LZW"));
    items.push(this.Item("item4", "None", null, "None"));
    items.push(this.Item("item5", "Rle", null, "Rle"));

    return items;
}

StiMvcViewer.prototype.GetEncodingDifFileItems = function () {
    var items = [];
    items.push(this.Item("item0", "437", null, "437"));
    items.push(this.Item("item1", "850", null, "850"));
    items.push(this.Item("item2", "852", null, "852"));
    items.push(this.Item("item3", "857", null, "857"));
    items.push(this.Item("item4", "860", null, "860"));
    items.push(this.Item("item5", "861", null, "861"));
    items.push(this.Item("item6", "862", null, "862"));
    items.push(this.Item("item7", "863", null, "863"));
    items.push(this.Item("item8", "865", null, "865"));
    items.push(this.Item("item9", "866", null, "866"));
    items.push(this.Item("item10", "869", null, "869"));

    return items;
}

StiMvcViewer.prototype.GetExportModeRtfItems = function () {
    var items = [];
    items.push(this.Item("item0", this.collections.loc["ExportModeRtfTable"], null, "Table"));
    items.push(this.Item("item1", this.collections.loc["ExportModeRtfFrame"], null, "Frame"));

    return items;
}

StiMvcViewer.prototype.GetEncodingDbfFileItems = function () {
    var items = [];
    items.push(this.Item("item0", "Default", null, "Default"));
    items.push(this.Item("item1", "437 U.S. MS-DOS", null, "USDOS"));
    items.push(this.Item("item2", "620 Mazovia(Polish) MS-DOS", null, "MazoviaDOS"));
    items.push(this.Item("item3", "737 Greek MS-DOS(437G)", null, "GreekDOS"));
    items.push(this.Item("item4", "850 International MS-DOS", null, "InternationalDOS"));
    items.push(this.Item("item5", "852 Eastern European MS-DOS", null, "EasternEuropeanDOS"));
    items.push(this.Item("item6", "857 Turkish MS-DOS", null, "TurkishDOS"));
    items.push(this.Item("item7", "861 Icelandic MS-DOS", null, "IcelandicDOS"));
    items.push(this.Item("item8", "865 Nordic MS-DOS", null, "NordicDOS"));
    items.push(this.Item("item9", "866 Russian MS-DOS", null, "RussianDOS"));
    items.push(this.Item("item10", "895 Kamenicky(Czech) MS-DOS", null, "KamenickyDOS"));
    items.push(this.Item("item11", "1250 Eastern European Windows", null, "EasternEuropeanWindows"));
    items.push(this.Item("item12", "1251 Russian Windows", null, "RussianWindows"));
    items.push(this.Item("item13", "1252 WindowsANSI", null, "WindowsANSI"));
    items.push(this.Item("item14", "1253 GreekWindows", null, "GreekWindows"));
    items.push(this.Item("item15", "1254 TurkishWindows", null, "TurkishWindows"));
    items.push(this.Item("item16", "10000 StandardMacintosh", null, "StandardMacintosh"));
    items.push(this.Item("item17", "10006 GreekMacintosh", null, "GreekMacintosh"));
    items.push(this.Item("item18", "10007 RussianMacintosh", null, "RussianMacintosh"));
    items.push(this.Item("item19", "10029 EasternEuropeanMacintosh", null, "EasternEuropeanMacintosh"));
    
    return items;
}

StiMvcViewer.prototype.GetAllowEditableItems = function () {
    var items = [];
    items.push(this.Item("item0", this.collections.loc["NameYes"], null, "Yes"));
    items.push(this.Item("item1", this.collections.loc["NameNo"], null, "No"));

    return items;
}

StiMvcViewer.prototype.GetEncryptionKeyLengthItems = function () {
    var items = [];
    items.push(this.Item("item0", "40 bit", null, "Bit40"));
    items.push(this.Item("item1", "128 bit", null, "Bit128"));

    return items;
}

StiMvcViewer.prototype.InitializeZoomMenu = function () {
    var items = [];
    var zoomItems = ["25", "50", "75", "100", "150", "200"];
    for (var i in zoomItems) {
        items.push(this.Item("Zoom" + zoomItems[i], zoomItems[i] + "%", "SelectedItem.png", "Zoom" + zoomItems[i]));
    }
    items.push("separator1");
    items.push(this.Item("ZoomOnePage", this.collections.loc["ZoomOnePage"], "ZoomOnePage.png", "ZoomOnePage"));
    items.push(this.Item("ZoomPageWidth", this.collections.loc["ZoomPageWidth"], "ZoomPageWidth.png", "ZoomPageWidth"));

    var zoomMenu = this.VerticalMenu("zoomMenu", this.controls.toolbar.controls["Zoom"], "Down", items);

    zoomMenu.action = function (menuItem) {
        zoomMenu.changeVisibleState(false);
        zoomMenu.jsObject.postAction(menuItem.key);
    }
}

StiMvcViewer.prototype.VerticalMenu = function (name, parentButton, animDirection, items, itemStyleName, menuStyleName) {
    var menu = this.BaseMenu(name, parentButton, animDirection, menuStyleName);
    menu.itemStyleName = itemStyleName;

    menu.addItems = function (items) {
        while (this.innerContent.childNodes[0]) {
            this.innerContent.removeChild(this.innerContent.childNodes[0]);
        }
        for (var index in items) {
            if (typeof (items[index]) != "string")
                this.innerContent.appendChild(this.jsObject.VerticalMenuItem(this, items[index].name, items[index].caption, items[index].imageName, items[index].key, this.itemStyleName));
            else
                this.innerContent.appendChild(this.jsObject.VerticalMenuSeparator(this, items[index]));
        }
    }

    menu.addItems(items);
    
    return menu; 
}

StiMvcViewer.prototype.VerticalMenuItem = function (menu, itemName, caption, imageName, key, styleName) {
    var menuItem = document.createElement("div");
    menuItem.jsObject = this;
    menuItem.menu = menu;
    menuItem.name = itemName;
    menuItem.key = key;
    menuItem.caption_ = caption;
    menuItem.imageName = imageName;
    menuItem.styleName = styleName || "stiMvcViewerMenuStandartItem";
    menuItem.id = this.generateKey();
    menuItem.className = menuItem.styleName;
    menu.items[itemName] = menuItem;
    menuItem.isEnabled = true;
    menuItem.isSelected = false;
    menuItem.style.height = this.options.isTouchDevice ? "30px" : "24px";

    var innerTable = this.CreateHTMLTable();
    menuItem.appendChild(innerTable);
    innerTable.style.height = "100%";
    innerTable.style.width = "100%";

    if (imageName != null) {
        menuItem.cellImage = innerTable.addCell();
        menuItem.cellImage.style.width = "22px";
        menuItem.cellImage.style.minWidth = "22px";
        menuItem.cellImage.style.padding = "0";
        menuItem.cellImage.style.textAlign = "center";
        var img = document.createElement("img");
        menuItem.image = img;
        menuItem.cellImage.style.lineHeight = "0";
        menuItem.cellImage.appendChild(img);
        img.src = this.collections.images[imageName];
    }

    if (caption != null) {
        var captionCell = innerTable.addCell();
        menuItem.caption = captionCell;
        captionCell.style.padding = "0 20px 0 7px";
        captionCell.style.textAlign = "left";
        captionCell.style.whiteSpace = "nowrap";
        captionCell.innerHTML = caption;
    }

    menuItem.onmouseover = function () {
        if (this.isTouchProcessFlag || !this.isEnabled) return;
        this.className = this.styleName + " " + this.styleName + "Over";
    }

    menuItem.onmouseout = function () {
        if (this.isTouchProcessFlag || !this.isEnabled) return;
        this.className = this.styleName;
        if (this.isSelected) this.className += " " + this.styleName + "Selected";
    }

    menuItem.onclick = function () {
        if (this.isTouchProcessFlag || !this.isEnabled) return;
        this.action();
    }

    menuItem.ontouchstart = function () {
        this.jsObject.options.fingerIsMoved = false;
    }

    menuItem.ontouchend = function () {
        if (!this.isEnabled || this.jsObject.options.fingerIsMoved) return;
        this.isTouchProcessFlag = true;
        this.className = this.styleName + " " + this.styleName + "Over";
        var this_ = this;
        setTimeout(function () {
            this_.className = this_.styleName;
            this_.action();
        }, 150);
        setTimeout(function () {
            this_.isTouchProcessFlag = false;
        }, 1000);
    }

    menuItem.action = function () {
        this.menu.action(this);
    }

    menuItem.setEnabled = function (state) {
        this.isEnabled = state;
        this.className = this.styleName + " " + (state ? "" : (this.styleName + "Disabled"));
    }

    menuItem.setSelected = function (state) {
        if (!state) {
            this.isSelected = false;
            this.className = this.styleName;
            return;
        }
        if (this.menu.selectedItem != null) {
            this.menu.selectedItem.className = this.styleName;
            this.menu.selectedItem.isSelected = false;
        }
        this.className = this.styleName + " " + this.styleName + "Selected";
        this.menu.selectedItem = this;
        this.isSelected = true;
    }

    return menuItem;
}

StiMvcViewer.prototype.VerticalMenuSeparator = function (menu, name) {
    var menuSeparator = document.createElement("div");
    menuSeparator.className = "stiMvcViewerVerticalMenuSeparator";
    menu.items[name] = menuSeparator;

    return menuSeparator;
}

StiMvcViewer.prototype.InitializeDatePicker = function () {
    var datePicker = this.BaseMenu(null, null, "Down", "stiMvcViewerDropdownMenu");
    datePicker.style.fontFamily = this.options.toolbar.fontFamily;
    if (this.options.toolbar.fontColor != "") datePicker.style.color = this.options.toolbar.fontColor;
    datePicker.style.zIndex = "36";
    datePicker.parentDataControl = null;
    datePicker.dayButtons = [];
    datePicker.showTime = false;
    datePicker.key = new Date();
    this.controls.datePicker = datePicker;
    this.controls.mainPanel.appendChild(datePicker);

    // Add Header Buttons
    var headerButtonsTable = this.CreateHTMLTable();
    datePicker.innerContent.appendChild(headerButtonsTable);

    // Prev Month
    datePicker.prevMonthButton = this.SmallButton(null, null, "ArrowLeft.png");
    datePicker.prevMonthButton.style.margin = "1px 2px 0 1px";
    datePicker.prevMonthButton.datePicker = datePicker;
    datePicker.prevMonthButton.action = function () {
        var month = this.datePicker.key.getMonth();
        var year = this.datePicker.key.getFullYear();
        month--;
        if (month == -1) { month = 11; year--; }
        var countDaysInMonth = this.jsObject.GetCountDaysOfMonth(year, month);
        if (countDaysInMonth < this.datePicker.key.getDate()) this.datePicker.key.setDate(countDaysInMonth);
        this.datePicker.key.setMonth(month); this.datePicker.key.setYear(year);
        this.datePicker.fill();
        this.datePicker.action();
    };
    headerButtonsTable.addCell(datePicker.prevMonthButton);

    // Month DropDownList
    datePicker.monthDropDownList = this.DropDownList("DatePickerMonth", this.options.isTouchDevice ? 79 : 81, null, this.GetMonthesForDatePickerItems(), true);
    datePicker.monthDropDownList.style.margin = "1px 2px 0 0";
    datePicker.monthDropDownList.datePicker = datePicker;
    datePicker.monthDropDownList.action = function () {
        var countDaysInMonth = this.jsObject.GetCountDaysOfMonth(this.datePicker.key.getFullYear(), parseInt(this.key));
        if (countDaysInMonth < this.datePicker.key.getDate()) this.datePicker.key.setDate(countDaysInMonth);
        this.datePicker.key.setMonth(parseInt(this.key));
        this.datePicker.repaintDays();
        this.datePicker.action();
    };
    headerButtonsTable.addCell(datePicker.monthDropDownList);

    // Override menu
    datePicker.monthDropDownList.menu.style.zIndex = "37";
    datePicker.monthDropDownList.menu.datePicker = datePicker;
    datePicker.monthDropDownList.menu.onmousedown = function () { if (this.jsObject.options.isTouchDevice) return; this.ontouchstart(); }
    datePicker.monthDropDownList.menu.ontouchstart = function () { this.jsObject.options.dropDownListMenuPressed = this; this.datePicker.ontouchstart(); }

    // Year TextBox
    datePicker.yearTextBox = this.TextBox(null, 40, "Year");
    datePicker.yearTextBox.style.margin = "1px 2px 0 0";
    datePicker.yearTextBox.datePicker = datePicker;
    datePicker.yearTextBox.action = function () {
        var year = this.jsObject.strToCorrectPositiveInt(this.value);
        this.value = year;
        this.datePicker.key.setYear(year);
        this.datePicker.repaintDays();
        this.datePicker.action();
    };
    headerButtonsTable.addCell(datePicker.yearTextBox);

    // Next Month
    datePicker.nextMonthButton = this.SmallButton(null, null, "ArrowRight.png");
    datePicker.nextMonthButton.datePicker = datePicker;
    datePicker.nextMonthButton.style.margin = "1px 1px 0 0";
    datePicker.nextMonthButton.action = function () {
        var month = this.datePicker.key.getMonth();
        var year = this.datePicker.key.getFullYear();
        month++;
        if (month == 12) { month = 0; year++; }
        var countDaysInMonth = this.jsObject.GetCountDaysOfMonth(year, month);
        if (countDaysInMonth < this.datePicker.key.getDate()) this.datePicker.key.setDate(countDaysInMonth);
        this.datePicker.key.setMonth(month); this.datePicker.key.setYear(year);
        this.datePicker.fill();
        this.datePicker.action();
    };
    headerButtonsTable.addCell(datePicker.nextMonthButton);

    // Separator
    var separator = document.createElement("div");
    separator.style.margin = "2px 0 2px 0";
    separator.className = "stiMvcViewerDatePickerSeparator";
    datePicker.innerContent.appendChild(separator);

    datePicker.daysTable = this.CreateHTMLTable();
    datePicker.innerContent.appendChild(datePicker.daysTable);

    // Add Day Of Week
    for (var i = 0; i < 7; i++) {
        var dayOfWeekCell = datePicker.daysTable.addCell();
        dayOfWeekCell.className = "stiMvcViewerDatePickerDayOfWeekCell";
        var dayName = this.collections.loc["Day" + this.collections.dayOfWeek[i]];
        if (dayName) dayOfWeekCell.innerHTML = dayName.toString().substring(0, 1).toUpperCase();
        if (i == 5) dayOfWeekCell.style.color = "#0000ff";
        if (i == 6) dayOfWeekCell.style.color = "#ff0000";
    }

    // Add Day Cells
    datePicker.daysTable.addRow();
    var rowCount = 1;
    for (var i = 0; i < 42; i++) {
        var dayButton = this.DatePickerDayButton();
        dayButton.datePicker = datePicker;
        dayButton.style.margin = "1px";
        datePicker.dayButtons.push(dayButton);
        datePicker.daysTable.addCellInRow(rowCount, dayButton);
        if ((i + 1) % 7 == 0) { datePicker.daysTable.addRow(); rowCount++ }
    }

    // Separator2
    var separator2 = document.createElement("div");
    separator2.style.margin = "2px 0 2px 0";
    separator2.className = "stiMvcViewerDatePickerSeparator";
    datePicker.innerContent.appendChild(separator2);

    // Time
    var timeTable = this.CreateHTMLTable();
    timeTable.style.width = "100%";
    datePicker.innerContent.appendChild(timeTable);
    timeTable.addTextCell(this.collections.loc.Time + ":").style.padding = "0 4px 0 4px";
    var timeControl = this.TextBox(null, 90);
    timeControl.style.margin = "1px 2px 2px 2px";
    var timeControlCell = timeTable.addCell(timeControl);
    timeControlCell.style.width = "100%";
    timeControlCell.style.textAlign = "right";
    datePicker.time = timeControl;

    timeControl.action = function () {
        var time = this.jsObject.stringToTime(this.value);
        datePicker.key.setHours(time.hours);
        datePicker.key.setMinutes(time.minutes);
        datePicker.key.setSeconds(time.seconds);
        this.value = this.jsObject.formatDate(datePicker.key, "h:nn:ss");
        datePicker.action();
    };

    datePicker.repaintDays = function () {
        var month = this.key.getMonth();
        var year = this.key.getFullYear();
        var countDaysInMonth = this.jsObject.GetCountDaysOfMonth(year, month);
        var firstDay = this.jsObject.GetDayOfWeek(year, month, 1);

        for (var i = 0; i < 42; i++) {
            var numDay = i - (firstDay - 1) + 1;
            var isSelectedDay = (numDay == this.key.getDate());
            var dayButton = this.dayButtons[i];

            if (!((i < firstDay - 1) || (i - (firstDay - 1) > countDaysInMonth - 1))) {
                dayButton.numberOfDay = numDay;
                dayButton.caption.innerHTML = numDay;
                dayButton.setEnabled(true);
                dayButton.setSelected(isSelectedDay);
            }
            else {
                dayButton.caption.innerHTML = "";
                dayButton.setEnabled(false);
            }
        }
    }

    datePicker.fill = function () {
        this.yearTextBox.value = this.key.getFullYear();
        this.monthDropDownList.setKey(this.key.getMonth());
        this.repaintDays();
        if (this.showTime) {
            this.time.value = this.jsObject.formatDate(this.key, "h:nn:ss");
        }
    }

    datePicker.onshow = function () {
        this.key = new Date();
        if (this.ownerValue) {
            this.key = new Date(this.ownerValue.year, this.ownerValue.month - 1, this.ownerValue.day,
            this.ownerValue.hours, this.ownerValue.minutes, this.ownerValue.seconds);
        }
        separator2.style.display = this.showTime ? "" : "none";
        timeTable.style.display = this.showTime ? "" : "none";
        this.fill();
    };

    datePicker.action = function () {
        if (!this.ownerValue) this.ownerValue = this.jsObject.getNowDateTimeObject();
        this.ownerValue.year = this.key.getFullYear();
        this.ownerValue.month = this.key.getMonth() + 1;
        this.ownerValue.day = this.key.getDate();
        this.ownerValue.hours = this.key.getHours();
        this.ownerValue.minutes = this.key.getMinutes();
        this.ownerValue.seconds = this.key.getSeconds();
        if (this.parentDataControl)
            this.parentDataControl.value = this.jsObject.dateTimeObjectToString(datePicker.ownerValue, this.parentDataControl.parameter.params.dateTimeType);
    };

    // Ovveride Methods
    datePicker.onmousedown = function () { if (this.jsObject.options.isTouchDevice) return; this.ontouchstart(); }
    datePicker.ontouchstart = function () { this.jsObject.options.datePickerPressed = this; }
    datePicker.changeVisibleState = function (state) {
        var mainClassName = "stiMvcViewerMainPanel";
        if (state) {
            this.onshow();
            this.style.display = "";
            this.visible = true;
            this.style.overflow = "hidden";
            this.parentDataControl.setSelected(true);
            this.parentButton.setSelected(true);
            this.jsObject.options.currentDatePicker = this;
            this.style.width = this.innerContent.offsetWidth + "px";
            this.style.height = this.innerContent.offsetHeight + "px";
            this.style.left = (this.jsObject.FindPosX(this.parentButton, mainClassName)) + "px";
            this.style.top = (this.jsObject.FindPosY(this.parentButton, mainClassName) + this.parentButton.offsetHeight + 1) + "px";
            this.innerContent.style.top = -this.innerContent.offsetHeight + "px";

            var d = new Date();
            var endTime = d.getTime();
            if (this.jsObject.options.toolbar.menuAnimation) endTime += this.jsObject.options.menuAnimDuration;
            this.jsObject.ShowAnimationVerticalMenu(this, 0, endTime);
        }
        else {
            clearTimeout(this.innerContent.animationTimer);
            this.showTime = false;
            this.visible = false;
            this.parentDataControl.setSelected(false);
            this.parentButton.setSelected(false);
            this.style.display = "none";
            if (this.jsObject.options.currentDatePicker == this) this.jsObject.options.currentDatePicker = null;
        }
    }

    return datePicker;
}

StiMvcViewer.prototype.DatePickerDayButton = function () {
    var button = this.SmallButton(null, "0", null, null, null, "stiMvcViewerDatePickerDayButton");
    var size = this.options.isTouchDevice ? "25px" : "23px";
    button.style.width = size;
    button.style.height = size;
    button.caption.style.textAlign = "center";
    button.innerTable.style.width = "100%";
    button.caption.style.padding = "0px";
    button.numberOfDay = 1;
    button.action = function () {
        this.datePicker.key.setDate(parseInt(this.numberOfDay));
        this.setSelected(true);
        this.datePicker.action();
        this.datePicker.changeVisibleState(false);
    }

    return button;
}


// Helper Methods
StiMvcViewer.prototype.GetDayOfWeek = function (year, month) {
    var result = new Date(year, month, 1).getDay();
    if (result == 0) result = 7;
    return result;
}

StiMvcViewer.prototype.GetCountDaysOfMonth = function (year, month) {
    var countDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var count = countDaysInMonth[month];

    if (month == 1)
        if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0))
            count = 29;
        else
            count = 28;
    return count;
}

/* Monthes */
StiMvcViewer.prototype.GetMonthesForDatePickerItems = function () {
    var items = [];
    for (var i = 0; i < this.collections.months.length; i++)
        items.push(this.Item("Month" + i, this.collections.loc["Month" + this.collections.months[i]], null, i));

    return items;
}

/* DayOfWeek */
StiMvcViewer.prototype.GetDayOfWeekItems = function () {
    var items = [];
    for (var i = 0; i < this.collections.dayOfWeek.length; i++) {
        items.push(this.Item("DayOfWeekItem" + i, this.collections.loc["Day" + this.collections.dayOfWeek[i]], null, this.collections.dayOfWeek[i]));
    }

    return items;
}

StiMvcViewer.prototype.scrollToAnchor = function (anchor) {
    for (var i = 0; i < document.anchors.length; i++) {
        if (document.anchors[i].name == anchor) {
            var anchorElement = document.anchors[i];
            var anchorParent = anchorElement.parentElement || anchorElement;
            var targetTop = this.FindPosY(anchorElement, this.options.appearance.scrollbarsMode ? "stiMvcViewerReportPanel" : null, true) - anchorParent.offsetHeight * 2;

            var d = new Date();
            var endTime = d.getTime() + this.options.scrollDuration;
            var this_ = this;
            this.ShowAnimationForScroll(this.controls.reportPanel, targetTop, endTime,
            function () {
                var page = this_.getPageFromAnchorElement(anchorElement);                
                var anchorParentTopPos = this_.FindPosY(anchorParent, "stiMvcViewerReportPanel", true);
                var pageTopPos = page ? this_.FindPosY(page, "stiMvcViewerReportPanel", true) : anchorParentTopPos;

                var label = document.createElement("div");
                this_.controls.bookmarksLabel = label;
                label.className = "stiMvcViewerBookmarksLabel";
                var labelMargin = 20 * (this_.options.zoom / 100);
                var labelWidth = page ? page.offsetWidth - labelMargin - 6 : anchorParent.offsetWidth;
                var labelHeight = anchorParent.offsetHeight - 3;
                label.style.width = labelWidth + "px";
                label.style.height = labelHeight + "px";

                var pageLeftMargin = page.margins ? this_.StrToInt(page.margins[3]) : 0;
                label.style.marginLeft = (labelMargin / 2 - pageLeftMargin) + "px";
                var pageTopMargin = page.margins ? this_.StrToInt(page.margins[0]) : 0;
                label.style.marginTop = (anchorParentTopPos - pageTopPos - pageTopMargin - (this_.options.zoom / 100)) + "px";

                page.insertBefore(label, page.childNodes[0]);
            });
            break;
        }
    }
}

StiMvcViewer.prototype.removeBookmarksLabel = function () {
    if (this.controls.bookmarksLabel) {
        this.controls.bookmarksLabel.parentElement.removeChild(this.controls.bookmarksLabel);
        this.controls.bookmarksLabel = null;
    }
}

StiMvcViewer.prototype.getPageFromAnchorElement = function (anchorElement) {
    var obj = anchorElement;
    while (obj.parentElement) {
        if (obj.className && obj.className.indexOf("stiMvcViewerPage") == 0) {
            return obj;
        }
        obj = obj.parentElement;
    }
    return obj;
}

StiMvcViewer.prototype.isContainted = function (array, item) {
    for (var index in array)
        if (item == array[index]) return true;

    return false;
}

StiMvcViewer.prototype.IsTouchDevice = function () {
    return ('ontouchstart' in document.documentElement);
}

StiMvcViewer.prototype.SetZoom = function (zoomIn) {
    zoomValues = ["25", "50", "75", "100", "150", "200"];

    for (var i = 0; i < zoomValues.length; i++)
        if (zoomValues[i] == this.options.zoom) break;

    if (zoomIn && i < zoomValues.length - 1) this.postAction("Zoom" + zoomValues[i + 1]);
    if (!zoomIn && i > 0) this.postAction("Zoom" + zoomValues[i - 1]);
}

StiMvcViewer.prototype.getCssParameter = function (css) {
    if (css.indexOf(".gif]") > 0 || css.indexOf(".png]") > 0) return css.substr(css.indexOf("["), css.indexOf("]") - css.indexOf("[") + 1);
    return null;
}

StiMvcViewer.prototype.newGuid = (function () {
    var CHARS = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
    return function (len, radix) {
        var chars = CHARS, uuid = [], rnd = Math.random;
        radix = radix || chars.length;

        if (len) {
            for (var i = 0; i < len; i++) uuid[i] = chars[0 | rnd() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            for (var i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | rnd() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
                }
            }
        }

        return uuid.join('');
    };
})();

StiMvcViewer.prototype.generateKey = function () {
    return this.newGuid().replace(/-/g, '');
}

StiMvcViewer.prototype.Item = function (name, caption, imageName, key) {
    var item = {
        "name": name,
        "caption": caption,
        "imageName": imageName,
        "key": key
    }

    return item;
}

StiMvcViewer.prototype.StrToInt = function (value) {   
    var result = parseInt(value);
    if (result) return result;
    return 0;
}

StiMvcViewer.prototype.formatDate = function (formatDate, formatString) {
    var yyyy = formatDate.getFullYear();
    var yy = yyyy.toString().substring(2);
    var m = formatDate.getMonth() + 1;
    var mm = m < 10 ? "0" + m : m;
    var d = formatDate.getDate();
    var dd = d < 10 ? "0" + d : d;

    var h = formatDate.getHours();
    var hh = h < 10 ? "0" + h : h;
    var n = formatDate.getMinutes();
    var nn = n < 10 ? "0" + n : n;
    var s = formatDate.getSeconds();
    var ss = s < 10 ? "0" + s : s;

    formatString = formatString.replace(/yyyy/i, yyyy);
    formatString = formatString.replace(/yy/i, yy);
    formatString = formatString.replace(/mm/i, mm);
    formatString = formatString.replace(/m/i, m);
    formatString = formatString.replace(/dd/i, dd);
    formatString = formatString.replace(/d/i, d);
    formatString = formatString.replace(/hh/i, hh);
    formatString = formatString.replace(/h/i, h);
    formatString = formatString.replace(/nn/i, nn);
    formatString = formatString.replace(/n/i, n);
    formatString = formatString.replace(/ss/i, ss);
    formatString = formatString.replace(/s/i, s);

    return formatString;
}

StiMvcViewer.prototype.stringToTime = function (timeStr) {
    var timeArray = timeStr.split(":");
    var time = { hours: 0, minutes: 0, seconds: 0 };

    time.hours = this.StrToInt(timeArray[0]);
    if (timeArray.length > 1) time.minutes = this.StrToInt(timeArray[1]);
    if (timeArray.length > 2) time.seconds = this.StrToInt(timeArray[2]);

    if (time.hours < 0) time.hours = 0;
    if (time.minutes < 0) time.minutes = 0;
    if (time.seconds < 0) time.seconds = 0;

    if (time.hours > 23) time.hours = 23;
    if (time.minutes > 59) time.minutes = 59;
    if (time.seconds > 59) time.seconds = 59;

    return time;
}

StiMvcViewer.prototype.dateTimeObjectToString = function (dateTimeObject, typeDateTimeObject) {    
    var date = new Date(dateTimeObject.year, dateTimeObject.month - 1, dateTimeObject.day, dateTimeObject.hours, dateTimeObject.minutes, dateTimeObject.seconds);

    if (this.options.appearance.parametersPanelDateFormat != "") return this.formatDate(date, this.options.appearance.parametersPanelDateFormat);
    if (typeDateTimeObject == "Time") return date.toLocaleTimeString();
    if (typeDateTimeObject == "Date") return date.toLocaleDateString();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

StiMvcViewer.prototype.getStringKey = function (key, parameter) {
    var stringKey = (parameter.params.type == "DateTime")
        ? this.dateTimeObjectToString(key, parameter.params.dateTimeType)
        : key;

    return stringKey;
}

StiMvcViewer.prototype.getCountObjects = function (objectArray) {
    var count = 0;
    if (objectArray)
        for (var singleObject in objectArray) { count++ };
    return count;
}

StiMvcViewer.prototype.getNowDateTimeObject = function () {
    var date = new Date();
    dateTimeObject = {};
    dateTimeObject.year = date.getFullYear();
    dateTimeObject.month = date.getMonth() + 1;
    dateTimeObject.day = date.getDate();
    dateTimeObject.hours = date.getHours();
    dateTimeObject.minutes = date.getMinutes();
    dateTimeObject.seconds = date.getSeconds();

    return dateTimeObject;
}

StiMvcViewer.prototype.getNowTimeSpanObject = function () {
    date = new Date();
    timeSpanObject = {};
    timeSpanObject.hours = date.getHours();
    timeSpanObject.minutes = date.getMinutes();
    timeSpanObject.seconds = date.getSeconds();

    return timeSpanObject;
}

StiMvcViewer.prototype.copyObject = function (o) {
    if (!o || "object" !== typeof o) {
        return o;
    }
    var c = "function" === typeof o.pop ? [] : {};
    var p, v;
    for (p in o) {
        if (o.hasOwnProperty(p)) {
            v = o[p];
            if (v && "object" === typeof v) {
                c[p] = this.copyObject(v);
            }
            else c[p] = v;
        }
    }
    return c;
}

StiMvcViewer.prototype.getNavigatorName = function () {
    var useragent = navigator.userAgent;
    var navigatorname = "Unknown";
    if (useragent.indexOf('MSIE') != -1) {
        navigatorname = "MSIE";
    }
    else if (useragent.indexOf('Gecko') != -1) {
        if (useragent.indexOf('Chrome') != -1)
            navigatorname = "Google Chrome";
        else navigatorname = "Mozilla";
    }
    else if (useragent.indexOf('Mozilla') != -1) {
        navigatorname = "old Netscape or Mozilla";
    }
    else if (useragent.indexOf('Opera') != -1) {
        navigatorname = "Opera";
    }

    return navigatorname;
}

StiMvcViewer.prototype.showHelpWindow = function (url) {
    var helpLanguage;
    switch (this.options.cultureName) {
        case "ru": helpLanguage = "ru";
        // case "de": helpLanguage = "de";
        default: helpLanguage = "en";
    }
    window.open("http://www.stimulsoft.com/" + helpLanguage + "/documentation/online/" + url);
}

StiMvcViewer.prototype.setObjectToCenter = function (object, defaultTop) {
    var leftPos = (this.controls.viewer.offsetWidth / 2 - object.offsetWidth / 2);
    var topPos = this.options.appearance.fullScreenMode ? (this.controls.viewer.offsetHeight / 2 - object.offsetHeight / 2) : (defaultTop ? defaultTop : 250);
    object.style.left = leftPos > 0 ? leftPos + "px" : 0;
    object.style.top = topPos > 0 ? topPos + "px" : 0;
}

StiMvcViewer.prototype.strToInt = function (value) {
    var result = parseInt(value);
    if (result) return result;
    return 0;
}

StiMvcViewer.prototype.strToCorrectPositiveInt = function (value) {
    var result = this.strToInt(value);
    if (result >= 0) return result;
    return 0;
}

StiMvcViewer.prototype.helpLinks = {
    "Print": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm",
    "Save": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm",
    "SendEmail": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm",
    "Bookmarks": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm",
    "Parameters": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm",
    "FirstPage": "user-manual/index.html?report_internals_appearance_borders_simple_borders.htm",
    "PrevPage": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm",
    "NextPage": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm",
    "LastPage": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm",
    "FullScreen": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm",
    "Zoom": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm",
    "ViewMode": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm",
    "Editor": "user-manual/index.html?viewing_reports_basic_toolbar_of_report_viewer.htm"
}

StiMvcViewer.prototype.getHTMLColor = function (color) {
    if (color.indexOf(",") > 0) return "rgb(" + color + ")";
    return color;
}

StiMvcViewer.prototype.clearStyles = function (object) {
    object.className = "stiMvcViewerClearAllStyles";
}

StiMvcViewer.prototype.getDefaultExportSettings = function (exportFormat) {
    var exportSettings = null;
    switch (exportFormat) {
        case "Document": { exportSettings = {}; break; }
        case "Pdf": { exportSettings = this.options.exports.defaultSettings["StiPdfExportSettings"]; break; }
        case "Xps": { exportSettings = this.options.exports.defaultSettings["StiXpsExportSettings"]; break; }
        case "Ppt2007": { exportSettings = this.options.exports.defaultSettings["StiPpt2007ExportSettings"]; break; }
        case "Html":
        case "Html5":
        case "Mht": { exportSettings = this.options.exports.defaultSettings["StiHtmlExportSettings"]; break; }
        case "Text": { exportSettings = this.options.exports.defaultSettings["StiTxtExportSettings"]; break; }
        case "Rtf": { exportSettings = this.options.exports.defaultSettings["StiRtfExportSettings"]; break; }
        case "Word2007": { exportSettings = this.options.exports.defaultSettings["StiWord2007ExportSettings"]; break; }
        case "Odt": { exportSettings = this.options.exports.defaultSettings["StiOdtExportSettings"]; break; }
        case "Excel":
        case "ExcelXml":
        case "Excel2007": { exportSettings = this.options.exports.defaultSettings["StiExcelExportSettings"]; break; }
        case "Ods": { exportSettings = this.options.exports.defaultSettings["StiOdsExportSettings"]; break; }
        case "ImageBmp":
        case "ImageGif":
        case "ImageJpeg":
        case "ImagePcx":
        case "ImagePng":
        case "ImageTiff":
        case "ImageSvg":
        case "ImageSvgz":
        case "ImageEmf": { exportSettings = this.options.exports.defaultSettings["StiImageExportSettings"]; break; }
        case "Xml":
        case "Csv":
        case "Dbf":
        case "Dif":
        case "Sylk": { exportSettings = this.options.exports.defaultSettings["StiDataExportSettings"]; break; }
    }

    return exportSettings;
}

StiMvcViewer.prototype.changeFullScreenMode = function (fullScreenMode) {
    this.options.appearance.scrollbarsMode = fullScreenMode || this.options.appearance.userScrollbarsMode;
    this.options.appearance.fullScreenMode = fullScreenMode;
    if (this.options.toolbar.visible && this.options.toolbar.showFullScreenButton) this.controls.toolbar.controls.FullScreen.setSelected(fullScreenMode);

    if (fullScreenMode) {
        this.controls.viewer.style.position = "absolute";
        this.controls.viewer.style.userHeight = this.controls.viewer.style.height;
        this.controls.viewer.style.height = null;

        this.controls.reportPanel.style.position = "absolute";
        this.controls.reportPanel.style.top = this.options.toolbar.visible ? this.controls.toolbar.offsetHeight + "px" : 0;
        
        document.body.prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
    }
    else {
        this.controls.viewer.style.position = "";
        if (this.controls.viewer.style.userHeight) this.controls.viewer.style.height = this.controls.viewer.style.userHeight;

        this.controls.reportPanel.style.position = this.options.viewerHeightType != "Percentage" || this.options.appearance.scrollbarsMode ? "absolute" : "relative";
        this.controls.reportPanel.style.top =
            this.options.toolbar.visible ? (this.options.viewerHeightType != "Percentage" || this.options.appearance.scrollbarsMode ? this.controls.toolbar.offsetHeight + "px" : 0) : 0;
        if (typeof document.body.prevOverflow != "undefined") {
                document.body.style.overflow = document.body.prevOverflow;
                delete document.body.prevOverflow;
        }        
    }

    this.controls.reportPanel.style.overflow = this.options.appearance.scrollbarsMode ? "auto" : "hidden";
}

StiMvcViewer.prototype.addEvent = function (element, eventName, fn) {
    if (element.addEventListener) element.addEventListener(eventName, fn, false);
    else if (element.attachEvent) element.attachEvent('on' + eventName, fn);
}

StiMvcViewer.prototype.lowerFirstChar = function (text) {
    return text.charAt(0).toLowerCase() + text.substr(1);
}

StiMvcViewer.prototype.addHoverEventsToMenus = function () {
    if (this.options.toolbar.showMenuMode == "Hover") {
        var buttonsWithMenu = ["Print", "Save", "SendEmail", "Zoom", "ViewMode"];
        for (var i = 0; i < buttonsWithMenu.length; i++) {
            var button = this.controls.toolbar.controls[buttonsWithMenu[i]];
            if (button) {
                var menu = this.controls.menus[this.lowerFirstChar(button.name) + "Menu"];
                if (menu) {
                    menu.buttonName = button.name;

                    menu.onmouseover = function () {
                        clearTimeout(this.jsObject.options.toolbar["hideTimer" + this.buttonName + "Menu"]);
                    }

                    menu.onmouseout = function () {
                        var thisMenu = this;
                        this.jsObject.options.toolbar["hideTimer" + this.buttonName + "Menu"] = setTimeout(function () {
                            thisMenu.changeVisibleState(false);
                        }, this.jsObject.options.menuHideDelay);
                    }
                }
            }
        }
    }
}

StiMvcViewer.prototype.GetXmlValue = function (xml, key) {
    var string = xml.substr(0, xml.indexOf("</" + key + ">"));
    return string.substr(xml.indexOf("<" + key + ">") + key.length + 2);
}

StiMvcViewer.prototype.CheckBox = function (name, captionText, toolTip) {
    var checkBox = this.CreateHTMLTable();
    checkBox.style.fontFamily = this.options.toolbar.fontFamily;
    if (this.options.toolbar.fontColor != "") checkBox.style.color = this.options.toolbar.fontColor;
    checkBox.jsObject = this;
    checkBox.isEnabled = true;
    checkBox.isChecked = false;
    checkBox.id = this.generateKey();
    checkBox.name = name;
    checkBox.captionText = captionText;
    if (toolTip) checkBox.setAttribute("title", toolTip);
    checkBox.className = "stiMvcViewerCheckBox";
    if (name) {
        if (!this.controls.checkBoxes) this.controls.checkBoxes = {};
        this.controls.checkBoxes[name] = checkBox;
    }

    // Image
    checkBox.imageBlock = document.createElement("div");
    var size = this.options.isTouchDevice ? "16px" : "13px";
    checkBox.imageBlock.style.width = size;
    checkBox.imageBlock.style.height = size;
    checkBox.imageBlock.className = "stiMvcViewerCheckBoxImageBlock"
    var imageBlockCell = checkBox.addCell(checkBox.imageBlock);
    if (this.options.isTouchDevice) imageBlockCell.style.padding = "1px 3px 1px 1px";

    checkBox.image = document.createElement("img");
    checkBox.image.src = this.collections.images["CheckBox.png"];
    checkBox.image.style.visibility = "hidden";
    var imgTable = this.CreateHTMLTable();
    imgTable.style.width = "100%";
    imgTable.style.height = "100%";
    checkBox.imageBlock.appendChild(imgTable);
    imgTable.addCell(checkBox.image).style.textAlign = "center";

    // Caption
    if (captionText != null) {
        checkBox.captionCell = checkBox.addCell();
        if (!this.options.isTouchDevice) checkBox.captionCell.style.padding = "1px 0 0 4px";
        checkBox.captionCell.style.whiteSpace = "nowrap";
        checkBox.captionCell.innerHTML = captionText;
    }

    checkBox.onmouseover = function () {
        if (this.isTouchProcessFlag || !this.isEnabled) return;
        this.imageBlock.className = "stiMvcViewerCheckBoxImageBlockOver";
    }

    checkBox.onmouseout = function () {
        if (this.isTouchProcessFlag || !this.isEnabled) return;
        this.imageBlock.className = "stiMvcViewerCheckBoxImageBlock";
    }

    checkBox.onclick = function () {
        if (this.isTouchProcessFlag || !this.isEnabled) return;
        this.setChecked(!this.isChecked);
        this.action();
    }

    checkBox.ontouchend = function () {
        if (!this.isEnabled || this.jsObject.options.fingerIsMoved) return;
        this.isTouchProcessFlag = true;
        this.imageBlock.className = "stiMvcViewerCheckBoxImageBlockOver";
        setTimeout("js" + this.jsObject.controls.viewer.id + ".CheckBoxSetCheckedState('" + this.id + "')", 150);
        var this_ = this;
        /*setTimeout(function () {
            this_.imageBlock.className = "stiMvcViewerCheckBoxImageBlock";
            this_.setChecked(!this_.isChecked);
            this_.action();
        }, 150);*/
        setTimeout(function () {
            this_.isTouchProcessFlag = false;
        }, 1000);
    }

    checkBox.ontouchstart = function () {
        this.jsObject.options.fingerIsMoved = false;
    }

    checkBox.setEnabled = function (state) {
        this.image.style.opacity = state ? "1" : "0.5";
        this.isEnabled = state;
        this.className = state ? "stiMvcViewerCheckBox" : "stiMvcViewerCheckBoxDisabled";
        this.imageBlock.className = state ? "stiMvcViewerCheckBoxImageBlock" : "stiMvcViewerCheckBoxImageBlockDisabled";
    }

    checkBox.setChecked = function (state) {
        this.image.style.visibility = (state) ? "visible" : "hidden";
        this.isChecked = state;
        this.onChecked();
    }

    checkBox.onChecked = function () { }
    checkBox.action = function () { }

    return checkBox;
}

StiMvcViewer.prototype.CheckBoxSetCheckedState = function (checkBoxId) {
    var checkBox = document.getElementById(checkBoxId);
    if (!checkBox) return;
    checkBox.imageBlock.className = "stiMvcViewerCheckBoxImageBlock";
    checkBox.setChecked(!checkBox.isChecked);
    checkBox.action();
}

StiMvcViewer.prototype.InitializeExportForm = function () {

    var exportForm = this.BaseForm("exportForm", this.collections.loc["ExportFormTitle"], 1);
    exportForm.style.fontFamily = this.options.toolbar.fontFamily;
    if (this.options.toolbar.fontColor != "") exportForm.style.color = this.options.toolbar.fontColor;
    exportForm.style.fontSize = "12px";
    exportForm.controls = {};
    exportForm.labels = {};
    exportForm.container.style.padding = "3px";

    exportForm.addControlToParentControl = function (label, control, parentControl, name) {
        if (parentControl.innerTable == null) {
            parentControl.innerTable = exportForm.jsObject.CreateHTMLTable();
            parentControl.appendChild(parentControl.innerTable);
        }
        control.parentRow = parentControl.innerTable.addRow();
        var cellForLabel = parentControl.innerTable.addCellInLastRow();
        var cellForControl = (label != null) ? parentControl.innerTable.addCellInLastRow() : cellForLabel;
        if (label != null) {
            cellForLabel.style.padding = "0 8px 0 8px";
            cellForLabel.style.minWidth = "150px";
            if (label) cellForLabel.innerHTML = label;
            exportForm.labels[name] = cellForLabel;
            var tooltip = control.getAttribute("title");
            if (tooltip != null) cellForLabel.setAttribute("title", tooltip);
        }
        else {
            cellForControl.setAttribute("colspan", "2");
        }
        cellForControl.appendChild(control);
    }

    var mrgn = "8px";

    // 0-name, 1-label, 2-control, 3-parentControlName, 4-margin
    var controlProps = [
        ["SavingReportGroup", null, this.GroupPanel(this.collections.loc["SavingReport"]), null, "4px"],
        ["SaveReportMdc", null, this.RadioButton(exportForm.name + "SaveReportMdc", exportForm.name + "SavingReportGroup", this.collections.loc["SaveReportMdc"], null), "SavingReportGroup.container", "6px " + mrgn + " 3px " + mrgn],
        ["SaveReportMdz", null, this.RadioButton(exportForm.name + "SaveReportMdz", exportForm.name + "SavingReportGroup", this.collections.loc["SaveReportMdz"], null), "SavingReportGroup.container", "3px " + mrgn + " 3px " + mrgn],
        ["SaveReportMdx", null, this.RadioButton(exportForm.name + "SaveReportMdx", exportForm.name + "SavingReportGroup", this.collections.loc["SaveReportMdx"], null), "SavingReportGroup.container", "3px " + mrgn + " 0px " + mrgn],
        ["SaveReportPassword", this.collections.loc["PasswordSaveReport"], this.TextBox(null, 140, this.collections.loc["PasswordSaveReportTooltip"]), "SavingReportGroup.container", "4px " + mrgn + " 0px " + mrgn],
        ["PageRangeGroup", null, this.GroupPanel(this.collections.loc["PagesRange"]), null, "4px"],
        ["PageRangeAll", null, this.RadioButton(exportForm.name + "PagesRangeAll", exportForm.name + "PageRangeGroup", this.collections.loc["PagesRangeAll"], this.collections.loc["PagesRangeAllTooltip"]), "PageRangeGroup.container", "6px " + mrgn + " 6px " + mrgn],
        ["PageRangeCurrentPage", null, this.RadioButton(exportForm.name + "PagesRangeCurrentPage", exportForm.name + "PageRangeGroup", this.collections.loc["PagesRangeCurrentPage"], this.collections.loc["PagesRangeCurrentPageTooltip"]), "PageRangeGroup.container", "0px " + mrgn + " 4px " + mrgn],
        ["PageRangePages", null, this.RadioButton(exportForm.name + "PagesRangePages", exportForm.name + "PageRangeGroup", this.collections.loc["PagesRangePages"], this.collections.loc["PagesRangePagesTooltip"]), "PageRangeGroup.container", "0px " + mrgn + " 0px " + mrgn],
        ["PageRangePagesText", null, this.TextBox(null, 130, this.collections.loc["PagesRangePagesTooltip"]), "PageRangePages.lastCell"/*, true*/, "0 0 0 30px"],
        ["SettingsGroup", null, this.GroupPanel(this.collections.loc["SettingsGroup"]), null, "4px"],
        ["ImageType", this.collections.loc["Type"], this.DropDownListForExportForm(null, 160, this.collections.loc["TypeTooltip"], this.GetImageTypesItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["DataType", this.collections.loc["Type"], this.DropDownListForExportForm(null, 160, this.collections.loc["TypeTooltip"], this.GetDataTypesItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["ExcelType", this.collections.loc["Type"], this.DropDownListForExportForm(null, 160, this.collections.loc["TypeTooltip"], this.GetExcelTypesItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["HtmlType", this.collections.loc["Type"], this.DropDownListForExportForm(null, 160, this.collections.loc["TypeTooltip"], this.GetHtmlTypesItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["Zoom", this.collections.loc["ZoomHtml"], this.DropDownListForExportForm(null, 160, this.collections.loc["ZoomHtmlTooltip"], this.GetZoomItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["ImageFormatForHtml", this.collections.loc["ImageFormatForHtml"], this.DropDownListForExportForm(null, 160, this.collections.loc["ImageFormatForHtmlTooltip"], this.GetImageFormatForHtmlItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["ExportMode", this.collections.loc["ExportMode"], this.DropDownListForExportForm(null, 160, this.collections.loc["ExportModeTooltip"], this.GetExportModeItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["CompressToArchive", null, this.CheckBox(null, this.collections.loc["CompressToArchive"], this.collections.loc["CompressToArchiveTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["UseEmbeddedImages", null, this.CheckBox(null, this.collections.loc["EmbeddedImageData"], this.collections.loc["EmbeddedImageDataTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["AddPageBreaks", null, this.CheckBox(null, this.collections.loc["AddPageBreaks"], this.collections.loc["AddPageBreaksTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["ImageResolution", this.collections.loc["ImageResolution"], this.DropDownListForExportForm(null, 160, this.collections.loc["ImageResolutionTooltip"], this.GetImageResolutionItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["ImageCompressionMethod", this.collections.loc["ImageCompressionMethod"], this.DropDownListForExportForm(null, 160, this.collections.loc["ImageCompressionMethodTooltip"], this.GetImageCompressionMethodItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["AllowEditable", this.collections.loc["AllowEditable"], this.DropDownListForExportForm(null, 160, this.collections.loc["AllowEditableTooltip"], this.GetAllowEditableItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["ImageQuality", this.collections.loc["ImageQuality"], this.DropDownListForExportForm(null, 160, this.collections.loc["ImageQualityTooltip"], this.GetImageQualityItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["ContinuousPages", null, this.CheckBox(null, this.collections.loc["ContinuousPages"], this.collections.loc["ContinuousPagesTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["StandardPdfFonts", null, this.CheckBox(null, this.collections.loc["StandardPDFFonts"], this.collections.loc["StandardPDFFontsTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["EmbeddedFonts", null, this.CheckBox(null, this.collections.loc["EmbeddedFonts"], this.collections.loc["EmbeddedFontsTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["UseUnicode", null, this.CheckBox(null, this.collections.loc["UseUnicode"], this.collections.loc["UseUnicodeTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["Compressed", null, this.CheckBox(null, this.collections.loc["Compressed"], this.collections.loc["CompressedTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["ExportRtfTextAsImage", null, this.CheckBox(null, this.collections.loc["ExportRtfTextAsImage"], this.collections.loc["ExportRtfTextAsImageTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["PdfACompliance", null, this.CheckBox(null, this.collections.loc["PdfACompliance"], this.collections.loc["PdfAComplianceTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["KillSpaceLines", null, this.CheckBox(null, this.collections.loc["KillSpaceLines"], this.collections.loc["KillSpaceLinesTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["PutFeedPageCode", null, this.CheckBox(null, this.collections.loc["PutFeedPageCode"], this.collections.loc["PutFeedPageCodeTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["DrawBorder", null, this.CheckBox(null, this.collections.loc["DrawBorder"], this.collections.loc["DrawBorderTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["CutLongLines", null, this.CheckBox(null, this.collections.loc["CutLongLines"], this.collections.loc["CutLongLinesTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["BorderType", this.collections.loc["BorderType"] + ":", this.DropDownListForExportForm(null, 160, this.collections.loc["BorderTypeTooltip"], this.GetBorderTypeItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["ZoomX", this.collections.loc["ZoomXY"] ? this.collections.loc["ZoomXY"].replace(":", "") + " X: " : "", this.DropDownListForExportForm(null, 160, this.collections.loc["ZoomXYTooltip"], this.GetZoomItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["ZoomY", this.collections.loc["ZoomXY"] ? this.collections.loc["ZoomXY"].replace(":", "") + " Y: " : "", this.DropDownListForExportForm(null, 160, this.collections.loc["ZoomXYTooltip"], this.GetZoomItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["EncodingTextOrCsvFile", this.collections.loc["EncodingData"], this.DropDownListForExportForm(null, 160, this.collections.loc["EncodingDataTooltip"], this.GetEncodingDataItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["ImageFormat", this.collections.loc["ImageFormat"], this.DropDownListForExportForm(null, 160, this.collections.loc["ImageFormatTooltip"], this.GetImageFormatItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["DitheringType", this.collections.loc["MonochromeDitheringType"], this.DropDownListForExportForm(null, 160, this.collections.loc["MonochromeDitheringTypeTooltip"], this.GetMonochromeDitheringTypeItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["TiffCompressionScheme", this.collections.loc["TiffCompressionScheme"], this.DropDownListForExportForm(null, 160, this.collections.loc["TiffCompressionSchemeTooltip"], this.GetTiffCompressionSchemeItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["CutEdges", null, this.CheckBox(null, this.collections.loc["CutEdges"], this.collections.loc["CutEdgesTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["MultipleFiles", null, this.CheckBox(null, this.collections.loc["MultipleFiles"], this.collections.loc["MultipleFilesTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["ExportDataOnly", null, this.CheckBox(null, this.collections.loc["ExportDataOnly"], this.collections.loc["ExportDataOnlyTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["UseDefaultSystemEncoding", null, this.CheckBox(null, this.collections.loc["UseDefaultSystemEncoding"], this.collections.loc["UseDefaultSystemEncodingTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["EncodingDifFile", this.collections.loc["EncodingDifFile"], this.DropDownListForExportForm(null, 160, this.collections.loc["EncodingDifFileTooltip"], this.GetEncodingDifFileItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["ExportModeRtf", this.collections.loc["ExportModeRtf"], this.DropDownListForExportForm(null, 160, this.collections.loc["ExportModeRtfTooltip"], this.GetExportModeRtfItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["UsePageHeadersAndFooters", null, this.CheckBox(null, this.collections.loc["UsePageHeadersFooters"], this.collections.loc["UsePageHeadersFootersTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["RemoveEmptySpaceAtBottom", null, this.CheckBox(null, this.collections.loc["RemoveEmptySpace"], this.collections.loc["RemoveEmptySpaceTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["Separator", this.collections.loc["Separator"], this.TextBox(null, 160, this.collections.loc["SeparatorTooltip"]), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["SkipColumnHeaders", null, this.CheckBox(null, this.collections.loc["SkipColumnHeaders"], this.collections.loc["SkipColumnHeadersTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["ExportObjectFormatting", null, this.CheckBox(null, this.collections.loc["ExportObjectFormatting"], this.collections.loc["ExportObjectFormattingTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["UseOnePageHeaderAndFooter", null, this.CheckBox(null, this.collections.loc["UseOnePageHeaderFooter"], this.collections.loc["UseOnePageHeaderFooterTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["ExportEachPageToSheet", null, this.CheckBox(null, this.collections.loc["ExportEachPageToSheet"], this.collections.loc["ExportEachPageToSheetTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["ExportPageBreaks", null, this.CheckBox(null, this.collections.loc["ExportPageBreaks"], this.collections.loc["ExportPageBreaksTooltip"]), "SettingsGroup.container", "4px " + mrgn + " 4px " + mrgn],
        ["EncodingDbfFile", this.collections.loc["EncodingDbfFile"], this.DropDownListForExportForm(null, 160, this.collections.loc["EncodingDbfFileTooltip"], this.GetEncodingDbfFileItems(), true), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["DocumentSecurityButton", null, this.SmallButton(null, this.collections.loc["DocumentSecurityButton"], null, null, "Down", "stiMvcViewerFormButton"), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["DigitalSignatureButton", null, this.SmallButton(null, this.collections.loc["DigitalSignatureButton"], null, null, "Down", "stiMvcViewerFormButton"), "SettingsGroup.container", "2px " + mrgn + " 2px " + mrgn],
        ["OpenAfterExport", null, this.CheckBox(null, this.collections.loc["OpenAfterExport"], this.collections.loc["OpenAfterExportTooltip"]), null, "2px " + mrgn + " 2px " + mrgn],
        ["DocumentSecurityMenu", null, this.BaseMenu(exportForm.name + "DocumentSecurityMenu", null, "Down", "stiMvcViewerDropdownPanel"), null, null],
        ["PasswordInputUser", this.collections.loc["UserPassword"], this.TextBox(null, 160, this.collections.loc["UserPasswordTooltip"]), "DocumentSecurityMenu.innerContent", "8px " + mrgn + " 2px " + mrgn],
        ["PasswordInputOwner", this.collections.loc["OwnerPassword"], this.TextBox(null, 160, this.collections.loc["OwnerPasswordTooltip"]), "DocumentSecurityMenu.innerContent", "2px " + mrgn + " 2px " + mrgn],
        ["PrintDocument", null, this.CheckBox(null, this.collections.loc["AllowPrintDocument"], this.collections.loc["AllowPrintDocumentTooltip"]), "DocumentSecurityMenu.innerContent", "4px " + mrgn + " 4px " + mrgn],
        ["ModifyContents", null, this.CheckBox(null, this.collections.loc["AllowModifyContents"], this.collections.loc["AllowModifyContentsTooltip"]), "DocumentSecurityMenu.innerContent", "4px " + mrgn + " 4px " + mrgn],
        ["CopyTextAndGraphics", null, this.CheckBox(null, this.collections.loc["AllowCopyTextAndGraphics"], this.collections.loc["AllowCopyTextAndGraphicsTooltip"]), "DocumentSecurityMenu.innerContent", "4px " + mrgn + " 4px " + mrgn],
        ["AddOrModifyTextAnnotations", null, this.CheckBox(null, this.collections.loc["AllowAddOrModifyTextAnnotations"], this.collections.loc["AllowAddOrModifyTextAnnotationsTooltip"]), "DocumentSecurityMenu.innerContent", "4px " + mrgn + " 4px " + mrgn],
        ["KeyLength", this.collections.loc["EncryptionKeyLength"], this.DropDownListForExportForm(null, 160, this.collections.loc["EncryptionKeyLengthTooltip"], this.GetEncryptionKeyLengthItems(), true), "DocumentSecurityMenu.innerContent", "2px " + mrgn + " 8px " + mrgn],
        ["DigitalSignatureMenu", null, this.BaseMenu(exportForm.name + "DigitalSignatureMenu", null, "Down", "stiMvcViewerDropdownPanel"), null, null],
        ["UseDigitalSignature", null, this.CheckBox(null, this.collections.loc["UseDigitalSignature"], this.collections.loc["UseDigitalSignatureTooltip"]), "DigitalSignatureMenu.innerContent", "8px " + mrgn + " 4px " + mrgn],
        ["GetCertificateFromCryptoUI", null, this.CheckBox(null, this.collections.loc["GetCertificateFromCryptoUI"], this.collections.loc["GetCertificateFromCryptoUITooltip"]), "DigitalSignatureMenu.innerContent", "4px " + mrgn + " 4px " + mrgn],
        ["SubjectNameString", this.collections.loc["SubjectNameString"], this.TextBox(null, 160, this.collections.loc["SubjectNameStringTooltip"]), "DigitalSignatureMenu.innerContent", "8px " + mrgn + " 8px " + mrgn]
    ]

    // Add Controls To Form
    for (var i = 0; i < controlProps.length; i++) {
        var name = controlProps[i][0];
        var label = controlProps[i][1];
        var control = controlProps[i][2];
        var parentControlName = controlProps[i][3];
        exportForm.controls[name] = control;
        if (controlProps[i][4]) control.style.margin = controlProps[i][4];
        if (control.className == "stiMvcViewerGroupPanel") control.container.style.paddingBottom = "6px";
        if (name == "DocumentSecurityMenu" || name == "DigitalSignatureMenu") continue;

        if (parentControlName != null) {
            var controlNamesArray = parentControlName.split(".");
            var parentControl = exportForm.controls[controlNamesArray[0]];
            if (controlNamesArray.length > 1) {
                for (var k = 1; k < controlNamesArray.length; k++) {
                    if (parentControl) parentControl = parentControl[controlNamesArray[k]]
                }
            }
            if (parentControl) exportForm.addControlToParentControl(label, control, parentControl, name);
            continue;
        }
        exportForm.addControlToParentControl(label, control, exportForm.container, name);
    }

    exportForm.controls.PageRangePages.lastCell.style.paddingLeft = "60px";

    try {
        exportForm.controls.PasswordInputUser.setAttribute("type", "password");
        exportForm.controls.PasswordInputOwner.setAttribute("type", "password");
        exportForm.controls.SaveReportPassword.setAttribute("type", "password");
    } catch (e) { }

    exportForm.controls.DocumentSecurityMenu.parentButton = exportForm.controls.DocumentSecurityButton;
    exportForm.controls.DigitalSignatureMenu.parentButton = exportForm.controls.DigitalSignatureButton;
    var buttonNames = ["DocumentSecurityButton", "DigitalSignatureButton"];
    for (var i = 0; i < buttonNames.length; i++) {
        var button = exportForm.controls[buttonNames[i]];
        button.innerTable.style.width = "100%";
        button.style.minWidth = "220px";
        button.caption.style.textAlign = "center";
        button.caption.style.width = "100%";
        button.style.display = "inline-block";
    }

    // Add Action Methods To Controls
    // Types Controls
    exportForm.controls.ImageType.action = function () {
        exportForm.showControlsByExportFormat("Image" + this.key, true);
    }

    exportForm.controls.DataType.action = function () {
        exportForm.showControlsByExportFormat(this.key, true);
    }

    exportForm.controls.ExcelType.action = function () {
        var exportFormat = this.key == "ExcelBinary" ? "Excel" : this.key;
        exportForm.showControlsByExportFormat(exportFormat, true);
    }

    exportForm.controls.HtmlType.action = function () {
        exportForm.showControlsByExportFormat(this.key, true);
    }

    // Saving Report
    var controlNames = ["SaveReportMdc", "SaveReportMdz", "SaveReportMdx"];
    for (var i = 0; i < controlNames.length; i++) {
        exportForm.controls[controlNames[i]].controlName = controlNames[i];
        exportForm.controls[controlNames[i]].onChecked = function () {
            if (this.isChecked) { exportForm.controls.SaveReportPassword.setEnabled(this.controlName == "SaveReportMdx"); }
        }
    }
    // PdfACompliance
    exportForm.controls.PdfACompliance.onChecked = function () {
        var controlNames = ["StandardPdfFonts", "EmbeddedFonts", "UseUnicode"];
        for (var i = 0; i < controlNames.length; i++) { exportForm.controls[controlNames[i]].setEnabled(!this.isChecked); }
    }
    // EmbeddedFonts, UseUnicode
    var controlNames = ["EmbeddedFonts", "UseUnicode"];
    for (var i = 0; i < controlNames.length; i++) {
        exportForm.controls[controlNames[i]].onChecked = function () { if (this.isChecked) exportForm.controls.StandardPdfFonts.setChecked(false); };
    }
    // StandardPdfFonts
    exportForm.controls.StandardPdfFonts.onChecked = function () {
        if (!this.isChecked) return;
        var controlNames = ["EmbeddedFonts", "UseUnicode"];
        for (var i = 0; i < controlNames.length; i++) { exportForm.controls[controlNames[i]].setChecked(false); }
    }
    // ImageCompressionMethod
    exportForm.controls.ImageCompressionMethod.onChange = function () {
        exportForm.controls.ImageQuality.setEnabled(this.key == "Jpeg");
    }
    // ExportDataOnly
    exportForm.controls.ExportDataOnly.onChecked = function () {
        exportForm.controls.ExportObjectFormatting.setEnabled(this.isChecked);
        exportForm.controls.UseOnePageHeaderAndFooter.setEnabled(!this.isChecked);
    }
    // UseDefaultSystemEncoding
    exportForm.controls.UseDefaultSystemEncoding.onChecked = function () {
        exportForm.controls.EncodingDifFile.setEnabled(!this.isChecked);
    }
    // ImageType
    exportForm.controls.ImageType.onChange = function () {
        exportForm.controls.TiffCompressionScheme.setEnabled(this.key == "Tiff");
        var items = exportForm.jsObject.GetImageFormatItems(this.key == "Emf");
        exportForm.controls.ImageFormat.menu.addItems(items);
    }
    // ImageFormat
    exportForm.controls.ImageFormat.onChange = function () {
        exportForm.controls.DitheringType.setEnabled(this.key == "Monochrome");
    }
    // DocumentSecurityButton
    exportForm.controls.DocumentSecurityButton.action = function () {
        exportForm.jsObject.controls.menus[exportForm.name + "DocumentSecurityMenu"].changeVisibleState(!this.isSelected);
    }
    // DigitalSignatureButton
    exportForm.controls.DigitalSignatureButton.action = function () {
        exportForm.jsObject.controls.menus[exportForm.name + "DigitalSignatureMenu"].changeVisibleState(!this.isSelected);
    }
    // UseDigitalSignature
    exportForm.controls.UseDigitalSignature.onChecked = function () {
        exportForm.controls.GetCertificateFromCryptoUI.setEnabled(this.isChecked);
        exportForm.controls.SubjectNameString.setEnabled(this.isChecked && !exportForm.controls.GetCertificateFromCryptoUI.isChecked);
    }
    // GetCertificateFromCryptoUI
    exportForm.controls.GetCertificateFromCryptoUI.onChecked = function () {
        exportForm.controls.SubjectNameString.setEnabled(!this.isChecked && exportForm.controls.UseDigitalSignature.isChecked);
    }

    // Form Methods
    exportForm.setControlsValue = function (ignoreTypeControls) {
        var defaultExportSettings = exportForm.jsObject.getDefaultExportSettings(exportForm.exportFormat);
        if (!defaultExportSettings) return;
        var exportControlNames = exportForm.getExportControlNames();

        // Reset Enabled States for All Controls
        for (var i in exportForm.controls) {
            if (exportForm.controls[i]["setEnabled"] != null) exportForm.controls[i].setEnabled(true);
        }

        // PageRange
        var pageRangeAllIsDisabled = exportForm.jsObject.isContainted(exportControlNames, "ImageType") && exportForm.exportFormat != "ImageTiff";
        exportForm.controls[!pageRangeAllIsDisabled ? "PageRangeAll" : "PageRangeCurrentPage"].setChecked(true);
        exportForm.controls.PageRangeAll.setEnabled(!pageRangeAllIsDisabled);

        for (var propertyName in defaultExportSettings) {
            if (exportForm.jsObject.isContainted(exportControlNames, propertyName)) {
                if (propertyName == "ImageType" || propertyName == "DataType" || propertyName == "ExcelType" || propertyName == "HtmlType") {
                    if (ignoreTypeControls) continue;

                    switch (propertyName) {
                        case "ImageType":
                            if (!exportForm.jsObject.options.exports.showExportToImageBmp && defaultExportSettings[propertyName] == "Bmp") defaultExportSettings[propertyName] = "Gif";
                            if (!exportForm.jsObject.options.exports.showExportToImageGif && defaultExportSettings[propertyName] == "Gif") defaultExportSettings[propertyName] = "Jpeg";
                            if (!exportForm.jsObject.options.exports.showExportToImageJpeg && defaultExportSettings[propertyName] == "Jpeg") defaultExportSettings[propertyName] = "Pcx";
                            if (!exportForm.jsObject.options.exports.showExportToImagePcx && defaultExportSettings[propertyName] == "Pcx") defaultExportSettings[propertyName] = "Png";
                            if (!exportForm.jsObject.options.exports.showExportToImagePng && defaultExportSettings[propertyName] == "Png") defaultExportSettings[propertyName] = "Tiff";
                            if (!exportForm.jsObject.options.exports.showExportToImageTiff && defaultExportSettings[propertyName] == "Tiff") defaultExportSettings[propertyName] = "Emf";
                            if (!exportForm.jsObject.options.exports.showExportToImageMetafile && defaultExportSettings[propertyName] == "Emf") defaultExportSettings[propertyName] = "Svg";
                            if (!exportForm.jsObject.options.exports.showExportToImageSvg && defaultExportSettings[propertyName] == "Svg") defaultExportSettings[propertyName] = "Svgz";
                            if (!exportForm.jsObject.options.exports.showExportToImageSvgz && defaultExportSettings[propertyName] == "Svgz") defaultExportSettings[propertyName] = "Bmp";
                            break;

                        case "DataType":
                            if (!exportForm.jsObject.options.exports.showExportToCsv && defaultExportSettings[propertyName] == "Csv") defaultExportSettings[propertyName] = "Dbf";
                            if (!exportForm.jsObject.options.exports.showExportToDbf && defaultExportSettings[propertyName] == "Dbf") defaultExportSettings[propertyName] = "Xml";
                            if (!exportForm.jsObject.options.exports.showExportToXml && defaultExportSettings[propertyName] == "Xml") defaultExportSettings[propertyName] = "Dif";
                            if (!exportForm.jsObject.options.exports.showExportToDif && defaultExportSettings[propertyName] == "Dif") defaultExportSettings[propertyName] = "Sylk";
                            if (!exportForm.jsObject.options.exports.showExportToSylk && defaultExportSettings[propertyName] == "Sylk") defaultExportSettings[propertyName] = "Csv";
                            break;

                        case "ExcelType":
                            if (!exportForm.jsObject.options.exports.showExportToExcel2007 && defaultExportSettings[propertyName] == "Excel2007") defaultExportSettings[propertyName] = "ExcelBinary";
                            if (!exportForm.jsObject.options.exports.showExportToExcel2007 && defaultExportSettings[propertyName] == "Excel2007") defaultExportSettings[propertyName] = "ExcelBinary";
                            if (!exportForm.jsObject.options.exports.showExportToExcel && defaultExportSettings[propertyName] == "ExcelBinary") defaultExportSettings[propertyName] = "ExcelXml";
                            if (!exportForm.jsObject.options.exports.showExportToExcelXml && defaultExportSettings[propertyName] == "ExcelXml") defaultExportSettings[propertyName] = "Excel2007";
                            break;

                        case "HtmlType":
                            if (!exportForm.jsObject.options.exports.showExportToHtml && defaultExportSettings[propertyName] == "Html") defaultExportSettings[propertyName] = "Html5";
                            if (!exportForm.jsObject.options.exports.showExportToHtml5 && defaultExportSettings[propertyName] == "Html5") defaultExportSettings[propertyName] = "Mht";
                            if (!exportForm.jsObject.options.exports.showExportToMht && defaultExportSettings[propertyName] == "Mht") defaultExportSettings[propertyName] = "Html";
                            break;
                    }
                }

                var control = exportForm.controls[propertyName];
                exportForm.setDefaultValueToControl(control, defaultExportSettings[propertyName]);
            }
        }

        // Exceptions
        if (exportForm.exportFormat == "Document") exportForm.controls.SaveReportMdc.setChecked(true);
        if (exportForm.exportFormat == "Pdf" && defaultExportSettings.StandardPdfFonts) exportForm.controls.StandardPdfFonts.setChecked(true);
        if (exportForm.jsObject.isContainted(exportControlNames, "HtmlType") && defaultExportSettings.ImageFormat) exportForm.controls.ImageFormatForHtml.setKey(defaultExportSettings.ImageFormat);
        if (exportForm.exportFormat == "Rtf" && defaultExportSettings.ExportMode) exportForm.controls.ExportModeRtf.setKey(defaultExportSettings.ExportMode);
        if (exportForm.jsObject.isContainted(exportControlNames, "ImageType") && defaultExportSettings.ImageZoom) exportForm.controls.Zoom.setKey(defaultExportSettings.ImageZoom.toString());
        if (exportForm.exportFormat == "Pdf") {
            var userAccessPrivileges = defaultExportSettings.UserAccessPrivileges;
            exportForm.controls.PrintDocument.setChecked(userAccessPrivileges.indexOf("PrintDocument") != -1 || userAccessPrivileges == "All");
            exportForm.controls.ModifyContents.setChecked(userAccessPrivileges.indexOf("ModifyContents") != -1 || userAccessPrivileges == "All");
            exportForm.controls.CopyTextAndGraphics.setChecked(userAccessPrivileges.indexOf("CopyTextAndGraphics") != -1 || userAccessPrivileges == "All");
            exportForm.controls.AddOrModifyTextAnnotations.setChecked(userAccessPrivileges.indexOf("AddOrModifyTextAnnotations") != -1 || userAccessPrivileges == "All");
        }
        // Encodings
        if (exportForm.exportFormat == "Difs" || exportForm.exportFormat == "Sylk") exportForm.controls.EncodingDifFile.setKey("437");
        if (exportForm.exportFormat == "Dbf" && defaultExportSettings.CodePage) exportForm.controls.EncodingDbfFile.setKey(defaultExportSettings.CodePage);
        if ((exportForm.exportFormat == "Text" || exportForm.exportFormat == "Csv") && defaultExportSettings.Encoding)
            exportForm.controls.EncodingTextOrCsvFile.setKey(defaultExportSettings.Encoding);
    }

    exportForm.show = function (exportFormat, actionType) {
        exportForm.actionType = actionType;
        exportForm.showControlsByExportFormat(exportFormat || "Pdf");
        exportForm.changeVisibleState(true);
    }

    exportForm.action = function () {
        var exportSettingsObject = exportForm.getExportSettingsObject();
        exportForm.changeVisibleState(false);

        if (exportForm.actionType == exportForm.jsObject.options.actions.exportReport) {
            exportForm.jsObject.postExport(exportForm.exportFormat, exportSettingsObject, exportForm.actionType);
        }
        else if (exportForm.jsObject.options.email.showEmailDialog) {
            exportForm.jsObject.controls.forms.sendEmailForm.show(exportForm.exportFormat, exportSettingsObject);
        }
        else {
            exportSettingsObject["Email"] = exportForm.jsObject.options.email.defaultEmailAddress;
            exportSettingsObject["Message"] = exportForm.jsObject.options.email.defaultEmailMessage;
            exportSettingsObject["Subject"] = exportForm.jsObject.options.email.defaultEmailSubject;
            exportForm.jsObject.postExport(exportForm.exportFormat, exportSettingsObject, exportForm.jsObject.options.actions.emailReport);
        }
    }

    exportForm.showControlsByExportFormat = function (exportFormat, ignoreTypeControls) {
        exportForm.exportFormat = exportFormat;
        for (var controlName in exportForm.controls) {
            var control = exportForm.controls[controlName];
            var exportControlNames = exportForm.getExportControlNames();
            if (control.parentRow) {
                control.parentRow.style.display =
                    (this.actionType == this.jsObject.options.actions.exportReport || controlName != "OpenAfterExport") && exportForm.jsObject.isContainted(exportControlNames, controlName)
                        ? ""
                        : "none";
            }
        }
        exportForm.setControlsValue(ignoreTypeControls);
    }


    exportForm.setDefaultValueToControl = function (control, value) {
        if (control["setKey"] != null) control.setKey(value.toString());
        else if (control["setChecked"] != null) control.setChecked(value);
        else if (control["value"] != null) control.value = value;
    }

    exportForm.getValueFromControl = function (control) {
        if (control["isEnabled"] == false) return control["setChecked"] != null ? false : null;
        else if (control["setKey"] != null) return control.key;
        else if (control["setChecked"] != null) return control.isChecked;
        else if (control["value"] != null) return control.value;

        return null;
    }

    exportForm.getExportControlNames = function () {
        var controlNames = {
            Document: ["SavingReportGroup", "SaveReportMdc", "SaveReportMdz", "SaveReportMdx", "SaveReportPassword"],
            Pdf: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "ImageResolution", "ImageCompressionMethod",
                "ImageQuality", "StandardPdfFonts", "EmbeddedFonts", "UseUnicode", "Compressed", "ExportRtfTextAsImage", "DocumentSecurityButton", "DigitalSignatureButton",
                "OpenAfterExport", "AllowEditable", "PasswordInputUser", "PasswordInputOwner", "PrintDocument", "ModifyContents", "CopyTextAndGraphics",
                "AddOrModifyTextAnnotations", "KeyLength", "UseDigitalSignature", "GetCertificateFromCryptoUI", "SubjectNameString"],
            Xps: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "ImageResolution", "ImageQuality", "OpenAfterExport",
                "ExportRtfTextAsImage"],
            Ppt2007: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "ImageResolution", "ImageQuality"],
            Html: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "HtmlType", "Zoom", "ImageFormatForHtml",
                "ExportMode", "UseEmbeddedImages", "AddPageBreaks", "OpenAfterExport"],
            Html5: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "HtmlType", "ImageFormatForHtml", "ImageResolution",
                "ImageQuality", "ContinuousPages", "OpenAfterExport"],
            Mht: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "HtmlType", "Zoom", "ImageFormatForHtml",
                "ExportMode", "AddPageBreaks"],
            Text: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "KillSpaceLines",
                "PutFeedPageCode", "DrawBorder", "CutLongLines", "BorderType", "ZoomX", "ZoomY", "EncodingTextOrCsvFile"],
            Rtf: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "ImageResolution",
                "ImageQuality", "ExportModeRtf", "UsePageHeadersAndFooters", "RemoveEmptySpaceAtBottom"],
            Word2007: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "ImageResolution",
                "ImageQuality", "UsePageHeadersAndFooters", "RemoveEmptySpaceAtBottom"],
            Odt: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "ImageResolution",
                "ImageQuality", "RemoveEmptySpaceAtBottom"],
            Excel: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "ExcelType", "ImageResolution",
                "ImageQuality", "ExportDataOnly", "ExportObjectFormatting", "UseOnePageHeaderAndFooter", "ExportEachPageToSheet", "ExportPageBreaks"],
            ExcelXml: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "ExcelType"],
            Excel2007: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "ExcelType", "ImageResolution",
                "ImageQuality", "ExportDataOnly", "ExportObjectFormatting", "UseOnePageHeaderAndFooter", "ExportEachPageToSheet", "ExportPageBreaks"],
            Ods: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "ImageResolution",
                "ImageQuality"],
            Csv: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "DataType", "EncodingTextOrCsvFile",
                "Separator", "SkipColumnHeaders"],
            Dbf: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "DataType", "EncodingDbfFile"],
            Dif: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "DataType", "ExportDataOnly",
                "UseDefaultSystemEncoding", "EncodingDifFile"],
            Sylk: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "DataType", "ExportDataOnly",
                "UseDefaultSystemEncoding", "EncodingDifFile"],
            Xml: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "DataType"],
            ImageBmp: ["PageRangeGroup", "PageRangeAll", "PageRangeCurrentPage", "PageRangePages", "PageRangePagesText", "SettingsGroup", "ImageType", "Zoom", "ImageResolution",
                "ImageFormat", "CutEdges"]
        }

        controlNames.ImageGif = controlNames.ImageJpeg = controlNames.ImagePcx = controlNames.ImageJpeg = controlNames.ImagePng = controlNames.ImageTiff =
        controlNames.ImageEmf = controlNames.ImageSvg = controlNames.ImageSvgz = controlNames.ImageBmp;

        return controlNames[exportForm.exportFormat];
    }

    exportForm.getExportSettingsObject = function () {
        var exportSettings = {};
        var exportControlNames = exportForm.getExportControlNames();

        for (var i in exportControlNames) {
            var controls = exportForm.controls;
            var controlName = exportControlNames[i];
            var control = controls[controlName];
            if (control.groupName == exportForm.name + "SavingReportGroup" || control.groupName == exportForm.name + "PageRangeGroup" ||
                controlName == "PageRangePagesText") {
                continue;
            }
            else if (controlName == "SavingReportGroup") {
                exportSettings.Format = controls.SaveReportMdc.isChecked ? "Mdc" : (controls.SaveReportMdz.isChecked ? "Mdz" : "Mdx");
                if (exportSettings.Format == "Mdx") exportSettings.Password = controls.SaveReportPassword.value;
            }
            else if (controlName == "PageRangeGroup") {
                exportSettings.PageRange = controls.PageRangeAll.isChecked ? "All" :
                    (controls.PageRangeCurrentPage.isChecked ? (exportForm.jsObject.options.pageNumber + 1).toString() : controls.PageRangePagesText.value);
            }
            else {
                var value = exportForm.getValueFromControl(control);
                if (value != null) exportSettings[controlName] = value;
            }
        }

        // Exceptions
        if (exportForm.exportFormat == "Pdf") {
            exportSettings.UserAccessPrivileges = "";
            var controlNames = ["PrintDocument", "ModifyContents", "CopyTextAndGraphics", "AddOrModifyTextAnnotations"];
            for (var i in controlNames) {
                if (exportSettings[controlNames[i]]) {
                    if (exportSettings.UserAccessPrivileges != "") exportSettings.UserAccessPrivileges += ", ";
                    exportSettings.UserAccessPrivileges += controlNames[i];
                    delete exportSettings[controlNames[i]];
                }
            }
        }

        if (exportForm.jsObject.isContainted(exportControlNames, "ImageType")) {
            exportSettings.ImageZoom = exportSettings.Zoom;
            delete exportSettings.Zoom;
        }
        var controlNames = [
                ["ImageFormatForHtml", "ImageFormat"],
                ["EncodingTextOrCsvFile", "Encoding"],
                ["ExportModeRtf", "ExportMode"],
                ["EncodingDifFile", "Encoding"],
                ["EncodingDbfFile", "CodePage"]
            ]
        for (var i in controlNames) {
            if (exportSettings[controlNames[i][0]] != null) {
                exportSettings[controlNames[i][1]] = exportSettings[controlNames[i][0]];
                delete exportSettings[controlNames[i][0]];
            }
        }

        return exportSettings;
    }
}

StiMvcViewer.prototype.DropDownListForExportForm = function (name, width, toolTip, items, readOnly, showImage) {
    var dropDownList = this.DropDownList(name, width, toolTip, items, readOnly, showImage);

    dropDownList.onChange = function () { };

    dropDownList.setKey = function (key) {
        dropDownList.key = key;
        dropDownList.onChange();
        for (var itemName in dropDownList.items)
            if (key == dropDownList.items[itemName].key) {
                this.textBox.value = dropDownList.items[itemName].caption;
                if (dropDownList.image) dropDownList.image.style.background = "url(" + dropDownList.jsObject.collections.images[dropDownList.items[itemName].imageName] + ")";
                return;
            }
        dropDownList.textBox.value = key.toString();
    }
    if (dropDownList.menu) {
        dropDownList.menu.action = function (menuItem) {
            this.changeVisibleState(false);
            this.dropDownList.key = menuItem.key;
            this.dropDownList.textBox.value = menuItem.caption.innerHTML;
            if (this.dropDownList.image) this.dropDownList.image.style.background = "url(" + this.jsObject.collections.images[menuItem.imageName] + ")";
            this.dropDownList.onChange();
            this.dropDownList.action();
        }
    }

    return dropDownList;
}

StiMvcViewer.prototype.TextBox = function (name, width, toolTip) {
    var textBox = document.createElement("input");
    textBox.style.fontFamily = this.options.toolbar.fontFamily;
    if (this.options.toolbar.fontColor != "") textBox.style.color = this.options.toolbar.fontColor;
    if (width) textBox.style.width = width + "px";
    textBox.jsObject = this;
    textBox.name = name;
    textBox.isEnabled = true;
    textBox.isSelected = false;
    textBox.isFocused = false;
    textBox.isOver = false;
    if (toolTip) {
        try { textBox.setAttribute("title", toolTip); } catch (e) { }
    }
    textBox.style.height = this.options.isTouchDevice ? "26px" : "21px";
    textBox.style.lineHeight = textBox.style.height;
    var styleName = "stiMvcViewerTextBox";
    textBox.className = styleName + " " + styleName + "Default";
    if (name) {
        if (!this.controls.textBoxes) this.controls.textBoxes = {};
        this.controls.textBoxes[name] = textBox;
    }

    textBox.setEnabled = function (state) {
        this.isEnabled = state;
        this.disabled = !state;
        this.className = styleName + " " + styleName + (state ? "Default" : "Disabled");
    }

    textBox.onmouseover = function () {
        if (this.jsObject.options.isTouchDevice || !this.isEnabled || this.readOnly) return;
        this.isOver = true;
        if (!this.isSelected && !this.isFocused) this.className = styleName + " " + styleName + "Over";
    }

    textBox.onmouseout = function () {
        if (this.jsObject.options.isTouchDevice || !this.isEnabled || this.readOnly) return;
        this.isOver = false;
        if (!this.isSelected && !this.isFocused) this.className = styleName + " " + styleName + "Default";
    }

    textBox.setSelected = function (state) {
        this.isSelected = state;
        this.className = styleName + " " + styleName + (state ? "Over" : (this.isEnabled ? (this.isOver ? "Over" : "Default") : "Disabled"));
    }

    textBox.setReadOnly = function (state) {
        this.style.cursor = state ? "default" : "";
        this.readOnly = state;
        try {
            this.setAttribute("unselectable", state ? "on" : "off");
            this.setAttribute("onselectstart", state ? "return false" : "");
        }
        catch (e) { };
    }

    textBox.onfocus = function () { this.isFocused = true; this.setSelected(true); }
    textBox.onblur = function () { this.isFocused = false; this.setSelected(false); this.action(); }
    textBox.onkeypress = function (event) {
        if (this.readOnly) return false;
        if (event && event.keyCode == 13) {
            this.action();
            return false;
        }
    }

    textBox.action = function () { };

    return textBox;
}

StiMvcViewer.prototype.FormButton = function (name, caption, imageName, minWidth) {
    var button = this.SmallButton(name, caption || "", imageName, null, null, "stiMvcViewerFormButton");
    button.innerTable.style.width = "100%";
    button.style.minWidth = (minWidth || 80) + "px";
    button.caption.style.textAlign = "center";
    
    return button;
}

StiMvcViewer.prototype.InitializeAboutPanel = function () {
    var aboutPanel = document.createElement("div");
    this.controls.aboutPanel = aboutPanel;
    this.controls.mainPanel.appendChild(aboutPanel);
    aboutPanel.jsObject = this;
    aboutPanel.className = "stiMvcViewerAboutPanel";
    aboutPanel.style.background = "white url(" + this.collections.images["AboutInfo.png"] + ")";
    aboutPanel.style.display = "none";

    var version = document.createElement("div");
    version.innerHTML = /* this.collections.loc["Version"] + ": " + */ this.options.productVersion;
    aboutPanel.appendChild(version);
    version.style.fontFamily = "Arial";
    version.style.fontSize = "10pt";
    version.style.color = "#000000";
    version.style.padding = "60px 20px 5px 25px";

    var copyRight = document.createElement("div");
    copyRight.innerHTML = "Copyright 2003-" + new Date().getFullYear() + " by Stimulsoft, All rights reserved.";
    aboutPanel.appendChild(copyRight);
    copyRight.style.fontFamily = "Arial";
    copyRight.style.fontSize = "10pt";
    copyRight.style.color = "#000000";
    copyRight.style.padding = "105px 20px 0px 25px";

    aboutPanel.ontouchstart = function () { this.changeVisibleState(false); }
    aboutPanel.onmousedown = function () { this.changeVisibleState(false); }

    aboutPanel.changeVisibleState = function (state) {
        this.style.display = state ? "" : "none";
        this.jsObject.setObjectToCenter(this);
        this.jsObject.controls.disabledPanels[2].changeVisibleState(state);
    }
}

StiMvcViewer.prototype.SetEditableMode = function (state) {
    this.options.editableMode = state;
    if (this.controls.buttons.Editor) this.controls.buttons.Editor.setSelected(state);

    if (state)
        this.ShowAllEditableFields();
    else
        this.HideAllEditableFields();
}

StiMvcViewer.prototype.ShowAllEditableFields = function () {
    this.options.editableFields = [];
    var pages = this.controls.reportPanel.pages;

    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        var pageElements = page.getElementsByTagName('*');

        for (k = 0; k < pageElements.length; k++) {
            var editableStrAttr = pageElements[k].getAttribute("editable");
            if (editableStrAttr) {
                var attrArray = editableStrAttr.split(";");
                var params = {};
                params.compIndex = attrArray[0];
                params.pageIndex = i.toString();
                params.type = attrArray[1];

                if (params.type == "CheckBox") {
                    this.ShowCheckBoxEditableField(pageElements[k], params, attrArray);
                }
                else if (params.type == "Text") {
                    this.ShowTextEditableField(pageElements[k], params);
                }
                else if (params.type == "RichText") {
                    this.ShowRichTextEditableField(pageElements[k], params);
                }
            }
        }
    }
}

StiMvcViewer.prototype.HideAllEditableFields = function () {
    var editableFields = this.options.editableFields;
    if (this.options.currentEditableTextArea) this.options.currentEditableTextArea.onblur();

    for (var i = 0; i < editableFields.length; i++) {
        editableFields[i].className = editableFields[i].className.replace(" stiEditableField stiEditableFieldSelected", "");
        editableFields[i].onclick = null;
        editableFields[i].style.outline = "";
    }
}

StiMvcViewer.prototype.ShowCheckBoxEditableField = function (editableCell, params, attrArray) {
    if (!editableCell.sizes) {
        var imgElements = editableCell.getElementsByTagName('IMG');
        if (imgElements.length == 0) imgElements = editableCell.getElementsByTagName('SVG');
        var imgElement = (imgElements.length > 0) ? imgElements[0] : null;
        if (!imgElement) return;
        editableCell.sizes = {
            inPixels: imgElement.offsetWidth > imgElement.offsetHeight ? imgElement.offsetHeight : imgElement.offsetWidth,
            widthStyle: imgElement.style.width,
            heightStyle: imgElement.style.height
        }
    }

    if (this.getNavigatorName() != "Google Chrome") editableCell.style.outline = "1px solid gray";
    editableCell.style.textAlign = "center";
    editableCell.className += " stiEditableField stiEditableFieldSelected";

    var trueSvgImage = this.GetSvgCheckBox(attrArray[3], attrArray[5], this.StrToInt(attrArray[6]), attrArray[7], editableCell.sizes.inPixels);
    var falseSvgImage = this.GetSvgCheckBox(attrArray[4], attrArray[5], this.StrToInt(attrArray[6]), attrArray[7], editableCell.sizes.inPixels);
    params.falseImage = "<div style='width:" + editableCell.sizes.widthStyle + ";height:" + editableCell.sizes.heightStyle + ";'>" + trueSvgImage + "</div>";
    params.trueImage = "<div style='width:" + editableCell.sizes.widthStyle + ";height:" + editableCell.sizes.heightStyle + ";'>" + falseSvgImage + "</div>";
    params.checked = attrArray[2] == "true" || attrArray[2] == "True";
    editableCell.params = params;
    editableCell.jsObject = this;

    if (!editableCell.hasChanged) {
        editableCell.checked = params.checked;
        editableCell.innerHTML = params.checked ? params.trueImage : params.falseImage;
    }

    editableCell.onclick = function () {
        this.checked = !this.checked;
        this.innerHTML = this.checked ? params.trueImage : params.falseImage;
        this.hasChanged = true;
        this.jsObject.AddEditableParameters(this);
    }
    this.options.editableFields.push(editableCell);
}

StiMvcViewer.prototype.ShowTextEditableField = function (editableCell, params) {

    editableCell.className += " stiEditableField stiEditableFieldSelected";
    if (this.getNavigatorName() != "Google Chrome") editableCell.style.outline = "1px solid gray";
    editableCell.params = params;
    editableCell.jsObject = this;

    editableCell.onclick = function () {
        if (this.editMode) return;
        if (this.jsObject.options.currentEditableTextArea) this.jsObject.options.currentEditableTextArea.onblur();
        this.editMode = true;

        var textArea = document.createElement("textarea");
        textArea.jsObject = this.jsObject;
        textArea.style.width = (this.offsetWidth - 5) + "px";
        textArea.style.height = (this.offsetHeight - 5) + "px";
        textArea.style.maxWidth = (this.offsetWidth - 5) + "px";
        textArea.style.maxHeight = (this.offsetHeight - 5) + "px";
        textArea.className = this.className.replace(" stiEditableField stiEditableFieldSelected", "") + " stiEditableTextArea";
        textArea.style.border = "0px";

        textArea.value = this.innerHTML;
        this.appendChild(textArea);
        textArea.focus();
        this.jsObject.options.currentEditableTextArea = textArea;

        textArea.onblur = function () {
            editableCell.editMode = false;
            editableCell.innerHTML = this.value;
            this.jsObject.options.currentEditableTextArea = null;
            this.jsObject.AddEditableParameters(editableCell);
        }
    }
    this.options.editableFields.push(editableCell);
}

StiMvcViewer.prototype.ShowRichTextEditableField = function (editableCell, params) {
    // TO DO
}

StiMvcViewer.prototype.AddEditableParameters = function (editableCell) {
    if (!this.options.editableParameters) this.options.editableParameters = {};
    var params = {};
    params.type = editableCell.params.type;
    if (params.type == "CheckBox") params.checked = editableCell.checked;
    if (params.type == "Text") params.text = editableCell.innerHTML;

    if (!this.options.editableParameters[editableCell.params.pageIndex]) this.options.editableParameters[editableCell.params.pageIndex] = {};
    this.options.editableParameters[editableCell.params.pageIndex][editableCell.params.compIndex] = params;
}

StiMvcViewer.prototype.GetSvgCheckBox = function (style, contourColor, size, backColor, width) {
    var head = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0\" y=\"0\" width=\"" + width + "px\" height=\"" + width + "px\">";
    var path = "<path stroke=\"" + contourColor + "\" stroke-width=\"" + size + "\" fill=\"" + backColor +
        "\" stroke-linecap=\"round\" stroke-linejoin=\"round\" transform=\"scale(" + (1 / (200 / width)) + ")\" d=\"";

    var shape = "";
    switch (style) {
        case "Cross":
            shape = "m 62.567796,147.97593 c -0.55,-0.14223 -2.162828,-0.5128 -3.584062,-0.82348 -3.647667,-0.79738 -9.670499,-5.83775 -14.242817,-11.91949 l " +
                        "-3.902341,-5.19058 5.080199,-1.13481 c 7.353071,-1.64253 13.640456,-5.71752 21.826811,-14.14646 l 7.208128,-7.42171 " +
                        "-6.410736,-7.513354 c -11.773129,-13.79803 -14.346726,-23.01954 -8.627769,-30.91434 2.894109,-3.9952 11.818482,-12.369333 " +
                        "13.182086,-12.369333 0.411356,0 1.063049,1.6875 1.448207,3.750003 0.980474,5.25038 6.456187,16.76587 10.936694,23 2.075266,2.8875 " +
                        "3.991125,5.25 4.257464,5.25 0.266339,0 3.775242,-3.4875 7.797566,-7.75 16.397034,-17.37615 29.674184,-19.76481 38.280564,-6.88699 " +
                        "4.15523,6.21753 4.18631,8.07093 0.14012,8.3552 -5.84833,0.41088 -17.16241,8.5342 -25.51465,18.319104 l -4.63153,5.42599 " +
                        "4.87803,4.31529 c 6.55108,5.79533 18.8991,11.89272 25.84076,12.76002 3.0455,0.38051 5.53727,1.10582 5.53727,1.6118 0,2.7809 " +
                        "-9.26611,14.41872 -13.03,16.36511 -7.96116,4.11687 -16.36991,0.71207 -32.764584,-13.26677 l -4.985957,-4.25125 -7.086791,8.97188 c " +
                        "-3.897736,4.93454 -8.82141,10.1198 -10.9415,11.52281 -3.906121,2.58495 -8.86588,4.41339 -10.691162,3.94136 z";
            break;

        case "Check":
            shape = "M 60.972125,162.49704 C 51.172676,136.72254 43.561975,123.37669 35.370344,117.6027 l -4.45827,-3.14248 2.75159,-2.89559 c 3.875121,-4.07793 " +
                        "10.034743,-7.49924 14.902472,-8.27747 3.859874,-0.61709 4.458306,-0.38024 8.535897,3.37835 2.660692,2.45254 6.265525,7.60856 9.167226,13.11196 " +
                        "2.630218,4.98849 4.910542,9.06999 5.067388,9.06999 0.156846,0 2.31372,-3.0375 4.793052,-6.75 C 96.259164,91.956015 129.68299,58.786374 157.56485,41.281603 l " +
                        "8.84913,-5.555656 2.2633,2.631238 2.26329,2.631237 -7.76266,6.294183 C 139.859,66.19023 108.01682,105.51363 89.042715,138.83563 c -6.680477,11.73214 " +
                        "-7.172359,12.31296 -15.090788,17.81963 -4.501873,3.13071 -9.044031,6.30443 -10.093684,7.05271 -1.708923,1.21826 -2.010678,1.09165 -2.886118,-1.21093 z";
            break;

        case "CrossRectangle":
            shape = "m 24.152542,102.04237 0,-72.499996 74.5,0 74.499998,0 0,72.499996 0,72.5 -74.499998,0 -74.5,0 0,-72.5 z m 133.758188,0.25 -0.25819,-57.249996 " +
                        "-58.999998,0 -59,0 -0.259695,55.999996 c -0.142833,30.8 -0.04446,56.5625 0.218615,57.25 0.375181,0.98048 13.207991,1.25 59.517885,1.25 l " +
                        "59.039573,0 -0.25819,-57.25 z m -90.574091,43.18692 c -1.823747,-0.3912 -4.926397,-1.85716 -6.894778,-3.25768 -3.319254,-2.36169 -12.289319,-12.40741 " +
                        "-12.289319,-13.76302 0,-0.32888 2.417494,-1.13897 5.372209,-1.80021 7.185193,-1.60797 13.747505,-5.93496 21.803114,-14.3763 l 6.675323,-6.99496 " +
                        "-6.379078,-7.31436 C 64.931387,85.71231 61.643682,76.29465 65.471903,68.89169 67.054097,65.83207 78.56175,54.542374 80.098251,54.542374 c 0.45744,0 " +
                        "1.146839,1.6875 1.531997,3.75 0.980474,5.250386 6.456187,16.765876 10.936694,22.999996 2.075266,2.8875 3.991125,5.25 4.257464,5.25 0.266339,0 " +
                        "3.775244,-3.4875 7.797564,-7.75 16.39704,-17.376139 29.67419,-19.764806 38.28057,-6.88698 4.15523,6.21752 4.18631,8.07092 0.14012,8.35519 -5.82996,0.40959 " +
                        "-18.23707,9.34942 -25.91566,18.67328 -3.90068,4.73647 -3.97203,4.95414 -2.2514,6.86861 3.19054,3.54997 13.7039,10.54321 18.97191,12.61967 2.83427,1.11716 " +
                        "7.43737,2.33421 10.22912,2.70455 2.79175,0.37034 5.07591,0.9956 5.07591,1.38947 0,2.11419 -8.37504,13.20895 -11.6517,15.4355 -8.39423,5.70403 " +
                        "-16.63203,2.77 -34.14289,-12.16054 l -4.985955,-4.25125 -7.086791,8.97188 c -9.722344,12.3085 -16.524852,16.55998 -23.948565,14.96754 z";
            break;

        case "CheckRectangle":
            shape = "m 19.915254,103.5 0,-72.5 71.942245,0 71.942241,0 6.55727,-4.11139 6.55726,-4.11139 1.96722,2.36139 c 1.08197,1.298765 1.98219,2.644166 2.00049,2.98978 " +
                        "0.0183,0.345615 -2.44173,2.53784 -5.46673,4.87161 l -5.5,4.243219 0,69.378391 0,69.37839 -74.999991,0 -75.000005,0 0,-72.5 z m 133.999996,3.87756 c " +
                        "0,-49.33933 -0.12953,-53.514947 -1.62169,-52.276568 -2.78014,2.307312 -15.68408,17.90053 -24.32871,29.399008 -10.4919,13.955575 -23.47926,33.53736 " +
                        "-29.514025,44.5 -4.457326,8.09707 -5.134776,8.80812 -14.291256,15 -5.28667,3.575 -9.903486,6.62471 -10.259592,6.77712 -0.356107,0.15242 -1.912439,-2.99758 " +
                        "-3.458515,-7 -1.546077,-4.00241 -5.258394,-12.41205 -8.249593,-18.68809 -4.285436,-8.99155 -6.676569,-12.64898 -11.27758,-17.25 C 47.70282,104.62757 " +
                        "44.364254,102 43.495254,102 c -2.798369,0 -1.704872,-1.66044 3.983717,-6.049158 5.593548,-4.31539 13.183139,-7.091307 16.801313,-6.145133 3.559412,0.930807 " +
                        "9.408491,8.154973 13.919775,17.192241 l 4.46286,8.94025 4.54378,-6.83321 C 95.518219,96.605618 108.21371,81.688517 125.80695,63.75 L 143.21531,46 l " +
                        "-53.650021,0 -53.650035,0 0,57.5 0,57.5 59.000005,0 58.999991,0 0,-53.62244 z";
            break;

        case "CrossCircle":
            shape = "M 83.347458,173.13597 C 61.069754,168.04956 42.193415,152.8724 32.202285,132.01368 23.4014,113.63986 23.679644,89.965903 32.91889,71.042373 " +
                        "41.881579,52.685283 60.867647,37.139882 80.847458,31.799452 c 10.235111,-2.735756 31.264662,-2.427393 40.964762,0.600679 26.18668,8.174684 " +
                        "46.06876,28.926852 51.62012,53.879155 2.43666,10.952327 1.56754,28.058524 -1.98036,38.977594 -6.65679,20.48707 -25.64801,38.95163 -47.32647,46.01402 " +
                        "-6.3909,2.08202 -10.18566,2.59644 -21.27805,2.88446 -9.033911,0.23456 -15.484931,-0.10267 -19.500002,-1.01939 z M 112.4138,158.45825 c 17.13137,-3.13002 " +
                        "33.71724,-15.96081 41.41353,-32.03742 14.8975,-31.119027 -1.10807,-67.659584 -34.40232,-78.540141 -6.71328,-2.193899 -9.93541,-2.643501 " +
                        "-19.07755,-2.661999 -9.354252,-0.01893 -12.16228,0.37753 -18.768532,2.649866 -17.155451,5.900919 -29.669426,17.531424 -36.438658,33.866137 " +
                        "-2.152301,5.193678 -2.694658,8.35455 -3.070923,17.89744 -0.518057,13.139047 0.741843,19.201887 6.111644,29.410237 4.106815,7.80733 15.431893,19.09359 " +
                        "23.36818,23.28808 12.061362,6.37467 27.138828,8.6356 40.864629,6.1278 z M 69.097458,133.41654 c -2.8875,-2.75881 -5.25,-5.35869 -5.25,-5.77751 " +
                        "0,-0.41882 5.658529,-6.30954 12.57451,-13.0905 l 12.57451,-12.329 L 76.198053,89.392633 63.399628,76.565738 68.335951,71.554056 c 2.714978,-2.756426 " +
                        "5.304859,-5.011683 5.75529,-5.011683 0.450432,0 6.574351,5.611554 13.608709,12.470121 l 12.78974,12.470119 4.42889,-4.553471 c 2.43588,-2.50441 " +
                        "8.39186,-8.187924 13.23551,-12.630032 l 8.80663,-8.076559 5.34744,5.281006 5.34743,5.281007 -12.96155,12.557899 -12.96154,12.557897 13.13318,13.16027 " +
                        "13.13319,13.16027 -5.18386,4.66074 c -2.85112,2.5634 -5.70472,4.66073 -6.34134,4.66073 -0.63661,0 -6.5434,-5.4 -13.12621,-12 -6.58281,-6.6 -12.3871,-12 " +
                        "-12.89844,-12 -0.511329,0 -6.593363,5.60029 -13.515627,12.44509 l -12.585935,12.44508 -5.25,-5.016 z";
            break;

        case "DotCircle":
            shape = "M 81.652542,170.5936 C 59.374838,165.50719 40.498499,150.33003 30.507369,129.47131 21.706484,111.09749 21.984728,87.42353 31.223974,68.5 " +
                        "40.186663,50.14291 59.172731,34.597509 79.152542,29.257079 89.387653,26.521323 110.4172,26.829686 120.1173,29.857758 c 26.18668,8.174684 " +
                        "46.06876,28.926852 51.62012,53.879152 2.43666,10.95233 1.56754,28.05853 -1.98036,38.9776 -6.65679,20.48707 -25.64801,38.95163 -47.32647,46.01402 " +
                        "-6.3909,2.08202 -10.18566,2.59644 -21.27805,2.88446 -9.033907,0.23456 -15.484927,-0.10267 -19.499998,-1.01939 z m 29.999998,-15.098 c 20.68862,-4.34363 " +
                        "38.01874,-20.45437 44.09844,-40.9956 2.36228,-7.9813 2.36228,-22.0187 0,-30 C 150.08927,65.371023 134.63549,50.297336 114.65254,44.412396 " +
                        "106.5531,42.027127 90.741304,42.026386 82.695253,44.4109 62.460276,50.407701 46.686742,66.039241 41.6053,85.13096 c -1.948821,7.32201 -1.86506,23.11641 " +
                        "0.158766,29.93754 8.730326,29.42481 38.97193,46.91812 69.888474,40.4271 z M 90.004747,122.6703 C 76.550209,117.63801 69.825047,101.82445 " +
                        "75.898143,89.5 c 2.136718,-4.33615 7.147144,-9.356192 11.754399,-11.776953 5.578622,-2.931141 16.413098,-2.927504 22.052908,0.0074 18.03,9.382663 " +
                        "19.07573,32.784373 1.91442,42.841563 -5.57282,3.26589 -15.830952,4.2617 -21.615123,2.09829 z";
            break;

        case "DotRectangle":
            shape = "m 23.847458,101.19491 0,-72.499995 74.5,0 74.499992,0 0,72.499995 0,72.5 -74.499992,0 -74.5,0 0,-72.5 z m 133.999992,-0.008 0,-57.507925 " +
                        "-59.249992,0.25793 -59.25,0.25793 -0.25819,57.249995 -0.258189,57.25 59.508189,0 59.508182,0 0,-57.50793 z m -94.320573,33.85402 c -0.37368,-0.37368 " +
                        "-0.679419,-15.67942 -0.679419,-34.01275 l 0,-33.333335 35.513302,0 35.51329,0 -0.2633,33.749995 -0.2633,33.75 -34.570573,0.26275 c -19.013819,0.14452 " +
                        "-34.876319,-0.043 -35.25,-0.41666 z";
            break;

        case "NoneCircle":
            shape = "M 83.5,170.5936 C 61.222296,165.50719 42.345957,150.33003 32.354827,129.47131 23.553942,111.09749 23.832186,87.423523 33.071432,68.5 " +
                        "42.034121,50.14291 61.020189,34.597509 81,29.257079 c 10.235111,-2.735756 31.26466,-2.427393 40.96476,0.600679 26.18668,8.174684 46.06876,28.926852 " +
                        "51.62012,53.879155 2.43666,10.95232 1.56754,28.058527 -1.98036,38.977597 -6.65679,20.48707 -25.64801,38.95163 -47.32647,46.01402 -6.3909,2.08202 " +
                        "-10.18566,2.59644 -21.27805,2.88446 -9.033909,0.23456 -15.484929,-0.10267 -19.5,-1.01939 z m 30,-15.098 c 20.68862,-4.34363 38.01874,-20.45437 " +
                        "44.09844,-40.9956 2.36228,-7.9813 2.36228,-22.018707 0,-29.999997 C 151.93673,65.371023 136.48295,50.297336 116.5,44.412396 108.40056,42.027127 " +
                        "92.588762,42.026386 84.542711,44.410896 64.307734,50.407697 48.5342,66.039237 43.452758,85.130959 c -1.948821,7.322 -1.86506,23.116411 " +
                        "0.158766,29.937541 8.730326,29.42481 38.97193,46.91812 69.888476,40.4271 z";
            break;

        case "NoneRectangle":
            shape = "m 24.152542,102.04237 0,-72.499997 74.5,0 74.500008,0 0,72.499997 0,72.5 -74.500008,0 -74.5,0 0,-72.5 z m 133.758198,0.25 " +
                        "-0.25819,-57.249997 -59.000008,0 -59,0 -0.259695,55.999997 c -0.142833,30.8 -0.04446,56.5625 0.218615,57.25 0.375181,0.98048 " +
                        "13.207991,1.25 59.517885,1.25 l 59.039583,0 -0.25819,-57.25 z";
            break;
    }

    return head + path + shape + "\" /></svg>";
}


function StiMvcViewer(parameters) {
    this.defaultParameters = {};
    this.options = parameters.options;
    this.options.exports.defaultSettings = parameters.defaultExportSettings;
    this.initOptions();

    // Options
    this.options.isTouchDevice = this.options.appearance.interfaceType == "Auto" ? this.IsTouchDevice() : this.options.appearance.interfaceType == "Touch";
    this.options.menuAnimDuration = 150;
    this.options.formAnimDuration = 200;
    this.options.scrollDuration = 350;
    this.options.firstZoomDistance = 0;
    this.options.secondZoomDistance = 0;
    this.options.menuHideDelay = 250;
    this.options.zoomStep = 0;
    this.options.reportGuid = null;
    this.options.paramsGuid = null;
    this.options.previousParamsGuid = null;
    this.options.pageNumber = 0;
    this.options.pagesCount = 0;
    this.options.zoom = this.options.toolbar.zoom;
    this.options.viewMode = this.options.toolbar.viewMode;
    if (!this.options.server.globalReportCache) this.options.clientGuid = this.generateKey();

    this.options.toolbar.backgroundColor = this.getHTMLColor(this.options.toolbar.backgroundColor);
    this.options.toolbar.borderColor = this.getHTMLColor(this.options.toolbar.borderColor);
    this.options.toolbar.fontColor = this.getHTMLColor(this.options.toolbar.fontColor);
    this.options.appearance.pageBorderColor = this.getHTMLColor(this.options.appearance.pageBorderColor);
    

    this.options.parametersValues = {};
    this.options.pagesWidth = 0;
    this.options.pagesHeight = 0;
    this.options.parameterRowHeight = this.options.isTouchDevice ? 35 : 30;

    // Collections
    this.collections = {
    	    "loc": {
    	        "EncodingDifFile": "编码:",
    	        "SkipColumnHeaders": "略过列头",
    	        "DrawBorderTooltip": "Drawing the borders of components with graphic characters.",
    	        "EmbeddedFontsTooltip": "Embed the font files into a PDF file.",
    	        "ImageFormatForHtmlTooltip": "The image format in the finished file.",
    	        "Design": "设计",
    	        "MonthApril": "4月",
    	        "Print": "打印",
    	        "MonthJanuary": "1月",
    	        "EmailSuccessfullySent": "The Email has been successfully sent.",
    	        "ExportModeRtf": "导出模式:",
    	        "SaveWord2007": "Word 文档 (*.docx)",
    	        "UseDefaultSystemEncoding": "使用默认的系统编码",
    	        "AllowPrintDocument": "允许打印文档",
    	        "Parameters": "Parameters",
    	        "MonthMay": "5月",
    	        "DayWednesday": "周三",
    	        "Close": "关闭",
    	        "SaveText": "纯文本 (*.txt)",
    	        "SavePpt2007": "PowerPoint 演示文稿 (*.pptx)",
    	        "BorderType": "边框类型",
    	        "AddPageBreaks": "增加分页符",
    	        "CutEdges": "裁边",
    	        "PutFeedPageCodeTooltip": "Feed pages in the final document with a special character.",
    	        "OwnerPassword": "所有者密码:",
    	        "Loading": "加载",
    	        "MonthOctober": "10月",
    	        "CutEdgesTooltip": "Trim the borders of report pages.",
    	        "UseUnicode": "用 Unicode 编码",
    	        "ContinuousPagesTooltip": "The mode of placing report pages as a vertical strip.",
    	        "ButtonCancel": "取消",
    	        "ContinuousPages": "ContinuousPages",
    	        "EmailOptions": "EmailOptions",
    	        "UseDigitalSignature": "使用数字签名",
    	        "TellMeMore": "帮助",
    	        "NextPageToolTip": "下一页",
    	        "ExportPageBreaksTooltip": "Show the borders of the report pages on the Excel sheet.",
    	        "Submit": "Submit",
    	        "Separator": "分隔符:",
    	        "ZoomToolTip": "缩放",
    	        "PdfAComplianceTooltip": "Support for the standard of the long-term archiving and storing of electronic documents.",
    	        "BorderTypeTooltip": "The border type of components: simple - drawing borders of components with characters +, -, |; Unicode single - drawing the borders with single box-drawing characters, Unicode double - drawing the borders with double box-drawing characters.",
    	        "AddPageBreaksTooltip": "Visual separator of report pages.",
    	        "Email": "Email",
    	        "PagesRangeCurrentPageTooltip": "当前页",
    	        "MonthDecember": "12月",
    	        "SaveDocument": "报表文件 (.mdc)",
    	        "ImageResolution": "清晰度:",
    	        "Attachment": "Attachment",
    	        "Page": "",
    	        "SaveImage": "图片",
    	        "AllowAddOrModifyTextAnnotations": "允许添加或修改文本附注",
    	        "Version": "版本",
    	        "OpenAfterExportTooltip": "Automatic opening of the created document (after export) by the program set for these file types.",
    	        "MonthSeptember": "9月",
    	        "PagesRangePagesTooltip": "请输入页码或者页面列表(用逗号隔开),也可以输入页码范围(用'-'隔开),例如:1,3,5-12",
    	        "PagesRangePages": "页数:",
    	        "EmbeddedImageDataTooltip": "Embed images directly into the HTML file.",
    	        "SaveHtml": "网页 (*.html)",
    	        "EncodingData": "编码:",
    	        "AllowAddOrModifyTextAnnotationsTooltip": "Limited access to work with annotations in the document.",
    	        "CompressedTooltip": "Compression of the ready document. It is recommended to always include file compression.",
    	        "DayMonday": "周一",
    	        "EncodingDataTooltip": "Encoding data file.",
    	        "SavingReport": "Saving Report",
    	        "CutLongLines": "截断长行",
    	        "UseOnePageHeaderFooterTooltip": "Define the page bands Header and Footer as the header and footer of the Microsoft Word document.",
    	        "SaveData": "数据文档",
    	        "SendEmailToolTip": "Send a report via Email.",
    	        "PutFeedPageCode": "放置页码",
    	        "SkipColumnHeadersTooltip": "Enable/disable the column headers.",
    	        "ZoomHtml": "缩放比例",
    	        "SaveOds": "打开 Calc File 文档...",
    	        "PrintToolTip": "打印报表",
    	        "SaveOdt": "打开 Writer File 文档...",
    	        "ImageFormatTooltip": "The color scheme of the image: color - image after exporting will fully match the image in the viewer; gray – an image after exporting will be of the gray shade; monochrome - the images will be strictly black and white. At the same time, it should be considered that the monochrome has three modes None, Ordered, FloydSt.",
    	        "ExportModeRtfFrame": "框架",
    	        "UseUnicodeTooltip": "Extended support for encoding characters. It affects on the internal character encoding within the PDF file, and improves the copying of the text from the PDF file.",
    	        "DayFriday": "周五",
    	        "LastPageToolTip": "末页",
    	        "Time": "时间",
    	        "MonthFebruary": "2月",
    	        "SavePdf": "PDF (*.pdf)",
    	        "ExportModeTooltip": "Apply a filter condition when exporting. Data Only - only data bands (Table component, Hierarchical Band) will be exported. Data and Headers/Footers - data bands (Table component, Hierarchical Band) and their headers/footers will be exported. All Bands - All the report bands will be exported.",
    	        "MonochromeDitheringTypeTooltip": "Dithering type: None - no dithering, Ordered, FloydSt. - with dithering.",
    	        "ExportMode": "导出模式:",
    	        "PasswordSaveReportTooltip": "The password required to open the document.",
    	        "RemoveEmptySpace": "删除页尾空白",
    	        "PrevPageToolTip": "上一页",
    	        "TiffCompressionScheme": "TiffCompressionScheme",
    	        "ExportRtfTextAsImage": "将Rtf文字导出为图片",
    	        "OpenAfterExport": "导出后打开",
    	        "ImageQualityTooltip": "Allows you to choose the ratio of the image quality/size of the file. The higher the quality is, the larger is the size of the finished file.",
    	        "DayTuesday": "周二",
    	        "ExportEachPageToSheetTooltip": "Export each report page in a separate Excel sheet.",
    	        "EncodingDbfFile": "编码:",
    	        "PageOf": "/",
    	        "Subject": "Subject",
    	        "DigitalSignatureButton": "数字签名",
    	        "DrawBorder": "绘制边框",
    	        "ImageResolutionTooltip": "每英寸的像素数.像素数越高,图像质量越好,当然文件大小也会越大.",
    	        "BookmarksToolTip": "Show the bookmark panel that is used for quick navigation to jump directly to a bookmarked location.",
    	        "RangeFrom": "RangeFrom",
    	        "BorderTypeSimple": "单线",
    	        "ImageQuality": "图像质量",
    	        "ParametersToolTip": "Showing parameters panel which is used when report rendering.",
    	        "ButtonOk": "确定",
    	        "PagesRangeAll": "全部",
    	        "Bookmarks": "书签",
    	        "ImageFormatForHtml": "图片格式:",
    	        "DayThursday": "周四",
    	        "EncodingDifFileTooltip": "Encoding data file.",
    	        "AllowCopyTextAndGraphicsTooltip": "Limited access to copying information.",
    	        "SaveToolTip": "导出报表",
    	        "AllowEditable": "允许编辑",
    	        "ExportModeRtfTable": "表",
    	        "ImageCompressionMethod": "图像压缩方法:",
    	        "ZoomHtmlTooltip": "The size (scale) of report pages and items after the export.",
    	        "PrintWithoutPreview": "直接打印",
    	        "EncodingDbfFileTooltip": "Encoding data file.",
    	        "TiffCompressionSchemeTooltip": "Compression scheme for TIFF files.",
    	        "UserPassword": "用户密码:",
    	        "SaveReportMdc": "文档 File (.mdc)",
    	        "FullScreenToolTip": "全屏",
    	        "AllowEditableTooltip": "允许编辑",
    	        "ExportDataOnly": "仅导出数据",
    	        "CompressToArchiveTooltip": "Pack all files and folders in the zip archive.",
    	        "MultipleFilesTooltip": "Each report page can be a separate file.",
    	        "MonthJune": "6月",
    	        "MonochromeDitheringType": "MonochromeDitheringType",
    	        "PdfACompliance": "PdfACompliance",
    	        "UsePageHeadersFootersTooltip": "Define the bands Page Header and Footer as the header and footer of the document in Microsoft Word.",
    	        "OwnerPasswordTooltip": "The password to access operations with files.",
    	        "SaveReportMdx": "EncryptedDocumentFile (.mdx)",
    	        "SaveReportMdz": "CompressedDocumentFile (.mdz)",
    	        "SaveXps": "XPS 文档 (*.xps)",
    	        "ImageFormatMonochrome": "单色",
    	        "FirstPageToolTip": "首页",
    	        "SendEmail": "发送邮件",
    	        "KillSpaceLines": "去除空行",
    	        "UserPasswordTooltip": "The password required to open the document.",
    	        "MultipleFiles": "Multiple 文件",
    	        "PagesRangeCurrentPage": "当前页",
    	        "PasswordSaveReport": "密码:",
    	        "GetCertificateFromCryptoUITooltip": "Using the interface of the system cryptography library.",
    	        "GetCertificateFromCryptoUI": "从 Crypto UI 获取证书",
    	        "SaveRtf": "RTF 格式 (*.rtf)",
    	        "AllowModifyContentsTooltip": "Limited access to the text editing.",
    	        "EditorToolTip": "编辑器",
    	        "ExportDataOnlyTooltip": "Export only Data bands (the Table component, Hierachical band).",
    	        "WholeReport": "整个报表",
    	        "MonthJuly": "7月",
    	        "AllowPrintDocumentTooltip": "Limited access to the print operation.",
    	        "Compressed": "压缩",
    	        "AllowModifyContents": "允许修改内容",
    	        "NameNo": "否",
    	        "CompressToArchive": "CompressToArchive",
    	        "PrintPdf": "PDF打印",
    	        "Type": "类型:",
    	        "ImageCompressionMethodTooltip": "压缩方法：JPEG - 这可能导致质量下降; Flate - 没有质量损失,操作简单,有序.",
    	        "MonthMarch": "3月",
    	        "StandardPDFFontsTooltip": "14 standard Adobe fonts. If this option is enabled, then only standard 14 fonts will be used in the PDF file. All report fonts are converted into them.",
    	        "SubjectNameString": "主题命名字符串:",
    	        "PagesRangeAllTooltip": "全部页",
    	        "OnePage": "一页",
    	        "TypeTooltip": "The file the report will be converted into.",
    	        "BorderTypeSingle": "Unicode-单线",
    	        "UseDigitalSignatureTooltip": "The digital signature of the file.",
    	        "SubjectNameStringTooltip": "Certificate identifier. The identifier is the name of the certificate owner (full line) or a part of the name (substring).",
    	        "ImageFormat": "图片类型",
    	        "UseOnePageHeaderFooter": "原样导出",
    	        "ExportPageBreaks": "分页导出",
    	        "DaySaturday": "周六",
    	        "NewItem": "新项目",
    	        "Reset": "重置",
    	        "ExportObjectFormatting": "导出格式化对象",
    	        "RemoveEmptySpaceTooltip": "Minimize the empty space at the bottom of the page.",
    	        "MonthAugust": "8月",
    	        "EncryptionKeyLengthTooltip": "The length of the encryption key. The longer the length is, the more difficult it is to decrypt the document, and, accordingly, the document security is on higher priority.",
    	        "SeparatorTooltip": "Separator between the data in the CSV file.",
    	        "SettingsGroup": "设置",
    	        "ZoomXYTooltip": "The report size (scale): X - change the horizontal scale, Y - to change the vertical scale.",
    	        "ImageFormatGrayscale": "灰阶",
    	        "Save": "导出",
    	        "RemoveAll": "RemoveAll",
    	        "StandardPDFFonts": "标准PDF字体",
    	        "ExportFormTitle": "导出设置",
    	        "Message": "Message",
    	        "PagesRange": "页面范围",
    	        "EmbeddedFonts": "嵌入字体",
    	        "SelectAll": "全选(&A)",
    	        "ZoomXY": "缩放:",
    	        "ExportRtfTextAsImageTooltip": "Convert the RTF text into the image. If the option is enabled, then, when exporting, RichText decomposes into simpler primitives supported by the PDF format. RichText with complex formatting (embedded images, tables) cannot always be converted correctly. In this case it is recommended to enable this option.",
    	        "ViewModeToolTip": "查看方式",
    	        "BorderTypeDouble": "Unicode-双线",
    	        "KillSpaceLinesTooltip": "Remove blank lines (rows) in the document.",
    	        "CutLongLinesTooltip": "Trim the long lines (text lines) by the borders of components.",
    	        "ImageFormatColor": "颜色",
    	        "EncryptionKeyLength": "密钥长度:",
    	        "ZoomOnePage": "页高",
    	        "MonthNovember": "11月",
    	        "UsePageHeadersFooters": "使用页眉页尾",
    	        "SaveExcel": "Excel 工作簿 (*.xlsx)",
    	        "ExportEachPageToSheet": "分页分sheet导出",
    	        "NameYes": "是",
    	        "DocumentSecurityButton": "文档安全",
    	        "EmbeddedImageData": "嵌入图片数据",
    	        "ExportObjectFormattingTooltip": "Apply formatting to export data from Data bands (Table component, Hierachical band).",
    	        "PrintWithPreview": "打印预览",
    	        "AllowCopyTextAndGraphics": "允许复制文字和图片",
    	        "ZoomPageWidth": "页宽",
    	        "ExportModeRtfTooltip": "Presentation of the report data after export. The Table - the report will look like a table, where each report component is a table cell. Frame - each component will look like a single frame, but without any relationship between them.",
    	        "DaySunday": "周日",
    	        "RangeTo": "RangeTo",
    	        "UseDefaultSystemEncodingTooltip": "Use system coding by default or specify the encoding by standard."
    	    },
    	    "images": {
    	        "Office2007Black.Loading.gif": "data:image/gif;base64,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",
    	        "SaveRtf.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIFSURBVHjahFPPaxNBFP6yGZM2JmnzayMEDCWlRynm1lJojaEUr157K4I97akXT/0P9lSKRuhBT0JBr72UHnorVE9akrhRIyHFoOaXTbJZ30yy21mt9sHje/Nm3jffezvrsSwLtr1bWHhE8Jh8HtfYneNjD0c2LpwkeB1aWcmHcjn40un/Fhvr607MxvhK1bS8PxGH+aWKiw/v/1nsu5dzrRnd/jCQvfsA0QgaT59dpxyxpSWYkYhLwZPQ/TyUSgVKIIB04Tn6xkdgOMSFYYyQ9ux168VLhMNhF8E8SyRglopg0SgUGo1/ZkZs+jOZK1UMBgPout7RNC2g8ITV62FISa8kTbbS5iaG3a6zbjabTjwiqJ+jaVRwIx7/q7i+t4f26Sm+Hxw4uVarxeGTQ0CaYBKrl1qQ7VexiH69LuKfR0dOvt1uc6heKqABwTTBYjEXwbf9faS2tuiUgu7ZmZPvdDocahKBKQjkFr7qOrzT0/i8vQ0PY+g3Gn+2UHMeklBAbg+RF1lEeFvTxLpbKol2fhweYmp52VbgbmFqbU18Rm7JjQ2EFhedOXiDQSgTE6jt7sozuFRwXihgkt5/7+QEb1dXkUwmoc7NwUcHb87OIrOz45qNqwX7r6KHkSLIolzOlslFDNwK0u2qqo5ICbnLLTCJuDr2N1IuRbdluUuktgkFvwUYAJ1f2FocY1TSAAAAAElFTkSuQmCC",
    	        "Office2007Silver.Loading.gif": "data:image/gif;base64,R0lGODlhEAAQAOZZAJKSkoCAgO3t7ezs7N3d3fj4+PHx8dvb2+fn5/r6+vT09L29veLi4srKyvn5+fv7+5ycnPz8/PLy8tfX17m5udTU1K2traioqP39/YaGhuTk5PDw8PPz85eXl9XV1aysrLi4uM3NzeHh4Y2Njbq6uvb29u/v74yMjNHR0Z2dnebm5tra2vX19cbGxurq6szMzN7e3sjIyKWlpcnJycvLy4eHh6mpqZiYmJWVlYSEhODg4Kenp6qqqrCwsLu7u4GBgb6+vujo6JOTk+np6dzc3J+fn7Kyst/f37e3t7S0tO7u7r+/v8HBwff39+Xl5bGxsZ6enuPj48fHx6SkpLa2ttnZ2f7+/uvr6////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgBZACwAAAAAEAAQAAAHmIBYgoMoGTUTg4lYVi4GVjUBASOKglYWAEJVGZEnlFguAKE8HicjBJ4KHaE+nooMRkwJrYIwOxcMrQUDAw42U1MWrQNXVwIXvx/CxAIiHxYIuQICslgqLSgPiRgIIhKDClThFYlDVeYOggLhVDRXMw0CGuZVJZUxVCADDVJSISwrVRhYGWTFQAEs+6S8wPLgYCsBL0JsoBQIACH5BAUKAFkALAAAAAAQABAAAAeggFiCgxMdNwSDiVhWAgpWNwAAKVgmKlaDViRTMkcdkRAVPwFFl1hKU6ggBxApDBABsAiCJReoLYk9sBkSgwhANA+JDkhTiFgaIBRBisxYJFRUC82KFNDS070LC1fYigMVRBGJVhwmBYNNMVJSMIkcV/DiWAbrUhMGKwccBvBXCYMepMwwcKBKFQIJBlzZoEiBAywFD2LBEGyaBAIEWDALBAAh+QQFCgBZACwAAAAAEAAQAAAHmoBYgoMwFzYMg4lYVgYlVjZTUxZYBi5Wg1YxVFROF5EfK0IAFpeUm1QtIh8WCDwAry6CBRSbKIk+rx0Kg1c0HhGJCUxPiFhXMw0CioMoORkTDVJSIcuLNQEBI9FSL9VWGdgnAi8hG9VYHicjBIISIggY54MOVfVD8oIl9VUaBQMDDs4xqLKCxYArV5SdK/AAy8GE+GQJEJBgWSAAIfkEBQoAWQAsAAAAABAAEAAAB6CAWIKDGhQkQYOJggoFViRUVAtYCgJWiR5SMVcUkAs6MlMklpNSpRUICwtXIFOtSoIODaVEiS2tFyWDGxNHEYkPNEAIggYrBxyKgxM4HQQHVVUEyVhWNwAAKc/R01Yd1xASBAQs01gHECkMggUmHKPrPRAVgxFX9siDSQEBPwOCCfauGEgkY18AHbquDEiQCEaOAFB8DXqAIZkEFe/KTQsEACH5BAUKAFkALAAAAAAQABAAAAebgFiCg1cNDQKDiYIFCVgNUlIhWCUGVokMVVUSj1IvKlRUMZZYBZlVIgIvIRstoFQGgg8HmQiJKKAUBYMsGi4YiREeNFeLAwMOioMwOxcMA1dXiMlWNlNTFs/RyVhWF9YfBQICjdsiHxa124IOPjwr6olLAABCJtsoORkTRvMAGtM1AgQYEQUHgA8RpmUQeAKLAhejknk4MYJAskAAIfkEBQoAWQAsAAAAABAAEAAAB6OAWIKDBgcHHIOJgg8RWAdVVQRYBQqKG1dXBY+RAzFSHoMPmFcmEgQELBVSq5VYGAOYiINEqw0OgwkGClaJEUcTG4rCgxogFEHDiVYkVFQLyYNWFM3P0IIICwtXghUQPQWJCS0gOoMDPwEBSYkzU1MyBoI66QEyEzgdBEDuU0OCVkUC5CBwAwCAFAh2TKGAIZoKCVY6GISApYQAXsMOQEjBQFggACH5BAUKAFkALAAAAAAQABAAAAeZgFiCgwUDAw6DiYoDV1cCWAkFiomMjhJVVQyTggUCAgkimFWSm4MImAcPpYMYLhosgig5GROlVzMNAjUBASOlDVJSIRm8J7/BLx4nIwSlAi8hG4IrPD6Igw8oLSqDJkIAAEuJFVTlCoIa4ABGMDsXDDTlVI9YVhYAOAw2U1MWAyBUpGAYZMWFAisX+H3AUsCAlVIiPlhAMCkQACH5BAUKAFkALAAAAAAQABAAAAehgFiCg4SFg1YqJoYRD4RWRQE/FYQFV1cbgwgBmxCEJpZXjVgSGZs9hByWAxiDBDJIDo4KBgmCEzgdBIaCBisHHDcAACm7WAdVVQQdwp27x8kHECkMxRIEBCyCOiAttYMRRBUDgwYyU1MzhDBSUjFNgkPnU0AaIBRBE+xSBoJWJFM7VJCgQmWBgRlSKlg5JKCEFQoEF2BxoKAYFgQLFlwxFAgAOw==",
    	        "Bookmarksempty.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAEZ0FNQQAAsY58+1GTAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAlSURBVHjaYvz//z8DNQATA5XAqEGjBo0aNGrQYDEIAAAA//8DALMHAyEzWwaWAAAAAElFTkSuQmCC",
    	        "ArrowRight.png": "data:image/png;base64,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",
    	        "ButtonArrowDown.png": "data:image/png;base64,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",
    	        "Bookmarksline.png": "data:image/png;base64,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",
    	        "Default.Editor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjalFLdSkJBEJ4Vb6S6KrotepSI7jpBkYSBGWEZqYlZJIFFCJlCddEfZDcJPUA+VCDkjRXWObvTzC5HM49pH+ews7Mz3/yK2OEdAgMRFJBIn1J8KlaBolORgNLcke/0/nS1J5AUfva9zW/CIOBInw7A2k6xpfMDtg02sjfEzpEQHooJrVtNX+iIHLlyngFbmSxc+CghLUQPrtnRKp/FBao2K8uVy7QIBAJWKFnUAfhvEbA/OxOs+8J2lQWu2ZyGgMFvwyNDVjRVgJ8BPBFOnaOLULzY07rVxN/gzn9JMpBoJkJYWD9BlsfGR63aS+1ZmjKEJ/NKooT1d8TXusRg7LQjg7lwDgfKQPiIXoiOjpumdt49CaQjwX6zoSEb4DhOF3lPguWtArpjosmDD3264/ORnNZXH/N6+3oSMHu5lIQPW0Kz2QRwBOSPU6AoiexRydj8VQLXF6HNM/uudHT+mdidfd8d6IeZpUz/KXhhNriv92ByasKaXtzl1PQedDXlv/gWYACo3RPdkUubNwAAAABJRU5ErkJggg==",
    	        "SelectedItem.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAADAFBMVEWjvePV4fJ8enxTAoN3H6gAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAE4ACABgAAp3H6gY9jAAAABEAAAAOgBXAFwAbwBrAHIAXABvAEYAcgBWACAAaQB3AGUAZQBcAHIAMQAzADIAXABlAFMAbABjAGUAdABkAGUASQBlAHQAbQBwAC4AbgAAAGcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAAAAAACYAAAAGPUfqwH1kHcBABgAAACTEeQAAHYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgALUAupkAAAD1sAAKABgDyAAABPcSKAAAdpN2jyobACB/6AABALoAAAC6mdj11AAjABh3HuAe36UAAHcAAAAAAAAAAAD2WABGABh2kMYY9ljGoAAAdpAAAACD//9jjAKMAn4CfmMAABgAAAAwAAAAGPYAAEAAAAAcAAAAGPYAAAAAAAAAAAAAAAAAAAAADAACAAAAAAAAAQH2lAAAABgAAAC1AACJGAAAA10dOTGKAAAAAWJLR0T/pQfyxQAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAC1JREFUeNpjYMAKGDHAAAkyMWEKQsXggiA+TAyhkokJLoakHSHGOJi8iRDEAgAXYAFTLVxyPgAAAABJRU5ErkJggg==",
    	        "Parameters.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAADAFBMVEX///+49hiKior////Q3uxZir1NgriUtNSsxd7n7vbb5vGIrNBxm8agvNkAAAAACAAAAAAAAAAAAEoACABgAAp28KgY9jDzZABEABgAOgBXAFwAbwBrAHIAXABvAEYAcgBWACAAaQB3AGUAZQBcAHIAMQAzADIAXABhAFAAcgBtAGEAZQBlAHQAcgAuAHMAcABnAG4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAAAAAACYAAAAGPXwqwH1kHYBABgAAABwEeQAAHYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYACQAKIoAAAD1sAAXABgBWwAABPUSKAAAdnB2bCobACB9UAABACgAAAAoilD11AAjABh27+Dv36UAAHYAAAAAAAAAAAD2WABGABh2bcYY9ljGoAAAdm0AAAAU//841AbUBhMGEzgAABgAAAAwAAAAGPYAAEAAAAAcAAAAGPYAAAAAAAAAAAAAAAAAAAAADAACAAAAAAAAAQH2lAAAABgAAAAkAAA2OABkQTPwAAAAAXRSTlMAQObYZgAAAAFiS0dEAmYLfGQAAAAJcEhZcwAALiMAAC4jAXilP3YAAABESURBVHjaY2CAACYmBhTABEZwSQSACDDDuMwwATjAI8DCysaOIsDBwsnKiaqFixvVDC4eNEN5OQjYwszBTkgFigCK5wD9yAIeIKOH+wAAAABJRU5ErkJggg==",
    	        "Windows7.SelectedItem.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAV5JREFUeNqslMFOwkAQhv9Z14YoIkpjYtAD0Yvx4hv47LyBB416wBiEGEGCgkbpth131hZMKR5aJtnubrv79Z9/pyVmxl13xL2XMcrEoV/Hecsnun4YslZAq7lfGKYUofM0Qhjb8fPwDSfHDZBShZtN0jGEpSM7U0QIIi6VsmdVCktDOGkrEwlDO2G0BiIBwtJigHgQx+WAzCQX6Di5keXxihfUtjddP/0Kl54Jyyn8D5AHm3ya/PVOIbse2UPeqy42Z2ES2fXONudhchxZD2WjQFLQXxhy1qczPZsZGFvig0mwlMFt7wNnR9X5uD+erbSj4ikIS8/lrvDwpjvNVZRj36/CRQox1hGJQkZUug45BZKtH8Z3YArDxI6It9znMvfQRLyelLXegAlC+DWvuEIRZBnC0n59B53+GKf2f2aiYmlXPA/3j68QFomZ7as+D0bvpVI9aOzi8qJJPwIMALe9x88ZfvvHAAAAAElFTkSuQmCC",
    	        "Print.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACtSURBVHjaYiwqKmJAA/8Z8ANGZA4LNhW9vb1YdRYXF2OIMTFQCCg2AOQFeyDuAmIzkNP9mneCMVYg4Mawqdb9P9Qrp4C4DGTACiCWgKkBKiDWcjOQXhZkzdgCiQCQGPhApEosPAViaTIT0lOQASlAPB85MEHAt2kHisrNdR7oml+A9IIMAKmUhNkMtOU/Dg0w1zEiu4QFl9+IcAGmAcgm49KAHg4sxOY6XAAgwABqSjFfY2wW+AAAAABJRU5ErkJggg==",
    	        "AboutInfo.png": "data:image/png;base64,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",
    	        "Office2010.Editor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjalFLdSkJBEJ4Vb6S6KrotepSI7jpBkYSBGWEZqYlZJIFFCJlCddEfZDcJPUA+VCDkjRXWObvTzC5HM49pH+ews7Mz3/yK2OEdAgMRFJBIn1J8KlaBolORgNLcke/0/nS1J5AUfva9zW/CIOBInw7A2k6xpfMDtg02sjfEzpEQHooJrVtNX+iIHLlyngFbmSxc+CghLUQPrtnRKp/FBao2K8uVy7QIBAJWKFnUAfhvEbA/OxOs+8J2lQWu2ZyGgMFvwyNDVjRVgJ8BPBFOnaOLULzY07rVxN/gzn9JMpBoJkJYWD9BlsfGR63aS+1ZmjKEJ/NKooT1d8TXusRg7LQjg7lwDgfKQPiIXoiOjpumdt49CaQjwX6zoSEb4DhOF3lPguWtArpjosmDD3264/ORnNZXH/N6+3oSMHu5lIQPW0Kz2QRwBOSPU6AoiexRydj8VQLXF6HNM/uudHT+mdidfd8d6IeZpUz/KXhhNriv92ByasKaXtzl1PQedDXlv/gWYACo3RPdkUubNwAAAABJRU5ErkJggg==",
    	        "Office2007Silver.SelectedItem.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWJJREFUeNqslb1OwzAQgC/RDR4YbmDI0KESGyzpG1SCgfeAR2JF4hEYGUDqiFiaBQZUJAaGDB08dLghUjjbSePUCSlNT3F8558v5/PFjsqyhK/lfQlHkLPZTRSt3u5KShKgyfUomP55Ap3ngLxhB9ssvG4lhf9hgzDmkK8eBFhIR12s8M4kU+se25PCVVgr7a/v6n01tJxgZvGQ2TVwLuVbxk4PC+IJO6D10MD0Y/Wx7EBgalyEuIndfoLnz7aEImFAJcDWRgzDbPw/rjp63cbG+3ryN6yRXg/riT54COaAWKcAeTUFgBBG4ZKFhY1BLjmxGlzpxeetvLRrt23k2dTYLqvlQX+jkuaP6dIRQtuukLZh85YM0EqhLh0ptP1x2yXjazN4MHeo2zYMCUmsDJLT8YdhIQylzGljYpK5uIwRzKq9naSg1wrodDHugF3PgaYMkbkC3pcvR7kCLmaX0a8AAwDOipVbk6mXKwAAAABJRU5ErkJggg==",
    	        "CheckBox.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAC7SURBVHjaYvz//z8DqYBxcGnq7u4uAlK9QDy3tLQ0hYkIDfZAqguILwBxLkiMmZubm/PYsWNHgXg2EP+3trY+iKRBGkjtBeK/QOwKtOUV3HlASVEg+xgQqwBxPVCyCSjGBmQfBmIzIA4Fiq3B8BNQkQpUI8iAeiCWA+JkIJ4I1FCAMyCAGkGmHgBiTqjQcSB2AGr6hTf0gBoDgdQ6IH4NxCZADY8wQgekCR13dXVVALEHNjkQpl+KAAgwAKCmeGnxQrElAAAAAElFTkSuQmCC",
    	        "Bookmarksminus.png": "data:image/png;base64,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",
    	        "OnePage.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAB9SURBVHjaYixbPt2egYGhC4jNGIgHp4C4DIgPsgCJFUAswUAaMIPqk2SBaeZgZWNoDE4iqLN8xQwYE6yPiYFCwIJNcPnBOxhikfYqxBuAS/GoCwarC6iSkJ4CsfSP37+Qkykx4CnMBSlA/IJEi19A9YFdsAOUq8j1AkCAAQDiLiK1dsl6lQAAAABJRU5ErkJggg==",
    	        "WindowsXP.Editor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjalFLdSkJBEJ4Vb6S6KrotepSI7jpBkYSBGWEZqYlZJIFFCJlCddEfZDcJPUA+VCDkjRXWObvTzC5HM49pH+ews7Mz3/yK2OEdAgMRFJBIn1J8KlaBolORgNLcke/0/nS1J5AUfva9zW/CIOBInw7A2k6xpfMDtg02sjfEzpEQHooJrVtNX+iIHLlyngFbmSxc+CghLUQPrtnRKp/FBao2K8uVy7QIBAJWKFnUAfhvEbA/OxOs+8J2lQWu2ZyGgMFvwyNDVjRVgJ8BPBFOnaOLULzY07rVxN/gzn9JMpBoJkJYWD9BlsfGR63aS+1ZmjKEJ/NKooT1d8TXusRg7LQjg7lwDgfKQPiIXoiOjpumdt49CaQjwX6zoSEb4DhOF3lPguWtArpjosmDD3264/ORnNZXH/N6+3oSMHu5lIQPW0Kz2QRwBOSPU6AoiexRydj8VQLXF6HNM/uudHT+mdidfd8d6IeZpUz/KXhhNriv92ByasKaXtzl1PQedDXlv/gWYACo3RPdkUubNwAAAABJRU5ErkJggg==",
    	        "SaveOdt.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIoSURBVHjaYvz//z8DDKj6xKYBqUwgNmAgAG5vWcwIolmgGjmB1MYAJxvXIBc7BjV5GbyaLaKz4GwWKL26pzjDVVRUjOHm05cMx289wqk51tkChc8CtD3E0dTAW1RYmGH2zqOEXM7w798/BmkZWRQXVMd4uzCcvfOIgZOdjWFKdhTDo1dvGf4Bw+bRq3cM////A9Mw/rRthxkUVdUQJqp4x/x/9OzF/9LpS/9XzV//nxjw+/fv//39/d9AEcAEMuTPn78M3759ZxDk4QIbeufRU4aXb9/j9Mbnz5/hbIgBf/8yHDp6lEGYjxsseOrKDQbPrAqG9jnLGH78+oVhwJcvX0DUI7gBN+7eZ2AExirMBVFezgx7ZvUwvPv0iSG5rpvh9fuPDN9+/IAb8PXrVxD1FB6NX7//ZGBlZWUQ4uWBK7p+7yFDd1EGw5y1WxlaZy1hOH/jNoOMuCiDma4mg7W6PEjJC7gBX779YOBgZ4d7AQQ2HTzGcPzSNYaS+DCwYYoykgwfP39lOHPtJjC8vsINYIIZwA40AOYFEGjJSWK4dOsug19eDUPTjEUMzExMDOLCggzethZAA76heuHbj58Mzob6KAawsrAwLGqtxBoL0DBAeGH+lp3g1PVmwQYGB0kOBnFxcQYxMTEw5ubmxhULEANguWrChAnSDN+fGd+7xwDE94yBQiAswcPDAzYI2VAML0DBUyjehCQmDbTNGISRDIUBsAsAAgwAJlkGLLKKGAkAAAAASUVORK5CYII=",
    	        "FirstPageDiabled.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACISURBVHjatNbBDsAQEARQK/1tp/1w0mOlmJldjg3zBF2s915utufvo7t/1NaaIWHvuLlvzZrpPKlUYBWeAuzCw8ApPAQg4TKAhksAE04DbDgFKOEwoIbDAFoqQkukItQmKwh9TFlE+tEYRC4VKBIqdggSLtcnJOXC2SFpV+YKsduviloutyHAADHHNisEgmXKAAAAAElFTkSuQmCC",
    	        "GetFlashPlayer.gif": "data:image/gif;base64,R0lGODlhngAnALMAAAcHB////35+fkNDQ84gJ9vV1aCgoMw+Q8MnLYiIiLy7u2ZmZtx6feWcniIiIgAAACH5BAkAAA8ALAAAAACeACcAAAT+kMhJq7046827/2AojldgnmiqrmzrvnAsxyQ533iu73Qt8sCg0CUoGo0t32/IbPKO0KQS5KxaY9CjdDo5HDLXsBiVRbK4h0bB1AC3EnDFzSA3FeAJwxplgO8DfXkneAl/YWVFWzUMKW0YLAYDCQoJCyyFKgMDJwoOcAsAAieaCQKhJgMLCZomAHiGV4iiZzUHsAGOJSqRLIYDsAYCDnsKmycOBgEDsyYOcgN1AK1jKbKKIre4bikOLJqeygADyaMFAgkmxXwLBdIolcpyq9PUJ9a0I3UquRa7lgGUMP2aVsDYiQLdEKYzCBAaw4bhACBrpelhLETXPjBq5EWDCjj+6RI4M+AJjjQD/wZB67RG3YlILl9ughagoBwACnLWu7fCRgoGHT4yCyCtUk4Fa0CicFBxGcRRyQAYUhXPBEh3VmRp1RJgxMYTQIOmaPen6EOaBw22e1rQ2Ko686oivCmm1FaMJkaM/bDCgDhSqCqaEEYuwDkU4xQAWCyJj4PFKQcsdtVqMjond+5m+SPiwE8vXza0uJWtHjVzmo0YEtGgFwLRpmPvUJBaQOG8IDy3eO1Rtm8cwe7exv2h9W7Yv5PHCC5rOHEPpU3w3qa8eout+Drodo3cunehWS73/AALNGgOu/DIW4HpIJxkBW7rQRGw/fwUdAbxia8e4CsdmR3+0d542v20BGKqTEKUCp2I59c5m8RUlUql4DQhYgaNY8dMCcojiSnOxYCaai6Ql0JoVKSAFj0oqNINKrdJuGIASvEyIyDCEPOihjPWaJEMtBWhT3YaGHcCP3ypOCRWxyizhwApPYXKkEqpc+Mvh8HoUo+XocRDHyGmsMEBDNyCYooYarIGk4BY4uVglAH0lyYWDoJOQcnMqJBCdjjgTGBq0vjhQDxEh4IGpZ2J5iiTRKPiJH6h0FZDRxVDpWVTvrPSMCcsEFmjVkmiYT0ZbNdIDZksKemcEyGWE0NcKrlUU8wodSGNl3FKTakrIBlCqigwWYpMgKxBloxUipfphgdhYWVrrID8WAWvkoaFqqwnTOYKodMksNhEyL6jbETiZAmjVeJJxhiujO6KwXYFWOvDd/QGocF5XBBQ77465OsBvwDP4K9YARec0cD9GKywCgh3t/DCDff28MMRV2zxxQhHAAA7",
    	        "CloseForm.png": "data:image/png;base64,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",
    	        "Office2010Silver.Editor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjalFLdSkJBEJ4Vb6S6KrotepSI7jpBkYSBGWEZqYlZJIFFCJlCddEfZDcJPUA+VCDkjRXWObvTzC5HM49pH+ews7Mz3/yK2OEdAgMRFJBIn1J8KlaBolORgNLcke/0/nS1J5AUfva9zW/CIOBInw7A2k6xpfMDtg02sjfEzpEQHooJrVtNX+iIHLlyngFbmSxc+CghLUQPrtnRKp/FBao2K8uVy7QIBAJWKFnUAfhvEbA/OxOs+8J2lQWu2ZyGgMFvwyNDVjRVgJ8BPBFOnaOLULzY07rVxN/gzn9JMpBoJkJYWD9BlsfGR63aS+1ZmjKEJ/NKooT1d8TXusRg7LQjg7lwDgfKQPiIXoiOjpumdt49CaQjwX6zoSEb4DhOF3lPguWtArpjosmDD3264/ORnNZXH/N6+3oSMHu5lIQPW0Kz2QRwBOSPU6AoiexRydj8VQLXF6HNM/uudHT+mdidfd8d6IeZpUz/KXhhNriv92ByasKaXtzl1PQedDXlv/gWYACo3RPdkUubNwAAAABJRU5ErkJggg==",
    	        "BookmarksminusBottom.png": "data:image/png;base64,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",
    	        "Office2010Silver.Loading.gif": "data:image/gif;base64,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",
    	        "SaveData.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIHSURBVHjaYvz//z8DDDg1S6UBqUwgNmAgAPbVPmME0SxQjZxAaqONlpurrY4ng4yIIl7N2dMC4GwWKL06w6vKVVCMn+HptysMN18cxqnZUTwahc8CtD1EX8nCm19AgOHwgw2EXM7wV/Qvg4yMDIoLqp0N/BjufTnHwMHCxVBhsYjhxdd7DP/+/wPS9yH0lwcM/xhA9H2GI082MCioyKEYYCAuKMVw7sEOBkF2CQYmYNBI8SiBJWV4VbC64s+fPwwTJkz4VlBQwAUOgz//fjP8/PWDgY9PGKzAv0eLQVJAjkFFQptBjE+aQYxfmkFJTJNBVliZgZONm+Hz58+ogfjn72+Gx/eeMZhKu4MFl2QfY3j+4RHDnRdXGV59espw6eEJhg2n5zM8fnuXYWv5bYYvX76AlD2CG3Dv7RWws/jYhMAGxEy1QnGBnrwFQ4BpItgFIPD161cQ9RRuwG+gC/78/csgwC5ClAu+ffsGUvYCyQu/GP4CDeCHGoDugjK/fpRAhHoByQCg8//9+8vAxy6M1QXoAOoChBf+/PvDYG/gwcALDQNeTgEwVpPUwxqN0DBAuGDTwZXg1DWFvYBB7aUPg7i4OIOYmBgYc3NzYxiA4gVYrgImDGmG4wzG9xjuGd+7d88YKATCEjw8PGCDkA3F8AIUPIXiTUhi0kDbjEEYyVAYALsAIMAA48LieE1XnEAAAAAASUVORK5CYII=",
    	        "Office2010Black.SelectedItem.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQ5JREFUeNpi/P//P8Plrc3/P1xbx0AJENAKYtD1rmVkubyt5f+H6+sZbKNdKTLw8LL1DJcZGf8zHuox+m8b7shADXB45X4GFgZGRgaGv/+pYiDILIiB/6lqIBMDw79/VDKQiRYuZAK5EIuBOCxhVJ8Ckb6ViynJRKIL4YbdzMGuBx6G2OQ0kDSjGwZm4ApDJkassiCNIENgBqEYhstEoFlMYBfiAMgGoBqGL5aZcBgIDaP/N7LxRhL2SAFhqiYbNmYQj0LT/kNcyMjGzsDAzEwV80BmsYA5zExUMRAEIGHIwkS1MGTilnVjOLrnBsTbFGCQGSCzGEFVwPmDk/9/ebKbIsfxyLgyGNrnMgIEGABSj14mjAo5NQAAAABJRU5ErkJggg==",
    	        "Office2003.Editor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjalFLdSkJBEJ4Vb6S6KrotepSI7jpBkYSBGWEZqYlZJIFFCJlCddEfZDcJPUA+VCDkjRXWObvTzC5HM49pH+ews7Mz3/yK2OEdAgMRFJBIn1J8KlaBolORgNLcke/0/nS1J5AUfva9zW/CIOBInw7A2k6xpfMDtg02sjfEzpEQHooJrVtNX+iIHLlyngFbmSxc+CghLUQPrtnRKp/FBao2K8uVy7QIBAJWKFnUAfhvEbA/OxOs+8J2lQWu2ZyGgMFvwyNDVjRVgJ8BPBFOnaOLULzY07rVxN/gzn9JMpBoJkJYWD9BlsfGR63aS+1ZmjKEJ/NKooT1d8TXusRg7LQjg7lwDgfKQPiIXoiOjpumdt49CaQjwX6zoSEb4DhOF3lPguWtArpjosmDD3264/ORnNZXH/N6+3oSMHu5lIQPW0Kz2QRwBOSPU6AoiexRydj8VQLXF6HNM/uudHT+mdidfd8d6IeZpUz/KXhhNriv92ByasKaXtzl1PQedDXlv/gWYACo3RPdkUubNwAAAABJRU5ErkJggg==",
    	        "WindowsXP.Loading.gif": "data:image/gif;base64,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",
    	        "Office2007Black.Editor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjalFLdSkJBEJ4Vb6S6KrotepSI7jpBkYSBGWEZqYlZJIFFCJlCddEfZDcJPUA+VCDkjRXWObvTzC5HM49pH+ews7Mz3/yK2OEdAgMRFJBIn1J8KlaBolORgNLcke/0/nS1J5AUfva9zW/CIOBInw7A2k6xpfMDtg02sjfEzpEQHooJrVtNX+iIHLlyngFbmSxc+CghLUQPrtnRKp/FBao2K8uVy7QIBAJWKFnUAfhvEbA/OxOs+8J2lQWu2ZyGgMFvwyNDVjRVgJ8BPBFOnaOLULzY07rVxN/gzn9JMpBoJkJYWD9BlsfGR63aS+1ZmjKEJ/NKooT1d8TXusRg7LQjg7lwDgfKQPiIXoiOjpumdt49CaQjwX6zoSEb4DhOF3lPguWtArpjosmDD3264/ORnNZXH/N6+3oSMHu5lIQPW0Kz2QRwBOSPU6AoiexRydj8VQLXF6HNM/uudHT+mdidfd8d6IeZpUz/KXhhNriv92ByasKaXtzl1PQedDXlv/gWYACo3RPdkUubNwAAAABJRU5ErkJggg==",
    	        "ArrowUp.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAMAAACgjTZZAAADAFBMVEX///////+HiYmJiovw8fCAgYCLjIz09PTt7e3k5OR3d3eNjY729vbw8PHp6eng4ODY2Nlub26Ojo6Ki4uGhoeBgYF7fHx2dnZwcHFqa2tmZmYAbwBrAHIAXAByAEEAcgB3AG8AVQAuAHAAcABnAG4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAugCRAWAAAAMlAAAkAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAugAAACABYAC0A5EAGPUJOL4BOHeaALp3CTi5jlcAAHcAAAAAugCRAWgAAAMAAAAAAAAbAAAAAACYAAAAGPUJqwFbCHdQA5YAugFUEeQAAHZQALoAugEAAAAAAABQAAAAugEAAAIAAAJSAABSAAAAAEUAAAAAAAAAAAAAAAMAAABFAAAAAAAAAFIAAADvAAC/AFAAAEUAAABwAAADl4gAAAAAAAAAAAAAAAC6AXwAAABQAAAAugEAAAAAAABoAAADkQGWWwgAAANFAAAAAAAAAAAAAAAAAQAAAAAAAij1sADUAQEAGPRUEeT3DHbVABh3DXGps7P//gCa//93CTgJNJIAAHdoAAADkQEI36UAAHcAAAAAAAAAAAD2WABGABh2UcYY9ljGoAAAdlEAAAB9///4DAIMBnwGfPgAABgAAAAwAAAAGPYAAEAAAAAcAAAAGPYAAAAAAAAAAAAAAAAAAAAADAACAAAAAAAAAQH2lAAAABgAAAC6AAA0iAACoQoxAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAsSURBVHjaY2AAAiYGKGBmYYUw2Ng5OLlADG4eXj5+AUEGBiFhEVExcQlJKQAPUAFfavqkCgAAAABJRU5ErkJggg==",
    	        "Office2007Silver.Editor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjalFLdSkJBEJ4Vb6S6KrotepSI7jpBkYSBGWEZqYlZJIFFCJlCddEfZDcJPUA+VCDkjRXWObvTzC5HM49pH+ews7Mz3/yK2OEdAgMRFJBIn1J8KlaBolORgNLcke/0/nS1J5AUfva9zW/CIOBInw7A2k6xpfMDtg02sjfEzpEQHooJrVtNX+iIHLlyngFbmSxc+CghLUQPrtnRKp/FBao2K8uVy7QIBAJWKFnUAfhvEbA/OxOs+8J2lQWu2ZyGgMFvwyNDVjRVgJ8BPBFOnaOLULzY07rVxN/gzn9JMpBoJkJYWD9BlsfGR63aS+1ZmjKEJ/NKooT1d8TXusRg7LQjg7lwDgfKQPiIXoiOjpumdt49CaQjwX6zoSEb4DhOF3lPguWtArpjosmDD3264/ORnNZXH/N6+3oSMHu5lIQPW0Kz2QRwBOSPU6AoiexRydj8VQLXF6HNM/uudHT+mdidfd8d6IeZpUz/KXhhNriv92ByasKaXtzl1PQedDXlv/gWYACo3RPdkUubNwAAAABJRU5ErkJggg==",
    	        "About.png": "data:image/png;base64,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",
    	        "Office2010Black.Editor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjalFLdSkJBEJ4Vb6S6KrotepSI7jpBkYSBGWEZqYlZJIFFCJlCddEfZDcJPUA+VCDkjRXWObvTzC5HM49pH+ews7Mz3/yK2OEdAgMRFJBIn1J8KlaBolORgNLcke/0/nS1J5AUfva9zW/CIOBInw7A2k6xpfMDtg02sjfEzpEQHooJrVtNX+iIHLlyngFbmSxc+CghLUQPrtnRKp/FBao2K8uVy7QIBAJWKFnUAfhvEbA/OxOs+8J2lQWu2ZyGgMFvwyNDVjRVgJ8BPBFOnaOLULzY07rVxN/gzn9JMpBoJkJYWD9BlsfGR63aS+1ZmjKEJ/NKooT1d8TXusRg7LQjg7lwDgfKQPiIXoiOjpumdt49CaQjwX6zoSEb4DhOF3lPguWtArpjosmDD3264/ORnNZXH/N6+3oSMHu5lIQPW0Kz2QRwBOSPU6AoiexRydj8VQLXF6HNM/uudHT+mdidfd8d6IeZpUz/KXhhNriv92ByasKaXtzl1PQedDXlv/gWYACo3RPdkUubNwAAAABJRU5ErkJggg==",
    	        "CollapsingMinus.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAADAFBMVEXJycHFw7u/wbm7u7W1ta2vraenp5+foZmZmZPv7+7u7u3u7ezt7ezu7uyRkYvFxb3s7Ovr6+rq6+nq6unp6uiJi4PBwbno6ejn5+bm5uXo6Ofp6eiBgXu9u7N5eXO3ta/q6upvb2uxr6ns6+rk5OPi4uHj4+Ll5eRnZ2Opq6Ph4eBfX1mjo53l5uXg4N9VVVGdm5WVk42LjYeFg397e3VzcW1paWNfX1tNTUkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAAAAAACYAAAAGPUJqwH1kHcBABgAAABUEeQAAHYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOgDhCQAAAD1sAAMABgFIQAAAUcSKAAAdlR2UCobACAfmAABA4QAAACEI/j11AMjABh3COAI36UAAHcAAAAAAAAAAAD2WABGABh2UcYY9ljGoAAAdlEAAAB1//84iAaIBnIGcjgAABgAAAAwAAAAGPYAAEAAAAAcAAAAGPYAAAAAAAAAAAAAAAAAAAAADAACAAAAAAAAAQH2lAAAABgAAADoAAD6eAAAA40cBS2ZAAAAAWJLR0T/pQfyxQAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAGpJREFUeNolxlcSgjAABcAnIF1MFDBFwJJEDSh2vf/JmIH9WgAzx/XmfhACUZykaRIvMiwJXa1zSkmBcsMY50LmW1QyGIkazW4q3+NwlFxpo05nXIhkympjWnRUXM3NWt3j/ni+3p/vr/8Pb64JoOz29nAAAAAASUVORK5CYII=",
    	        "CollapsingPlus.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAADAFBMVEXJycHFw7u/wbm7u7W1ta2vraenp5+foZmZmZPv7+7u7u3u7ezt7ezu7uyRkYvFxb3s7Ovr6+rq6+mJi4PBwbno6ejn5+bo6Ofp6ejp6uiBgXu9u7N5eXO3ta/q6urm5uVvb2uxr6ns6+rj4+Lk5OPl5eRnZ2Opq6Pi4uFfX1mjo53l5uXg4N/h4eBVVVGdm5WVk42LjYeFg397e3VzcW1paWNfX1tNTUkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAAAAAACYAAAAGPUJqwH1kHcBABgAAABUEeQAAHYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACoAOgDhEgAAAD1sAALABgAjAAAA5YSKAAAdlR2UCobACAfmAABA4QAAACESKD11AMjABh3COAI36UAAHcAAAAAAAAAAAD2WABGABh2UcYY9ljGoAAAdlEAAAAE//+rtAG0BnUGdasAABgAAAAwAAAAGPYAAEAAAAAcAAAAGPYAAAAAAAAAAAAAAAAAAAAADAACAAAAAAAAAQH2lAAAABgAAADoAABbUAAAB0nTNs/UAAAAAWJLR0T/pQfyxQAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAGpJREFUeNolytsaQkAYRuFP6Lc3I5lpYzuKiPa5/zvjqXX0HiwA2ko3zDVZgO24nuc6foCQ8YiIc7ZBvE0SIiF3exwk/RJHpNmfeYGykjmRqk9nNEwub6vUBR0XvboOQzvidn88X+/Pd5xmRQgIsvQGdUsAAAAASUVORK5CYII=",
    	        "NextPage.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABhSURBVHjaYvz//z8DJYCRUgMYQAagY5/G7f+xiWPDTLgM9m3aQZTTmPBJEmMIEyEFhAxhIsaZ+AxhIjawcRlCtAGb6zwYyTYAl2aiDMCnmaABhDRTJSUyDnhmotgAgAADAB9+gDvqx6+SAAAAAElFTkSuQmCC",
    	        "SaveText.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHdSURBVHjahFNLSwJRGD3FIPg2fGfUD3AjWCKC4KZNUqtWFS6DCsRVIf0FIxHqT7SxwLaCkBv7AbVQKBgwUbF8LHx278fMNGNYH3xz7tzHuec7996l2WwGOZLJ5DGDE5YB/BO5XG6JoyAt1DO4D4VC2+FwGF6v98/F6XRaaQsS3iUSiW2bzYZ6vY5qtbpwcSQS0fwLbPd9v98fN5vNKJVK/ynHdDqFy+nUKLiMRqMQRRE6nQ4Hh0dot5rg3rTbbcJWq6X8F4tFrPp8GoKAkzG+vrzAYDBgmVnjcDho0KnaSR3j8RjZbHaQSqUMgtwxHA5hW1mhCVeZDLgfbo8HVosFFqsVLpcLdrudVHa7XYVsmX8mkwmeymUYjUbqPD07w048jjUmdcqkv7+94bFQQPb6msZ7vR6Hd+UUms0mDfASeNze3GgUrG9sYHNrixTw6Pf7HESFgJcgCAJMJpOioNPp4IMd6efXFyl4rlTIzPOLCwwGAz6trhCMRiOqTS5hXsHu3p7GRKmExQTzCuZDUqAtIRaLKR7o9XrKRVda8uBHQT6fp4FGo0Ekbrebjo2nrGphCfKrYhfDx95BkDWDtVqNkKWHG8uJ1KS/SpBClPJB1edjuwV5qkjlIAXfAgwAYhHPoxeRjY0AAAAASUVORK5CYII=",
    	        "Editor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABdSURBVHjaYvz//z9DY2PjfwYiQX19PSMyn4mBQgAzgBENo9uIVY6qLhjCBrCQqP4/MMrBAQuLelINYARqBqcbWHoYjQUqGMAAyo2k4oaGhv8wNknRCIt75HQAEGAAd+tKehdJM0YAAAAASUVORK5CYII=",
    	        "BookmarksjoinBottom.png": "data:image/png;base64,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",
    	        "SaveWord2007.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJRSURBVHjaYvz//z8DDDhEz0kDUplAbMBAABxYmsIIolmgGjmB1EY7M2VXB3MVBllJAbyaU6tWwtksUHp1doyNq5AgL8Pjl58Zrt97j1Ozk4U8Cp8FaHuIgZa0Nz8vB0PNhL2EXM5gayzLoConhOKCaicLNYZ7z74y8HCxMeycG8Fw6/5bhn///jPcevgOTN9+8J7h779/DLcfvmfomX8UyP+CYoCBiBAPw+V7HxlEhTgZmIBBIynKx/Ds9TcGRzNFBn5eVgxX/Pnzh2HChAnfCgoKuMBh8P3Hb4bvP/8wiApygRW0zjnL8On9DwY+QQ6G9GANhtCirQzn1kQzlPWfAIu3F+rDDWMCER8+/2DYeuA2g7gIN1iwq9CC4dS1pwwRbqoMRV2HGL58/Q0Wv3LzBUN+giHDly9gLzyCG/D373+gs/4BvcAFNxmkae2emwymOuIM7OzMDAs3XmNws5Zn0FTiZ/j69StIyVO4ATAgIcKDcNp/Voa3b38xhHmog/k7Dz1hSAnTA7O/ffsGol4gGQBOVHAvfPj+h0FOVJihucCCgZGRmYGfVZChJMmYgQfoErDrIF5AMoCRkYEZGPywQGT885+hIsMQ6CUOMD/CS41BTQWROqEueApPiYxAA6rTrcDRCAKgqHOyFgezVeV5GSSjuOC2gwA0DF7ADZi6aB9Y4tQ5aQZb7d8M4uLiDGJiYmDMzc2NohndCyywXAVMGNIMDDeN791jAOJ7xkAhEJbg4eEBG4RsKIYXoOApFG9CEpMG2mYMwkiGwgDYBQABBgAJvMxnjnl3sQAAAABJRU5ErkJggg==",
    	        "Bookmarksnode.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAB5SURBVHjaYvz//z8DJYAFxiguLiZkUmNvb28DhijIBSBcVFT0HxcAyTU0NIDoBph6GGYi1qn19fUMfHx89UCXNmD1Agxs2bIFhe/j4wPzItwsIG4gyQvo3kH2AkEXYHMNXi9gU0RUNI66YLC4ACm1EQ0YKc3OAAEGACk8j7f3gD1uAAAAAElFTkSuQmCC",
    	        "ZoomOnePage.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAADAFBMVEX///+Kioq49hj///9NgrimwNsY81hiEAACdNkAAAAAAADzlACUABh02dAAAAAACAAAAAAAAAAAAEwACABgAAp3H6gY9jDzZABEABgAOgBXAFwAbwBrAHIAXABvAEYAcgBWACAAaQB3AGUAZQBcAHIAMQAzADIAXABvAFoAbwBPAG0AbgBQAGUAYQBlAGcALgBuAHAAZwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAAAAAACYAAAAGPUfqwH1kHcBABgAAACTEeQAAHYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAK4As6wAAAD1sAAWABgB5QAABJ4SKAAAdpN2jyobACCf6AABALMAAACzrOj11AAjABh3HuAe36UAAHcAAAAAAAAAAAD2WABGABh2kMYY9ljGoAAAdpAAAADo///TAAUAAjcCN9MAABgAAAAwAAAAGPYAAEAAAAAcAAAAGPYAAAAAAAAAAAAAAAAAAAAADAACAAAAAAAAAQH2lAAAABgAAACuAAAv6AAnMJIqAAAAAXRSTlMAQObYZgAAAAFiS0dEAmYLfGQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAA0SURBVHjaY2BEBQwMjMxgwAKh4AIsLCwoAiwsUBGEFmZkLawwQFMV2NyB7lIUv6D7Fh0AAGjKAnyhnaeFAAAAAElFTkSuQmCC",
    	        "Bookmarks.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABmSURBVHjaYvz//z8DJYAFRBQXF5NsSm9vLyPcAKgA0ZqBFsLZTAwUAhZ0Ab/mnQw14UYMLSvPYSjeVOtO2ACYImyKiXIBIZegG4zTAGJdMghdQPdYoF5CQk6epABGSnMjxV4ACDAAoZcyOOj0dmgAAAAASUVORK5CYII=",
    	        "DateTimeButton.png": "data:image/png;base64,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////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AEo/IKkAAACNSURBVHjaZI7BCoQwDESn1bhru4LQ//9EhYpC2mqyB6vgbm7zeBPGbHheCxxyJ9ugBWRcgQyZhUIDi/8K8MG0IFsagNNYZy1FRy2XkWMxCOrYn2CSIgHRCVVjKSYoHHuuP7KMcd/Fp64CG9QxE3epVmx04pFe/bsaQ8/KTKxKgNkgx7WSrmE/0+0DfgcAPbo9DqZGpIwAAAAASUVORK5CYII=",
    	        "GuidButton.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAEZ0FNQQAAsY58+1GTAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAMAUExURf//////zP//mf//Zv//M///AP/M///MzP/Mmf/MZv/MM//MAP+Z//+ZzP+Zmf+ZZv+ZM/+ZAP9m//9mzP9mmf9mZv9mM/9mAP8z//8zzP8zmf8zZv8zM/8zAP8A//8AzP8Amf8AZv8AM/8AAMz//8z/zMz/mcz/Zsz/M8z/AMzM/8zMzMzMmczMZszMM8zMAMyZ/8yZzMyZmcyZZsyZM8yZAMxm/8xmzMxmmcxmZsxmM8xmAMwz/8wzzMwzmcwzZswzM8wzAMwA/8wAzMwAmcwAZswAM8wAAJn//5n/zJn/mZn/Zpn/M5n/AJnM/5nMzJnMmZnMZpnMM5nMAJmZ/5mZzJmZmZmZZpmZM5mZAJlm/5lmzJlmmZlmZplmM5lmAJkz/5kzzJkzmZkzZpkzM5kzAJkA/5kAzJkAmZkAZpkAM5kAAGb//2b/zGb/mWb/Zmb/M2b/AGbM/2bMzGbMmWbMZmbMM2bMAGaZ/2aZzGaZmWaZZmaZM2aZAGZm/2ZmzGZmmWZmZmZmM2ZmAGYz/2YzzGYzmWYzZmYzM2YzAGYA/2YAzGYAmWYAZmYAM2YAADP//zP/zDP/mTP/ZjP/MzP/ADPM/zPMzDPMmTPMZjPMMzPMADOZ/zOZzDOZmTOZZjOZMzOZADNm/zNmzDNmmTNmZjNmMzNmADMz/zMzzDMzmTMzZjMzMzMzADMA/zMAzDMAmTMAZjMAMzMAAAD//wD/zAD/mQD/ZgD/MwD/AADM/wDMzADMmQDMZgDMMwDMAACZ/wCZzACZmQCZZgCZMwCZAABm/wBmzABmmQBmZgBmMwBmAAAz/wAzzAAzmQAzZgAzMwAzAAAA/wAAzAAAmQAAZgAAMwAAAHx6fP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYfrPMAAADadFJOU/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AgwWs3gAAACFJREFUeNpivMmACpgYhrbAfySMXQUjEsZQAQAAAP//AwCocAP5dkyIIAAAAABJRU5ErkJggg==",
    	        "SaveImage.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJZSURBVHjahFNLaBNRFD1pYhLbSZrUOglNjSGFWqyl1cQuRKpYq2JB8IMIVgXFTzc1XYrowk1BEKMbQVSkIBQUpEJVunBlVTCgi4oRddSQNEO1xjaZpGZmMr73TKYJfnrhct68O/e+c868MWiahlLw266cINBPsgOLxPT4aQNFU7FxKYHR3ZtX9+ztbkWzt/6/zZ1HrulrUxHvXhrc2eNrcCL+dQ7jL4V/Nm8N+iueTeT0fVuCTb0+tw1jE+8XYw4tADQ3eSsYnD3Uuw4fkxlYzUacP9aJ5DcJBeINwwIwRZB6RXFsIoqNbe6KAR3+xnq8jUVhrzGjiljjWV7Diit47q8sFEVBOBzOhkKh6iq6ISvAz7yKWs6svzQzm2N4/f5rbDp5B3lF1WvpdFpfswFCUsazNyIcnIVtqgUNa/tu4epIBE8in2Exm7H+8G18iKdYPZPJUIjpX+H7rAopl2cSaBw8Nwq/pw4Xh1/AajGhfVUDWlZ64XXbWV2SJAoJnYGsaJBlFQ7bbwYb2hpRbTWy5jNHu8DX2RGJTmPX4D1Wz2azFESdgaKSAURjScLAgSCMRgNeRUU8fP4JMz8kZOcVnNrTXi5B1BlQzaq6YGJMnMOFG0+xzGnD5Ls4Wn21xPk89ne3lDNI6AxIL/p2bNc9oFqnHg2gf+gxHHYrjOTbTo4c150verAgYejmMLtduXkv1jgTcLlc4Hkel0NdWGKxEoPlintQLsFU+qvIxfAg9SUgpBAQBIFcWNB0cxzHhpWG0vxDQjESxXxQtuchpwVolg0tBWPwS4ABAIqS6H0Z2A6TAAAAAElFTkSuQmCC",
    	        "PrintWithPreview.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALJJREFUeNpi/P//PwMyKCoqQhXABIx9fX1wDgs2FcgK0AzHEGNioBBQbABjYWFhGpAGYWMQ/7aAG8EwUP2wC6TmLBDPYoFqNEZWsLnOA6du36YdMCZITxrIBf8p8sJ/9HgkMvTh0YjkJDiIsldhOP9sN0NKSQuD2tOneA1nsdBRYKjyV8WQiACGaxu7I0M1NaIRlLBwJK6zlKQDeDSSHPBUTYnkuIABIze2bbxNdjoACDAAnPk0mb+5vDsAAAAASUVORK5CYII=",
    	        "Bookmarksroot.png": "data:image/png;base64,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//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AzF4BsAAAAGJJREFUeNqUjkEKgDAMBCch6jeqov9/j0KpfYSXCnqwaHsSh73sMpBI3DvhQTGsf3sA4whuzX26HUeJcoRqMBrHVBlpw/scQGIaiyuKkpafhiEzAzmAcn4Yxrm05acSqbkGAGenLiT/9JfeAAAAAElFTkSuQmCC",
    	        "SendEmail.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAD7SURBVHjaYvz//z8DLtDd3c0JpCYDMRsQZ5WWln5BV8OIywCgZhUgtdrExMSAiYmJ4dSpU3eA/AigIWcJGgDUHAKk5js6OvIADQCLXb58mWHHjh2/gMwaoCHdWA0AagQ5tV1dXb3IwMCAQU5ODsXgjx8/glzCcOHChR1AbhzQoNdwA4CaQapXGBsbW9rZ2TGwsLDgDJujR48yHDt27AXIEMauri7coQgFLs7OWMX37N3LALYG6BR8McFgaGSE3wAQWH7wDoaCSHsVDLEPeV5gWmDSNjDNgk8xMYBkF8BsxjCAbi7AaQBNXQCKSopcAEwnjHgNwGcDIQAQYABQWmVYCvm5cQAAAABJRU5ErkJggg==",
    	        "LastPage.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABeSURBVHjaYvz//z8DJYCJgUKAYoBv0w6szgGJwzBBF+AyhCQvkGIIzjAg1hC8gUiMIQRjgZAhBA3YXOfBSLYBhDTjNYAYzTgNIFYzVgNI0YxhAKmaQYBxwHMjQIABANL8JauSyptCAAAAAElFTkSuQmCC",
    	        "Office2007Blue.SelectedItem.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWJJREFUeNqslb1OwzAQgC/RDR4YbmDI0KESGyzpG1SCgfeAR2JF4hEYGUDqiFiaBQZUJAaGDB08dLghUjjbSePUCSlNT3F8558v5/PFjsqyhK/lfQlHkLPZTRSt3u5KShKgyfUomP55Ap3ngLxhB9ssvG4lhf9hgzDmkK8eBFhIR12s8M4kU+se25PCVVgr7a/v6n01tJxgZvGQ2TVwLuVbxk4PC+IJO6D10MD0Y/Wx7EBgalyEuIndfoLnz7aEImFAJcDWRgzDbPw/rjp63cbG+3ryN6yRXg/riT54COaAWKcAeTUFgBBG4ZKFhY1BLjmxGlzpxeetvLRrt23k2dTYLqvlQX+jkuaP6dIRQtuukLZh85YM0EqhLh0ptP1x2yXjazN4MHeo2zYMCUmsDJLT8YdhIQylzGljYpK5uIwRzKq9naSg1wrodDHugF3PgaYMkbkC3pcvR7kCLmaX0a8AAwDOipVbk6mXKwAAAABJRU5ErkJggg==",
    	        "Windows7.Editor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjalFLdSkJBEJ4Vb6S6KrotepSI7jpBkYSBGWEZqYlZJIFFCJlCddEfZDcJPUA+VCDkjRXWObvTzC5HM49pH+ews7Mz3/yK2OEdAgMRFJBIn1J8KlaBolORgNLcke/0/nS1J5AUfva9zW/CIOBInw7A2k6xpfMDtg02sjfEzpEQHooJrVtNX+iIHLlyngFbmSxc+CghLUQPrtnRKp/FBao2K8uVy7QIBAJWKFnUAfhvEbA/OxOs+8J2lQWu2ZyGgMFvwyNDVjRVgJ8BPBFOnaOLULzY07rVxN/gzn9JMpBoJkJYWD9BlsfGR63aS+1ZmjKEJ/NKooT1d8TXusRg7LQjg7lwDgfKQPiIXoiOjpumdt49CaQjwX6zoSEb4DhOF3lPguWtArpjosmDD3264/ORnNZXH/N6+3oSMHu5lIQPW0Kz2QRwBOSPU6AoiexRydj8VQLXF6HNM/uudHT+mdidfd8d6IeZpUz/KXhhNriv92ByasKaXtzl1PQedDXlv/gWYACo3RPdkUubNwAAAABJRU5ErkJggg==",
    	        "Default.Loading.gif": "data:image/gif;base64,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",
    	        "DropDownButton.png": "data:image/png;base64,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//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AgwWs3gAAACpJREFUeNpivMmACpgY6CHAAqH+MzAwMDAiqWCE8eFaGKF8hBmMtHQYYACNOgIA+vDCDAAAAABJRU5ErkJggg==",
    	        "Bookmarksplus.png": "data:image/png;base64,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",
    	        "SaveExcel.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJySURBVHjahFNdSFNhGH42V7KfmjvUtlxshzFHjCJjq2kX2gxvlIJk0UUGXQkjghXlRUGBdCWYq7Coi368i7KmJBjZzyIMBW8EKSlXri1bBLr2Y+3nnL7zbee00Y/v4eU538d5n/d53u87Mp7nIQZ73NJFwEeyHqvExysLMgEVpUIlgeED7o5Wb6MX9lr7f4t3drukd0UJ7/UdvdhaZ7Yhno5jIvrqn8Xu2saKtYJ093q2etpZA4vroWurKYfLuAv7GtorFJw93NSJ+aX3UK5Rond/P6LLEXA8R/ATeAETUWk9OHkbXDVXQVDPbmQxOzuDGmUN5GQ0Zp25OFSG/auKfD6PQCCQ8fv9KjqDXCGHROo7dOt19IMjfc1Iriyjjt2B3s6bKJ4TTx8Bk8mURCYXGQeHboFRMXRzwBfE4lIEz6cfYPDZJcSIhdNjJ9A9dhKXXweQSlGCiETw+WsMmmoNtSDEOlUNrvqGIZdXYWC0Bxcen6H7TpMLPvcxpNNpYRmTCLL5LPRaA3RKRpLJbNgMm80FjivgzUwIbfY2HNx2CFVyOTKZjFD2RboH2dxP1DKmkgUeLxdCGJ0bgZHdgsX4PJKJbxifuIuHM/fhtjTAkrJLBEUFuSyMuk3QEgtPw+MIfXiBAuksk8ng2L4HCsVaPJkeAreSQZPNIyqISQpy+RwcVgedQYt1LzzWFqKDo2cvWLrDOHAj2IOpqUfQdvSLM/ht4VzwPB3S3I+3cBd2w2AwQK/X01Sr1ehqPkVTjNIpFAnEv4pcDBPewRlG2BkOh53C0EkaNRoNJSon/cNCKWKlHCnbM5FuTiHLSMWgCn4JMAAxeffXf3PoCQAAAABJRU5ErkJggg==",
    	        "Office2010Silver.SelectedItem.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQ5JREFUeNpi/P//P8Plrc3/P1xbx0AJENAKYtD1rmVkubyt5f+H6+sZbKNdKTLw8LL1DJcZGf8zHuox+m8b7shADXB45X4GFgZGRgaGv/+pYiDILIiB/6lqIBMDw79/VDKQiRYuZAK5EIuBOCxhVJ8Ckb6ViynJRKIL4YbdzMGuBx6G2OQ0kDSjGwZm4ApDJkassiCNIENgBqEYhstEoFlMYBfiAMgGoBqGL5aZcBgIDaP/N7LxRhL2SAFhqiYbNmYQj0LT/kNcyMjGzsDAzEwV80BmsYA5zExUMRAEIGHIwkS1MGTilnVjOLrnBsTbFGCQGSCzGEFVwPmDk/9/ebKbIsfxyLgyGNrnMgIEGABSj14mjAo5NQAAAABJRU5ErkJggg==",
    	        "Zoom.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFrSURBVHjaYvz//z8DJYAFmVNcXKwIpEqB2BuI5YD4KRDvAOLu3t7em9gMYIS5AKjZA0itBmIeXl5eBkFBQYbPnz8zvH//HiT9C4jjgIasxGoAULMEkH2VnZ1dKCQkhMHIyAiu4MaNGwwrVqwAGfYFyNUDGnIf2QAmKN0OxELR0dEomkFAQ0ODISUlhYGJiYkHyO1FdwHMAD+Qk7W1tbEGlIyMDIOSkhJYHdC1bCgGAAU4QbaLi4vjDW0xMTEQxQzEoigGAP30HUh/gQYWTgCV/wvEr7F5YffLly8Zbt26hVXz8+fPYXIHgRb+wmZAMcgVy5YtY7h79y6G5gULFjD8/QuynOEevnQQCKQWgdKBoqIiAyhM3rx5w3D//n2QZpAiRqieDqArKjEMgBoCSn2NQGwDxCpADIrz40C8AIjnA7E0uiGMxOYFoOEgAw+gG8JISmbCYkgZI6m5Ec2QNYzkZGdoWIFy7EqAAAMAObWTUmudGf4AAAAASUVORK5CYII=",
    	        "SaveXps.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIrSURBVHjajFPPaxNREP6yu7FuNoayJLuGYK0R7aGChYggngoWhIJSEDxI7UEQ6tWDh970IFIl+Qs81KMoWhEPXnppC4KCehFTkhJJ2BY1qdlssj+f722SZherdWCYeQ/mm2++eS9CCEHfRp5s3qRhnvoE9rHK7GiERaFXKNLw8vLR2NTMqIQTieg/i8+/qu3mQi8+XTwrTwlCFG80F4/L5l+L758eCp0F2v3KZFqcjvPAw08/sb+lcEqRQgwW5k7GaWcCKcpheTqNjR0bHtWGRZdKtNEYnO9+aKBt2AO8I0tlUqmb5NrKLzL3ViP/Y7Ztk3w+b7AF+BpYbncTKZHfk3TDdLBWbiDCRXDxuIxmsxkWcavpYLVm4NbYgVDh5o6Fj1ttlDsWONOGJsYw6XjQdd3f5C4AY6BbLlTKYLXaxvyKjq+2ixsU0BY5PC+6aHsCjE4Hd7IJtFotVlYNrhE2Rc7yDjgLOJMh+PyN4BDP4cE6pcuWY9HxHBtV00XHMFiJFgJwPRfisIScMoRzxxK4XdSwbpm4N/we4xMjeNGSsfQjhi8tC8nuCGEAz/OgBEQcz6oQt+vIXr0EUPFmqM6PanVUBBfbXQbhEV5fSEE+yA0U5CPIpuXBmb78ZEZGkqbPuhoMGFxf++6/LqmoY9Z6B1VVoSiK75Ik/bFWPThC/1cVCoUMDbkS81Ipx3Lqh+PxuA8UBDX2GqF3wXw5cJeh3XLMA6B98xn8FmAAIkoRdAESmpMAAAAASUVORK5CYII=",
    	        "WindowsXP.SelectedItem.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEpJREFUeNpiNMo+ykAuYGKgAIxqpoXms1OsgIgczRBtxjnHiNKMbA8enUDAiDWFITsSl06czoZrwKMTCFhwSeDXNprChphmgAADAHiYFoh8fAnfAAAAAElFTkSuQmCC",
    	        "BookmarksplusBottom.png": "data:image/png;base64,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",
    	        "PrintPdf.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAARNJREFUeNpi/P//PwMyKCoqQhXABIx9fX1wDgs2FcgK0AzHEGNioBBQbABjYWFhGpAGYWMQ/7aAG8EwUP2wC6TmLBDPYoFqBGGG7E2bgOQmRnQdynfuwNm+TTtgTJCeNMaWtdfx2lgdpIE18FBiAaQIBP6+fs3wrqeHQbSzE8xvXXeD9ED89eAB+bHALCrKwMTNTb4Bv27eZGBkZ2f4tGIFRsLCkbjOohjwbf9+BpGqKobf9+8zfD91ioHt22d8lsOjEQ6+nznD8OflSwYmfn6GLzt2MKi9AZofY4qRDjBiART6n5YtY+D182PgAWIYuAKMBX8CYQA24G1HBwOHoSGKZnwAIzfOtk6F8HDEO76EBBBgALdIW6xGfnkkAAAAAElFTkSuQmCC",
    	        "SaveDocument.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIjSURBVHjaYvz//z8DDLg4N6cBqUwgNmAgAPbsrWUE0SxQjZxAaqOrm76ru4cBg4KiGF7NIYHdcDYLlF5dWRPsKijAy3Dn1muGs6ce4dQcFG6CwmcB2h5iYanmLSTIzbB6+WFCLmf4/9+YQVZWBsUF1QHBFgw3rr1i4OBgZahpCGV4/uwdw/9//xmePXvPAAqj50D63z8IvXTBAQZJcXYUAwzk5EQZjh+6x8DHz8XABAwaaWkhsKSMrDBWV/z584dhwoQJ3woKCrjAYfAXaPrv338ZBAQ4wQo+f/7JUFWxE2gQH4MUED95/JGhqsYRbsDnz5/hbCYQ8f71d4b7D14CDeAGCz59+glMBwRpM8jI8DM8eHSXoa1lP1zTly9fQNQjuAF///5n+PnzN9ALEBc8gxogwM/BoKUFiVKQIS1N+8Dsr1+/gu2BR+O/f/+AXvgDd8H6dVcZ/AO04DY2NYYz3Lv3juHKlZdg/rdv30DUC7gLQCH+9+9fuAGQAORHCbjlyy4yCAtzIXsBYcA/sAH/GPj4OOEaXrz4hBH6kpK8yC5AeAGUHYqKAsDRCAKVVQ4MCxYcZTh29BaY//zZbzAtJs6DHAYv4AaUl88Bpy51NUEGLR0mBnFxcYbIKA0GMTExBm5ubgyXIHuBBZargAlDmoHho/G9ewxAfM8YKATCEjw8PGCDQIaCaBDG8AIUPIXiTUhi0kDbjEEYyVB4MIEIgAADAGah1p0mdsdVAAAAAElFTkSuQmCC",
    	        "Office2010Black.Loading.gif": "data:image/gif;base64,R0lGODlhEAAQAOZZAJKSkoCAgO3t7ezs7N3d3fj4+PHx8dvb2+fn5/r6+vT09L29veLi4srKyvn5+fv7+5ycnPz8/PLy8tfX17m5udTU1K2traioqP39/YaGhuTk5PDw8PPz85eXl9XV1aysrLi4uM3NzeHh4Y2Njbq6uvb29u/v74yMjNHR0Z2dnebm5tra2vX19cbGxurq6szMzN7e3sjIyKWlpcnJycvLy4eHh6mpqZiYmJWVlYSEhODg4Kenp6qqqrCwsLu7u4GBgb6+vujo6JOTk+np6dzc3J+fn7Kyst/f37e3t7S0tO7u7r+/v8HBwff39+Xl5bGxsZ6enuPj48fHx6SkpLa2ttnZ2f7+/uvr6////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgBZACwAAAAAEAAQAAAHmIBYgoMoGTUTg4lYVi4GVjUBASOKglYWAEJVGZEnlFguAKE8HicjBJ4KHaE+nooMRkwJrYIwOxcMrQUDAw42U1MWrQNXVwIXvx/CxAIiHxYIuQICslgqLSgPiRgIIhKDClThFYlDVeYOggLhVDRXMw0CGuZVJZUxVCADDVJSISwrVRhYGWTFQAEs+6S8wPLgYCsBL0JsoBQIACH5BAUKAFkALAAAAAAQABAAAAeggFiCgxMdNwSDiVhWAgpWNwAAKVgmKlaDViRTMkcdkRAVPwFFl1hKU6ggBxApDBABsAiCJReoLYk9sBkSgwhANA+JDkhTiFgaIBRBisxYJFRUC82KFNDS070LC1fYigMVRBGJVhwmBYNNMVJSMIkcV/DiWAbrUhMGKwccBvBXCYMepMwwcKBKFQIJBlzZoEiBAywFD2LBEGyaBAIEWDALBAAh+QQFCgBZACwAAAAAEAAQAAAHmoBYgoMwFzYMg4lYVgYlVjZTUxZYBi5Wg1YxVFROF5EfK0IAFpeUm1QtIh8WCDwAry6CBRSbKIk+rx0Kg1c0HhGJCUxPiFhXMw0CioMoORkTDVJSIcuLNQEBI9FSL9VWGdgnAi8hG9VYHicjBIISIggY54MOVfVD8oIl9VUaBQMDDs4xqLKCxYArV5SdK/AAy8GE+GQJEJBgWSAAIfkEBQoAWQAsAAAAABAAEAAAB6CAWIKDGhQkQYOJggoFViRUVAtYCgJWiR5SMVcUkAs6MlMklpNSpRUICwtXIFOtSoIODaVEiS2tFyWDGxNHEYkPNEAIggYrBxyKgxM4HQQHVVUEyVhWNwAAKc/R01Yd1xASBAQs01gHECkMggUmHKPrPRAVgxFX9siDSQEBPwOCCfauGEgkY18AHbquDEiQCEaOAFB8DXqAIZkEFe/KTQsEACH5BAUKAFkALAAAAAAQABAAAAebgFiCg1cNDQKDiYIFCVgNUlIhWCUGVokMVVUSj1IvKlRUMZZYBZlVIgIvIRstoFQGgg8HmQiJKKAUBYMsGi4YiREeNFeLAwMOioMwOxcMA1dXiMlWNlNTFs/RyVhWF9YfBQICjdsiHxa124IOPjwr6olLAABCJtsoORkTRvMAGtM1AgQYEQUHgA8RpmUQeAKLAhejknk4MYJAskAAIfkEBQoAWQAsAAAAABAAEAAAB6OAWIKDBgcHHIOJgg8RWAdVVQRYBQqKG1dXBY+RAzFSHoMPmFcmEgQELBVSq5VYGAOYiINEqw0OgwkGClaJEUcTG4rCgxogFEHDiVYkVFQLyYNWFM3P0IIICwtXghUQPQWJCS0gOoMDPwEBSYkzU1MyBoI66QEyEzgdBEDuU0OCVkUC5CBwAwCAFAh2TKGAIZoKCVY6GISApYQAXsMOQEjBQFggACH5BAUKAFkALAAAAAAQABAAAAeZgFiCgwUDAw6DiYoDV1cCWAkFiomMjhJVVQyTggUCAgkimFWSm4MImAcPpYMYLhosgig5GROlVzMNAjUBASOlDVJSIRm8J7/BLx4nIwSlAi8hG4IrPD6Igw8oLSqDJkIAAEuJFVTlCoIa4ABGMDsXDDTlVI9YVhYAOAw2U1MWAyBUpGAYZMWFAisX+H3AUsCAlVIiPlhAMCkQACH5BAUKAFkALAAAAAAQABAAAAehgFiCg4SFg1YqJoYRD4RWRQE/FYQFV1cbgwgBmxCEJpZXjVgSGZs9hByWAxiDBDJIDo4KBgmCEzgdBIaCBisHHDcAACm7WAdVVQQdwp27x8kHECkMxRIEBCyCOiAttYMRRBUDgwYyU1MzhDBSUjFNgkPnU0AaIBRBE+xSBoJWJFM7VJCgQmWBgRlSKlg5JKCEFQoEF2BxoKAYFgQLFlwxFAgAOw==",
    	        "PrevPage.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABaSURBVHjaYvz//z8DJYCRUgMYQAYQg30at//HJs5EjCW+TTtwOpOJEs0EDSCkGa8BxGjGaQCxmnEasLnOg5EiA0gxBG8gEmMIwWgkaAilKZFxwDMTxQYABBgAlEaAOxX1tRYAAAAASUVORK5CYII=",
    	        "ArrowLeft.png": "data:image/png;base64,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",
    	        "ArrowDown.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAMAAACgjTZZAAADAFBMVEX///9mZmZqa2twcHF2dnZ7fHyBgYGGhoeKi4uOjo7///9ub27Y2Nng4ODp6enw8PH29vaNjY53d3fk5OTt7e309PSLjIyAgYDw8fCJiouHiYkAbwBrAHIAXAByAEEAcgB3AG8ARAB3AG8AbgBwAC4AbgAAAGcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAAAAAACYAAAAGPUJqwH1kHcBABgAAABUEeQAAHYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAL8AwsEAAAD1sAAEABgCtAAAAIkSKAAAdlR2UCobACCv0AABAMIAAADCwSD11AAjABh3COAI36UAAHcAAAAAAAAAAAD2WABGABh2UcYY9ljGoAAAdlEAAAAw///w4ALgAjACMPAAABgAAAAwAAAAGPYAAEAAAAAcAAAAGPYAAAAAAAAAAAAAAAAAAAAADAACAAAAAAAAAQH2lAAAABgAAAC/AADYiAB/Y8jCAAAAAXRSTlMAQObYZgAAAAFiS0dECfHZpewAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAtSURBVHjaY2BkYmZhZWPn4GRg4Obh5eMXEGQAAiFhEVExBjAQl5BkgAIpEAEAI5sBViE2gUcAAAAASUVORK5CYII=",
    	        "ViewMode.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFaSURBVHjalFMxa4NAGH2murhkzFCiP6A4BoLQsTgEusYx0J8Q8iOMZA+lnVw6dQiIhW6aNSZQFAyECqZkzipJ2u+kDqH1bD94vLvv3ffu07sTxuPxJzgxGo0Eng5mUBVM+9ZRhQZqgjqAbduVXdYaUHHJv5qIdbvXRaXB6XRCEAQIwxC73Q7tdhtpmt5NJpPH2k84Ho+YTqeYzWbYbrfFnIqZ9DAcDp9qDXzfx2azQavVwmAwgGVZME0TsiwzuU8mfa7BcrksuNfrQdM0iKKITqcDwzDKJXyD/X5fsKqqZ3lFUcrhJdeg2WwWnCTJWX69XpfDD66BrusFu66L1WqFw+GA+XwOz/PKJffcY+x2u4jjGFEUwXGcH4dEyMuJUPWY2CViuy4WC2RZBkmSkOf5K0k37DcRrulOvAnsQfw16PguiJ4Jt4SYDK4a+EdQAWvfJLwQ3lnuS4ABAMfktPVY3F2lAAAAAElFTkSuQmCC",
    	        "Office2007Blue.Editor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGISURBVHjalFLdSkJBEJ4Vb6S6KrotepSI7jpBkYSBGWEZqYlZJIFFCJlCddEfZDcJPUA+VCDkjRXWObvTzC5HM49pH+ews7Mz3/yK2OEdAgMRFJBIn1J8KlaBolORgNLcke/0/nS1J5AUfva9zW/CIOBInw7A2k6xpfMDtg02sjfEzpEQHooJrVtNX+iIHLlyngFbmSxc+CghLUQPrtnRKp/FBao2K8uVy7QIBAJWKFnUAfhvEbA/OxOs+8J2lQWu2ZyGgMFvwyNDVjRVgJ8BPBFOnaOLULzY07rVxN/gzn9JMpBoJkJYWD9BlsfGR63aS+1ZmjKEJ/NKooT1d8TXusRg7LQjg7lwDgfKQPiIXoiOjpumdt49CaQjwX6zoSEb4DhOF3lPguWtArpjosmDD3264/ORnNZXH/N6+3oSMHu5lIQPW0Kz2QRwBOSPU6AoiexRydj8VQLXF6HNM/uudHT+mdidfd8d6IeZpUz/KXhhNriv92ByasKaXtzl1PQedDXlv/gWYACo3RPdkUubNwAAAABJRU5ErkJggg==",
    	        "HelpIcon.png": "data:image/png;base64,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",
    	        "WholeReport.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACISURBVHjaYixbPt2egYGhC4jNGIgHp4C4DIgPsgCJFUAswUAaMIPqk2RB1twZkYGiqnzFDKxiUADWx4Ru9PKDd8CYkBgMsKALRNqrMBAjBgMD7wJGYDT+ZyAfMKK4gMRYYBiNBUQsPAHS0mTEwFMglgF5IQWIX5Co+QVUH9gLO0C5ityEABBgAK7WRrrRnAlbAAAAAElFTkSuQmCC",
    	        "Bookmarksjoin.png": "data:image/png;base64,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",
    	        "FullScreen.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABhSURBVHjaYvz//z8DJYClu7ubbBNKS0sZWaAMkjUDLYa4ACaQs/gW0ZqnxKrB2UwMFAIWdIFWPzUUfvWmW6QZQEgDyS4gZPgwcAH1ohE5cZBsACxZkgMYKc2NFIcBQIABAGIsIfw8AuswAAAAAElFTkSuQmCC",
    	        "Design.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAADAFBMVEX///+AgIC49hhNgrj////AwMDnjkZiEAACdesAAAAAAADzlACUABh169AAAAAACAAAAAAAAAAAADoACABgAAp28KgY9jDzZABEABgAOgBXAFwAbwBrAHIAXABvAEYAcgBWACAAaQB3AGUAZQBcAHIARABzAGUAaQBuAGcALgBuAHAAZwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAAAAAACYAAAAGPXwqwH1kHYBABgAAABwEeQAAHYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQADAANToAAAD1sAAKABgDgwAABTYSKAAAdnB2bCobACAiQAABADUAAAA1Ogj11AAjABh27+Dv36UAAHYAAAAAAAAAAAD2WABGABh2bcYY9ljGoAAAdm0AAAAA//9DEAYQAm8Cb0MAABgAAAAwAAAAGPYAAEAAAAAcAAAAGPYAAAAAAAAAAAAAAAAAAAAADAACAAAAAAAAAQH2lAAAABgAAAAwAAB7SABTW8N7AAAAAXRSTlMAQObYZgAAAAFiS0dEAxEMTPIAAAAJcEhZcwAALiMAAC4jAXilP3YAAABQSURBVHjabc5LDgAhCANQmxbvf+SRTwiawbjgidWFNYpnYwhJhxbRBS2kaiLFj5UZIYz5CgWs+3zF1H1kWOVNoOwB6//suw7oWg6z9s+Vpz7MJAIcoKu7VQAAAABJRU5ErkJggg==",
    	        "Save.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABuSURBVHjaYvz//z8DJYAFxuiMXP2fIgNgoHx5KFEagRaCaSYGCsFwNGD7zDMMoKiFYXQAEgOpwRkLlw7cB2O6eYEFm2DZshA4m5GREcMLXVFraOwCGIDZhOwiqocBIyyqgGm7AUjVk20AuQAgwADdIi9FIVmdsQAAAABJRU5ErkJggg==",
    	        "Office2003.Loading.gif": "data:image/gif;base64,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",
    	        "Office2007Black.SelectedItem.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWJJREFUeNqslb1OwzAQgC/RDR4YbmDI0KESGyzpG1SCgfeAR2JF4hEYGUDqiFiaBQZUJAaGDB08dLghUjjbSePUCSlNT3F8558v5/PFjsqyhK/lfQlHkLPZTRSt3u5KShKgyfUomP55Ap3ngLxhB9ssvG4lhf9hgzDmkK8eBFhIR12s8M4kU+se25PCVVgr7a/v6n01tJxgZvGQ2TVwLuVbxk4PC+IJO6D10MD0Y/Wx7EBgalyEuIndfoLnz7aEImFAJcDWRgzDbPw/rjp63cbG+3ryN6yRXg/riT54COaAWKcAeTUFgBBG4ZKFhY1BLjmxGlzpxeetvLRrt23k2dTYLqvlQX+jkuaP6dIRQtuukLZh85YM0EqhLh0ptP1x2yXjazN4MHeo2zYMCUmsDJLT8YdhIQylzGljYpK5uIwRzKq9naSg1wrodDHugF3PgaYMkbkC3pcvR7kCLmaX0a8AAwDOipVbk6mXKwAAAABJRU5ErkJggg==",
    	        "BookmarksfolderOpen.png": "data:image/png;base64,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////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ALLDDRIAAABlSURBVHjaXI85DsAgDAQHRMsXkpb/PyhSzg9EkcIlUrgI2N2O1/baXIxllcZxA74HLbD2jifAvKUK4nQATNJdEHC+RUDOciWXf4W3sEeVo3bSYzmiSppV9JaGCWzTv3gFjH7/GwAJKxnAgmMegQAAAABJRU5ErkJggg==",
    	        "SaveHtml.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAI6SURBVHjahFNNaBNBGH1JJtl2d1OiTTbBRQ3+UYu0xVy8ipYKHvQgOdQKQkUUPORUDzl56E0lBw8eevPoQetFEASRYj0Vi1CKJFtRYmKaNjXZrEm62XR2uplu8KcD377Z+eZ7+76f9XQ6HXSXJz1/m8JdamPYZ3Vmr3hsJE5gP4X5yRF1fGpUxbAS/G9w/NFbvicOPp+7OjquhiSsVppYLJX/GXxzeLDnndCvX5s4GbmsBgN4+P7LfspxfegARo7GehSkbyUO49PmNqSADy+mziG7ocOipck5mN2sw6KbHMXHH9YQ8Zk9BGPHQiIWihWERQFeWppTYZk5hyLyX1WYpolMJmOkUimR1aDZ7qBhthGWAj0Xcz9K0BstrG/VcPHsaX5eq9X43ms/Wm0LL5e/QpEE7tAK64jHwjgTP4QBsQ9zrxe4T9d1G75xgqVK224mV/BxVUN4QIbP66Vy25D7BRwMiniztML89Xrdhjxv4+9tC4QQKPKuguXsd6iDIfzcqqJqNFCj1qJEa4Xd9hqGYUNxj4A6BT/hKfyiAYsrGvzEh3qjCVEIoFzVIRDiTsFNYEEI+HkKM8kJ3Jh9iuNHVEbCLvq8uJc871aQ5zVoUoILJ6KsjWzOae+fpe9Ar5SRL5YQ7BNwP3mJF9GpwZ6CJ+8+s+maLm9gUiogGo1CURQ8mE5CkqQ/5qAnhe5fRQdDhYGEBmqalqBHtsVkWWZkXVLb3CkQF3HesVeuM5V+LWGbi7S7mIIdAQYAZ8nb628WxXMAAAAASUVORK5CYII=",
    	        "ZoomPageWidth.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAADAFBMVEX///+Kioq49hj///+mwNtNgrgY81hiEAACdNkAAAAAAADzlACUABh02dAAAAAACAAAAAAAAAAAAFAACABgAAp3H6gY9jDzZABEABgAOgBXAFwAbwBrAHIAXABvAEYAcgBWACAAaQB3AGUAZQBcAHIAMQAzADIAXABvAFoAbwBQAG0AYQBlAGcAVwBkAGkAdAAuAGgAcABnAG4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAAAAAACYAAAAGPUfqwH1kHcBABgAAACTEeQAAHYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIALUAukMAAAD1sAAMABgC+QAABKsSKAAAdpN2jyobACAvyAABALoAAAC6Q0D11AAjABh3HuAe36UAAHcAAAAAAAAAAAD2WABGABh2kMYY9ljGoAAAdpAAAAA///9XCAIIBdwF3FcAABgAAAAwAAAAGPYAAEAAAAAcAAAAGPYAAAAAAAAAAAAAAAAAAAAADAACAAAAAAAAAQH2lAAAABgAAAC1AAD+wAD3WKoHAAAAAXRSTlMAQObYZgAAAAFiS0dEAmYLfGQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAA4SURBVHjaY2BEBQwMjMzIAJcACwTgVsEKVcEKFWBlhUoDGSABVla4ClZWrCowzSDHHWgC6L5FBwBoOQJ7wAJr3QAAAABJRU5ErkJggg==",
    	        "Bookmarksfolder.png": "data:image/png;base64,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////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFYmD64AAABESURBVHjaYnzAgAqY0PgMLAw/GBgYOJAFWBgZ/iKr+MfIwMD8+99/KJ+DBWISE9xIDEPpI8DyC5XPwcKBpoIR3fuAAQAswAj/CTKo6wAAAABJRU5ErkJggg==",
    	        "SaveOds.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIuSURBVHjajJNfaNNQFMa/ZbWxppa5pa11MtENi6g4LTIRQcacL8IoUp34JoNh8c0nseKbvkkrzPkm+DYYCioTxx6dK65zVBRxOjJ06x+qpdU0WdusjTdpetcy6zxw+E5C7u+e757cJlVVUY3AQ/swET/JbmwSd/w/mjQ1GQstRJ4ddfv6jx24CGer+5+L7z46QmuToeMXzgT7+TYXsvIXfI7PNly83zVY92wiu/vce3rP2bbbEf4U2qxzdDq94Hl7XQeB44cuIZ2bxxYTh4GeMfySFqGqZWQlwdAloiVdIwuj2O3qXCfeHOXVRDasTkWvqq/e+dX/CUVR1GAwKGsDYDTIWllGvijCYm7ToanMAn5LiYY2RFGktQ4olfIIz01iG1vxthSfwf2xU3g5cxvKWn4DIJfLafKdApLZCECmamErHfQcvILrl2chr6bxeGIQopxCUZEoQJL0OkbHWFRkcoBm0oGDfpRIf4Cv7wFeR0cw8SaA5eQcdtg6sHfXSbQwffq+FFAgAJZlqQUt3n99AmFlGmdP3ELi50fwLV1YLWTwLfEWmbhMAbqFQlECa95KD1EL7+l7WE7NY2S8Fy+mb4BhGNg4Fw53eSHLcr0FRcljX0c3AbRSQDNjxtDA079OwTiDdQuR6JT+d002X0M5eR5OpxMOh0NPjuMaTaECqN6qUCjUvhiDBxA8giAQ1WrstFqtOqgWusGCETEjn9e8aye7ebSsgVZD7+CPAAMAKJ4Ef5Y1810AAAAASUVORK5CYII=",
    	        "Designer.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAK0SURBVHjaYmxoaGAAgglAXMBABqivr4ez/Zp3qgOpRUAcuqnW/RFIjAkqlw+1hGTw69cvMAYargXkHgBiMyA+DOTLIVsAs2QyOZZ8+PprjbeJzHEgUwIqBDJ8NYjBgqY2B0rnEmt4SOd+LSEedtsCPy0+FUk+hunbbzD8+vPvBVAqDt0HyJZMI8bws0wWoGDZ++7LT7GG5RcY3n3+yZDorPoNKOYAjIOb2HwAA5lQOouQ4bBg+ff/P8PiA3efApnOa8odb8LUMeFxIMiSmXgMP4AU5iCAYTguC5CDJw3dEiTDRdENBwULGxsbAwjjsyAbLTWBLJlDwHB4mKMDXHGQh5aakr8w8AkAaTscht/BFc5MeHJoHizzOXmHMDzl1A3GYrgtPsPxWgDKnZWVlYWfGPmXTN/3nOHLz78M6IYb/ztxn1BSZsEnWTTvlMkjRk13BiTDWRl+Maj8u3mci+HrI2LyCjYf/AfhBw8e/E90Uj5triYKDxY2hp8MpT7KDMmRfiFA7nwgZibHAjD4/OMvw9RtNxkibRUZjJWFwYaX+KgwCHGzMCxfvhykJBZkSWNjIzNZFlx49JXhDTDrN626yGCnJcZQ5K2MbDgMgCxZhM8ScByk8x1jZGBgZPn/5ycrKIQYmVgYMs6brbPWlNS6fONehubelgP//0HiIZ2HmeH/399A1WwM///8YmBkZmX4/+8P2/OegwyMjIxAuT8MkmUHv7/odwerZ/wPLEOgnP/INrPLmzAw8Qgx/Hp4juHvlzckFd8ShTsZYRYwgCx43ucGwv9hgApshue9rmBzwXEA8haaC0hii+duwvQGKEiBGGwBM58YAyWAkYUdS1r/zyAQ0ASJg39f3jK8mh31n4FKABQHP++eYGBXtoBYAASLgRgUTl+pZAeoVlwJT0W0BAABBgBNYEtP4534wwAAAABJRU5ErkJggg==",
    	        "RemoveItemButton.png": "data:image/png;base64,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//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AgwWs3gAAAE5JREFUeNqkjsEJwDAMA8+hO9YjVrtkgUJ2UR8pOPm29zBYoLPjZqfxLbBrNoCQwYqqpGwlAPGe7SM3qcc0wDF3JddZDish5dXx+/WVZwBwlxrSVfhUbAAAAABJRU5ErkJggg==",
    	        "FirstPage.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABdSURBVHjaYvz//z8DJYCJgUKAYoBv047/MIxNMTZxol2Ay1AmSjQTZQA+zQQNIKQZrwHEaMZrwOY6D0aK0wExhhAMREKGEBWN+AwhOiHhMoSkvIDNEMYBz40AAQYAaKwlq7Pf/SYAAAAASUVORK5CYII=",
    	        "Loading.gif": "data:image/gif;base64,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",
    	        "SavePdf.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAISSURBVHjahFNNSxtRFD2TmX7EGYc4kZlEaSkuQsRNIPgHhBChXaqtdGFBaDV/QESycONqINm0WEoXraAUu6kUbLvwB5TuWxQmqdo6GKkpSUbDjHl9bzBjJqZ64XLvnMc975w373GEEDTjhyA8pWWWZgLXRNxxOFY5RkAHg7T/IE9MpOTJSdwcHLxy2IjHPQLhHFuPLC+numIxkP19kK2t/w5zIyO+b4HuPiam0/d5Ovxnbe065VDaCWgu9MzMgCsUwAWD0HQdNlWBRsOrzt4emFVWcXyM8NzcBcN3nif1nR1S1nVSWlwk7eEcmMQxTR9m2zbJ5XIWIw0wEnJ6CseyEAiFLkk+ms+icC/mwyqVite7BPXtbRwtLYFXlA6uCThR8iHVapWVXY+AnJyAnJ2B76CgtvkZ0mjKj9VqrPxq/Y3gZRmNctm/07v3ENMperiiD7eoXRqmp8Al6O3FjYEBEMdBWc9jNzGMw2cZaG9e0zUFtY2P7RbaCMJhCH19OJyeRSmbhW0UIY2P4e/zl9TGJ/x++BjW5pdWBX4LoUwGjWgU6qsX6H40ji7mm3NvK+TpJ/g5lEBpfgHRu3eaZ2B6BAdTU+7lWF9Zgaqq0DQNarHo9qIogrt9C5HVt6h//YaA3O2zIDQfRT6f76crSbqYNAwjSSGWEUmSLkgfjEJQejpbOAdYbrRg/dXLpM1wFfwTYACL7fo6Ia6/rQAAAABJRU5ErkJggg==",
    	        "SavePpt2007.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKBSURBVHjahFNfSFNRGP/ds7vpdJXRujq3KJRqVOLUpyX1UAhFPQQZYgY+CEJBuJ5FSHvtYe6l3oIeIumhLOkhjCiohxFYZqBm2xRlkaJr7d7N3d1zOvfsj47IPvjud+459/f7ft/3nSsxxlC0TFdNPw/XufvwH6scS0hmlAtAOw/jxN/ZYWnvguT27gjO3moqreVCfCL3hTpYtRv6/Hewj1P/BFdcvFL2LvPsnaTp7IVNuwuW0GWxKe2QnZ27BMnjLVMwSE5fA5n7CtvjhNjUY1GAUmzGYvm4uCjinugjGPf7wJZnywh8cB4EfR8G4anp0hTI9Etg04Dd2QAQArunAkynIC23IVXvAjnSjGAwqAUCgSrRA5bLgmXSgtGYeY3c2zHe5v2QDiSRi8+CxuZBF1bB0jon2Av2Yrq8iXRtFZk343AMB/mH03wKLbDduMdPZdj4mFlyA+k7N6FPTnDSOvxOpUzYkvkg+bQ6DJtV1Gl8+wJrz4gAg4PTD4eRutoO+8AIpBoFpLYeqqqaqJWSAsZygFMBjS+AJZKA3SHAdDkCPfwMsKqgiWUQ/3GQynpommbCfpQUMGaAudxc/idQjasJTwoC4j6Eqt5R2E71gm2okPedAFFcSOVL2CIAJwCXlpv7DKZlkQkNiVJMEmvrSS5/CLK3GdmJMRCXp6hgWwkwsNvnA6EE1jPdMGZnoA32w9JwDHKrH3Qxiuyrp6A/4/kerKolBYKAPBgQt8t29wNwvkdkzisz+xAD/bXOyQ6Drq/B0ngUqei7LYLiX8UvhhujoTa+3O51DocDiqKgtrEFil+BwifxVwkFWyn48217bt6wNtMjkUiRtGhCwR8BBgCHORFPWdwk0wAAAABJRU5ErkJggg==",
    	        "PrintWithoutPreview.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAC2SURBVHjaYiwqKmJAA/8Z8ANGZA4LNhW9vb1YdRYXF2OIMTFQCCg2gBEYBvZAuguIzUBO92veiVfDplp3mFdOAXEZKAxWALEEsgIigRlIL8gF/6keBiCv4IoJogOxfMUMogxhwRfvMEOwxT9yLDxhMVWVxmdLZ0QGroT0FOSFFELOBLkEC3gB0gsyYAchA2AugHqXEZofJEF6WaAKGNEzE8xWZM1ExQKyP7FpRg8HRkqzM0CAAQBaqzs4D+6nowAAAABJRU5ErkJggg==",
    	        "Office2010.SelectedItem.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQ5JREFUeNpi/P//P8Plrc3/P1xbx0AJENAKYtD1rmVkubyt5f+H6+sZbKNdKTLw8LL1DJcZGf8zHuox+m8b7shADXB45X4GFgZGRgaGv/+pYiDILIiB/6lqIBMDw79/VDKQiRYuZAK5EIuBOCxhVJ8Ckb6ViynJRKIL4YbdzMGuBx6G2OQ0kDSjGwZm4ApDJkassiCNIENgBqEYhstEoFlMYBfiAMgGoBqGL5aZcBgIDaP/N7LxRhL2SAFhqiYbNmYQj0LT/kNcyMjGzsDAzEwV80BmsYA5zExUMRAEIGHIwkS1MGTilnVjOLrnBsTbFGCQGSCzGEFVwPmDk/9/ebKbIsfxyLgyGNrnMgIEGABSj14mjAo5NQAAAABJRU5ErkJggg=="
    	    },
    	    "months": [
    	        "January",
    	        "February",
    	        "March",
    	        "April",
    	        "May",
    	        "June",
    	        "July",
    	        "August",
    	        "September",
    	        "October",
    	        "November",
    	        "December"
    	    ],
    	    "dayOfWeek": [
    	        "Monday",
    	        "Tuesday",
    	        "Wednesday",
    	        "Thursday",
    	        "Friday",
    	        "Saturday",
    	        "Sunday"
    	    ],
    	    "encodingData": [
    	        {
    	            "value": "UTF-8",
    	            "key": "UTF-8"
    	        },
    	        {
    	            "value": "UTF-16",
    	            "key": "UTF-16"
    	        },
    	        {
    	            "value": "US-ASCII",
    	            "key": "US-ASCII"
    	        },
    	        {
    	            "value": "IBM437",
    	            "key": "IBM437"
    	        },
    	        {
    	            "value": "IBM850",
    	            "key": "IBM850"
    	        },
    	        {
    	            "value": "IBM852",
    	            "key": "IBM852"
    	        },
    	        {
    	            "value": "IBM857",
    	            "key": "IBM857"
    	        },
    	        {
    	            "value": "IBM860",
    	            "key": "IBM860"
    	        },
    	        {
    	            "value": "IBM861",
    	            "key": "IBM861"
    	        },
    	        {
    	            "value": "IBM862",
    	            "key": "IBM862"
    	        },
    	        {
    	            "value": "IBM863",
    	            "key": "IBM863"
    	        },
    	        {
    	            "value": "IBM865",
    	            "key": "IBM865"
    	        },
    	        {
    	            "value": "IBM866",
    	            "key": "IBM866"
    	        },
    	        {
    	            "value": "IBM869",
    	            "key": "IBM869"
    	        },
    	        {
    	            "value": "windows-1251",
    	            "key": "windows-1251"
    	        },
    	        {
    	            "value": "windows-1252",
    	            "key": "windows-1252"
    	        }
    	    ]
    	}
    // Controls
    this.controls = {};
    this.controls.head = document.getElementsByTagName("head")[0];
    this.controls.viewer = document.getElementById(this.options.viewerId);
    this.controls.mainPanel = document.getElementById(this.options.viewerId + "_MvcViewerMainPanel");
    
    // Actions
    if (!this.options.actions.printReport) this.options.actions.printReport = this.options.actions.viewerEvent;
    if (!this.options.actions.exportReport) this.options.actions.exportReport = this.options.actions.viewerEvent;
    if (!this.options.actions.interaction) this.options.actions.interaction = this.options.actions.viewerEvent;

    // Render MvcViewer styles into HEAD
    if (this.options.requestStylesUrl) {
        var stylesUrl = this.options.requestStylesUrl.replace("{action}", this.options.actions.viewerEvent);
        stylesUrl += stylesUrl.indexOf("?") > 0 ? "&" : "?";
        stylesUrl += "mvcviewer_resource=styles&mvcviewer_theme=" + this.options.theme + "&mvcviewer_version=" + this.options.shortProductVersion;

        var viewerStyles = document.createElement("link");
        viewerStyles.setAttribute("type", "text/css");
        viewerStyles.setAttribute("rel", "stylesheet");
        viewerStyles.setAttribute("href", stylesUrl);
        this.controls.head.appendChild(viewerStyles);
    }
    
    this.InitializeMvcViewer();
    this.InitializeToolBar();
    this.InitializeDrillDownPanel();
    this.InitializeDisabledPanels();
    this.InitializeAboutPanel();
    this.InitializeReportPanel();
    this.InitializeProcessImage();    
    this.InitializeDatePicker();
    this.InitializeToolTip();
    if (this.options.toolbar.showSaveButton && this.options.toolbar.visible) this.InitializeSaveMenu();
    if (this.options.toolbar.showSendEmailButton && this.options.toolbar.visible) this.InitializeSendEmailMenu();
    if (this.options.toolbar.showPrintButton && this.options.toolbar.visible) this.InitializePrintMenu();
    if (this.options.toolbar.showZoomButton && this.options.toolbar.visible) this.InitializeZoomMenu();
    if (this.options.toolbar.showViewModeButton && this.options.toolbar.visible) this.InitializeViewModeMenu();
    if (this.options.exports.showExportDialog || this.options.email.showExportDialog) this.InitializeExportForm();
    if (this.options.toolbar.showSendEmailButton && this.options.email.showEmailDialog && this.options.toolbar.visible) this.InitializeSendEmailForm();
    this.addHoverEventsToMenus();

    var jsObject = this;
    if (!this.options.isTouchDevice) {
        document.onmouseup = function (event) { jsObject.DocumentMouseUp(event); }
        document.onmousemove = function (event) { jsObject.DocumentMouseMove(event); };
    }

    this.controls.viewer.style.top = 0;
    this.controls.viewer.style.right = 0;
    this.controls.viewer.style.bottom = 0;
    this.controls.viewer.style.left = 0;

    this.options.appearance.userScrollbarsMode = this.options.appearance.scrollbarsMode;
    this.changeFullScreenMode(this.options.appearance.fullScreenMode);
}

StiMvcViewer.prototype.mergeOptions = function (fromObject, toObject) {
    for (var value in fromObject) {
        if (toObject[value] === undefined || typeof toObject[value] !== "object") toObject[value] = fromObject[value];
        else this.mergeOptions(fromObject[value], toObject[value]);
    }
}

StiMvcViewer.prototype.showError = function (text) {
    if (text != null && text.substr(0, 6) == "Error:") {
        if (text.length == 7) text += "Undefined";
        alert(text);
        return true;
    }

    return false;
}

StiMvcViewer.prototype.createXMLHttp = function () {
    if (typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
    else if (window.ActiveXObject) {
        var allVersions = [
            "MSXML2.XMLHttp.5.0",
            "MSXML2.XMLHttp.4.0",
            "MSXML2.XMLHttp.3.0",
            "MSXML2.XMLHttp",
            "Microsoft.XMLHttp"
        ];
        for (var i = 0; i < allVersions.length; i++) {
            try {
                var xmlHttp = new ActiveXObject(allVersions[i]);
                return xmlHttp;
            }
            catch (oError) {
            }
        }
    }
    throw new Error("Unable to create XMLHttp object.");
}

StiMvcViewer.prototype.createPostParameters = function (data, asObject) {
    if (this.options.zoom == -1 || this.options.zoom == -2) this.options.autoZoom = this.options.zoom;

    var params = {
        "viewerId": this.options.viewerId,
        "routes": this.options.routes,
        "formValues": this.options.formValues,
        "reportGuid": this.options.reportGuid,
        "paramsGuid": this.options.paramsGuid,
        "previousParamsGuid": this.options.previousParamsGuid,
        "clientGuid": this.options.clientGuid,
        "serverCacheMode": this.options.server.cacheMode,
        "serverCacheTimeout": this.options.server.cacheTimeout,
        "serverCacheItemPriority": this.options.server.cacheItemPriority,
        "pageNumber": this.options.pageNumber,
        "zoom": (this.options.zoom == -1 || this.options.zoom == -2) ? 100 : this.options.zoom,
        "viewMode": this.options.viewMode,
        "showBookmarks": this.options.toolbar.showBookmarksButton,
        "openLinksTarget": this.options.appearance.openLinksTarget,
        "chartRenderType": this.options.appearance.chartRenderType,
        "editableParameters": this.options.editableParameters
    };

    if (data)
        for (var key in data)
            params[key] = data[key];

    var postParams = null;
    if (asObject) {
        postParams = {};
        if (params.action) {
            postParams["mvcviewer_action"] = params.action;
            delete params.action;
        }
        postParams["mvcviewer_parameters"] = Base64.encode(JSON.stringify(params));
    }
    else {
        postParams = "";
        if (params.action) {
            postParams += "mvcviewer_action=" + params.action + "&";
            delete params.action;
        }
        postParams += "mvcviewer_parameters=" + encodeURIComponent(Base64.encode(JSON.stringify(params)));
    }

    return postParams;
}

StiMvcViewer.prototype.postAjax = function (url, data, callback) {
    var jsObject = this;
    var xmlHttp = this.createXMLHttp();

    if (jsObject.options.server.requestTimeout != 0) {
        setTimeout(function () {
            if (xmlHttp.readyState < 4) xmlHttp.abort();
        }, jsObject.options.server.requestTimeout * 1000);
    }

    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            var status = 0;
            try {
                status = xmlHttp.status;
            }
            catch (e) {
            }

            if (status == 0) {
                callback("Error: Timeout response from the server", jsObject);
            } else if (status == 200) {
                callback(xmlHttp.responseText, jsObject);
            } else {
                callback("Error: " + status + " - " + xmlHttp.statusText, jsObject);
            }
        }
    };
    var params = this.createPostParameters(data, false);
    xmlHttp.send(params);
}

StiMvcViewer.prototype.postForm = function (url, data, doc) {
    if (!doc) doc = document;
    var form = doc.createElement("FORM");
    form.setAttribute("method", "POST");
    form.setAttribute("action", url);

    var params = this.createPostParameters(data, true);
    for (var key in params) {
        var paramsField = doc.createElement("INPUT");
        paramsField.setAttribute("type", "hidden");
        paramsField.setAttribute("name", key);
        paramsField.setAttribute("value", params[key]);
        form.appendChild(paramsField);
    }

    doc.body.appendChild(form);
    form.submit();
    doc.body.removeChild(form);
}

StiMvcViewer.prototype.postAction = function (action, bookmarkPage, bookmarkAnchor) {
    switch (action) {
        case "Print":
            switch (this.options.toolbar.printDestination) {
                case "Pdf": this.postPrint("PrintPdf"); break;
                case "Direct": this.postPrint("PrintWithoutPreview"); break;
                case "PopupWindow": this.postPrint("PrintWithPreview"); break;
                default: this.controls.menus.printMenu.changeVisibleState(!this.controls.menus.printMenu.visible); break;
            }
            return;
        case "Save": this.controls.menus.saveMenu.changeVisibleState(!this.controls.menus.saveMenu.visible); return;
        case "SendEmail": this.controls.menus.sendEmailMenu.changeVisibleState(!this.controls.menus.sendEmailMenu.visible); return;
        case "Zoom": this.controls.menus.zoomMenu.changeVisibleState(!this.controls.menus.zoomMenu.visible); return;
        case "ViewMode": this.controls.menus.viewModeMenu.changeVisibleState(!this.controls.menus.viewModeMenu.visible); return;
        case "FirstPage": this.options.pageNumber = 0; break;
        case "PrevPage": if (this.options.pageNumber > 0) this.options.pageNumber--; break;
        case "NextPage": if (this.options.pageNumber < this.options.pagesCount - 1) this.options.pageNumber++; break;
        case "LastPage": this.options.pageNumber = this.options.pagesCount - 1; break;
        case "FullScreen": this.changeFullScreenMode(!this.options.appearance.fullScreenMode); return;
        case "Zoom25": this.options.zoom = 25; break;
        case "Zoom50": this.options.zoom = 50; break;
        case "Zoom75": this.options.zoom = 75; break;
        case "Zoom100": this.options.zoom = 100; break;
        case "Zoom150": this.options.zoom = 150; break;
        case "Zoom200": this.options.zoom = 200; break;
        case "ZoomOnePage": this.options.zoom = parseInt(this.controls.reportPanel.getZoomByPageHeight()); break;
        case "ZoomPageWidth": this.options.zoom = parseInt(this.controls.reportPanel.getZoomByPageWidth()); break;
        case "ViewModeOnePage": this.options.viewMode = "OnePage"; break;
        case "ViewModeWholeReport": this.options.viewMode = "WholeReport"; break;
        case "GoToPage": this.options.pageNumber = this.controls.toolbar.controls["PageControl"].textBox.getCorrectValue() - 1; break;
        case "BookmarkAction":
            if (this.options.pageNumber == bookmarkPage || this.options.viewMode == "WholeReport") {
                this.scrollToAnchor(bookmarkAnchor);
                return;
            }
            else {
                this.options.pageNumber = bookmarkPage;
                this.options.bookmarkAnchor = bookmarkAnchor;
            }
            break;
        case "Bookmarks": this.controls.bookmarksPanel.changeVisibleState(!this.controls.buttons["Bookmarks"].isSelected); return;
        case "Parameters": this.controls.parametersPanel.changeVisibleState(!this.controls.buttons["Parameters"].isSelected); return;
        case "About": this.controls.aboutPanel.changeVisibleState(!this.controls.toolbar.controls.About.isSelected); return;
        case "Design": this.postDesign(); return;
        case "Submit":
            this.options.editableParameters = null;
            this.options.pageNumber = 0;
            this.postInteraction({ action: "variables", variables: this.controls.parametersPanel.getParametersValues() });
            return;
        case "Reset":
            this.options.parameters = {};
            this.controls.parametersPanel.clearParameters();
            this.controls.parametersPanel.addParameters();
            return;
        case "Editor": this.SetEditableMode(!this.options.editableMode); return;
    }

    this.controls.processImage.show();
    this.postAjax(this.options.requestUrl.replace("{action}",
            (action == null || this.options.server.cacheMode == "None")
                ? this.options.actions.getReportSnapshot
                : this.options.actions.viewerEvent),
            action == null ? { sendBookmarks: true} : null, this.showReportPage);
}

StiMvcViewer.prototype.postPrint = function (action) {
    var data = {
        "action": "print",
        "printAction": action,
        "bookmarksPrint": this.options.appearance.bookmarksPrint
    };

    switch (action) {
        case "PrintPdf":
            this.printAsPdf(
                this.options.requestAbsoluteUrl.replace("{action}", this.options.actions.printReport) +
                (this.options.requestAbsoluteUrl.indexOf("?") > 0 ? "&" : "?") +
                this.createPostParameters(data, false)
            );
            break;

        case "PrintWithPreview":
            this.printAsPopup(this.options.requestAbsoluteUrl.replace("{action}", this.options.actions.printReport), data);
            break;

        case "PrintWithoutPreview":
            this.postAjax(this.options.requestUrl.replace("{action}", this.options.actions.printReport), data, this.printAsHtml);
            break;
    }
}

StiMvcViewer.prototype.printAsPdf = function (url) {
    printFrame = document.getElementById("pdfPrintFrame");
    if (printFrame == null) {
        printFrame = document.createElement("iframe");
        printFrame.id = "pdfPrintFrame";
        printFrame.name = "pdfPrintFrame";
        printFrame.width = "0px";
        printFrame.height = "0px";
        printFrame.style.position = "absolute";
        printFrame.style.border = "none";
        document.body.appendChild(printFrame, document.body.firstChild);
    }

    printFrame.src = url;
}

StiMvcViewer.prototype.printAsPopup = function (url, data) {
    var win = window.open("about:blank", "PrintReport", "height=900, width=790, toolbar=no, menubar=yes, scrollbars=yes, resizable=yes, location=no, directories=no, status=no");
    if (win != null) this.postForm(url, data, win.document);
}

StiMvcViewer.prototype.printAsHtml = function (text, jsObject) {
    if (jsObject.showError(text)) return;

    if (navigator.userAgent.indexOf("Opera") != -1) {
        var operaWin = window.open("about:blank");
        operaWin.document.body.innerHTML = text;
        operaWin.opener.focus();
        operaWin.print();
        operaWin.close();
        operaWin = null;
    }
    else {
        printFrame = document.getElementById("htmlPrintFrame");
        if (printFrame == null) {
            printFrame = document.createElement("iframe");
            printFrame.id = "htmlPrintFrame";
            printFrame.name = "htmlPrintFrame";
            printFrame.width = "0px";
            printFrame.height = "0px";
            printFrame.style.position = "absolute";
            printFrame.style.border = "none";
            document.body.appendChild(printFrame, document.body.firstChild);
        }

        printFrame.contentWindow.document.open();
        printFrame.contentWindow.document.write(text);
        printFrame.contentWindow.document.close();
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
    }
}

StiMvcViewer.prototype.postExport = function (format, settings, action) {
    if (action == "") return;
    var data = {
        "action": "export",
        "exportFormat": format,
        "exportSettings": settings
    };

    if (action == this.options.actions.emailReport) {
        this.controls.processImage.show();
        this.postAjax(this.options.requestUrl.replace("{action}", action), data, this.emailResult);
    }
    else {
        var doc = null;
        if (settings.OpenAfterExport && this.options.appearance.openExportedReportTarget == "_blank")
            doc = window.open("about:blank", "ExportReport", "toolbar=no, menubar=yes, scrollbars=yes, resizable=yes, location=no, directories=no, status=no").document;
        this.postForm(this.options.requestUrl.replace("{action}", action), data, doc);
    }
}

StiMvcViewer.prototype.postDesign = function () {
    this.postForm(this.options.requestUrl.replace("{action}", this.options.actions.designReport));
}

StiMvcViewer.prototype.postInteraction = function (params) {
    if (!this.options.actions.interaction) {
        if (this.controls.buttons["Parameters"]) this.controls.buttons["Parameters"].setEnabled(false);
        return;
    }

    if (params.action == "drilldown") this.options.previousParamsGuid = this.options.paramsGuid;
    if (params.action != "init-vars") {
        var json = JSON.stringify(params);
        this.options.paramsGuid = hex_md5(json);
        params.sendBookmarks = true;
    }

    this.controls.processImage.show();
    this.postAjax(this.options.requestUrl.replace("{action}", this.options.actions.interaction), params, params.action == "init-vars" ? this.initializeParametersPanel : this.showReportPage);
}

StiMvcViewer.prototype.initializeParametersPanel = function (jsText, jsObject) {
    if (jsObject.showError(jsText)) jsText = null;

    jsObject.options.isParametersReceived = true;
    var paramsProps = JSON.parse(jsText);
    
    jsObject.options.paramsVariables = paramsProps;
    jsObject.InitializeParametersPanel();
    jsObject.controls.processImage.hide();
}

StiMvcViewer.prototype.parseParameters = function (jsParams) {
    if (jsParams.substr(0, 1) == "{") {
        var parameters = JSON.parse(jsParams);

        this.options.pageNumber = parameters.pageNumber;
        this.options.pagesCount = parameters.pagesCount;
        this.options.pagesArray = parameters.pagesArray;
        this.options.zoom = parameters.zoom;
        this.options.viewMode = parameters.viewMode;
        this.options.reportGuid = parameters.reportGuid;
        this.options.reportFileName = parameters.reportFileName;
        this.options.interactionCollapsingStates = parameters.interactionCollapsingStates;
        if (parameters.bookmarksContent) this.options.bookmarksContent = parameters.bookmarksContent;

        var drillDownPanel = this.controls.drillDownPanel;
        if (drillDownPanel.buttonsRow.children.length == 0)
            drillDownPanel.addButton(this.options.reportFileName, this.options.reportGuid, this.options.paramsGuid);

        if (parameters.action == "drilldown") {
            drillDownPanel.changeVisibleState(true);
            var buttonExist = false;
            for (var name in drillDownPanel.buttons) {
                var button = drillDownPanel.buttons[name];
                if (this.options.paramsGuid == button.paramsGuid && this.options.reportGuid == button.reportGuid) {
                    buttonExist = true;
                    button.style.display = "inline-block";
                    button.select();
                    break;
                }
            }
            if (!buttonExist)
                this.controls.drillDownPanel.addButton(this.options.reportFileName, this.options.reportGuid, this.options.paramsGuid);
        }

        if (parameters.isEditableReport && this.controls.buttons.Editor) {
            this.controls.buttons.Editor.style.display = "";
        }
    }

    return parameters;
}

StiMvcViewer.prototype.emailResult = function (text, jsObject) {
    jsObject.controls.processImage.hide();
    if (text == "0")
        alert(jsObject.collections.loc["EmailSuccessfullySent"]);
    else {
        if (text.indexOf("<?xml") == 0) {
            alert(jsObject.GetXmlValue(text, "ErrorCode"));
            alert(jsObject.GetXmlValue(text, "ErrorDescription"));
        }
        else
            alert(text);
    }
}

StiMvcViewer.prototype.showReportPage = function (htmlText, jsObject) {
    if (htmlText == "null" && jsObject.options.isReportRecieved) {
        jsObject.options.isReportRecieved = false;
        jsObject.postAction();
        return;
    }

    jsObject.controls.processImage.hide();
    jsObject.options.isReportRecieved = true;
    if (jsObject.showError(htmlText)) return;
    if (htmlText == "null") return; // TODO: disable all controls

    var parameters = jsObject.parseParameters(htmlText);
    if (parameters && parameters.bookmarksContent) jsObject.InitializeBookmarksPanel();
    if (parameters && parameters["pagesArray"]) jsObject.controls.reportPanel.addPages();
    if (jsObject.controls.toolbar) jsObject.controls.toolbar.changeToolBarState();

    if (jsObject.options.autoZoom != null) {
        jsObject.postAction(jsObject.options.autoZoom == -1 ? "ZoomPageWidth" : "ZoomOnePage");
        delete jsObject.options.autoZoom;
    }

    // Go to the bookmark, if it present
    if (jsObject.options.bookmarkAnchor != null) {
        jsObject.scrollToAnchor(jsObject.options.bookmarkAnchor);
        jsObject.options.bookmarkAnchor = null;
    }

    // Get the request from user variables when the viewer is launched for the first time
    if (!jsObject.options.isParametersReceived && jsObject.options.toolbar.showParametersButton) jsObject.postInteraction({ action: "init-vars" });
}

StiMvcViewer.prototype.InitializeReportPanel = function () {
    var reportPanel = document.createElement("div");
    reportPanel.id = this.controls.viewer.id + "ReportPanel";
    reportPanel.jsObject = this;
    this.controls.reportPanel = reportPanel;
    this.controls.mainPanel.appendChild(reportPanel);
    reportPanel.style.textAlign = this.options.appearance.pageAlignment == "default" ? "center" : this.options.appearance.pageAlignment;
    reportPanel.className = "stiMvcViewerReportPanel";
    reportPanel.style.bottom = "0px";
    reportPanel.pages = [];

    reportPanel.addPage = function (pageAttributes) {
        var page = document.createElement("DIV");
        page.jsObject = this.jsObject;
        reportPanel.appendChild(page);
        reportPanel.pages.push(page);

        page.loadContent = function (pageContent) {
            page.style.display = "inline-block";
            var pageAttributes = pageContent[0];
            page.style.background = pageAttributes["background"] == "Transparent" ? "White" : pageAttributes["background"];
            page.innerHTML = pageAttributes["content"];
        }

        page.className = this.jsObject.options.appearance.showPageShadow ? "stiMvcViewerPageShadow" : "stiMvcViewerPage";

        var pageSizes = pageAttributes["sizes"].split(";");
        var marginsPx = pageAttributes["margins"].split(" ");
        var margins = [];
        for (var i in marginsPx) {
            margins.push(parseInt(marginsPx[i].replace("px", "")));
        }

        page.margins = margins;
        page.pageWidth = parseInt(pageSizes[0]);
        page.pageHeight = parseInt(pageSizes[1]);
        this.jsObject.options.pagesWidth = page.pageWidth;
        this.jsObject.options.pagesHeight = page.pageHeight;
        page.style.overflow = "hidden";
        page.style.margin = "10px";
        page.style.display = "inline-block";
        page.style.verticalAlign = "top";
        page.style.padding = pageAttributes["margins"];
        page.style.border = "1px solid " + this.jsObject.options.appearance.pageBorderColor;
        page.style.color = "#000000";
        page.style.background = pageAttributes["background"] == "Transparent" ? "White" : pageAttributes["background"];
        page.innerHTML = pageAttributes["content"];
        var currentPageHeight = page.offsetHeight - margins[0] - margins[2];
        if (reportPanel.maxHeights[pageSizes[1]] == null || currentPageHeight > reportPanel.maxHeights[pageSizes[1]])
            reportPanel.maxHeights[pageSizes[1]] = currentPageHeight;

        this.jsObject.InitializeInteractions(page);

        return page;
    }

    reportPanel.getZoomByPageWidth = function () {
        if (this.jsObject.options.pagesWidth == 0) return 100;
        var newZoom = (this.offsetWidth * this.jsObject.options.zoom) / (this.jsObject.options.pagesWidth + 20);
        return newZoom;
    }

    reportPanel.getZoomByPageHeight = function () {
        if (this.jsObject.options.pagesHeight == 0) return 100;
        var newPagesHeight = window.innerHeight - (this.jsObject.controls.toolbar ? this.jsObject.controls.toolbar.offsetHeight : 0) -
            (this.jsObject.controls.parametersPanel ? this.jsObject.controls.parametersPanel.offsetHeight : 0) - 50;
        var newZoom = (newPagesHeight * this.jsObject.options.zoom) / (this.jsObject.options.pagesHeight + 20);
        return newZoom;
    }

    reportPanel.addPages = function () {
        if (this.jsObject.options.pagesArray == null) return;
        reportPanel.style.top = this.jsObject.options.toolbar.visible
            ? (this.jsObject.options.viewerHeightType != "Percentage" || this.jsObject.options.appearance.scrollbarsMode
                ? this.jsObject.controls.toolbar.offsetHeight + "px" : "0px")
            : "0px";
        this.clear();
        this.maxHeights = {};
        var count = this.jsObject.options.pagesArray.length;

        // add pages styles
        if (this.jsObject.controls.css == null) {
            this.jsObject.controls.css = document.createElement("STYLE");
            this.jsObject.controls.css.setAttribute('type', 'text/css');
            this.jsObject.controls.head.appendChild(this.jsObject.controls.css);
        }
        if (this.jsObject.controls.css.styleSheet) this.jsObject.controls.css.styleSheet.cssText = this.jsObject.options.pagesArray[count - 2];
        else this.jsObject.controls.css.innerHTML = this.jsObject.options.pagesArray[count - 2];

        // add chart scripts
        var currChartScripts = document.getElementById("chartScriptMobileViewer");
        if (currChartScripts) this.jsObject.controls.head.removeChild(currChartScripts);

        if (this.jsObject.options.pagesArray[count - 1]) {
            var chartScripts = document.createElement("Script");
            chartScripts.setAttribute('type', 'text/javascript');
            chartScripts.id = "chartScriptMobileViewer";
            chartScripts.textContent = this.jsObject.options.pagesArray[count - 1];
            this.jsObject.controls.head.appendChild(chartScripts);
        }

        for (num = 0; num <= count - 3; num++) {
            var page = this.addPage(this.jsObject.options.pagesArray[num]);
        }
        reportPanel.correctHeights();

        if (typeof stiEvalCharts === "function") stiEvalCharts();

        if (this.jsObject.options.editableMode) this.jsObject.ShowAllEditableFields();
    }

    reportPanel.clear = function () {
        while (this.childNodes[0]) {
            this.removeChild(this.childNodes[0]);
        }
        reportPanel.pages = [];
    }

    reportPanel.correctHeights = function () {
        for (var i in this.childNodes) {
            if (this.childNodes[i].pageHeight != null) {
                var height = reportPanel.maxHeights[this.childNodes[i].pageHeight.toString()];
                if (height) this.childNodes[i].style.height = height + "px";
            }
        }
    }

    reportPanel.ontouchstart = function () {
        if (this.jsObject.options.allowTouchZoom) {
            this.jsObject.options.firstZoomDistance = 0;
            this.jsObject.options.secondZoomDistance = 0;
            this.jsObject.options.zoomStep = 0;
        }
    }

    reportPanel.ontouchmove = function (event) {
        if (typeof event !== "undefined" && event.touches.length > 1 && this.jsObject.options.allowTouchZoom) {
            if ('preventDefault' in event) event.preventDefault();
            this.jsObject.options.zoomStep++;

            if (this.jsObject.options.firstZoomDistance == 0)
                this.jsObject.options.firstZoomDistance = Math.sqrt(Math.pow(event.touches[0].pageX - event.touches[1].pageX, 2) + Math.pow(event.touches[0].pageY - event.touches[1].pageY, 2));

            if (this.jsObject.options.zoomStep > 2 && this.jsObject.options.secondZoomDistance == 0) {
                this.jsObject.options.secondZoomDistance = Math.sqrt(Math.pow(event.touches[0].pageX - event.touches[1].pageX, 2) + Math.pow(event.touches[0].pageY - event.touches[1].pageY, 2));

                this.jsObject.SetZoom(this.jsObject.options.secondZoomDistance > this.jsObject.options.firstZoomDistance);
            }
        }
    }
}

StiMvcViewer.prototype.InitializeSendEmailForm = function (form) {
    var sendEmailForm = this.BaseForm("sendEmailForm", this.collections.loc["EmailOptions"], 1);
    sendEmailForm.style.fontFamily = this.options.toolbar.fontFamily;
    if (this.options.toolbar.fontColor != "") sendEmailForm.style.color = this.options.toolbar.fontColor;
    sendEmailForm.style.fontSize = "12px";
    sendEmailForm.controls = {};

    var controlProps = [
        ["Email", this.collections.loc["Email"], this.TextBox("sendEmailFormEmail", 280)],
        ["Subject", this.collections.loc["Subject"], this.TextBox("sendEmailFormSubject", 280)],
        ["Message", this.collections.loc["Message"], this.TextArea("sendEmailFormMessage", 280, 70)],
        ["AttachmentCell", this.collections.loc["Attachment"], document.createElement("div")]
    ]

    var controlsTable = this.CreateHTMLTable();
    sendEmailForm.container.appendChild(controlsTable);

    for (var i = 0; i < controlProps.length; i++) {
        var control = controlProps[i][2];
        control.style.margin = "4px";
        sendEmailForm.controls[controlProps[i][0]] = control;
        controlsTable.addTextCellInLastRow(controlProps[i][1]).className = "stiMvcViewerCaptionControls";
        controlsTable.addCellInLastRow(control);
        if (i < controlProps.length - 1) controlsTable.addRow();
    }
    
    sendEmailForm.show = function (exportFormat, exportSettings) {
        this.changeVisibleState(true);
        this.exportSettings = exportSettings;
        this.exportFormat = exportFormat;

        for (var i in this.controls) {
            this.controls[i].value = "";
        }

        this.controls["Email"].value = this.jsObject.options.email.defaultEmailAddress;
        this.controls["Message"].value = this.jsObject.options.email.defaultEmailMessage;
        this.controls["Subject"].value = this.jsObject.options.email.defaultEmailSubject;

        var ext = this.exportFormat.toLowerCase().replace("image", "");
        switch (ext) {
            case "excel": ext = "xls"; break;
            case "excel2007": ext = "xlsx"; break;
            case "excelxml": ext = "xls"; break;
            case "html5": ext = "html"; break;
            case "jpeg": ext = "jpg"; break;
            case "ppt2007": ext = "ppt"; break;
            case "text": ext = "txt"; break;
            case "word2007": ext = "docx"; break;
        }

        this.controls["AttachmentCell"].innerHTML = this.jsObject.options.reportFileName + "." + ext;
    }

    sendEmailForm.action = function () {
        sendEmailForm.exportSettings["Email"] = sendEmailForm.controls["Email"].value;
        sendEmailForm.exportSettings["Subject"] = sendEmailForm.controls["Subject"].value;
        sendEmailForm.exportSettings["Message"] = sendEmailForm.controls["Message"].value;

        sendEmailForm.changeVisibleState(false);
        sendEmailForm.jsObject.postExport(sendEmailForm.exportFormat, sendEmailForm.exportSettings, sendEmailForm.jsObject.options.actions.emailReport);
    }
}

StiMvcViewer.prototype.GroupPanel = function (caption) {
    var groupPanel = document.createElement("fieldset");
    groupPanel.style.fontFamily = this.options.toolbar.fontFamily;
    groupPanel.style.color = this.options.toolbarFontColor;
    groupPanel.caption = document.createElement("legend");
    groupPanel.caption.className = "stiMvcViewerGroupPanelCaption";
    groupPanel.caption.innerHTML = caption;
    groupPanel.appendChild(groupPanel.caption);
    groupPanel.className = "stiMvcViewerGroupPanel";
    
    groupPanel.container = document.createElement("div");
    groupPanel.appendChild(groupPanel.container);

    return groupPanel;
}

StiMvcViewer.prototype.TextArea = function (name, width, height) {
    var textArea = document.createElement("textarea");
    textArea.style.width = width + "px";
    textArea.style.height = height + "px";
    textArea.style.minWidth = width + "px";
    textArea.style.minHeight = height + "px";
    textArea.jsObject = this;
    textArea.name = name;
    textArea.isEnabled = true;
    textArea.isSelected = false;
    textArea.isOver = false;
    var styleName = "stiMvcViewerTextBox";
    textArea.className = styleName + " " + styleName + "Default";
    if (name) {
        if (!this.controls.textBoxes) this.controls.textBoxes = {};
        this.controls.textBoxes[name] = textArea;
    }
        
    textArea.setEnabled = function (state) {
        this.isEnabled = state;
        this.disabled = !state;
        this.className = styleName + " " + styleName + (state ? "Default" : "Disabled");
    }
    
    textArea.onmouseover = function () {
        if (this.jsObject.options.isTouchDevice || !this.isEnabled || this.readOnly) return;
        this.isOver = true;
        if (!this.isSelected && !this.isFocused) this.className = styleName + " " + styleName + "Over";
    }
    
    textArea.onfocus = function () {
        this.jsObject.options.controlsIsFocused = true;
    }
    
    textArea.onmouseout = function () {
        if (this.jsObject.options.isTouchDevice || !this.isEnabled || this.readOnly) return;
        this.isOver = false;
        if (!this.isSelected && !this.isFocused) this.className = styleName + " " + styleName + "Default";
    }
    
    textArea.setSelected = function (state) {
        this.isSelected = state;
        this.className = styleName + " " + styleName + (state ? "Over" : (this.isEnabled ? (this.isOver ? "Over" : "Default") : "Disabled"));
    }
    
    textArea.onblur = function () {
        this.jsObject.options.controlsIsFocused = false;
        this.action(); 
    }
    
    textArea.action = function () { };
    
    return textArea;
}

StiMvcViewer.prototype.InitializeToolTip = function () {
    var toolTip = document.createElement("div");
    toolTip.id = this.controls.viewer.id + "ToolTip";
    toolTip.jsObject = this;
    this.controls.toolTip = toolTip;
    this.controls.mainPanel.appendChild(toolTip);
    toolTip.className = "stiMvcViewerToolTip";
    toolTip.style.display = "none";
    toolTip.showTimer = null;
    toolTip.hideTimer = null;
    toolTip.visible = false;

    toolTip.innerTable = this.CreateHTMLTable();
    toolTip.appendChild(toolTip.innerTable);

    toolTip.textCell = toolTip.innerTable.addCell();
    toolTip.textCell.className = "stiMvcViewerToolTipTextCell";

    toolTip.helpButton = document.createElement("div");// this.SmallButton(null,
														// null, null, null,
														// null, null);
    toolTip.innerTable.addCellInNextRow(toolTip.helpButton);
    // toolTip.helpButton.style.margin = "4px 8px 4px 8px";

    toolTip.show = function (text, helpUrl, leftPos, topPos) {
        if (this.visible && text == this.textCell.innerHTML) return;
        this.hide();
        this.textCell.innerHTML = text;
        this.helpButton.helpUrl = helpUrl;
        this.helpButton.action = function () { this.jsObject.showHelpWindow(this.helpUrl); }
        this.style.left = leftPos + "px";
        this.style.top = topPos + "px";
        var d = new Date();
        var endTime = d.getTime() + 300;
        this.style.opacity = 1 / 100;
        this.style.display = "";
        this.visible = true;
        this.jsObject.ShowAnimationForm(this, endTime);
    }

    toolTip.showWithDelay = function (text, helpUrl, leftPos, topPos) {
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);
        var this_ = this;
        this.showTimer = setTimeout(function () {
            this_.show(text, helpUrl, leftPos, topPos);
        }, 300);
    }

    toolTip.hide = function () {
        this.visible = false;
        clearTimeout(this.showTimer);
        this.style.display = "none";
    }

    toolTip.hideWithDelay = function () {
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);
        var this_ = this;
        this.hideTimer = setTimeout(function () {
            this_.hide();
        }, 500);
    }

    toolTip.onmouseover = function () {
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);
    }

    toolTip.onmouseout = function () {
        this.hideWithDelay();
    }
}

StiMvcViewer.prototype.InitializeDisabledPanels = function () {
    this.controls.disabledPanels = {};
    for (var i = 1; i < 5; i++) {
        var disabledPanel = document.createElement("div");
        disabledPanel.jsObject = this;
        disabledPanel.style.display = "none";
        this.controls.mainPanel.appendChild(disabledPanel);
        this.controls.disabledPanels[i] = disabledPanel;
        disabledPanel.style.zIndex = 10 * i;
        disabledPanel.className = "stiMvcViewerDisabledPanel"; 

        disabledPanel.changeVisibleState = function (state) {
            this.style.display = state ? "" : "none";
        }

        disabledPanel.onmousedown = function () { if (disabledPanel.jsObject.options.isTouchDevice) return; disabledPanel.ontouchstart(); }
        disabledPanel.ontouchstart = function () { disabledPanel.jsObject.options.disabledPanelPressed = true; }
    }
}

StiMvcViewer.prototype.ShowAnimationVerticalMenu = function (menu, finishPos, endTime) {
    var currentPos = menu.innerContent.offsetTop;
    clearTimeout(menu.animationTimer);

    var d = new Date();
    var t = d.getTime();
    var step = Math.round((finishPos - currentPos) / ((Math.abs(endTime - t) + 1) / 30));

    // Last step
    if (Math.abs(step) > Math.abs(finishPos - currentPos)) step = finishPos - currentPos;

    currentPos = currentPos + step;
    var resultPos;

    if (t < endTime) {
        resultPos = currentPos;
        menu.animationTimer = setTimeout(function () { menu.jsObject.ShowAnimationVerticalMenu(menu, finishPos, endTime) }, 30);
    }
    else {
        resultPos = finishPos;
        menu.style.overflow = "visible";
        menu.animationTimer = null;
    }

    menu.innerContent.style.top = resultPos + "px";
}

StiMvcViewer.prototype.ShowAnimationForm = function (form, endTime) {
    if (!form.flag) { form.currentOpacity = 1; form.flag = true; }
    clearTimeout(form.animationTimer);

    var d = new Date();
    var t = d.getTime();
    var step = Math.round((100 - form.currentOpacity) / ((Math.abs(endTime - t) + 1) / 30));

    // Last step
    if (Math.abs(step) > Math.abs(100 - form.currentOpacity)) step = 100 - form.currentOpacity;

    form.currentOpacity = form.currentOpacity + step;
    var resultOpacity;
    
    if (t < endTime) {
        resultOpacity = form.currentOpacity;
        form.animationTimer = setTimeout(function () { form.jsObject.ShowAnimationForm(form, endTime) }, 30);
    }
    else {
        resultOpacity = 100;
        form.flag = false;
        form.animationTimer = null;
    }

    form.style.opacity = resultOpacity / 100;
}

StiMvcViewer.prototype.ShowAnimationForScroll = function (reportPanel, finishScrollTop, endTime, completeFunction) {
    currentScrollTop = 0;
    if (reportPanel.jsObject.options.appearance.scrollbarsMode) currentScrollTop = reportPanel.scrollTop;
    else {
        currentScrollTop = document.documentElement.scrollTop;
        if (currentScrollTop == 0) currentScrollTop = document.getElementsByTagName('BODY')[0].scrollTop;
    }

    clearTimeout(reportPanel.animationTimer);
    var d = new Date();
    var t = d.getTime();
    var step = Math.round((finishScrollTop - currentScrollTop) / ((Math.abs(endTime - t) + 1) / 30));

    // Last step
    if (Math.abs(step) > Math.abs(finishScrollTop - currentScrollTop)) step = finishScrollTop - currentScrollTop;

    currentScrollTop += step;
    var resultScrollTop;
    var this_ = this;

    if (t < endTime) {
        resultScrollTop = currentScrollTop;        
        reportPanel.animationTimer = setTimeout(function () {
            this_.ShowAnimationForScroll(reportPanel, finishScrollTop, endTime, completeFunction);
        }, 30);
    }
    else {
        resultScrollTop = finishScrollTop;
        if (completeFunction) completeFunction();
    }

    if (reportPanel.jsObject.options.appearance.scrollbarsMode)
        reportPanel.scrollTop = resultScrollTop;
    else
        window.scrollTo(0, resultScrollTop);
}

StiMvcViewer.prototype.InitializeSendEmailMenu = function () {
    var sendEmailMenu = this.InitializeBaseSaveMenu("sendEmailMenu", this.controls.toolbar.controls["SendEmail"]);

    sendEmailMenu.action = function (menuItem) {
        this.changeVisibleState(false);
        if (this.jsObject.options.email.showExportDialog)
            this.jsObject.controls.forms.exportForm.show(menuItem.key, this.jsObject.options.actions.emailReport);
        else if (this.jsObject.options.email.showEmailDialog) {
            this.jsObject.controls.forms.sendEmailForm.show(menuItem.key, this.jsObject.getDefaultExportSettings(menuItem.key));
        }
        else {
            var exportSettings = this.jsObject.getDefaultExportSettings(menuItem.key);
            exportSettingsObject["Email"] = this.jsObject.options.email.defaultEmailAddress;
            exportSettingsObject["Message"] = this.jsObject.options.email.defaultEmailMessage;
            exportSettingsObject["Subject"] = this.jsObject.options.email.defaultEmailSubject;
            this.jsObject.postExport(menuItem.key, defaultSettings, this.jsObject.options.actions.emailReport);
        }
    }
}

StiMvcViewer.prototype.FindPosX = function (obj, mainClassName, noScroll) {
    var curleft = noScroll ? 0 : this.GetScrollXOffset(obj, mainClassName);
    if (obj.offsetParent) {
        while (obj.className != mainClassName) {            
            curleft += obj.offsetLeft;
            if (!obj.offsetParent) {
                break;
            }
            obj = obj.offsetParent;
            
        }
    } else if (obj.x) {
        curleft += obj.x;
    }
    return curleft;
}

StiMvcViewer.prototype.FindPosY = function (obj, mainClassName, noScroll) {
    var curtop = noScroll ? 0 : this.GetScrollYOffset(obj, mainClassName);
    if (obj.offsetParent) {
        while (obj.className != mainClassName) {
            curtop += obj.offsetTop;
            if (!obj.offsetParent) {
                break;
            }
            obj = obj.offsetParent;
        }
    } else if (obj.y) {
        curtop += obj.y;
    }
    return curtop;
}

StiMvcViewer.prototype.GetScrollXOffset = function (obj, mainClassName) {
    var scrollleft = 0;
    if (obj.parentElement) {
        while (obj.className != mainClassName) {
            if ("scrollLeft" in obj) { scrollleft -= obj.scrollLeft }
            if (!obj.parentElement) {
                break;
            }
            obj = obj.parentElement;
        }
    }
    
    return scrollleft;
}

StiMvcViewer.prototype.GetScrollYOffset = function (obj, mainClassName) {
    var scrolltop = 0;
    if (obj.parentElement) {
        while (obj.className != mainClassName) {
            if ("scrollTop" in obj) { scrolltop -= obj.scrollTop }
            if (!obj.parentElement) {
                break;
            }
            obj = obj.parentElement;
        }
    }
    
    return scrolltop;
}

StiMvcViewer.prototype.InitializePrintMenu = function () {
    var items = [];
    items.push(this.Item("PrintPdf", this.collections.loc["PrintPdf"], "PrintPdf.png", "PrintPdf"));
    items.push(this.Item("PrintWithPreview", this.collections.loc["PrintWithPreview"], "PrintWithPreview.png", "PrintWithPreview"));
    items.push(this.Item("PrintWithoutPreview", this.collections.loc["PrintWithoutPreview"], "PrintWithoutPreview.png", "PrintWithoutPreview"));

    var printMenu = this.VerticalMenu("printMenu", this.controls.toolbar.controls["Print"], "Down", items);

    printMenu.action = function (menuItem) {
        printMenu.changeVisibleState(false);
        printMenu.jsObject.postPrint(menuItem.key);
    }
}

var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}



StiMvcViewer.prototype.InitializeSaveMenu = function (menuName, parentButton) {
    var saveMenu = this.InitializeBaseSaveMenu("saveMenu", this.controls.toolbar.controls["Save"]);

    saveMenu.action = function (menuItem) {
        saveMenu.changeVisibleState(false);
        if (saveMenu.jsObject.options.exports.showExportDialog)
            saveMenu.jsObject.controls.forms.exportForm.show(menuItem.key, saveMenu.jsObject.options.actions.exportReport);
        else
            saveMenu.jsObject.postExport(menuItem.key, saveMenu.jsObject.getDefaultExportSettings(menuItem.key), saveMenu.jsObject.options.actions.exportReport);
    }
}


StiMvcViewer.prototype.InitializeBaseSaveMenu = function (menuName, parentButton) {
    var isFirst = true;
    var items = [];
    if (this.options.exports.showExportToDocument && menuName == "saveMenu") {
        items.push(this.Item("Document", this.collections.loc["SaveDocument"], "SaveDocument.png", "Document"));
        isFirst = false;
    }
    if (menuName == "saveMenu" && this.options.exports.showExportToPdf || this.options.exports.showExportToXps || this.options.exports.showExportToPowerPoint) {
        if (!isFirst) items.push("separator1");
        isFirst = false;
    }
    if (this.options.exports.showExportToPdf) items.push(this.Item("Pdf", this.collections.loc["SavePdf"], "SavePdf.png", "Pdf"));
    if (this.options.exports.showExportToXps) items.push(this.Item("Xps", this.collections.loc["SaveXps"], "SaveXps.png", "Xps"));
    if (this.options.exports.showExportToPowerPoint) items.push(this.Item("Ppt2007", this.collections.loc["SavePpt2007"], "SavePpt2007.png", "Ppt2007"));

    if (this.options.exports.showExportToHtml || this.options.exports.showExportToHtml5 || this.options.exports.showExportToMht) {
        if (!isFirst) items.push("separator2");
        isFirst = false;
        var htmlType = this.options.exports.defaultSettings["StiHtmlExportSettings"].HtmlType;
        if (!this.options.exports["showExportTo" + htmlType]) {
            if (this.options.exports.showExportToHtml) htmlType = "Html";
            else if (this.options.exports.showExportToHtml5) htmlType = "Html5";
            else if (this.options.exports.showExportToMht) htmlType = "Mht";
        }
        items.push(this.Item(htmlType, this.collections.loc["SaveHtml"], "SaveHtml.png", htmlType));
    }
    if (this.options.exports.showExportToText || this.options.exports.showExportToRtf || this.options.exports.showExportToWord2007 || this.options.exports.showExportToOdt) {
        if (!isFirst) items.push("separator3");
        isFirst = false;
    }
    if (this.options.exports.showExportToText) items.push(this.Item("Text", this.collections.loc["SaveText"], "SaveText.png", "Text"));
    if (this.options.exports.showExportToRtf) items.push(this.Item("Rtf", this.collections.loc["SaveRtf"], "SaveRtf.png", "Rtf"));
    if (this.options.exports.showExportToWord2007) items.push(this.Item("Word2007", this.collections.loc["SaveWord2007"], "SaveWord2007.png", "Word2007"));
    if (this.options.exports.showExportToOpenDocumentWriter) items.push(this.Item("Odt", this.collections.loc["SaveOdt"], "SaveOdt.png", "Odt"));
    if (this.options.exports.showExportToExcel || this.options.exports.showExportToExcel2007 || this.options.exports.showExportToExcelXml || this.options.exports.showExportToOpenDocumentWriter) {
        if (!isFirst) items.push("separator4");
        isFirst = false;
    }
    if (this.options.exports.showExportToExcel || this.options.exports.showExportToExcelXml || this.options.exports.showExportToExcel2007) {
        var excelType = this.options.exports.defaultSettings["StiExcelExportSettings"].ExcelType;
        if (excelType == "ExcelBinary") excelType = "Excel";
        if (!this.options.exports["showExportTo" + excelType]) {
            if (this.options.exports.showExportToExcel) excelType = "Excel";
            else if (this.options.exports.showExportToExcel2007) excelType = "Excel2007";
            else if (this.options.exports.showExportToExcelXml) excelType = "ExcelXml";
        }
        items.push(this.Item(excelType, this.collections.loc["SaveExcel"], "SaveExcel.png", excelType));
    }
    if (this.options.exports.showExportToOpenDocumentCalc) {
        items.push(this.Item("Ods", this.collections.loc["SaveOds"], "SaveOds.png", "Ods"));
    }
    if (this.options.exports.showExportToCsv || this.options.exports.showExportToDbf || this.options.exports.showExportToXml || this.options.exports.showExportToDif || this.options.exports.showExportToSylk) {
        if (!isFirst) items.push("separator5");
        isFirst = false;
        var dataType = this.options.exports.defaultSettings["StiDataExportSettings"].DataType;
        if (!this.options.exports["showExportTo" + dataType]) {
            if (this.options.exports.showExportToCsv) dataType = "Csv";
            else if (this.options.exports.showExportToDbf) dataType = "Dbf";
            else if (this.options.exports.showExportToXml) dataType = "Xml";
            else if (this.options.exports.showExportToDif) dataType = "Dif";
            else if (this.options.exports.showExportToSylk) dataType = "Sylk";
        }
        items.push(this.Item(dataType, this.collections.loc["SaveData"], "SaveData.png", dataType));
    }
    if (this.options.exports.showExportToImageBmp || this.options.exports.showExportToImageGif || this.options.exports.showExportToImageJpeg || this.options.exports.showExportToImagePcx ||
        this.options.exports.showExportToImagePng || this.options.exports.showExportToImageTiff || this.options.exports.showExportToImageMetafile || this.options.exports.showExportToImageSvg || this.options.exports.showExportToImageSvgz) {
        if (!isFirst) items.push("separator6");
        isFirst = false;
        var imageType = this.options.exports.defaultSettings["StiImageExportSettings"].ImageType;
        var imageType_ = imageType == "Emf" ? "Metafile" : imageType;
        if (!this.options.exports["showExportToImage" + imageType_]) {
            if (this.options.exports.showExportToImageBmp) imageType = "Bmp";
            else if (this.options.exports.showExportToImageGif) imageType = "Gif";
            else if (this.options.exports.showExportToImageJpeg) imageType = "Jpeg";
            else if (this.options.exports.showExportToImagePcx) imageType = "Pcx";
            else if (this.options.exports.showExportToImagePng) imageType = "Png";
            else if (this.options.exports.showExportToImageTiff) imageType = "Tiff";
            else if (this.options.exports.showExportToImageMetafile) imageType = "Emf";
            else if (this.options.exports.showExportToImageSvg) imageType = "Svg";
            else if (this.options.exports.showExportToImageSvgz) imageType = "Svgz";
        }
        items.push(this.Item("Image" + imageType, this.collections.loc["SaveImage"], "SaveImage.png", "Image" + imageType));
    }

    var baseSaveMenu = this.VerticalMenu(menuName, parentButton, "Down", items);
    baseSaveMenu.menuName = menuName;

    return baseSaveMenu;
}

StiMvcViewer.prototype.InitializeViewModeMenu = function () {
    var items = [];
    items.push(this.Item("OnePage", this.collections.loc["OnePage"], "OnePage.png", "ViewModeOnePage"));
    items.push(this.Item("WholeReport", this.collections.loc["WholeReport"], "WholeReport.png", "ViewModeWholeReport"));

    var viewModeMenu = this.VerticalMenu("viewModeMenu", this.controls.toolbar.controls["ViewMode"], "Down", items);

    viewModeMenu.action = function (menuItem) {
        viewModeMenu.changeVisibleState(false);
        viewModeMenu.jsObject.postAction(menuItem.key);
    }
}

StiMvcViewer.prototype.InitializeBookmarksPanel = function () {
    var createAndShow = true;
    if (this.controls.bookmarksPanel) {
        if (!this.controls.bookmarksPanel.visible) createAndShow = false;
        this.controls.bookmarksPanel.changeVisibleState(false);
        this.controls.mainPanel.removeChild(this.controls.bookmarksPanel);
        delete this.controls.bookmarksPanel;
    }
    if (this.options.toolbar.visible && this.options.toolbar.showBookmarksButton) {
        this.controls.toolbar.controls.Bookmarks.setEnabled(this.options.bookmarksContent != null);
    }
    if (!this.options.bookmarksContent) return;

    var bookmarksPanel = document.createElement("div");
    this.controls.mainPanel.appendChild(bookmarksPanel);
    this.controls.bookmarksPanel = bookmarksPanel;
    bookmarksPanel.style.fontFamily = this.options.toolbar.fontFamily;
    if (this.options.toolbar.fontColor != "") bookmarksPanel.style.color = this.options.toolbar.fontColor;
    bookmarksPanel.jsObject = this;
    bookmarksPanel.id = this.controls.viewer.id + "_BookmarksPanel";
    bookmarksPanel.className = "stiMvcViewerBookmarksPanel";
    bookmarksPanel.style.display = "none";
    bookmarksPanel.visible = false;
    bookmarksPanel.style.width = (this.options.appearance.bookmarksTreeWidth - 1) + "px";
    bookmarksPanel.style.top = ((this.options.toolbar.visible ? this.controls.toolbar.offsetHeight + 2 : 2) +
        (this.controls.parametersPanel ? this.controls.parametersPanel.offsetHeight - 2 : 0) + this.controls.drillDownPanel.offsetHeight) + "px";
    bookmarksPanel.style.bottom = "2px";
    bookmarksPanel.container = document.createElement("div");
    bookmarksPanel.container.className = "stiMvcViewerBookmarksContainer";
    if (this.options.toolbar.backgroundColor != "") bookmarksPanel.container.style.background = this.options.toolbar.backgroundColor;
    if (this.options.toolbar.borderColor != "") bookmarksPanel.container.style.border = "1px solid " + this.options.toolbar.borderColor;
    bookmarksPanel.appendChild(bookmarksPanel.container);

    bookmarksPanel.changeVisibleState = function (state) {
        var options = this.jsObject.options;
        this.style.display = state ? "" : "none";
        this.visible = state;
        if (options.toolbar.visible && options.toolbar.showBookmarksButton) this.jsObject.controls.toolbar.controls.Bookmarks.setSelected(state);
        this.jsObject.controls.reportPanel.style.marginLeft = state ? (this.jsObject.options.appearance.bookmarksTreeWidth + 2) + "px" : 0;
    }

    bookmarksPanel.addContent = function (content) {
        this.container.innerHTML = content;
    }

    var imagesForBookmarks = this.GetImagesForBookmarks();
    var bookmarksContent = this.options.bookmarksContent.replace("imagesForBookmarks", imagesForBookmarks);
    eval(bookmarksContent);
    bookmarksPanel.addContent(bookmarks);
    if (createAndShow) bookmarksPanel.changeVisibleState(true);
}

StiMvcViewer.prototype.GetImagesForBookmarks = function () {
    var names = ["root", "folder", "folderOpen", "node", "empty", "line", "join", "joinBottom", "plus", "plusBottom", "minus", "minusBottom"]
    var imagesForBookmarks = {};
    for (var i in names) {
        imagesForBookmarks[names[i]] = this.collections.images["Bookmarks" + names[i] + ".png"];
    }
    return JSON.stringify(imagesForBookmarks);
}

// Node object
function stiTreeNode(id, pid, name, url, title) {
    this.id = id;
    this.pid = pid;
    this.name = name;
    this.url = url ? url.replace(/'/g, "\\\'") : url;
    this.title = title;
    this.page == null;
    if (title) this.page = parseInt(title.substr(5)) - 1;
    this.target = null;
    this.icon = null;
    this.iconOpen = null;
    this._io = false; // Open
    this._is = false;
    this._ls = false;
    this._hc = false;
    this._ai = 0;
    this._p;
}

// Tree object
function stiTree(objName, mobileViewerId, currentPageNumber, imagesForBookmarks) {

    this.config = {
        target: null,
        folderLinks: true,
        useSelection: true,
        useCookies: true,
        useLines: true,
        useIcons: true,
        useStatusText: false,
        closeSameLevel: false,
        inOrder: false
    }
    this.icon = {
        nlPlus: 'img/nolines_plus.gif',
        nlMinus: 'img/nolines_minus.gif'
    };

    for (var imageName in imagesForBookmarks) {
        this.icon[imageName] = imagesForBookmarks[imageName];
    }

    this.obj = objName;
    this.mobileViewerId = mobileViewerId;
    this.currentPageNumber = currentPageNumber;
    this.aNodes = [];
    this.aIndent = [];
    this.root = new stiTreeNode(-1);
    this.selectedNode = null;
    this.selectedFound = false;
    this.completed = false;
}

// Adds a new node to the node array
stiTree.prototype.add = function (id, pid, name, url, title, page) {
    this.aNodes[this.aNodes.length] = new stiTreeNode(id, pid, name, url, title, page);
}

// Open/close all nodes
stiTree.prototype.openAll = function () {
    this.oAll(true);
}

stiTree.prototype.closeAll = function () {
    this.oAll(false);
}

// Outputs the tree to the page
stiTree.prototype.toString = function () {
    var str = '<div class="stiTree">\n';
    if (document.getElementById) {
        if (this.config.useCookies) this.selectedNode = this.getSelected();
        str += this.addNode(this.root);
    } else str += 'Browser not supported.';
    str += '</div>';
    if (!this.selectedFound) this.selectedNode = null;
    this.completed = true;
    return str;
}

// Creates the tree structure
stiTree.prototype.addNode = function (pNode) {
    var str = '';
    var n = 0;
    if (this.config.inOrder) n = pNode._ai;
    for (n; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == pNode.id) {
            var cn = this.aNodes[n];
            cn._p = pNode;
            cn._ai = n;
            this.setCS(cn);
            if (!cn.target && this.config.target) cn.target = this.config.target;
            if (cn._hc && !cn._io && this.config.useCookies) cn._io = this.isOpen(cn.id);
            if (!this.config.folderLinks && cn._hc) cn.url = null;
            if (this.config.useSelection && cn.id == this.selectedNode && !this.selectedFound) {
                cn._is = true;
                this.selectedNode = n;
                this.selectedFound = true;
            }
            str += this.node(cn, n);
            if (cn._ls) break;
        }
    }
    return str;
}

// Creates the node icon, url and text
stiTree.prototype.node = function (node, nodeId) {
    var str = '<div class="stiTreeNode">' + this.indent(node, nodeId);
    if (this.config.useIcons) {
        if (!node.icon) node.icon = (this.root.id == node.pid) ? this.icon.root : ((node._hc) ? this.icon.folder : this.icon.node);
        if (!node.iconOpen) node.iconOpen = (node._hc) ? this.icon.folderOpen : this.icon.node;
        if (this.root.id == node.pid) {
            node.icon = this.icon.root;
            node.iconOpen = this.icon.root;
        }
        str += '<img id="i' + this.obj + nodeId + '" src="' + ((node._io) ? node.iconOpen : node.icon) + '" alt="" />';
    }
    if (node.url) {
        str += '<a id="s' + this.obj + nodeId + '" class="' + ((this.config.useSelection) ? ((node._is ? 'nodeSel' : 'node')) : 'node') + '"';
        if (node.target) str += ' target="' + node.target + '"';
        if (this.config.useStatusText) str += ' onmouseover="window.status=\'' + node.name + '\';return true;" onmouseout="window.status=\'\';return true;" ';

        var clc = "";
        if (this.config.useSelection && ((node._hc && this.config.folderLinks) || !node._hc)) clc += this.obj + ".s(" + nodeId + ");";
        if (node.page != null) clc += "js" + this.mobileViewerId + ".postAction('BookmarkAction'," + node.page + ",'" + node.url.substr(1) + "');";
        if (clc.length > 0 && node.page >= 0) str += ' onclick="' + clc + '"';

        str += '>';
    }
    else if ((!this.config.folderLinks || !node.url) && node._hc && node.pid != this.root.id)
        str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');" class="node">';
    str += node.name;
    if (node.url || ((!this.config.folderLinks || !node.url) && node._hc)) str += '</a>';
    str += '</div>';
    if (node._hc) {
        str += '<div id="d' + this.obj + nodeId + '" class="clip" style="display:' + ((this.root.id == node.pid || node._io) ? 'block' : 'none') + ';">';
        str += this.addNode(node);
        str += '</div>';
    }
    this.aIndent.pop();
    return str;
}

// Adds the empty and line icons
stiTree.prototype.indent = function (node, nodeId) {
    var str = '';
    if (this.root.id != node.pid) {
        for (var n = 0; n < this.aIndent.length; n++)
            str += '<img src="' + ((this.aIndent[n] == 1 && this.config.useLines) ? this.icon.line : this.icon.empty) + '" alt="" />';
        (node._ls) ? this.aIndent.push(0) : this.aIndent.push(1);
        if (node._hc) {
            str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');"><img id="j' + this.obj + nodeId + '" src="';
            if (!this.config.useLines) str += (node._io) ? this.icon.nlMinus : this.icon.nlPlus;
            else str += ((node._io) ? ((node._ls && this.config.useLines) ? this.icon.minusBottom : this.icon.minus) : ((node._ls && this.config.useLines) ? this.icon.plusBottom : this.icon.plus));
            str += '" alt="" /></a>';
        } else str += '<img src="' + ((this.config.useLines) ? ((node._ls) ? this.icon.joinBottom : this.icon.join) : this.icon.empty) + '" alt="" />';
    }
    return str;
}

// Checks if a node has any children and if it is the last sibling
stiTree.prototype.setCS = function (node) {
    var lastId;
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.id) node._hc = true;
        if (this.aNodes[n].pid == node.pid) lastId = this.aNodes[n].id;
    }
    if (lastId == node.id) node._ls = true;
}

// Returns the selected node
stiTree.prototype.getSelected = function () {
    var sn = this.getCookie('cs' + this.obj);
    return (sn) ? sn : null;
}

// Highlights the selected node
stiTree.prototype.s = function (id) {
    if (!this.config.useSelection) return;
    var cn = this.aNodes[id];
    if (cn._hc && !this.config.folderLinks) return;
    if (this.selectedNode != id) {
        if (this.selectedNode || this.selectedNode == 0) {
            eOld = document.getElementById("s" + this.obj + this.selectedNode);
            eOld.className = "node";
        }
        eNew = document.getElementById("s" + this.obj + id);
        eNew.className = "nodeSel";
        this.selectedNode = id;
        if (this.config.useCookies) this.setCookie('cs' + this.obj, cn.id);
    }
}

// Toggle Open or close
stiTree.prototype.o = function (id) {
    // debugger;
    var cn = this.aNodes[id];
    this.nodeStatus(!cn._io, id, cn._ls);
    cn._io = !cn._io;
    if (this.config.closeSameLevel) this.closeLevel(cn);
    if (this.config.useCookies) this.updateCookie();
}

// Open or close all nodes
stiTree.prototype.oAll = function (status) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n]._hc && this.aNodes[n].pid != this.root.id) {
            this.nodeStatus(status, n, this.aNodes[n]._ls)
            this.aNodes[n]._io = status;
        }
    }
    if (this.config.useCookies) this.updateCookie();
}

// Opens the tree to a specific node
stiTree.prototype.openTo = function (nId, bSelect, bFirst) {
    if (!bFirst) {
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n].id == nId) {
                nId = n;
                break;
            }
        }
    }
    var cn = this.aNodes[nId];
    if (cn.pid == this.root.id || !cn._p) return;
    cn._io = true;
    cn._is = bSelect;
    if (this.completed && cn._hc) this.nodeStatus(true, cn._ai, cn._ls);
    if (this.completed && bSelect) this.s(cn._ai);
    else if (bSelect) this._sn = cn._ai;
    this.openTo(cn._p._ai, false, true);
}

// Closes all nodes on the same level as certain node
stiTree.prototype.closeLevel = function (node) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.pid && this.aNodes[n].id != node.id && this.aNodes[n]._hc) {
            this.nodeStatus(false, n, this.aNodes[n]._ls);
            this.aNodes[n]._io = false;
            this.closeAllChildren(this.aNodes[n]);
        }
    }
}

// Closes all children of a node
stiTree.prototype.closeAllChildren = function (node) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.id && this.aNodes[n]._hc) {
            if (this.aNodes[n]._io) this.nodeStatus(false, n, this.aNodes[n]._ls);
            this.aNodes[n]._io = false;
            this.closeAllChildren(this.aNodes[n]);
        }
    }
}

// Change the status of a node(open or closed)
stiTree.prototype.nodeStatus = function (status, id, bottom) {
    eDiv = document.getElementById('d' + this.obj + id);
    eJoin = document.getElementById('j' + this.obj + id);
    if (this.config.useIcons) {
        eIcon = document.getElementById('i' + this.obj + id);
        eIcon.src = (status) ? this.aNodes[id].iconOpen : this.aNodes[id].icon;
    }
    eJoin.src = (this.config.useLines) ?
	((status) ? ((bottom) ? this.icon.minusBottom : this.icon.minus) : ((bottom) ? this.icon.plusBottom : this.icon.plus)) :
	((status) ? this.icon.nlMinus : this.icon.nlPlus);
    eDiv.style.display = (status) ? 'block' : 'none';
}

// [Cookie] Clears a cookie
stiTree.prototype.clearCookie = function () {
    var now = new Date();
    var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
    this.setCookie('co' + this.obj, 'cookieValue', yesterday);
    this.setCookie('cs' + this.obj, 'cookieValue', yesterday);
}

// [Cookie] Sets value in a cookie
stiTree.prototype.setCookie = function (cookieName, cookieValue, expires, path, domain, secure) {
    document.cookie =
		escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
}

// [Cookie] Gets a value from a cookie
stiTree.prototype.getCookie = function (cookieName) {
    var cookieValue = '';
    var posName = document.cookie.indexOf(escape(cookieName) + '=');
    if (posName != -1) {
        var posValue = posName + (escape(cookieName) + '=').length;
        var endPos = document.cookie.indexOf(';', posValue);
        if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));
        else cookieValue = unescape(document.cookie.substring(posValue));
    }
    return (cookieValue);
}

// [Cookie] Returns ids of open nodes as a string
stiTree.prototype.updateCookie = function () {
    var str = '';
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n]._io && this.aNodes[n].pid != this.root.id) {
            if (str) str += '.';
            str += this.aNodes[n].id;
        }
    }
    this.setCookie('co' + this.obj, str);
}

// [Cookie] Checks if a node id is in a cookie
stiTree.prototype.isOpen = function (id) {
    var aOpen = this.getCookie('co' + this.obj).split('.');
    for (var n = 0; n < aOpen.length; n++)
        if (aOpen[n] == id) return true;
    return false;
}

// If Push and pop is not implemented by the browser
if (!Array.prototype.push) {
    Array.prototype.push = function array_push() {
        for (var i = 0; i < arguments.length; i++)
            this[this.length] = arguments[i];
        return this.length;
    }
}

if (!Array.prototype.pop) {
    Array.prototype.pop = function array_pop() {
        lastElement = this[this.length - 1];
        this.length = Math.max(this.length - 1, 0);
        return lastElement;
    }
}

StiMvcViewer.prototype.InitializeInteractions = function (page) {

    page.paintSortingArrow = function (component, sort) {
        var page = this.jsObject.getPageFromAnchorElement(component);
        var componentLeftPos = this.jsObject.FindPosX(component, "stiMvcViewerReportPanel", true);
        var pageLeftPos = page ? this.jsObject.FindPosX(page, "stiMvcViewerReportPanel", true) : componentLeftPos;

        var arrowImg = document.createElement("img");
        arrowImg.src = sort == "asc" ? this.jsObject.collections.images["ArrowDown.png"] : this.jsObject.collections.images["ArrowUp.png"];
        arrowImg.style.position = "absolute";
        var arrowWidth = (this.jsObject.options.zoom / 100) * 9;
        var arrowHeight = (this.jsObject.options.zoom / 100) * 5;
        arrowImg.style.width = arrowWidth + "px";
        arrowImg.style.height = arrowHeight + "px";
        arrowImg.style.marginLeft = arrowWidth + "px";
        arrowImg.style.marginTop = arrowHeight + "px";
        component.appendChild(arrowImg);
    }

    page.paintCollapsingIcon = function (component, collapsed) {
        var page = this.jsObject.getPageFromAnchorElement(component);
        var componentLeftPos = this.jsObject.FindPosX(component, "stiMvcViewerReportPanel", true);
        var pageLeftPos = page ? this.jsObject.FindPosX(page, "stiMvcViewerReportPanel", true) : componentLeftPos;

        var collapsImg = document.createElement("img");
        collapsImg.src = collapsed ? this.jsObject.collections.images["CollapsingPlus.png"] : this.jsObject.collections.images["CollapsingMinus.png"];
        collapsImg.style.position = "absolute";
        var collapsWidth = (this.jsObject.options.zoom / 100) * 10;
        var collapsHeight = (this.jsObject.options.zoom / 100) * 10;
        collapsImg.style.width = collapsWidth + "px";
        collapsImg.style.height = collapsHeight + "px";
        collapsImg.style.marginTop = collapsHeight + "px";
        component.appendChild(collapsImg);
    }

    page.postInteractionSorting = function (component, isCtrl) {
        var params = {
            "action": "sorting",
            "parameters": {
                "ComponentName": component.getAttribute("interaction") + ";" + isCtrl.toString(),
                "DataBand": component.getAttribute("databandsort")
            }
        };

        if (this.jsObject.controls.parametersPanel) {
            params.variables = this.jsObject.controls.parametersPanel.getParametersValues();
        }

        this.jsObject.postInteraction(params);
    }

    page.postInteractionDrillDown = function (component) {
        var params = {
            "action": "drilldown",
            "parameters": {
                "ComponentIndex": component.getAttribute("compindex"),
                "PageIndex": component.getAttribute("pageindex"),
                "PageGuid": component.getAttribute("pageguid"),
                "ReportFile": null
            }
        };

        this.jsObject.postInteraction(params);
    }

    page.postInteractionCollapsing = function (component) {
        var componentName = component.getAttribute("interaction");
        var collapsingIndex = component.getAttribute("compindex");
        var collapsed = component.getAttribute("collapsed") == "true" ? false : true;

        if (!this.jsObject.options.interactionCollapsingStates) this.jsObject.options.interactionCollapsingStates = {};
        if (!this.jsObject.options.interactionCollapsingStates[componentName]) this.jsObject.options.interactionCollapsingStates[componentName] = {};
        this.jsObject.options.interactionCollapsingStates[componentName][collapsingIndex] = collapsed;

        var params = {
            "action": "collapsing",
            "parameters": {
                "ComponentName": componentName,
                "InteractionCollapsingStates": this.jsObject.options.interactionCollapsingStates
            }
        };

        if (this.jsObject.controls.parametersPanel) {
            params.variables = this.jsObject.controls.parametersPanel.getParametersValues();
        }

        this.jsObject.postInteraction(params);
    }

    var elems = page.getElementsByTagName('TD');
    var collapsedIndexes = [];
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].getAttribute("interaction") && (
                elems[i].getAttribute("pageguid") ||
                elems[i].getAttribute("collapsed") ||
                elems[i].getAttribute("databandsort"))) {

            elems[i].style.cursor = "pointer";
            elems[i].jsObject = this;

            var sort = elems[i].getAttribute("sort");
            if (sort) {
                page.paintSortingArrow(elems[i], sort);
            }

            var collapsed = elems[i].getAttribute("collapsed");
            if (collapsed) {
                var compIndex = elems[i].getAttribute("compindex");
                if (collapsedIndexes.indexOf(compIndex) < 0) {
                    page.paintCollapsingIcon(elems[i], collapsed == "true");
                    collapsedIndexes.push(compIndex);
                }
            }

            elems[i].onclick = function (e) {
                if (this.getAttribute("pageguid")) page.postInteractionDrillDown(this);
                else if (this.getAttribute("collapsed")) page.postInteractionCollapsing(this);
                else page.postInteractionSorting(this, e.ctrlKey);
            }
        }
    }
}

StiMvcViewer.prototype.DropDownList = function (name, width, toolTip, items, readOnly, showImage) {
    var dropDownList = this.CreateHTMLTable();
    dropDownList.style.fontFamily = this.options.toolbar.fontFamily;
    if (this.options.toolbar.fontColor != "") dropDownList.style.color = this.options.toolbar.fontColor;
    dropDownList.jsObject = this;
    dropDownList.name = name;
    dropDownList.key = null;
    dropDownList.imageCell = null;
    dropDownList.readOnly = readOnly;
    dropDownList.items = (items == null) ? {} : items;
    dropDownList.isEnabled = true;
    dropDownList.isSelected = false;
    dropDownList.isOver = false;
    dropDownList.isFocused = false;
    dropDownList.fullWidth = width + 3;
    if (toolTip) dropDownList.setAttribute("title", toolTip);
    var textBoxWidth = width - (this.options.isTouchDevice ? 23 : 15) - (showImage ? 38 : 0);
    dropDownList.className = "stiMvcViewerDropDownList";
    if (name) {
        if (!this.controls.dropDownLists) this.controls.dropDownLists = {};
        this.controls.dropDownLists[name] = dropDownList;
    }

    // Image
    if (showImage) {
        dropDownList.image = document.createElement("div");
        dropDownList.image.dropDownList = dropDownList;
        dropDownList.image.jsObject = this;
        dropDownList.image.className = "stiMvcViewerDropDownListImage";
        dropDownList.imageCell.style.lineHeight = "0";
        dropDownList.imageCell = dropDownList.addCell(dropDownList.image);
        if (readOnly) {
            dropDownList.image.onclick = function () { if (!this.isTouchProcessFlag) this.dropDownList.button.onclick(); }
            dropDownList.image.ontouchend = function () {
                this.isTouchProcessFlag = true;
                this.dropDownList.button.ontouchend();
                var this_ = this;
                setTimeout(function () {
                    this_.isTouchProcessFlag = false;
                }, 1000);
            }
        }
    }

    // TextBox
    dropDownList.textBox = document.createElement("input");
    dropDownList.textBox.jsObject = this;
    dropDownList.addCell(dropDownList.textBox);
    dropDownList.textBox.style.width = textBoxWidth + "px";
    dropDownList.textBox.dropDownList = dropDownList;
    dropDownList.textBox.readOnly = readOnly;
    dropDownList.textBox.style.border = 0;
    dropDownList.textBox.style.cursor = readOnly ? "default" : "text";
    dropDownList.textBox.style.fontFamily = this.options.toolbar.fontFamily;
    if (this.options.toolbar.fontColor != "") dropDownList.textBox.style.color = this.options.toolbar.fontColor;
    dropDownList.textBox.style.height = this.options.isTouchDevice ? "23px" : "18px";
    dropDownList.textBox.style.lineHeight = dropDownList.textBox.style.height;
    dropDownList.textBox.className = "stiMvcViewerDropDownList_TextBox";
    if (readOnly) {
        dropDownList.textBox.onclick = function () { if (!this.isTouchProcessFlag) this.dropDownList.button.onclick(); }
        dropDownList.textBox.ontouchend = function () {
            this.isTouchProcessFlag = true;
            this.dropDownList.button.ontouchend();
            var this_ = this;
            setTimeout(function () {
                this_.isTouchProcessFlag = false;
            }, 1000);
        }
    }
    dropDownList.textBox.action = function () { if (!this.dropDownList.readOnly) { this.dropDownList.setKey(this.value); this.dropDownList.action(); } }
    dropDownList.textBox.onfocus = function () { this.isFocused = true; this.dropDownList.isFocused = true; this.dropDownList.setSelected(true); }
    dropDownList.textBox.onblur = function () { this.isFocused = false; this.dropDownList.isFocused = false; this.dropDownList.setSelected(false); this.action(); }
    dropDownList.textBox.onkeypress = function (event) {
        if (this.dropDownList.readOnly) return false;
        if (event && event.keyCode == 13) {
            this.action();
            return false;
        }
    }

    // DropDownButton
    dropDownList.button = this.SmallButton(null, null, "ButtonArrowDown.png", null, null, "stiMvcViewerDropDownListButton");
    dropDownList.button.style.height = this.isTouchDevice ? "26px" : "21px";
    dropDownList.addCell(dropDownList.button);
    dropDownList.button.dropDownList = dropDownList;
    dropDownList.button.action = function () {
        if (!this.dropDownList.menu.visible) {
            if (this.dropDownList.menu.isDinamic) this.dropDownList.menu.addItems(this.dropDownList.items);
            this.dropDownList.menu.changeVisibleState(true);
        }
        else
            this.dropDownList.menu.changeVisibleState(false);
    }


    // Menu
    dropDownList.menu = this.DropDownListMenu(dropDownList);
    this.controls.mainPanel.appendChild(dropDownList.menu);
    dropDownList.menu.isDinamic = (items == null);
    if (items != null) dropDownList.menu.addItems(items);

    dropDownList.onmouseover = function () {
        if (this.jsObject.options.isTouchDevice || !this.isEnabled) return;
        this.isOver = true;
        if (!this.isSelected && !this.isFocused) this.className = "stiMvcViewerDropDownListOver";
    }

    dropDownList.onmouseout = function () {
        if (this.jsObject.options.isTouchDevice || !this.isEnabled) return;
        this.isOver = false;
        if (!this.isSelected && !this.isFocused) this.className = "stiMvcViewerDropDownList";
    }

    dropDownList.setEnabled = function (state) {
        this.isEnabled = state;
        this.button.setEnabled(state);
        this.textBox.disabled = !state;
        this.textBox.style.visibility = state ? "visible" : "hidden";
        this.className = state ? "stiMvcViewerDropDownList" : "stiMvcViewerDropDownListDisabled";
        if (this.imageCell) this.image.style.visibility = state ? "visible" : "hidden";
    }

    dropDownList.setSelected = function (state) {
        this.isSelected = state;
        this.className = state ? "stiMvcViewerDropDownListOver" :
            (this.isEnabled ? (this.isOver ? "stiMvcViewerDropDownListOver" : "stiMvcViewerDropDownList") : "stiMvcViewerDropDownListDisabled");
    }

    dropDownList.setKey = function (key) {
        this.key = key;
        for (var itemName in this.items)
            if (key == this.items[itemName].key) {
                this.textBox.value = this.items[itemName].caption;
                if (this.image) this.image.style.background = "url(" + this.jsObject.collections.images[this.items[itemName].imageName] + ")";
                return;
            }
        this.textBox.value = key.toString();
    }

    dropDownList.haveKey = function (key) {
        for (var num in this.items)
            if (this.items[num].key == key) return true;
        return false;
    }

    dropDownList.action = function () { }

    return dropDownList;
}

StiMvcViewer.prototype.DropDownListMenu = function (dropDownList) {
    var menu = this.VerticalMenu(dropDownList.name || this.generateKey(), dropDownList.button, "Down", dropDownList.items, "stiMvcViewerMenuStandartItem", "stiMvcViewerDropdownMenu");
    menu.dropDownList = dropDownList;
    menu.innerContent.style.minWidth = dropDownList.fullWidth + "px";

    menu.changeVisibleState = function (state) {
        var mainClassName = "stiMvcViewerMainPanel";
        if (state) {
            this.onshow();
            this.style.display = "";
            this.visible = true;
            this.style.overflow = "hidden";
            this.parentButton.dropDownList.setSelected(true);
            this.parentButton.setSelected(true);
            this.jsObject.options.currentDropDownListMenu = this;
            this.style.width = this.innerContent.offsetWidth + "px";
            this.style.height = this.innerContent.offsetHeight + "px";
            this.style.left = (this.jsObject.FindPosX(this.parentButton.dropDownList, mainClassName)) + "px";
            this.style.top = (this.jsObject.FindPosY(this.parentButton.dropDownList, mainClassName) + this.parentButton.offsetHeight + 3) + "px";
            this.innerContent.style.top = -this.innerContent.offsetHeight + "px";

            d = new Date();
            var endTime = d.getTime();
            if (this.jsObject.options.toolbar.menuAnimation) endTime += this.jsObject.options.menuAnimDuration;
            this.jsObject.ShowAnimationVerticalMenu(this, 0, endTime);
        }
        else {
            clearTimeout(this.innerContent.animationTimer);
            this.visible = false;
            this.parentButton.dropDownList.setSelected(false);
            this.parentButton.setSelected(false);
            this.style.display = "none";
            if (this.jsObject.options.currentDropDownListMenu == this) this.jsObject.options.currentDropDownListMenu = null;
        }
    }

    menu.onmousedown = function () { if (this.jsObject.options.isTouchDevice) return; this.ontouchstart(); }
    menu.ontouchstart = function () { this.jsObject.options.dropDownListMenuPressed = this; }

    menu.action = function (menuItem) {
        this.changeVisibleState(false);
        this.dropDownList.key = menuItem.key;
        this.dropDownList.textBox.value = menuItem.caption.innerHTML;
        if (this.dropDownList.image) this.dropDownList.image.style.background = "url(" + this.jsObject.collections.images[menuItem.imageName] + ")";
        this.dropDownList.action();
    }

    menu.onshow = function () {
        if (this.dropDownList.key == null) return;
        for (var itemName in this.items) {
            if (this.dropDownList.key == this.items[itemName].key) {
                this.items[itemName].setSelected(true);
                return;
            }
            else
                this.items[itemName].setSelected(false);
        }
    }

    return menu;
}


StiMvcViewer.prototype.RadioButton = function (name, groupName, caption, tooltip) {
    var radioButton = this.CreateHTMLTable();
    radioButton.style.fontFamily = this.options.toolbar.fontFamily;
    radioButton.jsObject = this;
    radioButton.name = name;
    radioButton.isEnabled = true;
    radioButton.isChecked = false;
    radioButton.groupName = groupName;
    radioButton.className = "stiMvcViewerRadioButton";
    radioButton.captionText = caption;
    if (tooltip) radioButton.setAttribute("title", tooltip);
    if (name) {
        if (!this.controls.radioButtons) this.controls.radioButtons = {};
        this.controls.radioButtons[name] = radioButton;
    }

    radioButton.outCircle = document.createElement("div");
    radioButton.outCircle.className = "stiMvcViewerRadioButtonOutCircle";
    radioButton.circleCell = radioButton.addCell(radioButton.outCircle);

    radioButton.innerCircle = document.createElement("div");
    radioButton.innerCircle.style.visibility = "hidden";
    radioButton.innerCircle.className = "stiMvcViewerRadioButtonInnerCircle";

    radioButton.innerCircle.style.margin = this.options.isTouchDevice ? "4px" : "3px";
    radioButton.innerCircle.style.width = this.options.isTouchDevice ? "9px" : "7px";
    radioButton.innerCircle.style.height = this.options.isTouchDevice ? "9px" : "7px";
    radioButton.outCircle.appendChild(radioButton.innerCircle);

    // Caption
    if (caption != null) {
        radioButton.captionCell = radioButton.addCell();
        radioButton.captionCell.style.paddingLeft = "4px";
        radioButton.captionCell.style.whiteSpace = "nowrap";
        radioButton.captionCell.innerHTML = caption;
    }

    radioButton.lastCell = radioButton.addCell();

    radioButton.onmouseover = function () {
        if (this.isTouchProcessFlag || !this.isEnabled) return;
        this.outCircle.className = "stiMvcViewerRadioButtonOutCircleOver";
    }

    radioButton.onmouseout = function () {
        if (this.isTouchProcessFlag || !this.isEnabled) return;
        this.outCircle.className = "stiMvcViewerRadioButtonOutCircle";
    }

    radioButton.onclick = function () {
        if (this.isTouchProcessFlag || !this.isEnabled) return;
        radioButton.setChecked(true);
        radioButton.action();
    }

    radioButton.ontouchend = function () {
        if (!this.isEnabled || this.jsObject.options.fingerIsMoved) return;
        this.isTouchProcessFlag = true;
        this.outCircle.className = "stiMvcViewerRadioButtonOutCircleOver";
        var this_ = this;
        setTimeout(function () {
            this_.outCircle.className = "stiMvcViewerRadioButtonOutCircle";
            this_.setChecked(true);
            this_.action();
        }, 150);
        setTimeout(function () {
            this_.isTouchProcessFlag = false;
        }, 1000);
    }

    radioButton.ontouchstart = function () {
        this.jsObject.options.fingerIsMoved = false;
    }

    radioButton.setEnabled = function (state) {
        this.innerCircle.style.opacity = state ? "1" : "0.5";
        this.isEnabled = state;
        this.className = state ? "stiMvcViewerRadioButton" : "stiMvcViewerRadioButtonDisabled";
        this.outCircle.className = state ? "stiMvcViewerRadioButtonOutCircle" : "stiMvcViewerRadioButtonOutCircleDisabled";
    }

    radioButton.setChecked = function (state) {
        if (this.groupName && state)
            for (var name in this.jsObject.controls.radioButtons) {
                if (this.groupName == this.jsObject.controls.radioButtons[name].groupName)
                    this.jsObject.controls.radioButtons[name].setChecked(false);
            }

        this.innerCircle.style.visibility = (state) ? "visible" : "hidden";
        this.isChecked = state;
        this.onChecked();
    }

    radioButton.onChecked = function () { }
    radioButton.action = function () { }

    return radioButton;
}

StiMvcViewer.prototype.CreateHTMLTable = function (rowsCount, cellsCount) {
    var table = document.createElement("table");
    table.jsObject = this;
    this.clearStyles(table);
    table.cellPadding = 0;
    table.cellSpacing = 0;
    table.tbody = document.createElement("tbody");
    table.appendChild(table.tbody);
    table.tr = [];
    table.tr[0] = document.createElement("tr");
    this.clearStyles(table.tr[0]);
    table.tbody.appendChild(table.tr[0]);

    table.addCell = function (control) {
        var cell = document.createElement("td");
        this.jsObject.clearStyles(cell);
        this.tr[0].appendChild(cell);
        if (control) cell.appendChild(control);

        return cell;
    }

    table.addCellInNextRow = function (control) {
        var rowCount = this.tr.length;
        this.tr[rowCount] = document.createElement("tr");
        this.jsObject.clearStyles(this.tr[rowCount]);
        this.tbody.appendChild(this.tr[rowCount]);
        var cell = document.createElement("td");
        this.jsObject.clearStyles(cell);
        this.tr[rowCount].appendChild(cell);
        if (control) cell.appendChild(control);

        return cell;
    }

    table.addCellInLastRow = function (control) {
        var rowCount = this.tr.length;
        var cell = document.createElement("td");
        this.jsObject.clearStyles(cell);
        this.tr[rowCount - 1].appendChild(cell);
        if (control) cell.appendChild(control);

        return cell;
    }

    table.addTextCellInLastRow = function (text) {
        var rowCount = this.tr.length;
        var cell = document.createElement("td");
        this.jsObject.clearStyles(cell);
        this.tr[rowCount - 1].appendChild(cell);
        cell.innerHTML = text;

        return cell;
    }

    table.addCellInRow = function (rowNumber, control) {
        var cell = document.createElement("td");
        this.jsObject.clearStyles(cell);
        this.tr[rowNumber].appendChild(cell);
        if (control) cell.appendChild(control);

        return cell;
    }

    table.addTextCell = function (text) {
        var cell = document.createElement("td");
        this.jsObject.clearStyles(cell);
        this.tr[0].appendChild(cell);
        cell.innerHTML = text;

        return cell;
    }

    table.addRow = function () {
        var rowCount = this.tr.length;
        this.tr[rowCount] = document.createElement("tr");
        this.jsObject.clearStyles(this.tr[rowCount]);
        this.tbody.appendChild(this.tr[rowCount]);

        return this.tr[rowCount];
    }

    return table;
}

StiMvcViewer.prototype.InitializeProcessImage = function () {
    /*var processImage = document.createElement("div");
    processImage.style.fontFamily = this.options.toolbar.fontFamily;
    var innerTable = this.CreateHTMLTable();
    processImage.appendChild(innerTable);
    processImage.jsObject = this;
    processImage.style.display = "none";
    processImage.className = "stiMvcViewerProcessImage";
    this.controls.processImage = processImage;
    this.controls.mainPanel.appendChild(processImage);

    //Image
    var processImageIMG = document.createElement("img");
    processImage.img = processImageIMG;
    processImageIMG.src = this.collections.images["Loading.gif"];
    innerTable.addCell(processImageIMG).style.padding = "5px 7px 5px 30px";

    var textCell = innerTable.addCell();
    textCell.innerHTML = this.collections.loc["Loading"];
    textCell.style.padding = "5px 30px 5px 0";*/

    var processImage = this.Progress();
    processImage.jsObject = this;
    processImage.style.display = "none";
    this.controls.processImage = processImage;
    this.controls.mainPanel.appendChild(processImage);

    processImage.show = function () {
        this.style.display = "";
        this.jsObject.setObjectToCenter(this);
    }

    processImage.hide = function () {
        this.style.display = "none";
    }

    return processImage;
}

StiMvcViewer.prototype.Progress = function () {
    var progressContainer = document.createElement("div");
    progressContainer.style.position = "absolute";
    progressContainer.style.zIndex = "1000";

    var progress = document.createElement("div");
    progressContainer.appendChild(progress);
    progress.className = "mvc_viewer_loader";

    return progressContainer;
}

StiMvcViewer.prototype.InitializeMvcViewer = function () {
    this.controls.viewer.jsObject = this;

    this.controls.viewer.pressedDown = function () {
        var options = this.jsObject.options;

        this.jsObject.removeBookmarksLabel();

        // Close Current Menu
        if (options.currentMenu != null)
            if (options.menuPressed != options.currentMenu && options.currentMenu.parentButton != options.buttonPressed && !options.datePickerPressed && !options.dropDownListMenuPressed)
                options.currentMenu.changeVisibleState(false);

        // Close Current DropDownList
        if (options.currentDropDownListMenu != null)
            if (options.dropDownListMenuPressed != options.currentDropDownListMenu && options.currentDropDownListMenu.parentButton != options.buttonPressed)
                options.currentDropDownListMenu.changeVisibleState(false);

        // Close Current DatePicker
        if (options.currentDatePicker != null)
            if (options.datePickerPressed != options.currentDatePicker && options.currentDatePicker.parentButton != options.buttonPressed)
                options.currentDatePicker.changeVisibleState(false);

        options.buttonPressed = false;
        options.menuPressed = false;
        options.formPressed = false;
        options.dropDownListMenuPressed = false;
        options.disabledPanelPressed = false;
        options.datePickerPressed = false;
        options.fingerIsMoved = false;
    }

    this.controls.viewer.onmousedown = function () {
        if (this.isTouchProcessFlag) return;
        this.pressedDown();
    }

    this.controls.viewer.ontouchstart = function () {
        if (this.jsObject.options.buttonsTimer) {
            clearTimeout(this.jsObject.options.buttonsTimer[2]);
            this.jsObject.options.buttonsTimer[0].className = this.jsObject.options.buttonsTimer[1];
            this.jsObject.options.buttonsTimer = null;
        }
        this.pressedDown();
    }

    this.controls.viewer.onmouseup = function () {
        if (this.isTouchProcessFlag) return;
        this.ontouchend();
    }

    this.controls.viewer.ontouchend = function () {
        var this_ = this;
        this.isTouchProcessFlag = true;
        this.jsObject.options.fingerIsMoved = false;
        setTimeout(function () {
            this_.isTouchProcessFlag = false;
        }, 1000);
    }

    this.controls.viewer.ontouchmove = function () {
        this.jsObject.options.fingerIsMoved = true;
    }
}

StiMvcViewer.prototype.CreateParameter = function (params) {
    var parameter = this.CreateHTMLTable();
    this.options.parameters[params.name] = parameter;
    parameter.params = params;
    parameter.controls = {};
    parameter.jsObject = this;
    parameter.params.isNull = false;
    parameter.menu = null;

    parameter.addCell = function (control) {
        var cell = document.createElement("td");
        cell.style.height = parameter.jsObject.options.parameterRowHeight + "px";
        cell.style.padding = "0px 2px 0 2px";
        this.tr[0].appendChild(cell);
        if (control) cell.appendChild(control);

        return cell;
    }

    // boolCheckBox
    if (parameter.params.type == "Bool" && (parameter.params.basicType == "Value" || parameter.params.basicType == "NullableValue"))
        parameter.addCell(this.CreateBoolCheckBox(parameter));
    // labelFrom
    if (parameter.params.basicType == "Range") parameter.addCell().innerHTML = this.collections.loc["RangeFrom"];
    // firstTextBox
    if (parameter.params.type != "Bool" || parameter.params.basicType == "List") parameter.addCell(this.CreateFirstTextBox(parameter));
    // firstDateTimeButton
    if (parameter.params.type == "DateTime" && parameter.params.allowUserValues && parameter.params.basicType != "List")
        parameter.addCell(this.CreateFirstDateTimeButton(parameter));
    // firstGuidButton
    if (parameter.params.type == "Guid" && parameter.params.allowUserValues && parameter.params.basicType != "List") parameter.addCell(this.CreateFirstGuidButton(parameter));
    // labelTo
    if (parameter.params.basicType == "Range") parameter.addCell().innerHTML = this.collections.loc["RangeTo"];
    // secondTextBox
    if (parameter.params.basicType == "Range") parameter.addCell(this.CreateSecondTextBox(parameter));
    // secondDateTimeButton
    if (parameter.params.basicType == "Range" && parameter.params.type == "DateTime" && parameter.params.allowUserValues) parameter.addCell(this.CreateSecondDateTimeButton(parameter));
    // secondGuidButton
    if (parameter.params.basicType == "Range" && parameter.params.type == "Guid" && parameter.params.allowUserValues) parameter.addCell(this.CreateSecondGuidButton(parameter));
    // dropDownButton
    if (parameter.params.items != null || (parameter.params.basicType == "List" && parameter.params.allowUserValues)) parameter.addCell(this.CreateDropDownButton(parameter));
    // nullableCheckBox
    if (parameter.params.basicType == "NullableValue" && parameter.params.allowUserValues) parameter.addCell(this.CreateNullableCheckBox(parameter));
    // nullableText
    if (parameter.params.basicType == "NullableValue" && parameter.params.allowUserValues) {
        var nullableCell = parameter.addCell();
        nullableCell.innerHTML = "Null";
        nullableCell.style.padding = "0px";
    }

    parameter.setEnabled = function (state) {
        this.params.isNull = !state;
        for (var controlName in this.controls) {
            this.controls[controlName].setEnabled(state);
        }
    }

    parameter.changeVisibleStateMenu = function (state) {
        if (state) {
            var menu = null;
            switch (this.params.basicType) {
                case "Value":
                case "NullableValue":
                    menu = this.jsObject.parameterMenuForValue(this);
                    break;

                case "Range":
                    menu = this.jsObject.parameterMenuForRange(this);
                    break;

                case "List":
                    menu = (this.params.allowUserValues) ? this.jsObject.parameterMenuForEditList(this) : this.jsObject.parameterMenuForNotEditList(this);
                    break;
            }

            if (menu != null) menu.changeVisibleState(true);
        }
        else {
            if (parameter.menu != null) {
                if (parameter.params.allowUserValues && parameter.params.basicType == "List") parameter.menu.updateItems();
                parameter.menu.changeVisibleState(false);
            }
        }
    }

    parameter.getStringDateTime = function (object) {
        return object.month + "/" + object.day + "/" + object.year + " " +
            (object.hours > 12 ? object.hours - 12 : object.hours) + ":" + object.minutes + ":" + object.seconds + " " +
            (object.hours < 12 ? "AM" : "PM");
    }

    parameter.getValue = function () {
        var value = null;
        if (parameter.params.isNull) return null;

        if (parameter.params.basicType == "Value" || parameter.params.basicType == "NullableValue") {
            if (parameter.params.type == "Bool") return parameter.controls.boolCheckBox.isChecked;
            if (parameter.params.type == "DateTime") return this.getStringDateTime(parameter.params.key);
            value = parameter.params.allowUserValues ? parameter.controls.firstTextBox.value : parameter.params.key;
        }

        if (parameter.params.basicType == "Range") {
            value = {};
            value.from = (parameter.params.type == "DateTime") ? this.getStringDateTime(parameter.params.key) : parameter.controls.firstTextBox.value;
            value.to = (parameter.params.type == "DateTime") ? this.getStringDateTime(parameter.params.keyTo) : parameter.controls.secondTextBox.value;
        }

        if (parameter.params.basicType == "List") {
            value = []
            if (parameter.params.allowUserValues)
                for (var index in parameter.params.items) value[index] =
                    (parameter.params.type == "DateTime")
                        ? this.getStringDateTime(parameter.params.items[index].key)
                        : parameter.params.items[index].key;
            else {
                num = 0;
                for (var index in parameter.params.items)
                    if (parameter.params.items[index].isChecked) {
                        value[num] = (parameter.params.type == "DateTime")
                            ? this.getStringDateTime(parameter.params.items[index].key)
                            : parameter.params.items[index].key;
                        num++;
                    }
            }
        }

        return value;
    };

    // Methods For Reports Server

    parameter.getDateTimeForReportServer = function (value) {
        var date = new Date(value.year, value.month - 1, value.day, value.hours, value.minutes, value.seconds);
        return (parameter.jsObject.options.cloudReportsClient.options.const_dateTime1970InTicks + date * 10000).toString();
    }

    parameter.getTimeSpanForReportServer = function (value) {
        var jsObject = parameter.jsObject;

        var timeArray = value.split(":");
        var daysHoursArray = timeArray[0].split(".");
        var days = (daysHoursArray.length > 1) ? jsObject.strToInt(daysHoursArray[0]) : 0;
        var hours = jsObject.strToInt((daysHoursArray.length > 1) ? daysHoursArray[1] : daysHoursArray[0]);
        var minutes = (timeArray.length > 1) ? jsObject.strToInt(timeArray[1]) : 0;
        var seconds = (timeArray.length > 2) ? jsObject.strToInt(timeArray[2]) : 0;

        return ((days * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000) * 10000).toString();
    }

    parameter.getSingleValueForReportServer = function () {
        var value = null;
        if (parameter.params.isNull) return null;

        if (parameter.params.basicType == "Value" || parameter.params.basicType == "NullableValue") {
            if (parameter.params.type == "Bool") return parameter.controls.boolCheckBox.isChecked ? "True" : "False";
            if (parameter.params.type == "DateTime") return parameter.getDateTimeForReportServer(parameter.params.key);
            value = parameter.params.allowUserValues ? parameter.controls.firstTextBox.value : parameter.params.key;
            if (parameter.params.type == "TimeSpan") value = parameter.getTimeSpanForReportServer(value);
        }

        return value;
    };

    parameter.getRangeValuesForReportServer = function () {
        var values = {};
        values.from = (parameter.params.type == "DateTime")
            ? parameter.getDateTimeForReportServer(parameter.params.key)
            : (parameter.params.type == "TimeSpan") ? parameter.getTimeSpanForReportServer(parameter.controls.firstTextBox.value) : parameter.controls.firstTextBox.value;

        values.to = (parameter.params.type == "DateTime")
            ? parameter.getDateTimeForReportServer(parameter.params.keyTo)
            : (parameter.params.type == "TimeSpan") ? parameter.getTimeSpanForReportServer(parameter.controls.secondTextBox.value) : parameter.controls.secondTextBox.value;

        return values;
    };

    parameter.getListValuesForReportServer = function () {
        var values = [];
        var num = 0;

        for (var index in parameter.params.items) {
            var valuesItem = {};
            valuesItem.Ident = "Single";

            if (parameter.params.allowUserValues || (!parameter.params.allowUserValues && parameter.params.items[index].isChecked)) {
                valuesItem.Value = (parameter.params.type == "DateTime")
                    ? parameter.getDateTimeForReportServer(parameter.params.items[index].key)
                    : (parameter.params.type == "TimeSpan")
                        ? parameter.getTimeSpanForReportServer(parameter.params.items[index].key)
                        : parameter.params.items[index].key;
                valuesItem.Type = (valuesItem.Value == null) ? null : parameter.getSingleType();
                values.push(valuesItem);
            }
        }

        return values;
    };

    parameter.getParameterObjectForReportServer = function () {
        var parameterObject = {};
        parameterObject.Ident = parameter.params.basicType.indexOf("Value") != -1 ? "Single" : parameter.params.basicType;
        parameterObject.Name = parameter.params.name;

        switch (parameterObject.Ident) {
            case "Single":
                parameterObject.Value = parameter.getSingleValueForReportServer();
                parameterObject.Type = (parameterObject.Value == null) ? null : parameter.getSingleType();
                break;

            case "Range":
                var values = parameter.getRangeValuesForReportServer();
                parameterObject.FromValue = values.from;
                parameterObject.ToValue = values.to;
                parameterObject.RangeType = parameter.params.type + "Range";
                parameterObject.FromType = (parameterObject.FromValue == null) ? null : parameter.getSingleType();
                parameterObject.ToType = (parameterObject.ToValue == null) ? null : parameter.getSingleType();
                break;

            case "List":
                parameterObject.ListType = parameter.params.type + "List";
                parameterObject.Values = parameter.getListValuesForReportServer();
                break;
        }

        return parameterObject;
    };

    parameter.getSingleType = function () {
        var type = parameter.params.type;
        if (type != "DateTime" && type != "TimeSpan" && type != "Guid" && type != "Decimal") return type.toLowerCase();

        return type;
    }

    return parameter;
}

// --------------------- Controls ----------------------------

// boolCheckBox
StiMvcViewer.prototype.CreateBoolCheckBox = function (parameter) {
    var checkBox = this.ParameterCheckBox(parameter);
    parameter.controls.boolCheckBox = checkBox;
    checkBox.setChecked(parameter.params.value == "true" || parameter.params.value == "True");
    checkBox.setEnabled(parameter.params.allowUserValues);

    return checkBox;
}

// firstTextBox
StiMvcViewer.prototype.CreateFirstTextBox = function (parameter) {
    var textBox = this.ParameterTextBox(parameter);
    parameter.controls.firstTextBox = textBox;
    textBox.setReadOnly(parameter.params.type == "DateTime" || parameter.params.basicType == "List" || !parameter.params.allowUserValues)

    // Value
    if (parameter.params.basicType == "Value" || parameter.params.basicType == "NullableValue") {
        textBox.value =
            (parameter.params.type == "DateTime")
            ? this.getStringKey(parameter.params.key, parameter)
            : parameter.params.value;
    }

    // Range
    if (parameter.params.basicType == "Range") {
        textBox.value = this.getStringKey(parameter.params.key, parameter);
    }

    // List
    if (parameter.params.basicType == "List") {
        for (var index in parameter.params.items) {
            parameter.params.items[index].isChecked = true;
            if (textBox.value != "") textBox.value += ";";
            if (parameter.params.allowUserValues)
                textBox.value += this.getStringKey(parameter.params.items[index].key, parameter);
            else
                textBox.value += parameter.params.items[index].value != "" ? parameter.params.items[index].value : this.getStringKey(parameter.params.items[index].key, parameter);
        }
    }

    return textBox;
}

// firstDateTimeButton
StiMvcViewer.prototype.CreateFirstDateTimeButton = function (parameter) {
    var dateTimeButton = this.ParameterButton("DateTimeButton", parameter);
    parameter.controls.firstDateTimeButton = dateTimeButton;
    dateTimeButton.action = function () {
        var datePicker = dateTimeButton.jsObject.controls.datePicker;
        datePicker.ownerValue = this.parameter.params.key;
        datePicker.showTime = this.parameter.params.dateTimeType != "Date";
        datePicker.parentDataControl = this.parameter.controls.firstTextBox;
        datePicker.parentButton = this;
        datePicker.changeVisibleState(!datePicker.visible);
    }

    return dateTimeButton;
}

// firstGuidButton
StiMvcViewer.prototype.CreateFirstGuidButton = function (parameter) {
    var guidButton = this.ParameterButton("GuidButton", parameter);
    parameter.controls.firstGuidButton = guidButton;
    guidButton.action = function () {
        this.parameter.controls.firstTextBox.value = this.parameter.jsObject.newGuid();
    }

    return guidButton;
}

// secondTextBox
StiMvcViewer.prototype.CreateSecondTextBox = function (parameter) {
    var textBox = this.ParameterTextBox(parameter);
    parameter.controls.secondTextBox = textBox;
    textBox.setReadOnly(parameter.params.type == "DateTime" || !parameter.params.allowUserValues);
    textBox.value = this.getStringKey(parameter.params.keyTo, parameter);

    return textBox;
}

// secondDateTimeButton
StiMvcViewer.prototype.CreateSecondDateTimeButton = function (parameter) {
    var dateTimeButton = this.ParameterButton("DateTimeButton", parameter);
    parameter.controls.secondDateTimeButton = dateTimeButton;
    dateTimeButton.action = function () {
        var datePicker = dateTimeButton.jsObject.controls.datePicker;
        datePicker.ownerValue = this.parameter.params.keyTo;
        datePicker.showTime = this.parameter.params.dateTimeType != "Date";
        datePicker.parentDataControl = this.parameter.controls.secondTextBox;
        datePicker.parentButton = this;
        datePicker.changeVisibleState(!datePicker.visible);
    }

    return dateTimeButton;
}

// secondGuidButton
StiMvcViewer.prototype.CreateSecondGuidButton = function (parameter) {
    var guidButton = this.ParameterButton("GuidButton", parameter);
    parameter.controls.secondGuidButton = guidButton;
    guidButton.action = function () {
        this.parameter.controls.secondTextBox.value = this.parameter.jsObject.newGuid();
    }

    return guidButton;
}

// dropDownButton
StiMvcViewer.prototype.CreateDropDownButton = function (parameter) {
    var dropDownButton = this.ParameterButton("DropDownButton", parameter);
    parameter.controls.dropDownButton = dropDownButton;
    dropDownButton.action = function () {
        this.parameter.changeVisibleStateMenu(this.parameter.menu == null);
    }

    return dropDownButton;
}

// nullableCheckBox
StiMvcViewer.prototype.CreateNullableCheckBox = function (parameter) {
    var checkBox = this.ParameterCheckBox(parameter);
    checkBox.onChecked = function () {
        this.parameter.setEnabled(!this.isChecked);
    }

    return checkBox;
}

StiMvcViewer.prototype.BaseMenu = function (name, parentButton, animationDirection, menuStyleName) {
    var parentMenu = document.createElement("div");
    parentMenu.className = "stiMvcViewerParentMenu";
    parentMenu.jsObject = this;
    parentMenu.id = this.generateKey();
    parentMenu.name = name;
    parentMenu.items = {};
    parentMenu.parentButton = parentButton;
    parentMenu.type = null;
    if (parentButton) parentButton.haveMenu = true;
    parentMenu.animationDirection = animationDirection;
    parentMenu.rightToLeft = this.options.appearance.rightToLeft;
    parentMenu.visible = false;
    parentMenu.style.display = "none";
    if (name) {
        if (!this.controls.menus) this.controls.menus = {};
        if (this.controls.menus[name] != null) {
            this.controls.menus[name].changeVisibleState(false);
            this.controls.mainPanel.removeChild(this.controls.menus[name]);
        }
        this.controls.menus[name] = parentMenu;
    }
    this.controls.mainPanel.appendChild(parentMenu);

    var menu = document.createElement("div");
    menu.style.overflowY = "auto";
    menu.style.overflowX = "hidden";
    menu.style.maxHeight = "420px";
    menu.style.fontFamily = this.options.toolbar.fontFamily;
    if (this.options.toolbar.fontColor != "") menu.style.color = this.options.toolbar.fontColor;
    parentMenu.appendChild(menu);
    parentMenu.innerContent = menu;
    menu.className = menuStyleName || "stiMvcViewerMenu";

    parentMenu.changeVisibleState = function (state, parentButton) {
        var mainClassName = "stiMvcViewerMainPanel";
        if (parentButton) {
            this.parentButton = parentButton;
            parentButton.haveMenu = true;
        }
        if (state) {
            this.onshow();
            this.style.display = "";
            this.visible = true;
            this.style.overflow = "hidden";
            this.parentButton.setSelected(true);
            this.jsObject.options[this.type == null ? "currentMenu" : "current" + this.type] = this;
            this.style.width = this.innerContent.offsetWidth + "px";
            this.style.height = this.innerContent.offsetHeight + "px";
            this.style.left = this.rightToLeft
                    ? (this.jsObject.FindPosX(this.parentButton, mainClassName) - this.innerContent.offsetWidth + this.parentButton.offsetWidth) + "px"
                    : this.jsObject.FindPosX(this.parentButton, mainClassName) + "px";
            this.style.top = (this.animationDirection == "Down")
                ? (this.jsObject.FindPosY(this.parentButton, mainClassName) + this.parentButton.offsetHeight + 2) + "px"
                : (this.jsObject.FindPosY(this.parentButton, mainClassName) - this.offsetHeight) + "px";
            this.innerContent.style.top = ((this.animationDirection == "Down" ? -1 : 1) * this.innerContent.offsetHeight) + "px";

            d = new Date();
            var endTime = d.getTime();
            if (this.jsObject.options.toolbar.menuAnimation) endTime += this.jsObject.options.menuAnimDuration;
            this.jsObject.ShowAnimationVerticalMenu(this, (this.animationDirection == "Down" ? 0 : -1), endTime);
        }
        else {
            this.onHide();
            clearTimeout(this.innerContent.animationTimer);
            this.visible = false;
            this.parentButton.setSelected(false);
            this.style.display = "none";
            if (this.jsObject.options[this.type == null ? "currentMenu" : "current" + this.type] == this)
                this.jsObject.options[this.type == null ? "currentMenu" : "current" + this.type] = null;
        }
    }

    parentMenu.action = function (menuItem) {
        return menuItem;
    }

    parentMenu.onmousedown = function () { if (this.jsObject.options.isTouchDevice) return; this.ontouchstart(); }
    parentMenu.ontouchstart = function () { this.jsObject.options.menuPressed = this; }
    parentMenu.onshow = function () { };
    parentMenu.onHide = function () { };

    return parentMenu;
}

StiMvcViewer.prototype.InitializeDrillDownPanel = function () {
    var drillDownPanel = document.createElement("div");
    this.controls.drillDownPanel = drillDownPanel;
    this.controls.mainPanel.appendChild(drillDownPanel);
    drillDownPanel.jsObject = this;
    drillDownPanel.className = "stiMvcViewerToolBar";
    drillDownPanel.style.display = "none";

    var drillDownInnerContent = document.createElement("div");
    drillDownPanel.appendChild(drillDownInnerContent);
    drillDownInnerContent.style.padding = "0 2px 2px 2px";

    var drillDownInnerTable = this.CreateHTMLTable();
    drillDownInnerTable.className = "stiMvcViewerToolBarTable";
    drillDownInnerContent.appendChild(drillDownInnerTable);
    drillDownInnerTable.style.margin = "0px";
    if (this.options.toolbar.fontColor != "") drillDownInnerTable.style.color = this.options.toolbar.fontColor;
    drillDownInnerTable.style.fontFamily = this.options.toolbar.fontFamily;

    var buttonsTable = this.CreateHTMLTable();
    drillDownInnerTable.addCell(buttonsTable);

    drillDownPanel.buttonsRow = buttonsTable.rows[0];
    drillDownPanel.buttons = {};
    drillDownPanel.selectedButton = null;

    drillDownPanel.changeVisibleState = function (state) {
        this.style.display = state ? "" : "none";
        var drillDownPanelHeight = this.offsetHeight;
        var parametersPanelHeight = this.jsObject.controls.parametersPanel ? this.jsObject.controls.parametersPanel.offsetHeight : 0;
        var toolBarHeight = this.jsObject.options.toolbar.visible ? this.jsObject.controls.toolbar.offsetHeight : 0;

        if (this.jsObject.controls.parametersPanel) {
            this.jsObject.controls.parametersPanel.style.top = (toolBarHeight + drillDownPanelHeight) + "px";
        }
        if (this.jsObject.controls.bookmarksPanel) {
            this.jsObject.controls.bookmarksPanel.style.top = (toolBarHeight + parametersPanelHeight + drillDownPanelHeight) + "px";
        }
        this.jsObject.controls.reportPanel.style.marginTop = (this.jsObject.controls.reportPanel.style.position == "relative"
            ? parametersPanelHeight
            : (drillDownPanelHeight + parametersPanelHeight)) + "px";
    }

    drillDownPanel.addButton = function (caption, reportGuid, paramsGuid) {
        var name = "button" + (drillDownPanel.buttonsRow.children.length + 1);
        var button = drillDownPanel.jsObject.SmallButton(name, caption);
        button.style.display = "inline-block";
        button.reportGuid = reportGuid;
        button.paramsGuid = paramsGuid;
        drillDownPanel.buttons[name] = button;
        button.style.margin = "2px 1px 2px 2px";

        var cell = buttonsTable.addCell(button);
        cell.style.padding = "0px";
        cell.style.border = "0px";
        cell.style.lineHeight = "0px";

        button.select = function () {
            if (drillDownPanel.selectedButton) drillDownPanel.selectedButton.setSelected(false);
            this.setSelected(true);
            drillDownPanel.selectedButton = this;
        }

        button.action = function () {
            if (this.style.display != "none") {
                this.select();
                drillDownPanel.jsObject.options.reportGuid = this.reportGuid;
                drillDownPanel.jsObject.options.paramsGuid = this.paramsGuid;
                drillDownPanel.jsObject.postAction("FirstPage");
            }
        };

        button.select();

        if (name != "button1") {
            var closeButton = drillDownPanel.jsObject.SmallButton(null, null, "CloseForm.png");
            closeButton.style.display = "inline-block";
            closeButton.style.margin = "0 2px 0 0";
            closeButton.image.style.margin = "1px 0 0 -1px";
            closeButton.imageCell.style.padding = 0;
            closeButton.style.width = drillDownPanel.jsObject.options.isTouchDevice ? "22px" : "17px";
            closeButton.style.height = closeButton.style.width;
            closeButton.reportButton = button;
            button.innerTable.addCell(closeButton);

            closeButton.action = function () {
                this.reportButton.style.display = "none";
                if (this.reportButton.isSelected) drillDownPanel.buttons["button1"].action();
            };

            closeButton.onmouseover = function (event) {
                this.reportButton.onmouseoutAction();
                this.onmouseoverAction();
                event.stopPropagation();
            }
        }
    }

    return drillDownPanel;
}

StiMvcViewer.prototype.SmallButton = function (name, captionText, imageName, toolTip, arrow, styleName) {
    var button = document.createElement("div");
    button.style.fontFamily = this.options.toolbar.fontFamily;
    button.jsObject = this;
    button.name = name;
    button.styleName = styleName || "stiMvcViewerStandartSmallButton";
    button.isEnabled = true;
    button.isSelected = false;
    button.isOver = false;
    button.className = button.styleName + " " + button.styleName + "Default";
    button.toolTip = toolTip;
    button.style.height = this.options.isTouchDevice ? "28px" : "23px";
    if (name) {
        if (!this.controls.buttons) this.controls.buttons = {};
        this.controls.buttons[name] = button;
    }

    var innerTable = this.CreateHTMLTable();
    button.innerTable = innerTable;
    innerTable.style.height = "100%";
    button.appendChild(innerTable);

    if (imageName != null) {
        button.image = document.createElement("img");
        button.image.src = this.collections.images[imageName];
        button.imageCell = innerTable.addCell(button.image);
        button.imageCell.style.lineHeight = "0";
        button.imageCell.style.padding = (this.options.isTouchDevice && captionText == null) ? "0 7px" : "0 3px";
    }

    if (captionText != null) {
        button.caption = innerTable.addCell();
        button.caption.style.padding = (arrow ? "1px 0 " : "1px 5px ") + (imageName ? "0 0" : "0 5px");
        button.caption.style.whiteSpace = "nowrap";
        button.caption.style.textAlign = "left";
        button.caption.innerHTML = captionText;
    }

    if (arrow != null) {
        button.arrow = document.createElement("img");
        button.arrow.src = this.collections.images["ButtonArrow" + arrow + ".png"];
        innerTable.addCell(button.arrow).style.padding = captionText ? "0 5px 0 5px" : (this.options.isTouchDevice ? "0 7px 0 0" : "0 5px 0 2px");
        button.arrow.style.marginTop = "1px";
    }

    if (toolTip && typeof (toolTip) != "object") {
        button.setAttribute("title", toolTip);
    }

    button.onmouseoverAction = function () {
        if (this.jsObject.options.isTouchDevice || !this.isEnabled || (this["haveMenu"] && this.isSelected)) return;
        this.className = this.styleName + " " + this.styleName + "Over";
        this.isOver = true;
        if (this.jsObject.options.appearance.showTooltips && this.toolTip && typeof (this.toolTip) == "object")
            this.jsObject.controls.toolTip.showWithDelay(
                this.toolTip[0],
                this.toolTip[1],
                this.toolTip.length == 3 ? this.toolTip[2].left : this.jsObject.FindPosX(this, "stiMvcViewerMainPanel"),
                this.toolTip.length == 3 ? this.toolTip[2].top : this.jsObject.controls.toolbar.offsetHeight
            );
    }

    button.onmouseoutAction = function () {
        if (this.isTouchProcessFlag) return;
        this.isOver = false;
        if (!this.isEnabled) return;
        this.className = this.styleName + " " + this.styleName + (this.isSelected ? "Selected" : "Default");
        if (this.jsObject.options.appearance.showTooltips && this.toolTip && typeof (this.toolTip) == "object") this.jsObject.controls.toolTip.hideWithDelay();
    }

    button.onmouseover = function () {
        this.onmouseoverAction();
    }

    button.onmouseout = function () {
        this.onmouseoutAction();
    }

    button.onmousedown = function () {
        if (this.isTouchProcessFlag || !this.isEnabled) return;
        this.jsObject.options.buttonPressed = this;
    }

    button.onclick = function () {
        if (this.isTouchProcessFlag || !this.isEnabled) return;
        if (this.jsObject.options.appearance.showTooltips && this.toolTip && typeof (this.toolTip) == "object") this.jsObject.controls.toolTip.hide();
        this.action();
    }

    button.ontouchend = function () {
        if (!this.isEnabled || this.jsObject.options.fingerIsMoved) return;
        var this_ = this;
        this.isTouchProcessFlag = true;
        var timer = setTimeout(function (buttonId) {
            this_.jsObject.options.buttonsTimer = null;
            this_.className = this_.styleName + " " + this_.styleName + "Default";
            this_.action();
        }, 150);
        this.jsObject.options.buttonsTimer = [this, this.className, timer];
        this.className = this.styleName + " " + this.styleName + "Over";
        setTimeout(function () {
            this_.isTouchProcessFlag = false;
        }, 1000);
    }

    button.ontouchstart = function () {
        this.jsObject.options.fingerIsMoved = false;
        this.jsObject.options.buttonPressed = this;
    }

    button.setEnabled = function (state) {
        if (this.image) this.image.style.opacity = state ? "1" : "0.5";
        if (this.arrow) this.arrow.style.opacity = state ? "1" : "0.5";
        this.isEnabled = state;
        if (!state && !this.isOver) this.isOver = false;
        this.className = this.styleName + " " + (state ? (this.styleName + (this.isOver ? "Over" : "Default")) : this.styleName + "Disabled");
    }

    button.setSelected = function (state) {
        this.isSelected = state;
        this.className = this.styleName + " " + this.styleName +
            (state ? "Selected" : (this.isEnabled ? (this.isOver ? "Over" : "Default") : "Disabled"));
    }

    button.action = function () { this.jsObject.postAction(this.name); }

    return button;
}

StiMvcViewer.prototype.BaseForm = function (name, caption, level) {
    var form = document.createElement("div");
    form.name = name;
    form.id = this.generateKey();
    form.className = "stiMvcViewerForm";
    form.jsObject = this;
    form.level = level;
    form.caption = null;
    form.visible = false;
    form.style.display = "none";
    if (level == null) level = 1;
    form.style.zIndex = (level * 10) + 1;
    if (name) {
        if (!this.controls.forms) this.controls.forms = {};
        if (this.controls.forms[name] != null) {
            this.controls.forms[name].changeVisibleState(false);
            this.controls.mainPanel.removeChild(this.controls.forms[name]);
        }
        this.controls.forms[name] = form;
    }
    this.controls.mainPanel.appendChild(form);

    // Header
    form.header = document.createElement("div");
    form.header.thisForm = form;
    form.appendChild(form.header);
    form.header.className = "stiMvcViewerFormHeader";
    var headerTable = this.CreateHTMLTable();
    headerTable.style.width = "100%";
    form.header.appendChild(headerTable);

    form.caption = headerTable.addCell();
    if (caption != null) {
        if (caption) form.caption.innerHTML = caption;
        form.caption.style.textAlign = "left";
        form.caption.style.padding = "5px 10px 8px 15px";
    }

    form.buttonClose = this.SmallButton(null, null, "CloseForm.png");
    form.buttonClose.style.display = "inline-block";
    form.buttonClose.form = form;
    form.buttonClose.action = function () { this.form.changeVisibleState(false); };
    var closeButtonCell = headerTable.addCell(form.buttonClose);
    closeButtonCell.style.verticalAlign = "top";
    closeButtonCell.style.width = "30px";
    closeButtonCell.style.textAlign = "right";
    closeButtonCell.style.padding = "2px 1px 1px 1px";

    // Container
    form.container = document.createElement("div");
    form.appendChild(form.container);
    form.container.className = "stiMvcViewerFormContainer";

    // Separator
    form.buttonsSeparator = this.FormSeparator();
    form.appendChild(form.buttonsSeparator);

    // Buttons
    form.buttonsPanel = document.createElement("div");
    form.appendChild(form.buttonsPanel);
    form.buttonsPanel.className = "stiMvcViewerFormButtonsPanel";
    var buttonsTable = this.CreateHTMLTable();
    form.buttonsPanel.appendChild(buttonsTable);

    form.buttonOk = this.FormButton(null, this.collections.loc["ButtonOk"]);
    form.buttonOk.action = function () { form.action(); };
    buttonsTable.addCell(form.buttonOk).style.padding = "8px";

    form.buttonCancel = this.FormButton(null, this.collections.loc["ButtonCancel"]);
    form.buttonCancel.action = function () { form.changeVisibleState(false); };
    buttonsTable.addCell(form.buttonCancel).style.padding = "8px 8px 8px 0";

    form.changeVisibleState = function (state) {
        if (state) {
            this.style.display = "";
            this.onshow();
            this.jsObject.setObjectToCenter(this, 150);
            this.jsObject.controls.disabledPanels[this.level].changeVisibleState(true);
            this.visible = true;
            d = new Date();
            var endTime = d.getTime() + this.jsObject.options.formAnimDuration;
            this.flag = false;
            this.jsObject.ShowAnimationForm(this, endTime);
        }
        else {
            clearTimeout(this.animationTimer);
            this.visible = false;
            this.style.display = "none";
            this.onhide();
            this.jsObject.controls.disabledPanels[this.level].changeVisibleState(false);
        }
    }

    form.action = function () { };
    form.onshow = function () { };
    form.onhide = function () { };
    form.onmousedown = function () { if (this.jsObject.options.isTouchDevice) return; this.ontouchstart(); }
    form.ontouchstart = function () { this.jsObject.options.formPressed = this; }

    // Mouse Events
    form.header.onmousedown = function (event) {
        if (!event || this.thisForm.jsObject.options.isTouchDevice) return;
        var mouseStartX = event.clientX;
        var mouseStartY = event.clientY;
        var formStartX = this.thisForm.jsObject.FindPosX(this.thisForm, "stiMvcViewerMainPanel");
        var formStartY = this.thisForm.jsObject.FindPosY(this.thisForm, "stiMvcViewerMainPanel");
        this.thisForm.jsObject.options.formInDrag = [mouseStartX, mouseStartY, formStartX, formStartY, this.thisForm];
    }

    // Touch Events
    form.header.ontouchstart = function (event) {
        var fingerStartX = event.touches[0].pageX;
        var fingerStartY = event.touches[0].pageY;
        var formStartX = this.thisForm.jsObject.FindPosX(this.thisForm, "stiMvcViewerMainPanel");
        var formStartY = this.thisForm.jsObject.FindPosY(this.thisForm, "stiMvcViewerMainPanel");
        this.thisForm.jsObject.options.formInDrag = [fingerStartX, fingerStartY, formStartX, formStartY, this.thisForm];
    }

    form.header.ontouchmove = function (event) {
        event.preventDefault();

        if (this.thisForm.jsObject.options.formInDrag) {
            var formInDrag = this.thisForm.jsObject.options.formInDrag;
            var formStartX = formInDrag[2];
            var formStartY = formInDrag[3];
            var fingerCurrentXPos = event.touches[0].pageX;
            var fingerCurrentYPos = event.touches[0].pageY;
            var deltaX = formInDrag[0] - fingerCurrentXPos;
            var deltaY = formInDrag[1] - fingerCurrentYPos;
            var newPosX = formStartX - deltaX;
            var newPosY = formStartY - deltaY;
            formInDrag[4].style.left = newPosX + "px";
            formInDrag[4].style.top = newPosY + "px";
        }
    }

    form.header.ontouchend = function () {
        event.preventDefault();
        this.thisForm.jsObject.options.formInDrag = false;
    }

    // Form Move
    form.move = function (evnt) {
        var leftPos = this.jsObject.options.formInDrag[2] + (evnt.clientX - this.jsObject.options.formInDrag[0]);
        var topPos = this.jsObject.options.formInDrag[3] + (evnt.clientY - this.jsObject.options.formInDrag[1]);

        this.style.left = leftPos > 0 ? leftPos + "px" : 0;
        this.style.top = topPos > 0 ? topPos + "px" : 0;
    }

    return form;
}

// Separator
StiMvcViewer.prototype.FormSeparator = function () {
    var separator = document.createElement("div");
    separator.className = "stiMvcViewerFormSeparator";

    return separator;
}

StiMvcViewer.prototype.initOptions = function (){
	if(!window.optionsparams)
	{
		if(parent.optionsparams){
			window.optionsparams = parent.optionsparams;
		}
		else
			window.optionsparams = {};
	}
	if(window.optionsparams.theme)
		this.options.theme = window.optionsparams.theme;
	else
		this.options.theme = "Office2013";
	
	if(typeof window.optionsparams.showExportDialog == "boolean")
		this.options.exports.showExportDialog = window.optionsparams.showExportDialog;
	else
		this.options.exports.showExportDialog = false;
	
	if(typeof window.optionsparams.showExportToCsv == "boolean")
		this.options.exports.showExportToCsv = window.optionsparams.showExportToCsv;
	else
		this.options.exports.showExportToCsv = false;
	
	if(typeof window.optionsparams.showExportToDocument == "boolean")
		this.options.exports.showExportToDocument = window.optionsparams.showExportToDocument;
	else
		this.options.exports.showExportToDocument = false;
	
	if(typeof window.optionsparams.showExportToExcel2007 == "boolean")
		this.options.exports.showExportToExcel2007 = window.optionsparams.showExportToExcel2007;
	else
		this.options.exports.showExportToExcel2007 = true;
	
	if(typeof window.optionsparams.showExportToExcel == "boolean")
		this.options.exports.showExportToExcel = window.optionsparams.showExportToExcel;
	else
		this.options.exports.showExportToExcel = true;
	
	if(typeof window.optionsparams.showExportToExcelXml == "boolean")
		this.options.exports.showExportToExcelXml = window.optionsparams.showExportToExcelXml;
	else
		this.options.exports.showExportToExcelXml = true;
	
	if(typeof window.optionsparams.showExportToHtml == "boolean")
		this.options.exports.showExportToHtml = window.optionsparams.showExportToHtml;
	else
		this.options.exports.showExportToHtml = true;
	
	if(typeof window.optionsparams.showExportToHtml5 == "boolean")
		this.options.exports.showExportToHtml5 = window.optionsparams.showExportToHtml5;
	else
		this.options.exports.showExportToHtml5 = true;
	
	if(typeof window.optionsparams.showExportToImageBmp == "boolean")
		this.options.exports.showExportToImageBmp = window.optionsparams.showExportToImageBmp;
	else
		this.options.exports.showExportToImageBmp = true;
	
	if(typeof window.optionsparams.showExportToImageJpeg == "boolean")
		this.options.exports.showExportToImageJpeg = window.optionsparams.showExportToImageJpeg;
	else
		this.options.exports.showExportToImageJpeg = true;
	
	if(typeof window.optionsparams.showExportToImagePng == "boolean")
		this.options.exports.showExportToImagePng = window.optionsparams.showExportToImagePng;
	else
		this.options.exports.showExportToImagePng = true;
	
	if(typeof window.optionsparams.showExportToImageSvg == "boolean")
		this.options.exports.showExportToImageSvg = window.optionsparams.showExportToImageSvg;
	else
		this.options.exports.showExportToImageSvg = true;
	
	if(typeof window.optionsparams.showExportToImageSvgz == "boolean")
		this.options.exports.showExportToImageSvgz = window.optionsparams.showExportToImageSvgz;
	else
		this.options.exports.showExportToImageSvgz = true;
	
	if(typeof window.optionsparams.showExportToPdf == "boolean")
		this.options.exports.showExportToPdf = window.optionsparams.showExportToPdf;
	else
		this.options.exports.showExportToPdf = true;
	
	if(typeof window.optionsparams.showExportToRtf == "boolean")
		this.options.exports.showExportToRtf = window.optionsparams.showExportToRtf;
	else
		this.options.exports.showExportToRtf = false;
	
	if(typeof window.optionsparams.showExportToSylk == "boolean")
		this.options.exports.showExportToSylk = window.optionsparams.showExportToSylk;
	else
		this.options.exports.showExportToSylk = false;
	
	if(typeof window.optionsparams.showExportToText == "boolean")
		this.options.exports.showExportToText = window.optionsparams.showExportToText;
	else
		this.options.exports.showExportToText = true;
	
	if(typeof window.optionsparams.showExportToWord2007 == "boolean")
		this.options.exports.showExportToWord2007 = window.optionsparams.showExportToWord2007;
	else
		this.options.exports.showExportToWord2007 = true;
	
	if(typeof window.optionsparams.showExportToXml == "boolean")
		this.options.exports.showExportToXml = window.optionsparams.showExportToXml;
	else
		this.options.exports.showExportToXml = false;
	
	if(typeof window.optionsparams.showExportToXps == "boolean")
		this.options.exports.showExportToXps = window.optionsparams.showExportToXps;
	else
		this.options.exports.showExportToXps = false;
	
	if(typeof window.optionsparams.showViewModeButton == "boolean")
		this.options.toolbar.showViewModeButton = window.optionsparams.showViewModeButton;
	else
		this.options.toolbar.showViewModeButton = true;
	
	if(typeof window.optionsparams.showZoomButton == "boolean")
		this.options.toolbar.showZoomButton = window.optionsparams.showZoomButton;
	else
		this.options.toolbar.showZoomButton = true;
	
	if(typeof window.optionsparams.showCurrentPageControl == "boolean")
		this.options.toolbar.showCurrentPageControl = window.optionsparams.showCurrentPageControl;
	else
		this.options.toolbar.showCurrentPageControl = true;
	
	if(typeof window.optionsparams.showAboutButton == "boolean")
		this.options.toolbar.showAboutButton = window.optionsparams.showAboutButton;
	else
		this.options.toolbar.showAboutButton = false;
	
	if(typeof window.optionsparams.showBookmarksButton == "boolean")
		this.options.toolbar.showBookmarksButton = window.optionsparams.showBookmarksButton;
	else
		this.options.toolbar.showBookmarksButton = false;
	
	if(typeof window.optionsparams.showParametersButton == "boolean")
		this.options.toolbar.showParametersButton = window.optionsparams.showParametersButton;
	else
		this.options.toolbar.showParametersButton = false;
	
	if(window.optionsparams.showMenuMode)
		this.options.toolbar.showMenuMode = window.optionsparams.showMenuMode;
	else
		this.options.toolbar.showMenuMode = "Hover";
	
	if(typeof window.optionsparams.visible == "boolean")
		this.options.toolbar.visible = window.optionsparams.visible;
	else
		this.options.toolbar.visible = true;
	
	if(typeof window.optionsparams.showPrintButton == "boolean")
		this.options.toolbar.showPrintButton = window.optionsparams.showPrintButton;
	else
		this.options.toolbar.showPrintButton = true;
	
	if(typeof window.optionsparams.showFullScreenButton == "boolean")
		this.options.toolbar.showFullScreenButton = window.optionsparams.showFullScreenButton;
	else
		this.options.toolbar.showFullScreenButton = false;
	
	if(window.optionsparams.viewMode)
		this.options.toolbar.viewMode = window.optionsparams.viewMode;
	else
		this.options.toolbar.viewMode = "OnePage";
	
	if(typeof window.optionsparams.menuAnimation == "boolean")
		this.options.toolbar.menuAnimation = window.optionsparams.menuAnimation;
	else
		this.options.toolbar.menuAnimation = true;
	
	if(typeof window.optionsparams.showSaveButton == "boolean")
		this.options.toolbar.showSaveButton = window.optionsparams.showSaveButton;
	else
		this.options.toolbar.showSaveButton = true;
	
	if(typeof window.optionsparams.fullScreenMode == "boolean")
		this.options.appearance.fullScreenMode = window.optionsparams.fullScreenMode;
	else
		this.options.appearance.fullScreenMode = true;
	
	if(typeof window.optionsparams.showPageShadow == "boolean")
		this.options.appearance.showPageShadow = window.optionsparams.showPageShadow;
	else
		this.options.appearance.showPageShadow = true;
	
	if(typeof window.optionsparams.showTooltips == "boolean")
		this.options.appearance.showTooltips = window.optionsparams.showTooltips;
	else
		this.options.appearance.showTooltips = true;
	
	if(typeof window.optionsparams.scrollbarsMode == "boolean")
		this.options.appearance.scrollbarsMode = window.optionsparams.scrollbarsMode;
	else
		this.options.appearance.scrollbarsMode = false;
	
	if(typeof window.optionsparams.rightToLeft == "boolean")
		this.options.appearance.rightToLeft = window.optionsparams.rightToLeft;
	else
		this.options.appearance.rightToLeft = false;
	
	if(window.optionsparams.StiPdfExportSettings)
		this.options.exports.defaultSettings.StiPdfExportSettings = window.optionsparams.StiPdfExportSettings;
	else
		this.options.exports.defaultSettings.StiPdfExportSettings = {
			"AutoPrintMode": "None",
			"OpenAfterExport": false,
			"ImageQuality": 0.95,
			"ImageCompressionMethod": "Jpeg",
			"UseUnicode": true,
			"UserAccessPrivileges": "All",
			"DitheringType": "FloydSteinberg",
			"EmbeddedFonts": true,
			"ImageResolution": 200,
			"ExportFormat": "Pdf",
			"SendEmail": false,
			"ImageFormat": "Color",
			"PageRange": "All",
			"PasswordInputOwner": null,
			"Class": "class com.stimulsoft.report.export.settings.StiPdfExportSettings",
			"AllowEditable": "Yes",
			"PdfACompliance": false,
			"ExportRtfTextAsImage": false
		};
	
	if(window.optionsparams.StiWord2007ExportSettings)
		this.options.exports.defaultSettings.StiWord2007ExportSettings = window.optionsparams.StiWord2007ExportSettings;
	else
		this.options.exports.defaultSettings.StiWord2007ExportSettings = {
			"OpenAfterExport": false,
            "ImageQuality": 0.75,
            "RemoveEmptySpaceAtBottom": true,
            "Class": "class com.stimulsoft.report.export.settings.StiWord2007ExportSettings",
            "ImageResolution": 100,
            "ExportFormat": "Word2007",
            "SendEmail": false,
            "UsePageHeadersAndFooters": true,
            "PageRange": "All"
		};
	
	if(window.optionsparams.StiExcelExportSettings)
		this.options.exports.defaultSettings.StiExcelExportSettings = window.optionsparams.StiExcelExportSettings;
	else
		this.options.exports.defaultSettings.StiExcelExportSettings = {
			"OpenAfterExport": false,
            "ImageQuality": 0.75,
            "UseOnePageHeaderAndFooter": true,
            "ExportEachPageToSheet": false,
            "ImageResolution": 100,
            "ExcelType": "Excel2007",
            "ExportFormat": "Excel",
            "SendEmail": false,
            "ExportDataOnly": false,
            "PageRange": "All",
            "ExportPageBreaks": false,
            "Class": "class com.stimulsoft.report.export.settings.StiExcelExportSettings",
            "ExportObjectFormatting": true
		};
}
