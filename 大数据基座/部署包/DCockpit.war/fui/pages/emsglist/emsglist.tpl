<script type="text/x-template" id="emsg-recent-templ">
    {{#items}}
    <li class="emsg-recent-item {{^hasRead}}newmsg{{/hasRead}}" data-sessionid="{{sessionId}}" data-uid="{{uid}}" data-type="{{type}}">
        <div class="emsg-user-img">
            <img src="{{imgUrl}}" onerror="this.onerror='';this.src='../../emsg/images/emsg-user-error.jpg';" />
        </div>
        <div class="emsg-recent-record">
            <h2>
                <span class="emsg-user-name" title="{{name}}">{{name}}</span>{{^hasRead}}<i class="emsg-not-read"></i>{{/hasRead}}<span class="emsg-recent-date">{{date}}</span>
            </h2>
            <p class="emsg-recent-message">
                {{{message}}}
            </p>
            {{^hasRead}} <span class="emsg-ignore-icon">忽略</span>{{/hasRead}}
        </div>
    </li>
    {{/items}}
</script>