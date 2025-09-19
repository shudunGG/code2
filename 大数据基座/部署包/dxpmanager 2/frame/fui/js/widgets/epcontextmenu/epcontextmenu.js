//EpContextMenu for imac, metro
(function(win, $) {
    var M = Mustache;
    // menu item template
    var btnTmpl = 
            '<a class="cm-btn {{disabled}}" data-role="{{role}}"' + 
                '{{#url}} href="{{url}}" {{/url}}' + 
                '{{#target}} target="{{target}}" {{/target}}' + 
                'title="{{text}}">' + 
                '<img src="{{icon}}" class="cm-btn-icon" alt="">' + 
                '<span class="cm-btn-text">{{text}}</span>' + 
            '</a>',

        itemTmpl = 
            '<li class="cm-item">' + btnTmpl + '</li>',

        sepTmpl = 
            '<li class="sep cm-item"></li>',

        submenuTempl = 
            '<li class="cm-item has-menu">' + 
               btnTmpl + 
                '<ul class="menu sub-menu hidden-accessible">' + 
                    '{{{submenu}}}' + 
                '</ul>' +       
            '</li>';

    var noIconBase64 = 'data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw==';                 
    
    var EXTREA_MARGIN = 5,
        ID_SUFFIX = '-contextmenu',
        ROLE_SUFFIX = '-role';
    
    // default menu button settings
    var defaultItemSetting = {
        icon: noIconBase64,
        role: '',
        url: '#',
        target: ''
    };

    // default widget setting
    var defaultSetting = {
        id: false,
        items: [{
            text: '',
            role: '',
            icon: '',
            click: Util.noop
        }],
        selector: false
    };
    
    // render menu items
    var buildMenu = function(items) {
        var tmpArr = [];

        $.each(items, function(index, item) {
            if( item == 'sep' ) {
                tmpArr.push(sepTmpl);
                return true;    
            }  

            if(!item.role) {
                item.role = Util.uuid(8, 16) + ROLE_SUFFIX;
            } 
            
            var v = $.extend({}, defaultItemSetting, item);
            v.disabled = v.disabled === true ? 'cm-btn-disabled' : 'cm-btn-default';

            if(v.items && v.items.length) {
                tmpArr.push(M.render(submenuTempl, $.extend(v, {
                    submenu: buildMenu(v.items)
                })));
            } else {
                tmpArr.push(M.render(itemTmpl, v));
            }
        });

        return tmpArr.join('');
    };

    win.EpContextMenu = function(cfg) {
        this.cfg = $.extend({}, defaultSetting, cfg); 
        this._init();
    };
    
    EpContextMenu.prototype = {
        constructor: EpContextMenu,
        
        _init: function() {
            this.data = {};

            this.cfg.options = {};

            this._initView();
            this._initEvents();
        },

        _initView: function() {
            var c = this.cfg,
                html = [];

            if(!c.id) {
                c.id = Util.uuid(8, 16) + ID_SUFFIX;
            }

            html.push('<div id="' + c.id + '" class="ep-context-menu hidden-accessible">');
            html.push('<ul class="menu">');
            html.push(buildMenu(c.items));
            html.push('</ul>');
            html.push('</div>');

            this.$widget = $(html.join('')).appendTo('body');

            this.size = {
                width: this.$widget.outerWidth(),
                height: this.$widget.outerHeight()
            };
        },

        // hide context menu 
        hide: function() {
            var $cm = this.$widget;

            $cm.addClass('hidden-accessible');
            $cm.find('ul.sub-menu').addClass('hidden-accessible');
        },

        // show context menu 
        show: function(pos) {
            var top, left,
                
                widget_w = this.size.width,
                widget_h = this.size.height,
                
                bdSize = Util.getBdSize(),
                bd_w = bdSize.width,
                bd_h = bdSize.height;

            if(bd_h - pos.y >= widget_h) {
                top = pos.y;
            } else if(bd_h - pos.y < widget_h) {
                top = pos.y - widget_h;
                top = top < 0 ? EXTREA_MARGIN : top;
            }

            if(bd_w - pos.x >= widget_w) {
                left = pos.x;
            } else if(bd_w - pos.x < widget_w) {
                left = pos.x - widget_w;
            }

            this.$widget.css({
                top: top,
                left: left,
                zIndex: Util.getZIndex()
            }).removeClass('hidden-accessible');

            return this;
        },

        _cacheData: function(items) {
            var data = this.data,
                self = this;
  
            $.each(items, function(i, item) {
                data[item.role] = item;

                if(item.items && item.items.length) {
                    self._cacheData(item.items);
                }
            });
        },

        _initEvents: function() {
            var c = this.cfg,
                $cm = this.$widget,
                self = this,
                data = {};

            var $bindEl = null;

            this._cacheData(c.items);

            data = this.data;

            $cm.on('click', 'a[data-role]', function(event) {
                var $btn = $(this),
                    $p = $btn.parent(),
                    
                    role = $btn.data('role'),
                    callback = data[role].click,
                    rt;

                if($btn.attr('href') == '#') {
                    event.preventDefault();
                } 
                    
                if($p.hasClass('has-menu') || $btn.hasClass('cm-btn-disabled')) return;
                
                if(callback) {
                    rt = $.proxy(callback, self, c.options, data[role], event)();
                }

                if(rt !== false) {
                    self.hide();
                } 
            }); 

            $cm.find('.has-menu').on('mouseenter mouseleave', function(event) {
                var $li = $(this),
                    $a = $li.find('> a.cm-btn'),
                    $sub = $li.find('> ul.sub-menu'),

                    l = $li.width() - 2;

                var subOffsetL = 0,
                    sub_w = $sub.outerWidth(),
                    win_w = $(window).width();

                if($a.hasClass('cm-btn-disabled')) return false;

                if( event.type == 'mouseenter' ) {
                    subOffsetL = $sub.css('left', l)
                        .removeClass('hidden-accessible')
                        .offset().left;

                    if(win_w - subOffsetL < sub_w) {
                        $sub.css({
                            left: -sub_w
                        });
                    }
                } else {
                    $sub.addClass('hidden-accessible');
                }
            });

            
            // if selector is given, bind contextmenu event
            if(c.selector) {
                $bindEl = $(c.selector);
                $bindEl.length && $bindEl.on('contextmenu', function(event) {
                    var pos = {
                        x: event.pageX,
                        y: event.pageY
                    };

                    self.show(pos);
                    return false;
                });
            } 

            // auto hide
            $('body').on('click', function(event) {
                var t = event.target;

                if(!$.contains($cm[0], t)) $cm.addClass('hidden-accessible');
            });
        },

        // not for menu items only used to show up submenu
        updateItem: function(role, data) {
            var $btn = this.$widget.find('[data-role="' + role + '"]'),
                prop, val;

            if($btn.length) {
                for(prop in data) {
                    val = data[prop];

                    switch (prop) {
                        case 'icon':
                            $btn.find('> img.cm-btn-icon')[0].src = val;
                            break;
                        case 'text':
                            $btn.find('> span.cm-btn-text')[0].innerHTML = val;
                            break;
                        case 'title':
                            $btn.attr(prop, val);
                            break;
                        case 'url':
                            $btn.attr('href', val);
                            break;
                        case 'target':
                            $btn.attr('target', val);
                            break;
                        case 'role':
                            $btn.attr('data-role', val);
                            break;
                        case 'disabled':
                            val ? this.disableItem(role) : this.enableItem(role);
                    }
                }
            }
        },

        setOptions: function(prop, val) {
            this.cfg.options[prop] = val;
            return this;
        },

        disableItem: function(role) {
            var $btn = this.$widget.find('[data-role="' + role + '"]');

            $btn.length && $btn.removeClass('cm-btn-default cm-btn-active').addClass('cm-btn-disabled');

            return this;
        },

        enableItem: function(role) {
            var $btn = this.$widget.find('[data-role="' + role + '"]');

            $btn.length && $btn.removeClass('cm-btn-disabled cm-btn-active').addClass('cm-btn-default');

            return this;
        },

        // highlight menu item
        highlightItem: function(role) {
            var $cm = this.$widget,
                $active = $cm.find('a.cm-btn-active'),
                $btn = $cm.find('[data-role="' + role + '"]');

            $active.length && $active.removeClass('cm-btn-active').addClass('cm-btn-default');

            $btn.length && !$btn.hasClass('cm-btn-disabled') && $btn.removeClass('cm-btn-default').addClass('cm-btn-active');  
        },

        destroy: function() {
            this.$widget.remove();
            
            // TODO: 该组件应该不需要反复创建和销毁
        }
    };
}(this, jQuery));