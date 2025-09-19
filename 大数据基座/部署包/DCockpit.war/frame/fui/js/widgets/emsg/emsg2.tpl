<!--E讯-->
<div class="emsg-dialog" id="emsgDialog">
    <div class="emsg-dialog-left">
        <div class="emsg-dialog-scroll nicescroll">
            <ul class="emsg-session-list"></ul>
        </div>
    </div>
    <div class="emsg-dialog-right">
        <div class="emsg-dialog-head">
            <div class="emsg-user-img">
                <img src="" />
            </div>
            <div class="emsg-session-info emsg-group-info">
                <input class="emsg-group-rename" value="项目讨论组" type="text" maxlength="30" />
                <span class="emsg-curr-name">项目讨论组</span>
                <span class="emsg-group-date">创建日期：</span>
                <div class="emsg-top-bar">
                    <i class="emsg-create-group" title="编辑讨论组"></i>
                    <i class="emsg-write-email hidden" title="发邮件"></i>
                    <i class="emsg-quit-group" title="退出讨论组"></i>
                </div>
            </div>
            <i class="emsg-dialog-min" title="最小化"></i>
            <i class="emsg-dialog-close" title="关闭"></i>
        </div>
        <div class="emsg-message-panel">
        </div>
        <div class="emsg-message-inputbox">
            <div class="emsg-dialog-tool">
                <input class="emsg-emotion-icon" type="button" />
                <!--span class="emsg-file-icon" data-tooltip="文件限制5M以内" id="fileUploader"></span-->
                <span class="emsg-history-link">
          <i class="emsg-history-icon"></i>消息记录
        </span>
            </div>
            <div contenteditable="true" class="emsg-message-text" id="EmsgText"></div>
            <a class="emsg-btn-send" data-tooltip="内容为空,不能发送" href="javascript:;" id="testfile" title="按CTRL+ENTER键发送">发送</a>
        </div>
    </div>
</div>

<div class="emsg-cgroup-layer"></div>
<!--E讯讨论组-->
<div class="emsg-cgroup-dialog">
    <i class="emsg-cgroup-close r" title="关闭">×</i>
    <h2 class="emsg-cgroup-title">创建讨论组</h2>
    <div class="emsg-cgroup-body">
        <div class="emsg-cgroup-left">
            <div class="emsg-cgroup-header">联系人列表</div>
            <input type="text" class="emsg-cgroup-filter" />
            <div class="emsg-cgroup-src" id="emsg_group">
            </div>
        </div>
        <div class="emsg-cgroup-right">
            <div class="emsg-cgroup-header">已选联系人</div>
            <div class="emsg-cgroup-desc">
                <ul class="emsg-cgroup-list"></ul>
            </div>
        </div>
    </div>
    <div class="emsg-cgroup-bar">
        <input type="button" value="确定" class="emsg-btn-ok" />
        <input type="button" value="取消" class="emsg-btn-cancle" />
    </div>
</div>
<div class="emsg-mindialog"></div>


<!--新会话-->
<script type="text/x-template" id="emsg-sessionitem-templ">
    <li class="emsg-session-item active" data-sessionid="{{sessionId}}">
        <div class="emsg-user-img">
            <img src="{{imgUrl}}" onerror="this.onerror='';this.src='../../../js/widgets/emsg/images/emsg-user-error.jpg';" />
        </div>
        <div class="emsg-user-name">
            {{name}}
        </div>
        <i class="emsg-remove" title="关闭会话"></i>
    </li>
</script>

<!--会话消息窗口-->
<script type="text/x-template" id="emsg-messagelist-templ">
    {{^hasHead}}
    <div class="emsg-message-tab" data-sessionid="{{sessionId}}" data-page="1">
        <div class="emsg-message-inner">
            <div class="emsg-load">
                <span class="emsg-load-link">
          <i class="emsg-load-icon more"></i>
          <span class="emsg-load-text">查看更多信息</span>
                </span>
            </div>
            <ul class="emsg-message-list">
                {{/hasHead}} {{#items}}
                <li class="emsg-message-item {{^IsReceive}}send{{/IsReceive}} {{^IsSend}}receive{{/IsSend}}">
                    <div class="emsg-user-img">
                        <img src="{{imgUrl}}" onerror="this.onerror='';this.src='../../../js/widgets/emsg/images/emsg-user-error.jpg';" />
                    </div>
                    <div class="emsg-message">
                        {{#IsGroup}}<span class="emsg-message-name">{{name}}</span>{{/IsGroup}}
                        <span class="emsg-message-time">{{time}}</span>
                        <div class="emsg-message-content">
                            <div>
                                {{#IsFile}}<a class="emsg-file-down" href="{{href}}" target="_blank">
                  {{/IsFile}}
                  {{{content}}}
                  {{#IsFile}}
                </a>{{/IsFile}}
                            </div>
                        </div>
                    </div>
                </li>
                {{/items}} {{^hasHead}}
            </ul>
        </div>
    </div>
    {{/hasHead}}
</script>

<!--上传文件-->
<script type="text/x-template" id="emsg-fileupload-templ">
    <div class="emsg-file-uploader">
        <span class="emsg-file-name">{{name}}</span>
        <span class="emsg-file-size">{{size}}</span>
        <i class="emsg-uploader-status down"></i>
        <div class="emsg-uploader-process">
            <div class="emsg-process-inner"></div>
        </div>
        <span class="emsg-file-reupload">重新上传</span>
    </div>
</script>