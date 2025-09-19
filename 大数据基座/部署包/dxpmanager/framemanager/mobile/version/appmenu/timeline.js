(function(win, $){
    var config = win.timelineConfig;

    if(!config) {
        return;
    }

    var menuAction = {
        download: function(guid) {
            config.onDownloadItem && config.onDownloadItem(guid);
        },
        modify: function(guid) {
            config.onModifyItem && config.onModifyItem(guid);
        },
        delete: function(guid) {
            config.onDeleteItem && config.onDeleteItem(guid);
        },
        enable: function(guid) {
            config.onEnableItem && config.onEnableItem(guid);
        },
        disable: function(guid) {
            config.onDisableItem && config.onDisableItem(guid);
        }
    };

    var timelineItemTpl = $('#timeline-item-tpl').html();

    var getTimeline = function(platform) {
    	var $timeline = $('#timeline_' + platform);
        Util.ajax({
            url: config.getUrl,
            data: {'platform': platform}
        }).done(function(data){
            var html = [];

            for(var i = 0, l = data.length; i < l; i++) {
                html.push(Mustache.render(timelineItemTpl, data[i]));
            }

            $timeline.html(html.join(''));
        });
    };

	var platformItemTpl = $('#platform-item-tpl').html();

	epoint.execute('getPlatforms', '@none', '', function(data) {
		var html = [];

		var platformItemTpl = $('#platform-item-tpl').html();

		for (var i = 0; i < data.length; i++) {
			html.push(Mustache.render(platformItemTpl, data[i]));
		}

		$('#tabs1').html(html.join(''));

		$('#tabs1').attr('class', 'mini-tabs');
		mini.parse();

	    $('.timeline').on('click', '.item-dropdown', function(e){
	        var $target = $(e.target),
	            $this = $(this),
	            $item = $this.closest('.timeline-item'),
	            guid = $item.data('guid'),
	            action;
	        var $timeline = $('#timeline_' + platform);
	        if($target.hasClass('dropdown-toggle')) {
	            if($this.hasClass('show')) {
	                $timeline.find('.item-dropdown').removeClass('show');
	            } else {
	                $timeline.find('.item-dropdown').removeClass('show');
	                $this.addClass('show');
	            }
	        } else if($target.hasClass('dropdown-item')){
	            action = $target.data('action');

	            menuAction[action](guid);

	            $this.removeClass('show');
	        }

	    });
	});

    $('body').on('click', function(e){
        var $target = $(e.target);
        var $timeline = $('#timeline_' + platform);
        if($target.closest('.item-dropdown').length === 0) {
            $timeline.find('.item-dropdown').removeClass('show');
        }
    });

    win.getTimeline = getTimeline;
})(this, jQuery);